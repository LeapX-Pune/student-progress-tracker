/**
 * @fileoverview Router Guards — Part 3.
 *
 * Route-guard utility functions consumed by the SPA router
 * (to be built in Part 4) and by the AuthGuard component.
 * Centralises the logic that decides whether a navigation should
 * proceed, be redirected to /login, or be blocked entirely.
 *
 * @module router/guards
 */

import AuthContext from '../context/AuthContext.js';
import { isTokenExpired } from '../utils/authHelpers.js';
import { ROUTES } from '../utils/constants.js';

/**
 * Ensures the user is authenticated before allowing navigation.
 *
 * If not authenticated, returns a redirect descriptor pointing to
 * the login page with the intended path saved in a query parameter.
 *
 * @param {Object} context - The routing context
 * @param {string} context.path - The target path (e.g. '/dashboard')
 * @returns {{ redirect: string, params: { redirect: string } } | null}
 *   Redirect descriptor if unauthenticated, null if allowed
 */
export function requireAuth(context) {
    const { isAuthenticated } = AuthContext.getState();

    if (!isAuthenticated) {
        return {
            redirect: ROUTES.LOGIN,
            params: { redirect: context?.path || ROUTES.DASHBOARD },
        };
    }

    return null;
}

/**
 * Prevents authenticated users from navigating to the login page
 * or other authentication-related routes.
 *
 * @param {Object} context - The routing context
 * @returns {{ redirect: string } | null}
 *   Redirect to dashboard if already authenticated, null if allowed
 */
export function redirectIfAuthenticated(context) {
    const { isAuthenticated } = AuthContext.getState();

    if (isAuthenticated) {
        return {
            redirect: ROUTES.DASHBOARD,
        };
    }

    return null;
}

/**
 * Validates if the given token is present and not expired.
 *
 * @param {string|null} token - The auth token string
 * @param {number|string|null} expiresAt - The token expiry timestamp
 * @returns {boolean} True if the token is valid, false otherwise
 */
export function validateTokenExpiry(token, expiresAt) {
    if (!token) return false;
    if (isTokenExpired(expiresAt)) return false;

    return true;
}
