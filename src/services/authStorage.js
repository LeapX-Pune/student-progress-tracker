/**
 * @fileoverview Authentication Storage Service — Part 3.
 *
 * Abstracts all Web Storage reads and writes related to authentication
 * behind a clean, testable API so that AuthContext and authApi never
 * reference `localStorage` / `sessionStorage` directly.
 *
 * ─── Storage strategy ───────────────────────────────────────────────────────
 *   Token payload  { token, expiresAt, user }
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  rememberMe = true  → localStorage   (persists across browser close) │
 *   │  rememberMe = false → sessionStorage (cleared on tab/browser close)  │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 *   Read order: localStorage first → sessionStorage fallback.
 *   Clear: both tiers are always wiped to prevent orphaned tokens.
 *
 * ─── Private-browsing fallback (FR-STOR-006) ────────────────────────────────
 *   In environments where Web Storage is blocked (Safari private mode,
 *   certain enterprise browsers) every storage call is caught and an
 *   in-memory Map is used instead. The in-memory store is ephemeral —
 *   it lives only for the current page lifecycle — but it allows the
 *   application to function without crashing.
 *
 * ─── Exported API ───────────────────────────────────────────────────────────
 *   saveAuthToken({ token, expiresAt, rememberMe })
 *   getAuthToken()
 *   clearAuthToken()
 *   saveRedirectPath(path)
 *   getRedirectPath()
 *
 * @module services/authStorage
 */

import { ENV } from '../config/env.js';

// ─── Storage keys ─────────────────────────────────────────────────────────────
//
// Resolved once at module load from ENV so every function uses the
// same key string without repeating magic values.

/** @type {string} Key under which the auth payload is stored. */
const TOKEN_KEY = ENV.AUTH_TOKEN_KEY;

/** @type {string} Key under which the pre-login redirect path is stored. */
const REDIRECT_KEY = ENV.AUTH_REDIRECT_KEY;

// ─── In-memory fallback store (FR-STOR-006) ───────────────────────────────────
//
// Used when both localStorage and sessionStorage throw (e.g. private mode).
// Keys mirror the Web Storage key names so the rest of the code stays uniform.

/** @type {Map<string, string>} */
const _memoryStore = new Map();

// ─── Private helpers ──────────────────────────────────────────────────────────

/**
 * Attempts to read and JSON-parse a value from a single Web Storage tier.
 * Returns null on any failure (missing key, malformed JSON, storage blocked).
 *
 * @param {Storage} storage - `localStorage` or `sessionStorage`
 * @param {string}  key     - The storage key to read
 * @returns {unknown|null}  Parsed value or null
 */
function _storageRead(storage, key) {
    try {
        const raw = storage.getItem(key);
        if (raw === null || raw === '') return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * Attempts to JSON-serialise a value and write it to a Web Storage tier.
 * Falls back to the in-memory store when storage is unavailable.
 *
 * @param {Storage} storage - `localStorage` or `sessionStorage`
 * @param {string}  key     - The storage key to write
 * @param {unknown} value   - Any JSON-serialisable value
 * @returns {boolean} true when the write succeeded to Web Storage; false when
 *                    the fallback in-memory store was used
 */
function _storageWrite(storage, key, value) {
    try {
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        // Storage unavailable (private browsing, quota exceeded) — use memory.
        _memoryStore.set(key, JSON.stringify(value));
        return false;
    }
}

/**
 * Attempts to remove a key from a Web Storage tier.
 * Also removes the key from the in-memory fallback to keep them in sync.
 *
 * @param {Storage} storage - `localStorage` or `sessionStorage`
 * @param {string}  key     - The key to remove
 * @returns {void}
 */
function _storageRemove(storage, key) {
    try {
        storage.removeItem(key);
    } catch {
        // Storage unavailable — fall through to memory removal below.
    }
    _memoryStore.delete(key);
}

// ─── Exported API ─────────────────────────────────────────────────────────────

/**
 * Persists the authentication token payload to the appropriate storage tier.
 *
 * Stored payload shape:
 * ```json
 * { "token": "…", "expiresAt": 1234567890000, "user": { … } }
 * ```
 *
 * `expiresAt` is normalised to a Unix timestamp (ms) here regardless of
 * whether the server returns an ISO-8601 string or a numeric value.
 * This guarantees that `getAuthToken()` can always compare against `Date.now()`
 * without further type-checking.
 *
 * @param {Object}  params             - Token data from the auth API response
 * @param {string}  params.token       - Raw JWT or session token string
 * @param {number|string} params.expiresAt - Token expiry as a Unix ms timestamp
 *                                          or an ISO-8601 string
 * @param {Object}  params.user        - Authenticated user object
 * @param {boolean} [params.rememberMe=false] - When true: use localStorage;
 *                                              when false: use sessionStorage
 * @returns {void}
 */
export function saveAuthToken({ token, expiresAt, user, rememberMe = false }) {
    // Normalise expiresAt: accept both ISO strings and numeric timestamps.
    const normalised =
        typeof expiresAt === 'string' ? new Date(expiresAt).getTime() : Number(expiresAt);

    const payload = { token, expiresAt: normalised, user };

    if (rememberMe) {
        // Persistent session — survives browser restart.
        _storageWrite(localStorage, TOKEN_KEY, payload);
    } else {
        // Session-scoped — cleared automatically when the tab/browser closes.
        _storageWrite(sessionStorage, TOKEN_KEY, payload);
    }
}

/**
 * Retrieves the stored authentication token payload.
 *
 * Read order:
 *   1. `localStorage`   — "remember me" sessions
 *   2. `sessionStorage` — tab-scoped sessions
 *   3. In-memory store  — private-browsing fallback
 *
 * Returns null when no valid token payload is found in any tier.
 *
 * @returns {{ token: string, expiresAt: number, user: Object }|null}
 *   The stored payload, or null when none exists
 */
export function getAuthToken() {
    // Check Web Storage tiers first.
    const fromLocal = _storageRead(localStorage, TOKEN_KEY);
    if (fromLocal) return fromLocal;

    const fromSession = _storageRead(sessionStorage, TOKEN_KEY);
    if (fromSession) return fromSession;

    // Fall back to the in-memory store (private-browsing environments).
    const raw = _memoryStore.get(TOKEN_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * Removes the authentication token payload from all storage tiers.
 *
 * Clears localStorage, sessionStorage, AND the in-memory fallback
 * so that no orphaned token can be found by a subsequent `getAuthToken()` call,
 * regardless of which tier was used during login.
 *
 * Also removes the saved redirect path from sessionStorage.
 *
 * @returns {void}
 */
export function clearAuthToken() {
    _storageRemove(localStorage, TOKEN_KEY);
    _storageRemove(sessionStorage, TOKEN_KEY);
    // Remove the pre-login redirect path at the same time.
    _storageRemove(sessionStorage, REDIRECT_KEY);
}

/**
 * Saves the path the user was attempting to visit before being redirected
 * to the login page.  Stored in sessionStorage because the redirect intent
 * is only relevant for the current browser session.
 *
 * After a successful login, `getRedirectPath()` retrieves and removes this
 * value so the router can navigate to the intended destination.
 *
 * @param {string} path - A relative URL path, e.g. '/dashboard'
 * @returns {void}
 *
 * @example
 * // Called by AuthGuard when redirecting an unauthenticated user:
 * saveRedirectPath('/dashboard');
 * router.navigate(ROUTES.LOGIN);
 */
export function saveRedirectPath(path) {
    // Only store well-formed relative paths to prevent open-redirect attacks.
    // sanitizePath() in authHelpers.js enforces this — call it before here.
    try {
        sessionStorage.setItem(REDIRECT_KEY, path);
    } catch {
        _memoryStore.set(REDIRECT_KEY, path);
    }
}

/**
 * Retrieves and immediately removes the saved pre-login redirect path.
 *
 * The one-time read-and-delete behaviour prevents stale redirect paths
 * from persisting across multiple login sessions (a security consideration).
 *
 * Returns the default dashboard path when no redirect path was saved.
 *
 * @returns {string} The saved path, or `'/dashboard'` when none exists
 *
 * @example
 * // Called by LoginForm after a successful login:
 * const destination = getRedirectPath();  // e.g. '/dashboard'
 * router.navigate(destination);
 */
export function getRedirectPath() {
    // Try sessionStorage first.
    let path = null;
    try {
        path = sessionStorage.getItem(REDIRECT_KEY);
        sessionStorage.removeItem(REDIRECT_KEY);
    } catch {
        // Fall through to memory store below.
    }

    // Try in-memory fallback if sessionStorage was unavailable.
    if (!path) {
        path = _memoryStore.get(REDIRECT_KEY) ?? null;
        _memoryStore.delete(REDIRECT_KEY);
    }

    return path ?? '/dashboard';
}
