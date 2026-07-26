import './styles/main.css';
import { createIcons, icons } from 'lucide';
import { createEmptyState } from './components/EmptyState.js';
import { withErrorBoundary } from './components/ErrorBoundary.js';
import { createLoadingSpinner } from './components/LoadingSpinner.js';
import { createModal } from './components/Modal.js';
import { removeSkeletons } from './components/SkeletonLoader.js';
import { showError, showInfo } from './components/Toast.js';
import { createTooltip } from './components/Tooltip.js';
import { initUserProfileHeader, updateWelcomeHeader } from './components/auth/UserProfileHeader.js';
import AuthContext from './context/AuthContext.js';
import { initCoursesPage } from './pages/CoursesPage.js';
import createLoginPage from './pages/LoginPage.js';
import { initApi } from './services/api.js';
import { initMotionPreferences } from './utils/animations.js';
import { handleGlobalErrors } from './utils/errors.js';
import { initScrollRestoration } from './utils/router.js';
import { initTheme } from './utils/theme.js';

/**
 * ─── BOOTSTRAP ARCHITECTURE ───────────────────────────────────────────────────
 * Responsibilities:
 * - Orchestrates the startup sequence of the entire SPA.
 * - Bridges the routing, authentication, styling, and DOM components.
 *
 * Startup Lifecycle & Dependency Order (Critical Sequence):
 * 1. Theme (initTheme) - Prevents FOUC (Flash of Unstyled Content).
 * 2. Motion Prefs (initMotionPreferences) - Disables animations if requested.
 * 3. Error Handling - Catches any exceptions during the rest of the boot phase.
 * 4. API (initApi) - Bootstraps the mock service before any components load.
 * 5. Authentication (restoreSession) - Validates the user synchronously.
 * 6. Routing (handleRouteMount) - Paints the initial DOM view via the hash.
 * 7. Components (lucide, tooltips) - Hydrates the DOM icons and interactions.
 *
 * Note: Event Ownership is maintained here (e.g. pathway:route listener) to prevent duplicates.
 * ──────────────────────────────────────────────────────────────────────────────
 */

// Legacy lucide bridge for handleRouteMount outside conflict area
if (typeof window !== 'undefined') {
    window.lucide = {
        /**
         *
         */
        createIcons: () => createIcons({ icons }),
    };
}

/** @type {{ destroy: function }|null} Active page handle for cleanup */
let activePageHandle = null;

/**
 * Initializes global error handling for uncaught exceptions.
 */
function wireGlobalErrorHandler() {
    handleGlobalErrors(error => {
        const message = error?.message || error?.reason?.message || 'An unexpected error occurred.';
        showError('Error', message);
    });
}

/**
 *
 */
function wireNetworkDetection() {
    window.addEventListener('offline', () => {
        showInfo('Offline', 'You are currently offline. Some features may be unavailable.');
    });
    window.addEventListener('online', () => {
        showInfo('Back Online', 'Your internet connection has been restored.');
    });
}

/**
 *
 */
function wireErrorBoundary() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    document.addEventListener('pathway:route', () => {
        window._pageContent = pageContent;
    });

    /**
     *
     */
    window._showErrorBoundary = ({ title, message, onRetry } = {}) => {
        withErrorBoundary(pageContent, { title, message, onRetry });
    };
}

/**
 *
 */
function wireAuth() {
    // Rely on handleRouteMount for View toggling based on hash routes.
    // The signout listener is handled at the bottom of the file in init().
    // We can show toast notifications here on auth state changes if desired,
    // but the duplicate logout click listener has been safely removed.
}

/**
 *
 */
function wireLoadingStates() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    document.addEventListener('pathway:route', () => {
        removeSkeletons(pageContent);
    });

    /**
     *
     */
    window._removePageSkeletons = () => {
        removeSkeletons(pageContent);
    };
}

/**
 *
 */
function wireTooltips() {
    document.querySelectorAll('.icon-button, .action-btn-circle').forEach(el => {
        const label =
            el.getAttribute('aria-label') || el.querySelector('.nav-label')?.textContent?.trim();
        if (label) {
            createTooltip(el, { content: label, position: 'bottom' });
        }
    });
}

/**
 *
 */
function wireAppInteractions() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    document.addEventListener('pathway:route', () => {
        createIcons({ icons });
        if (!pageContent.querySelector('.route-placeholder, .settings-page')) {
            return;
        }
    });

    /**
     *
     */
    window._showEmptyState = opts => {
        const emptyEl = createEmptyState(opts);
        pageContent.innerHTML = '';
        pageContent.appendChild(emptyEl);
        createIcons({ icons });
    };

    /**
     *
     */
    window._showModal = opts => {
        const modal = createModal(opts);
        createIcons({ icons });
        return modal;
    };

    document.querySelector('[data-notification-clear]')?.addEventListener('click', () => {
        createModal({
            title: 'Clear Notifications',
            body: 'Mark all notifications as read?',
            footer: '<button class="btn btn--primary" data-confirm-clear>Clear all</button>',
            /**
             *
             */
            onClose: () => {},
        });
    });
}

/**
 * Mounts or unmounts view containers based on pathway routing events.
 *
 * @param {string} route - Active route key
 * @returns {void}
 */
function handleRouteMount(route) {
    const pageContent = document.querySelector('[data-page-content]');
    const appShell = document.querySelector('.app-shell');

    if (activePageHandle && typeof activePageHandle.destroy === 'function') {
        activePageHandle.destroy();
        activePageHandle = null;
    }

    const { isAuthenticated, user } = AuthContext.getState();
    if (!isAuthenticated && route !== 'login') {
        window.location.hash = '#/login';
        return;
    }

    if (route === 'login') {
        if (appShell) appShell.classList.add('is-auth-view');
        if (pageContent) {
            pageContent.innerHTML = '';
            activePageHandle = createLoginPage(pageContent);
        }
    } else {
        if (appShell) appShell.classList.remove('is-auth-view');
        if (user) {
            updateWelcomeHeader(user);
        }
    }

    if (
        typeof window !== 'undefined' &&
        window.lucide &&
        typeof window.lucide.createIcons === 'function'
    ) {
        window.lucide.createIcons();
    }
}

/**
 * Application initialization entry point.
 *
 * @returns {Promise<void>}
 */
async function init() {
    // 1. Apply Theme
    initTheme();
    // 2. Apply Motion Preferences
    initMotionPreferences();
    // 3. Restore Scroll Position
    initScrollRestoration();
    // 4. Initialize Global Error Handling
    wireGlobalErrorHandler();
    wireErrorBoundary();
    // 5. Initialize Network Monitoring
    wireNetworkDetection();
    // 6. Initialize Loading System
    const spinner = createLoadingSpinner({ size: 'lg', label: 'Loading application...' });
    spinner.style.cssText =
        'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1000;';
    document.body.appendChild(spinner);
    wireLoadingStates();
    // 7. Restore Authentication Session
    await AuthContext.restoreSession();
    // 8. Initialize API Layer
    await initApi();
    // 9. Initialize Authentication UI Binding
    wireAuth();
    // 10. Resolve Current Route
    const { isAuthenticated } = AuthContext.getState();
    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (!isAuthenticated && currentHash !== 'login') {
        window.location.hash = '#/login';
    } else if (isAuthenticated && (currentHash === 'login' || !currentHash)) {
        window.location.hash = '#/overview';
    }
    // 11. Mount Application View
    document.addEventListener('pathway:route', event => {
        const routeKey = event.detail?.route;
        handleRouteMount(routeKey);
    });
    handleRouteMount(currentHash || (isAuthenticated ? 'overview' : 'login'));
    // 12. Initialize Courses Module
    initCoursesPage();
    // 13. Update User Profile Header
    initUserProfileHeader();
    const signOutBtn = document.querySelector('.profile-dropdown-item--danger');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            AuthContext.logout();
            window.location.hash = '#/login';
        });
    }
    // 14. Hydrate Lucide Icons
    createIcons({ icons });
    // 15. Enable Tooltips & UI Interactions
    wireTooltips();
    wireAppInteractions();
    // 16. Remove Loading State
    if (spinner.parentNode) spinner.parentNode.removeChild(spinner);
    const app = document.querySelector('.app-shell');
    if (app) app.classList.add('app--ready');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
