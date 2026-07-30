/**
 * @fileoverview AuthContext — Global Authentication State Manager.
 *
 * Single source of truth for the current user session across the entire
 * Student Progress Tracking SaaS application. Implements the Observer
 * (Publish–Subscribe) pattern so any module can reactively respond to
 * authentication state changes without tight coupling or prop-drilling.
 *
 * ─── Responsibility boundary ────────────────────────────────────────────────
 *   This module is ONLY responsible for:
 *     • Holding and updating the authentication state object
 *     • Notifying registered subscribers on every state change
 *     • Structuring the login / logout state transitions
 *
 *   It is NOT responsible for:
 *     • Making HTTP requests          → authApi.js
 *     • Low-level storage abstraction → authStorage.js
 *     • Client-side routing           → router/guards.js
 *     • Rendering any UI              → LoginForm.js
 *     • Displaying toast messages     → Toast.js
 *
 * @module context/AuthContext
 */

import { ENV } from '../config/env.js';
import * as authApi from '../services/authApi.js';
import { saveAuthToken, getAuthToken, clearAuthToken } from '../services/authStorage.js';
import { isTokenExpired } from '../utils/authHelpers.js';
import { ERROR_CODES, ROUTES } from '../utils/constants.js';

// ─── Private helper functions ─────────────────────────────────────────────────

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
    if (err && typeof err === 'object' && 'code' in err) {
        return /** @type {{ code: string, message: string }} */ (err);
    }

    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : fallback;
    return { code: ERROR_CODES.UNKNOWN, message };
}

// ─── Type definitions ─────────────────────────────────────────────────────────

/**
 * Shape of the authenticated user object returned by the API and stored
 * in AuthContext state.
 *
 * @typedef {Object} AuthUser
 * @property {string}      id
 * @property {string}      name
 * @property {string}      email
 * @property {string}      [role]
 * @property {string|null} [avatar]
 * @property {string|null} [avatarUrl]
 * @property {string}      [studentId]
 * @property {string}      [teacherId]
 * @property {string}      [class]
 * @property {string}      [rollNumber]
 * @property {string}      [department]
 * @property {string}      [designation]
 * @property {string}      [status]
 */

/**
 * The complete authentication state object managed by AuthContext.
 *
 * @typedef {Object} AuthState
 * @property {AuthUser|null}                         user
 * @property {string|null}                           token
 * @property {boolean}                               isAuthenticated
 * @property {boolean}                               isLoading
 * @property {{ code: string, message: string }|null} error
 */

/**
 * Credentials submitted by the user on the login form.
 *
 * @typedef {Object} LoginCredentials
 * @property {string}  email
 * @property {string}  password
 * @property {string}  [role]
 * @property {boolean} [rememberMe]
 * @property {string}  [name]
 */

/**
 * The value returned by AuthContext.login() regardless of outcome.
 *
 * @typedef {Object} LoginResult
 * @property {boolean}   success
 * @property {AuthUser}  [user]
 * @property {string}    [error]
 */

// ─── Initial state ────────────────────────────────────────────────────────────

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
 * @namespace AuthContext
 */
const AuthContext = (() => {
    /** @type {AuthState} */
    let _state = { ...INITIAL_STATE };

    /** @type {Set<(state: AuthState) => void>} */
    const _subscribers = new Set();

    /**
     * Registers a callback to receive frozen state snapshots whenever the
     * authentication state changes.
     *
     * @param {(state: AuthState) => void} callback
     * @returns {() => void}
     */
    function subscribe(callback) {
        if (typeof callback !== 'function') {
            console.warn(
                '[AuthContext] subscribe() expects a function, received:',
                typeof callback
            );
            return () => {};
        }
        _subscribers.add(callback);
        return () => unsubscribe(callback);
    }

    /**
     * Removes a callback from the subscriber registry.
     *
     * @param {(state: AuthState) => void} callback
     * @returns {void}
     */
    function unsubscribe(callback) {
        _subscribers.delete(callback);
    }

    /**
     * Delivers a frozen snapshot of the current state to every registered subscriber.
     *
     * @returns {void}
     */
    function notify() {
        const snapshot = Object.freeze({ ..._state });
        _subscribers.forEach(callback => {
            try {
                callback(snapshot);
            } catch (err) {
                console.error('[AuthContext] A subscriber threw an error:', err);
            }
        });
    }

    /**
     * The only permitted way to update authentication state.
     *
     * @param {Partial<AuthState>} partialState
     * @returns {void}
     */
    function setState(partialState) {
        _state = { ..._state, ...partialState };
        notify();
    }

    /**
     * Returns a frozen, one-time snapshot of the current authentication state.
     *
     * @returns {Readonly<AuthState>}
     */
    function getState() {
        return Object.freeze({ ..._state });
    }

    /**
     * Attempts to restore a previous authentication session from authStorage.
     * Must be called once during application bootstrap.
     *
     * @returns {Promise<void>}
     */
    async function restoreSession() {
        setState({ isLoading: true, error: null });

        try {
            const stored = getAuthToken();

            if (!stored) {
                setState({ isLoading: false });
                return;
            }

            const { token, expiresAt, user } = stored;

            if (!token || !user || typeof user !== 'object') {
                console.warn(
                    '[AuthContext] Malformed session payload found in storage — clearing.'
                );
                clearAuthToken();
                setState({ isLoading: false });
                return;
            }

            if (token === 'mock-jwt-token-dev') {
                console.warn('[AuthContext] Stale mock auto-login token found — clearing.');
                clearAuthToken();
                setState({ isLoading: false });
                return;
            }

            if (isTokenExpired(expiresAt)) {
                console.warn('[AuthContext] Stored token has expired — clearing session.');
                clearAuthToken();
                setState({ isLoading: false });
                return;
            }

            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            if (!ENV.ENABLE_ANALYTICS) {
                console.warn('[AuthContext] Session restored for user ID:', user.id);
            }
        } catch (err) {
            console.error('[AuthContext] restoreSession() encountered an unexpected error:', err);
            clearAuthToken();
            setState({ isLoading: false, error: null });
        }
    }

    /**
     * Processes a login attempt using the authApi service and updates the state.
     *
     * @param {LoginCredentials} credentials
     * @returns {Promise<LoginResult>}
     */
    async function login(credentials) {
        setState({ isLoading: true, error: null });

        try {
            const authResponse = await authApi.login(credentials);
            const { token, expiresAt, user } = authResponse;

            if (!token || !user || !expiresAt) {
                throw new Error(
                    'Auth response is missing required fields: token, expiresAt, user.'
                );
            }

            const rememberMe = credentials.rememberMe === true;
            saveAuthToken({ token, expiresAt, user, rememberMe });

            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return { success: true, user };
        } catch (err) {
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

    /**
     * Ends the current user session.
     *
     * @returns {void}
     */
    function logout() {
        clearAuthToken();

        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });

        console.warn(`[AuthContext] Session ended. Navigate to ${ROUTES.LOGIN} via the router.`);
    }

    // Listen for global unauthorized events (e.g., from api.js)
    window.addEventListener('auth:unauthorized', () => {
        if (_state.isAuthenticated) {
            console.warn('[AuthContext] 401 Unauthorized detected globally. Logging out.');
            logout();
        }
    });

    return {
        subscribe,
        unsubscribe,
        notify,
        getState,
        setState,
        restoreSession,
        login,
        logout,
        clearStorage: clearAuthToken,
    };
})();

export default AuthContext;
