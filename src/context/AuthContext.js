/**
 * @fileoverview AuthContext — Global Authentication State Manager.
 *
 * Single source of truth for the current user session across the entire
 * Student Progress Tracking SaaS application.  Implements the Observer
 * (Publish–Subscribe) pattern so any module can reactively respond to
 * authentication state changes without tight coupling or prop-drilling.
 *
 * ─── Responsibility boundary ────────────────────────────────────────────────
 *   This module is ONLY responsible for:
 *     • Holding and updating the authentication state object
 *     • Notifying registered subscribers on every state change
 *     • Persisting / restoring the token via Web Storage
 *     • Structuring the login / logout state transitions
 *
 *   It is NOT responsible for:
 *     • Making HTTP requests          → authApi.js        (Part 8)
 *     • Low-level storage abstraction → authStorage.js    (Part 9)
 *     • Client-side routing           → router/guards.js  (Part 4)
 *     • Rendering any UI              → LoginForm.js      (Part 3 UI)
 *     • Displaying toast messages     → Toast.js          (Part 10)
 *
 * ─── Architecture (PRD § 6.4) ───────────────────────────────────────────────
 *
 *   ┌──────────────────────────── AuthContext ────────────────────────────┐
 *   │  _state { user, token, isAuthenticated, isLoading, error }          │
 *   │  _subscribers  Set<Function>                                        │
 *   │                                                                     │
 *   │  subscribe()   unsubscribe()   notify()   setState()   getState()   │
 *   │  restoreSession()   login()   logout()   clearStorage()             │
 *   └────────────────────────────────┬────────────────────────────────────┘
 *                                    │  notify() on every setState() call
 *                     ┌──────────────┴──────────────┐
 *                     ▼                             ▼
 *           ┌──────────────────┐         ┌──────────────────────┐
 *           │  useAuth() hook  │         │  AuthGuard component  │
 *           │  (Part 3)        │         │  (Part 3)             │
 *           └──────────────────┘         └──────────────────────┘
 *
 * ─── Integration sequence ───────────────────────────────────────────────────
 *   Part 3  → This file.  State layer complete.
 *   Part 3  → useAuth.js subscribes and exposes reactive state to components.
 *   Part 3  → AuthGuard reads getState() to protect routes.
 *   Part 4  → Router calls restoreSession() on boot; navigates on logout.
 *   Part 8  → authApi.login() replaces the _authResponse param in login().
 *   Part 9  → authStorage.js replaces the inline safeStorage* helpers.
 *   Part 10 → Notification context calls logout() on 401; shows toast.
 *
 * ─── Usage ──────────────────────────────────────────────────────────────────
 *   import AuthContext from '../context/AuthContext.js';
 *
 *   // 1. Subscribe to state changes (returns an unsubscribe function)
 *   const off = AuthContext.subscribe(state => render(state));
 *
 *   // 2. Restore session once on app boot (await before routing)
 *   await AuthContext.restoreSession();
 *
 *   // 3. Log in (Part 8 will remove the second argument)
 *   const result = await AuthContext.login(credentials, authResponse);
 *
 *   // 4. Log out (router in Part 4 handles the /login redirect)
 *   AuthContext.logout();
 *
 *   // 5. Read a one-time state snapshot
 *   const { user, isAuthenticated } = AuthContext.getState();
 *
 *   // 6. Clean up subscription on component destroy
 *   off();
 *
 * @module context/AuthContext
 */

import { ENV } from '../config/env.js';
import { ERROR_CODES, ROUTES } from '../utils/constants.js';

// ─── Module-level constants ───────────────────────────────────────────────────
//
// These are resolved once at module load time from the validated ENV object.
// Using named constants here (rather than inlining ENV.* at every call-site)
// makes the storage strategy immediately obvious to a new reader.

/**
 * The localStorage / sessionStorage key under which the serialised auth
 * payload { token, expiresAt, user } is stored.
 * Value is injected via ENV.AUTH_TOKEN_KEY so it can differ per environment.
 *
 * @constant {string}
 */
const TOKEN_KEY = ENV.AUTH_TOKEN_KEY;

/**
 * The sessionStorage key under which the pre-login intended path is stored
 * so that the router can redirect to it after a successful login.
 * Value is injected via ENV.AUTH_REDIRECT_KEY so it can differ per environment.
 *
 * @constant {string}
 */
const REDIRECT_KEY = ENV.AUTH_REDIRECT_KEY;

// ─── Private helper functions ─────────────────────────────────────────────────
//
// These are pure utility functions scoped to this module.  They have no
// awareness of the AuthContext state or the subscriber list — their only job
// is to make the higher-level methods easier to read and test.
//
// TODO (Part 9 — Data Persistence):
//   Once authStorage.js is implemented, replace safeStorageRead,
//   safeStorageWrite, and safeStorageRemove with calls to the authStorage
//   service, which will provide the same resilient API plus an in-memory
//   fallback for private-browsing environments (FR-STOR-006).

/**
 * Reads a single key from a Web Storage object and parses the raw JSON
 * string back into a JavaScript value.
 *
 * Designed to be maximally resilient:
 *   - Returns null when the key does not exist (getItem returns null)
 *   - Returns null when the stored string is empty
 *   - Returns null when JSON.parse throws (malformed / truncated data)
 *   - Returns null when the storage object itself is inaccessible
 *     (e.g. private-browsing mode blocks storage in some browsers)
 *
 * @param {Storage} storage - The Web Storage instance to read from
 *                            (window.localStorage or window.sessionStorage)
 * @param {string}  key     - The key to retrieve
 * @returns {unknown|null}  The parsed value, or null on any failure
 */
function safeStorageRead(storage, key) {
    try {
        const raw = storage.getItem(key);
        if (raw === null || raw === '') return null;
        return JSON.parse(raw);
    } catch {
        // Catches both storage-access errors and JSON.parse errors.
        return null;
    }
}

/**
 * Serialises a value to JSON and writes it to a Web Storage object.
 *
 * Designed to be maximally resilient:
 *   - Returns false (without throwing) when the storage is full
 *     (QuotaExceededError) so callers can decide how to react
 *   - Returns false when the storage object is inaccessible
 *   - Returns false when the value cannot be serialised (circular refs)
 *
 * @param {Storage} storage - The Web Storage instance to write to
 * @param {string}  key     - The key under which to store the value
 * @param {unknown} value   - Any JSON-serialisable value
 * @returns {boolean}       true when the write succeeded; false otherwise
 */
function safeStorageWrite(storage, key, value) {
    try {
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        // Swallow QuotaExceededError and SecurityError silently.
        return false;
    }
}

/**
 * Removes a single key from a Web Storage object.
 *
 * Silently no-ops when:
 *   - The key does not exist (removeItem is idempotent by spec)
 *   - The storage object is inaccessible (SecurityError)
 *
 * @param {Storage} storage - The Web Storage instance to modify
 * @param {string}  key     - The key to remove
 * @returns {void}
 */
function safeStorageRemove(storage, key) {
    try {
        storage.removeItem(key);
    } catch {
        // Storage unavailable — nothing to remove.
    }
}

/**
 * Determines whether a stored token has passed its expiry timestamp.
 *
 * An absent or non-numeric expiresAt value is treated as already expired
 * (fail-secure default) so a corrupted payload is never silently accepted.
 *
 * @param {number|null|undefined} expiresAt - Unix timestamp (ms) when the
 *                                            token should stop being trusted
 * @returns {boolean} true when the token has expired or the timestamp is
 *                    missing / malformed; false when the token is still valid
 */
function isTokenExpired(expiresAt) {
    if (!expiresAt || typeof expiresAt !== 'number') return true;
    return Date.now() > expiresAt;
}

/**
 * Converts any caught value into a normalised error object that is safe to
 * store in state and display to the user.
 *
 * Normalisation rules (checked in order):
 *   1. If the value already has a `code` property, it was thrown intentionally
 *      by a service layer (e.g. authApi) — return it as-is.
 *   2. If the value is a native Error, use Error.message.
 *   3. If the value is a plain string, use it directly.
 *   4. Otherwise, use the provided fallback message and ERROR_CODES.UNKNOWN.
 *
 * @param {unknown} err      - The raw caught value (may be anything)
 * @param {string}  fallback - Human-readable message used when the error
 *                             provides no useful information
 * @returns {{ code: string, message: string }} A normalised error descriptor
 */
function normaliseError(err, fallback) {
    // Already a normalised service-layer error — pass through unchanged.
    if (err && typeof err === 'object' && 'code' in err) {
        return /** @type {{ code: string, message: string }} */ (err);
    }

    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : fallback;

    return { code: ERROR_CODES.UNKNOWN, message };
}

// ─── Type definitions ─────────────────────────────────────────────────────────

/**
 * Shape of the authenticated user object returned by the API and stored
 * in AuthContext state.  Matches the `Student` interface in the PRD § 8.1.
 *
 * @typedef {Object} AuthUser
 * @property {string}      id          - Unique student ID, e.g. "stu_001"
 * @property {string}      name        - Full display name, e.g. "Alex Johnson"
 * @property {string}      email       - Email address
 * @property {string|null} [avatarUrl] - Remote avatar image URL, or null/absent
 *                                       when no avatar is set (UserAvatar will
 *                                       fall back to initials in that case)
 * @property {string}      [studentId] - Human-readable code, e.g. "STU-2024-001"
 */

/**
 * The complete authentication state object managed by AuthContext.
 * This is the shape received by every subscriber callback and returned
 * by getState().
 *
 * Field lifecycle:
 *   isLoading  → true on module load; set to false after restoreSession()
 *   user       → null until login succeeds or session is restored
 *   token      → null until login succeeds or session is restored
 *   isAuthenticated → mirrors whether user and token are both non-null & valid
 *   error      → set on login failure; cleared on every new login attempt
 *
 * @typedef {Object} AuthState
 * @property {AuthUser|null}                         user            - Authenticated user, or null
 * @property {string|null}                           token           - JWT/session token, or null
 * @property {boolean}                               isAuthenticated - True when session is valid
 * @property {boolean}                               isLoading       - True during session restore
 * @property {{ code: string, message: string }|null} error          - Last auth error, or null
 */

/**
 * Credentials submitted by the user on the login form.
 *
 * @typedef {Object} LoginCredentials
 * @property {string}  email       - User's email address
 * @property {string}  password    - User's password (plaintext; HTTPS enforced in prod)
 * @property {boolean} [rememberMe] - When true: persist via localStorage (30-day);
 *                                    when false/absent: sessionStorage only
 */

/**
 * The value returned by AuthContext.login() regardless of outcome.
 * login() never throws — all errors are surfaced here and in state.
 *
 * @typedef {Object} LoginResult
 * @property {boolean}   success - true on successful authentication
 * @property {AuthUser}  [user]  - Present only when success is true
 * @property {string}    [error] - Human-readable message when success is false
 */

// ─── Initial state ────────────────────────────────────────────────────────────
//
// isLoading starts as true because the application cannot know whether a
// valid session exists until restoreSession() completes.  Protected pages
// (via AuthGuard) must wait for isLoading to become false before deciding
// whether to render content or redirect to login.

/** @type {AuthState} */
const INITIAL_STATE = Object.freeze({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
});

// ─── AuthContext singleton ────────────────────────────────────────────────────

/**
 * AuthContext — the application's authentication state manager.
 *
 * This is an IIFE-produced module singleton.  Import and use it directly —
 * do NOT call `new AuthContext()` or create additional instances.
 *
 * The singleton pattern (over a class) is intentional: it guarantees that
 * every module in the application shares exactly one instance of the auth
 * state, eliminating out-of-sync state bugs that occur when two components
 * hold different class instances.
 *
 * @namespace AuthContext
 */
const AuthContext = (() => {
    // ── Private state ────────────────────────────────────────────────────────
    //
    // _state is only ever modified through setState().  Direct assignment to
    // _state properties is prohibited — it would bypass the notify() call and
    // leave subscribers with a stale view of the world.

    /** @type {AuthState} */
    let _state = { ...INITIAL_STATE };

    // ── Subscriber registry ──────────────────────────────────────────────────
    //
    // A Set (rather than an Array) is used so that the same callback reference
    // can only appear once, preventing double-notification bugs when a component
    // accidentally subscribes twice without unsubscribing in between.

    /**
     * Active subscriber callbacks.  Each entry is called with a frozen state
     * snapshot on every setState() invocation.
     *
     * @type {Set<(state: AuthState) => void>}
     */
    const _subscribers = new Set();

    // ── PubSub: subscribe / unsubscribe / notify ─────────────────────────────

    /**
     * Registers a callback to receive frozen state snapshots whenever the
     * authentication state changes.  The callback is invoked synchronously
     * within the same tick as the setState() call that triggered it.
     *
     * The returned unsubscribe function is the canonical way to clean up.
     * Always store it and call it when the subscribing component is destroyed
     * to prevent memory leaks from stale closures holding DOM references.
     *
     * @param {(state: AuthState) => void} callback - Listener function.
     *   Receives a frozen AuthState snapshot; must not attempt to mutate it.
     * @returns {() => void} Unsubscribe function — invoke to deregister
     *
     * @example
     * // Mount: start listening
     * const off = AuthContext.subscribe(({ user, isAuthenticated }) => {
     *   avatarEl.src = isAuthenticated ? user.avatarUrl : '';
     * });
     *
     * // Unmount / cleanup: stop listening
     * off();
     */
    function subscribe(callback) {
        if (typeof callback !== 'function') {
            console.warn(
                '[AuthContext] subscribe() expects a function, received:',
                typeof callback
            );
            // Return a no-op so callers can safely call the returned value.
            return () => {};
        }
        _subscribers.add(callback);
        // Return a bound unsubscribe so callers don't need to import unsubscribe.
        return () => unsubscribe(callback);
    }

    /**
     * Removes a callback from the subscriber registry.
     * If the callback was never subscribed, this is a safe no-op.
     *
     * Prefer calling the function returned by subscribe() over calling
     * unsubscribe() directly — it avoids needing to hold a reference to both
     * the context and the original callback.
     *
     * @param {(state: AuthState) => void} callback - The listener to remove
     * @returns {void}
     */
    function unsubscribe(callback) {
        _subscribers.delete(callback);
    }

    /**
     * Delivers a frozen snapshot of the current state to every registered
     * subscriber.  Called automatically by setState() — callers should not
     * need to invoke this directly.
     *
     * Isolation guarantee: if one subscriber throws, the error is caught and
     * logged but does NOT prevent the remaining subscribers from being called.
     * This makes the notification loop resilient to bugs in individual
     * component render functions.
     *
     * @returns {void}
     *
     * @fires AuthContext#statechange  (conceptually — not a DOM event)
     */
    function notify() {
        // Freeze the snapshot so subscribers cannot accidentally mutate shared state.
        const snapshot = Object.freeze({ ..._state });

        _subscribers.forEach(callback => {
            try {
                callback(snapshot);
            } catch (err) {
                // Isolate faulty subscribers so they cannot break unrelated components.
                console.error('[AuthContext] A subscriber threw an error:', err);
            }
        });
    }

    // ── State management: setState / getState ────────────────────────────────

    /**
     * The **only** permitted way to update authentication state.
     *
     * Merges `partialState` shallowly into the current state (analogous to
     * React's `setState`) and then calls notify() to propagate the change to
     * all subscribers.  Fields not present in `partialState` are carried over
     * unchanged from the previous state.
     *
     * Never assign to `_state` directly — doing so skips notification.
     *
     * @param {Partial<AuthState>} partialState - The fields to update.
     *   Only the keys present here will change; all other fields are preserved.
     * @returns {void}
     *
     * @example
     * // Mark the start of an async operation:
     * setState({ isLoading: true, error: null });
     *
     * // Hydrate after successful login:
     * setState({ user, token, isAuthenticated: true, isLoading: false, error: null });
     */
    function setState(partialState) {
        // Spread into a new object — never mutate _state in place.
        _state = { ..._state, ...partialState };
        notify();
    }

    /**
     * Returns a frozen, one-time snapshot of the current authentication state.
     *
     * The returned object is immutable — any attempt to assign to its properties
     * will throw in strict mode.  Subscribers should use the snapshot passed to
     * their callback for reactive updates; getState() is intended for
     * one-off reads (e.g. in route guards that run outside the subscriber cycle).
     *
     * @returns {Readonly<AuthState>} Frozen copy of the current state
     *
     * @example
     * // Check auth status in a route guard before rendering a protected page:
     * const { isAuthenticated, isLoading } = AuthContext.getState();
     * if (!isLoading && !isAuthenticated) router.navigate(ROUTES.LOGIN);
     */
    function getState() {
        return Object.freeze({ ..._state });
    }

    // ── Storage operations ────────────────────────────────────────────────────
    //
    // TODO (Part 9 — Data Persistence):
    //   Replace the direct safeStorage* calls below with the authStorage
    //   service once it is implemented.  authStorage will add:
    //     • An in-memory fallback for private-browsing environments
    //     • A saveRedirectPath() / getRedirectPath() API for post-login nav
    //     • Centralised storage-key management (no TOKEN_KEY / REDIRECT_KEY
    //       constants needed here)
    //   Reference: FR-STOR-001, FR-STOR-002, FR-STOR-006.

    /**
     * Removes all authentication artefacts from Web Storage, ensuring that
     * any subsequent call to restoreSession() finds nothing to restore.
     *
     * Clears from BOTH storage tiers because the user may have logged in under
     * one tier and switched "remember me" preference in a subsequent session.
     * Clearing both guarantees no orphaned tokens remain.
     *
     * This method intentionally does NOT call setState() — it is a pure storage
     * operation.  Callers (logout, restoreSession error path) are responsible
     * for updating the state after calling clearStorage().
     *
     * @returns {void}
     */
    function clearStorage() {
        // Remove the token payload from both storage tiers.
        safeStorageRemove(localStorage, TOKEN_KEY);
        safeStorageRemove(sessionStorage, TOKEN_KEY);

        // Remove any saved pre-login redirect path from session storage.
        safeStorageRemove(sessionStorage, REDIRECT_KEY);
    }

    // ── Session restoration ───────────────────────────────────────────────────

    /**
     * Attempts to restore a previous authentication session from Web Storage.
     * Must be called **once** during application bootstrap, before the router
     * renders any page, so that AuthGuard components have a settled auth state
     * to read from (isLoading will be false after this resolves).
     *
     * Restoration strategy:
     *   1. Check localStorage first — these are long-lived "remember me" sessions
     *   2. Fall back to sessionStorage — these are tab-scoped sessions
     *   3. If nothing is found → set isLoading: false and return (no-op)
     *   4. Validate that the stored payload has the expected shape
     *   5. Validate that the token has not passed its expiry timestamp
     *   6. On any validation failure → clearStorage(), set isLoading: false
     *   7. On success → hydrate state with the stored user and token
     *
     * This method never throws.  All errors are caught internally, logged, and
     * result in a clean unauthenticated state so the app can continue safely.
     *
     * @returns {Promise<void>} Resolves when the state has been settled
     *   (either hydrated with a valid session or reset to unauthenticated)
     *
     * @example
     * // src/main.js — called once before the router initialises:
     * import AuthContext from './context/AuthContext.js';
     * await AuthContext.restoreSession();
     * router.init(); // safe to render protected pages now
     */
    async function restoreSession() {
        // Signal to AuthGuard and the router that auth state is not yet settled.
        setState({ isLoading: true, error: null });

        try {
            // localStorage holds "remember me" sessions; check it first.
            // sessionStorage holds tab-scoped sessions; use it as a fallback.
            const stored =
                safeStorageRead(localStorage, TOKEN_KEY) ??
                safeStorageRead(sessionStorage, TOKEN_KEY);

            if (!stored) {
                // No stored session found — transition to clean unauthenticated state.
                setState({ isLoading: false });
                return;
            }

            const { token, expiresAt, user } = stored;

            // Guard against malformed payloads written by old versions of the app
            // or by external manipulation of storage.
            if (!token || !user || typeof user !== 'object') {
                console.warn(
                    '[AuthContext] Malformed session payload found in storage — clearing.'
                );
                clearStorage();
                setState({ isLoading: false });
                return;
            }

            // Fail-secure: treat a missing or past expiresAt as an expired token.
            if (isTokenExpired(expiresAt)) {
                console.warn('[AuthContext] Stored token has expired — clearing session.');
                clearStorage();
                setState({ isLoading: false });
                return;
            }

            // Payload is structurally valid and the token has not expired — restore.
            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            // Development-only confirmation log (analytics flag doubles as a
            // "production mode" signal since it is false in development by default).
            if (!ENV.ENABLE_ANALYTICS) {
                console.warn('[AuthContext] Session restored for user ID:', user.id);
            }
        } catch (err) {
            // An unexpected runtime error must never leave the app in a loading
            // state or prevent it from rendering.  Reset to a safe baseline.
            console.error('[AuthContext] restoreSession() encountered an unexpected error:', err);
            clearStorage();
            setState({ isLoading: false, error: null });
        }
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    /**
     * Processes a login attempt and updates the authentication state.
     *
     * ── Current behaviour (Part 3 — state management only) ──────────────────
     *   The method is fully structured for API integration but does NOT make
     *   an HTTP call yet.  Pass a pre-resolved `_authResponse` object to test
     *   the state machine in isolation while Part 8 is pending.
     *
     * ── Future behaviour (Part 8 — API Integration) ──────────────────────────
     *   TODO (Part 8 — API Integration):
     *     Remove the `_authResponse` parameter entirely.  Replace the
     *     placeholder block inside the try with:
     *
     *       import { authApi } from '../services/authApi.js';
     *       const authResponse = await authApi.login(credentials);
     *
     *     authApi.login() will POST to ENV.API_BASE_URL + API_ENDPOINTS.AUTH_LOGIN,
     *     return { token, expiresAt, user } on HTTP 200, and throw a normalised
     *     error object ({ code, message }) on 400 / 401 — which normaliseError()
     *     will handle correctly without any further changes to this method.
     *
     * ── Success flow ─────────────────────────────────────────────────────────
     *   1. Set isLoading: true, clear any previous error
     *   2. Obtain the auth response (currently via _authResponse; later via API)
     *   3. Validate the response shape
     *   4. Persist the token payload to the correct storage tier
     *      (localStorage for rememberMe=true; sessionStorage otherwise)
     *   5. Update state: user, token, isAuthenticated: true, isLoading: false
     *   6. Return { success: true, user }
     *
     * ── Failure flow ─────────────────────────────────────────────────────────
     *   Any error is caught, normalised, stored in state, and returned.
     *   This method NEVER throws — errors are always surfaced via the return
     *   value so callers can handle them without try/catch boilerplate.
     *
     * @param {LoginCredentials} credentials - User-supplied login data
     * @param {{ token: string, expiresAt: number, user: AuthUser }|null} [_authResponse]
     *   Temporary: pre-resolved auth payload for testing state transitions
     *   before Part 8 is merged.  Remove this parameter once authApi is wired.
     * @returns {Promise<LoginResult>} Always resolves; never rejects
     *
     * @example
     * // ── Part 3 testing (temporary) ──────────────────────────────────────
     * const result = await AuthContext.login(
     *   { email: 'student@demo.com', password: 'demo123', rememberMe: true },
     *   {
     *     token: 'fake-jwt-token',
     *     expiresAt: Date.now() + AUTH_CONSTANTS.TOKEN_EXPIRY_MS,
     *     user: { id: 'stu_001', name: 'Alex Johnson', email: 'alex@student.edu' },
     *   }
     * );
     * if (result.success) console.log('Logged in as', result.user.name);
     *
     * // ── Part 8 usage (once API is integrated) ───────────────────────────
     * const result = await AuthContext.login({ email, password, rememberMe });
     */
    async function login(credentials, _authResponse = null) {
        // ── Step 1: signal loading, clear stale error ─────────────────────────
        setState({ isLoading: true, error: null });

        try {
            // ── Step 2: obtain auth response ────────────────────────────────────
            //
            // TODO (Part 8 — API Integration):
            //   Delete the _authResponse parameter and this entire guard block.
            //   Replace with:
            //     const authResponse = await authApi.login(credentials);
            //
            //   The authApi module (src/services/authApi.js) will handle:
            //     • Building the POST request to ENV.API_BASE_URL + API_ENDPOINTS.AUTH_LOGIN
            //     • Setting Content-Type and Authorization headers
            //     • Mapping HTTP 401 → { code: ERROR_CODES.INVALID_CREDENTIALS, message }
            //     • Applying AbortController timeout (ENV.API_TIMEOUT ms)
            //     • Retry logic with exponential backoff (FR-API-004)
            //   After that change, rename `_authResponse` → `authResponse` below.
            //
            if (!_authResponse) {
                // Part 8 is not yet merged — surface a clear pending-integration error
                // so test code gets an actionable message rather than a silent failure.
                const pendingError = {
                    code: ERROR_CODES.UNKNOWN,
                    message:
                        'API layer (authApi) is not yet integrated. Provide _authResponse for testing.',
                };
                setState({ isLoading: false, error: pendingError });
                return { success: false, error: pendingError.message };
            }

            const { token, expiresAt, user } = _authResponse;

            // ── Step 3: validate the response shape ──────────────────────────────
            //
            // Reject incomplete payloads early so downstream code can trust that
            // all three fields exist without repeated null-checks.
            if (!token || !user || !expiresAt) {
                throw new Error(
                    'Auth response is missing required fields: token, expiresAt, user.'
                );
            }

            // ── Step 4: persist token to the correct storage tier ────────────────
            //
            // TODO (Part 9 — Data Persistence):
            //   Replace the two safeStorageWrite calls with a single call to:
            //     authStorage.saveAuthToken({ token, expiresAt, rememberMe });
            //   authStorage will encapsulate the tier-selection logic and add an
            //   in-memory fallback for private-browsing environments (FR-STOR-006).
            //
            const rememberMe = credentials.rememberMe === true;
            const payload = { token, expiresAt, user };

            if (rememberMe) {
                // Persistent session: survives browser restart for up to expiresAt.
                safeStorageWrite(localStorage, TOKEN_KEY, payload);
            } else {
                // Session-scoped: cleared automatically when the tab/browser closes.
                safeStorageWrite(sessionStorage, TOKEN_KEY, payload);
            }

            // ── Step 5: update state → triggers notify() → subscribers re-render ─
            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            // TODO (Part 4 — Routing):
            //   After a successful login the router should navigate to the saved
            //   redirect path (if any) or fall back to ROUTES.DASHBOARD:
            //
            //     const destination =
            //       authStorage.getRedirectPath() ?? ROUTES.DASHBOARD;
            //     router.navigate(destination);
            //
            //   Do NOT call router.navigate() here — it is the call-site's
            //   (LoginForm's submit handler) responsibility to trigger navigation
            //   so that AuthContext stays decoupled from the router.

            // ── Step 6: return success ────────────────────────────────────────────
            return { success: true, user };
        } catch (err) {
            // Normalise whatever was thrown into a { code, message } descriptor,
            // store it in state so the LoginForm can display it, and return
            // a failure result — never propagate the throw to the caller.
            const normalisedError = normaliseError(err, 'Login failed. Please try again.');
            setState({
                isLoading: false,
                error: normalisedError,
                isAuthenticated: false,
                user: null,
                token: null,
            });
            return { success: false, error: normalisedError.message };
        }
    }

    // ── Logout ────────────────────────────────────────────────────────────────

    /**
     * Ends the current user session and resets the authentication state to its
     * initial unauthenticated shape.
     *
     * Actions performed (in order):
     *   1. clearStorage()  — removes tokens from both localStorage and sessionStorage
     *   2. setState(...)   — resets all state fields to their INITIAL_STATE values
     *                        and calls notify() so every subscriber re-renders
     *
     * This method is synchronous and never throws.
     *
     * ── Router redirect ───────────────────────────────────────────────────────
     * This method intentionally does NOT navigate to the login page.
     * AuthContext has no dependency on the router — the separation of concerns
     * is by design (PRD § 6.2 — "zero-dep context layer").
     *
     * TODO (Part 4 — Routing):
     *   The router should subscribe to AuthContext and react to the
     *   `isAuthenticated: false` transition by navigating to ROUTES.LOGIN:
     *
     *     AuthContext.subscribe(({ isAuthenticated }) => {
     *       if (!isAuthenticated) router.navigate(ROUTES.LOGIN);
     *     });
     *
     *   Alternatively, the logout button handler in the Header component can
     *   call router.navigate(ROUTES.LOGIN) immediately after AuthContext.logout().
     *
     * @returns {void}
     *
     * @example
     * // Logout button click handler (header component):
     * logoutBtn.addEventListener('click', () => {
     *   AuthContext.logout();
     *   // TODO (Part 4): router.navigate(ROUTES.LOGIN);
     * });
     */
    function logout() {
        // Remove all token artefacts before resetting state so that any
        // subscriber that reads storage on notification finds nothing.
        clearStorage();

        // Reset to the exact unauthenticated shape — spread from INITIAL_STATE
        // except isLoading which must be false (session is definitively gone).
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });

        console.warn(
            `[AuthContext] Session ended. Navigate to ${ROUTES.LOGIN} via the router (Part 4).`
        );
    }

    // ── Public API ────────────────────────────────────────────────────────────
    //
    // Only the methods returned here are accessible to importers.  Everything
    // else (_state, _subscribers, and the private helpers) remains sealed
    // inside the IIFE closure.

    return {
        // ── Observer pattern ──────────────────────────────────────────────────
        /** @see subscribe */
        subscribe,
        /** @see unsubscribe */
        unsubscribe,
        /**
         * Manually re-delivers the current state to all subscribers.
         * Exposed for edge cases (e.g. a late-subscribing component that needs
         * the current snapshot immediately).  Not needed in normal usage.
         * @see notify
         */
        notify,

        // ── State accessors ───────────────────────────────────────────────────
        /** @see getState */
        getState,
        /**
         * Exposed for advanced use and unit testing of the state machine.
         * Prefer the named action methods (login, logout, restoreSession) in
         * application code — setState() is a low-level primitive.
         * @see setState
         */
        setState,

        // ── Session lifecycle ─────────────────────────────────────────────────
        /** @see restoreSession */
        restoreSession,
        /** @see login */
        login,
        /** @see logout */
        logout,

        // ── Storage ───────────────────────────────────────────────────────────
        /**
         * Exposed so that error-recovery paths in other modules (e.g. a global
         * 401 interceptor in Part 8) can wipe storage without triggering a full
         * logout state transition.
         * @see clearStorage
         */
        clearStorage,
    };
})();

export default AuthContext;
