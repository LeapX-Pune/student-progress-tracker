/**
 * @fileoverview AuthGuard — Route Protection Component — Part 3.
 *
 * Guards a page element from unauthenticated access.
 * Reads the current AuthContext state and either:
 *   • Renders the protected content (when authenticated)
 *   • Redirects to /login with a ?redirect= parameter (when not authenticated)
 *   • Renders nothing (when the session is still loading/restoring)
 *
 * ─── Usage ────────────────────────────────────────────────────────────────────
 *
 *   const guard = createAuthGuard(pageContainer, '/overview');
 *
 *   // Call render() after calling AuthContext.restoreSession():
 *   await AuthContext.restoreSession();
 *   guard.render();
 *
 *   // Or subscribe so it re-evaluates on every auth change:
 *   guard.watch();     // starts watching
 *   guard.unwatch();   // stops watching (call on page destroy)
 *
 * @module components/auth/AuthGuard
 */

import AuthContext from '../../context/AuthContext.js';
import { saveRedirectPath } from '../../services/authStorage.js';
import { buildLoginRedirectUrl, sanitizePath } from '../../utils/authHelpers.js';

/**
 * Creates an AuthGuard instance for a given page container.
 *
 * @param {HTMLElement} container - The DOM element that holds the protected page
 * @param {string}      [currentPath='/'] - The current page path; used to build
 *                                          the `?redirect=` parameter on redirect
 * @returns {{ render: function, watch: function, unwatch: function }}
 *
 * @example
 * const guard = createAuthGuard(document.getElementById('main'), '/overview');
 * await AuthContext.restoreSession();
 * guard.watch(); // starts reacting to auth changes
 */
export function createAuthGuard(container, currentPath = '/') {
    let _unsubscribe = null;

    /**
     * Evaluates the current auth state and acts accordingly.
     *
     * - isLoading=true → hides content (session still restoring, avoid flash)
     * - isAuthenticated=true → shows content
     * - isAuthenticated=false → redirects to login
     *
     * @returns {void}
     */
    function render() {
        const { isAuthenticated, isLoading } = AuthContext.getState();

        if (isLoading) {
            // Session restoration in progress — hide content to avoid
            // a momentary flash of the protected page before redirecting.
            container.style.visibility = 'hidden';
            return;
        }

        if (isAuthenticated) {
            // Valid session — show the protected content.
            container.style.visibility = '';
            return;
        }

        // Not authenticated — save the intended path and redirect to login.
        const safePath = sanitizePath(currentPath) || '/';
        saveRedirectPath(safePath);

        const loginUrl = buildLoginRedirectUrl(safePath);
        window.location.hash = loginUrl;
    }

    return {
        /** Evaluates auth state once and acts. */
        render,

        /**
         * Subscribes to AuthContext so the guard re-evaluates on every
         * state change (login, logout, session expiry).
         * Call once during page mount after `AuthContext.restoreSession()`.
         *
         * @returns {void}
         */
        watch() {
            if (_unsubscribe) return; // already watching
            _unsubscribe = AuthContext.subscribe(render);
            // Evaluate immediately with the current state.
            render();
        },

        /**
         * Unsubscribes from AuthContext.
         * Must be called when the page is unmounted to prevent memory leaks.
         *
         * @returns {void}
         */
        unwatch() {
            if (_unsubscribe) {
                _unsubscribe();
                _unsubscribe = null;
            }
        },
    };
}
