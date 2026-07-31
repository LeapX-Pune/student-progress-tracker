/**
 * @fileoverview useAuth — Reactive Authentication Hook — Part 3.
 *
 * Provides a subscription-based interface to the AuthContext singleton for
 * vanilla-JS component trees.  Components call `useAuth(renderCallback)` to
 * receive the current auth state and action functions.  The hook subscribes to
 * AuthContext on creation and invokes `renderCallback` whenever the state
 * changes, enabling reactive re-renders without a framework.
 *
 * ─── Pattern ────────────────────────────────────────────────────────────────
 *
 *   const auth = useAuth(state => myComponent.update(state));
 *
 *   // Read current state at any time (one-off, not reactive)
 *   const { user, isAuthenticated } = auth.getState();
 *
 *   // Trigger auth actions
 *   await auth.login({ email, password, rememberMe });
 *   auth.logout();
 *
 *   // Cleanup when the component is destroyed
 *   auth.destroy();
 *
 * ─── Why not just import AuthContext directly? ───────────────────────────────
 *   Components that import AuthContext directly become coupled to its internal
 *   API.  useAuth provides a stable, documented interface that can absorb
 *   future refactors (e.g. splitting AuthContext into sub-contexts) without
 *   touching every component.
 *
 * @module hooks/useAuth
 */

import AuthContext from '../context/AuthContext.js';

// ─── Type definitions ─────────────────────────────────────────────────────────

/**
 * @typedef {Object} AuthState
 * @property {Object|null}  user            - Authenticated user, or null
 * @property {string|null}  token           - Raw token string, or null
 * @property {boolean}      isAuthenticated - Whether a valid session is active
 * @property {boolean}      isLoading       - True during session restoration
 * @property {Object|null}  error           - Last auth error, or null
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string}  email      - User's email address
 * @property {string}  password   - User's password
 * @property {boolean} [rememberMe=false] - Persist session across browser close
 */

/**
 * @typedef {Object} LoginResult
 * @property {boolean}      success - Whether the login succeeded
 * @property {Object}       [user]  - Authenticated user (on success)
 * @property {string}       [error] - Error message (on failure)
 */

/**
 * @typedef {Object} AuthHook
 * @property {function(): Readonly<AuthState>}               getState  - Returns a frozen state snapshot
 * @property {function(LoginCredentials): Promise<LoginResult>} login  - Initiates login
 * @property {function(): void}                              logout    - Ends the session
 * @property {function(): void}                              destroy   - Unsubscribes the hook
 */

// ─── Hook factory ─────────────────────────────────────────────────────────────

/**
 * Creates a reactive auth hook bound to the current component lifecycle.
 *
 * Immediately subscribes to AuthContext using the supplied `onStateChange`
 * callback.  The callback is called with a frozen AuthState snapshot every
 * time the auth state changes (login, logout, session restoration, error).
 *
 * **Lifecycle requirement:** call `destroy()` on the returned object when the
 * component is unmounted / removed from the DOM to prevent memory leaks from
 * stale closure references.
 *
 * @param {function(AuthState): void} [onStateChange] - Optional callback
 *   invoked on every state change.  Omit when only the imperative API is
 *   needed (e.g. a guard checking auth status once, not re-rendering).
 * @returns {AuthHook} Hook object exposing getState, login, logout, and destroy
 *
 * @example
 * // Inside a vanilla-JS component's mount() function:
 * const auth = useAuth(({ isAuthenticated, user }) => {
 *   avatarEl.textContent = isAuthenticated ? user.name : 'Guest';
 * });
 *
 * // In the component's destroy() / disconnectedCallback():
 * auth.destroy();
 */
export function useAuth(onStateChange) {
    // ── Input validation ──────────────────────────────────────────────────────
    //
    // Accept undefined (imperative-only usage) but warn on incorrect types.
    if (onStateChange !== undefined && typeof onStateChange !== 'function') {
        console.warn(
            '[useAuth] onStateChange must be a function or undefined, received:',
            typeof onStateChange
        );
        // Reassign to undefined so we don't register a broken subscriber.
        onStateChange = undefined;
    }

    // ── Subscribe ─────────────────────────────────────────────────────────────
    //
    // Store the unsubscribe function returned by AuthContext.subscribe() so
    // destroy() can call it without needing to hold a reference to the callback.
    let _unsubscribe = null;

    if (typeof onStateChange === 'function') {
        _unsubscribe = AuthContext.subscribe(onStateChange);
    }

    // ── Returned hook object ──────────────────────────────────────────────────

    return {
        /**
         * Returns a frozen, one-time snapshot of the current auth state.
         * Use this for one-off reads (e.g. in guards or conditional renders).
         * For reactive updates, rely on the `onStateChange` callback instead.
         *
         * @returns {Readonly<AuthState>}
         */
        getState() {
            return AuthContext.getState();
        },

        /**
         * Initiates a login attempt with the provided credentials.
         * Delegates to AuthContext.login() and the authApi / authStorage layers.
         *
         * Returns a LoginResult object — never throws. Check `result.success`
         * to determine whether to navigate or display an error.
         *
         * @param {LoginCredentials} credentials
         * @returns {Promise<LoginResult>}
         */
        async login(credentials) {
            return AuthContext.login(credentials);
        },

        /**
         * Ends the current session.  Clears all stored tokens and resets
         * auth state.  Does not navigate — the caller (usually LoginForm's
         * submit handler or a logout button) is responsible for routing.
         *
         * @returns {void}
         */
        logout() {
            AuthContext.logout();
        },

        /**
         * Unsubscribes this hook instance from AuthContext.
         * **Must be called** when the component using this hook is destroyed
         * to prevent memory leaks.
         *
         * @returns {void}
         *
         * @example
         * // In a vanilla component's cleanup / disconnectedCallback:
         * auth.destroy();
         */
        destroy() {
            if (_unsubscribe) {
                _unsubscribe();
                _unsubscribe = null;
            }
        },
    };
}

// ─── Default export (convenience) ─────────────────────────────────────────────

export default useAuth;
