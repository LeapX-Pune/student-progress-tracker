/**
 * @fileoverview LoginPage — Top-Level Login Page — Part 3.
 *
 * Assembles the complete login view:
 *   • App logo + tagline (left / top panel)
 *   • LoginForm (right / bottom panel)
 *
 * Responsibilities:
 *   - Set `document.title` on mount (FR-UX-029)
 *   - Redirect to /dashboard if the user is already authenticated
 *   - Compose LoginForm with a navigation callback
 *   - Clean up subscriptions and child components on destroy
 *
 * ─── Navigation ──────────────────────────────────────────────────────────────
 *   TODO (Part 4 — Routing):
 *     Replace the `window.location.hash = …` calls with `router.navigate()`.
 *
 * @module pages/LoginPage
 */

import { createLoginForm } from '../components/auth/LoginForm.js';
import AuthContext from '../context/AuthContext.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_TITLE = 'Sign In | Student Progress Tracker';

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates and mounts the login page into the given container.
 *
 * @param {HTMLElement} container - The root element to mount into (e.g. `#app`)
 * @returns {{ destroy: function }} Cleanup handle
 *
 * @example
 * const page = createLoginPage(document.getElementById('app'));
 * // On route change / page destroy:
 * page.destroy();
 */
export function createLoginPage(container) {
    // ── Guard: redirect authenticated users away from the login page ──────────
    const { isAuthenticated, isLoading } = AuthContext.getState();

    if (!isLoading && isAuthenticated) {
        // TODO (Part 4 — Routing): router.navigate(ROUTES.DASHBOARD);
        window.location.hash = '/dashboard';
        // Return a no-op destroy handle — page won't be rendered.
        return {
            /**
             *
             */
            destroy: () => {},
        };
    }

    // ── Set document title ────────────────────────────────────────────────────
    document.title = PAGE_TITLE;

    // ── Build page shell ──────────────────────────────────────────────────────
    const pageEl = document.createElement('div');
    pageEl.className = 'login-page';
    pageEl.id = 'login-page';

    // ── Left / hero panel ─────────────────────────────────────────────────────
    const heroPanel = document.createElement('div');
    heroPanel.className = 'login-page__hero';
    heroPanel.setAttribute('aria-hidden', 'true'); // decorative panel

    const logoArea = document.createElement('div');
    logoArea.className = 'login-page__logo-area';

    // Inline SVG logo — uses the asset at src/assets/auth/logo.svg.
    // Loaded as an <img> with a meaningful alt so it degrades gracefully.
    const logoImg = document.createElement('img');
    logoImg.src = '/src/assets/auth/logo.svg';
    logoImg.alt = 'Student Progress Tracker logo';
    logoImg.className = 'login-page__logo';
    logoImg.width = 48;
    logoImg.height = 48;
    /**
     *
     */
    logoImg.onerror = () => {
        // If the SVG asset is missing, fall back to a text logo.
        logoImg.style.display = 'none';
    };

    const appName = document.createElement('span');
    appName.className = 'login-page__app-name';
    appName.textContent = 'Student Progress Tracker';

    logoArea.appendChild(logoImg);
    logoArea.appendChild(appName);

    const heroTagline = document.createElement('p');
    heroTagline.className = 'login-page__tagline';
    heroTagline.textContent = 'Track your learning journey, one course at a time.';

    // Login illustration
    const illustration = document.createElement('img');
    illustration.src = '/src/assets/auth/login.svg';
    illustration.alt = ''; // decorative — hidden from screen readers
    illustration.setAttribute('aria-hidden', 'true');
    illustration.className = 'login-page__illustration';
    /**
     *
     */
    illustration.onerror = () => {
        illustration.style.display = 'none';
    };

    heroPanel.appendChild(logoArea);
    heroPanel.appendChild(heroTagline);
    heroPanel.appendChild(illustration);

    // ── Right / form panel ────────────────────────────────────────────────────
    const formPanel = document.createElement('div');
    formPanel.className = 'login-page__form-panel';

    const formCard = document.createElement('div');
    formCard.className = 'login-page__form-card';

    formPanel.appendChild(formCard);

    pageEl.appendChild(heroPanel);
    pageEl.appendChild(formPanel);
    container.appendChild(pageEl);

    // ── Mount LoginForm into the card ─────────────────────────────────────────
    const loginFormHandle = createLoginForm(formCard, {
        /**
         *
         */
        onSuccess: (_user, destination) => {
            // TODO (Part 4 — Routing): router.navigate(destination);
            window.location.hash = destination;
        },
    });

    // ── Subscribe to AuthContext to handle mid-session auth changes ───────────
    //
    // If the user somehow becomes authenticated while on the login page
    // (e.g. via another tab), redirect them away.
    const unsubscribe = AuthContext.subscribe(({ isAuthenticated: authed }) => {
        if (authed) {
            // TODO (Part 4 — Routing): router.navigate(ROUTES.DASHBOARD);
            window.location.hash = '/dashboard';
        }
    });

    // ── Cleanup ────────────────────────────────────────────────────────────────

    return {
        /**
         * Tears down the login page, removing DOM elements and subscriptions.
         * Call this when the router navigates away from the login route.
         *
         * @returns {void}
         */
        destroy() {
            unsubscribe();
            loginFormHandle.destroy();
            if (container.contains(pageEl)) {
                container.removeChild(pageEl);
            }
            // Reset title to the app default.
            document.title = 'Student Progress Tracker';
        },
    };
}

export default createLoginPage;
