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

// Legacy lucide bridge for handleRouteMount outside conflict area
if (typeof window !== 'undefined') {
    window.lucide = {
        /**
         *
         */
        createIcons: () => createIcons({ icons }),
    };
}

let activePageHandle = null;

/** */
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
function wireAuth() {}

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
 *
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
 *
 */
async function init() {
    initTheme();
    initMotionPreferences();
    initScrollRestoration();
    wireGlobalErrorHandler();
    wireErrorBoundary();
    wireNetworkDetection();
    const spinner = createLoadingSpinner({ size: 'lg', label: 'Loading application...' });
    spinner.style.cssText =
        'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1000;';
    document.body.appendChild(spinner);
    wireLoadingStates();
    await initApi();
    await AuthContext.restoreSession();
    wireAuth();
    const { isAuthenticated } = AuthContext.getState();
    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (!isAuthenticated && currentHash !== 'login') {
        window.location.hash = '#/login';
    } else if (isAuthenticated && (currentHash === 'login' || !currentHash)) {
        window.location.hash = '#/overview';
    }
    document.addEventListener('pathway:route', event => {
        const routeKey = event.detail?.route;
        handleRouteMount(routeKey);
    });
    handleRouteMount(currentHash || (isAuthenticated ? 'overview' : 'login'));
    initCoursesPage();
    initUserProfileHeader();
    const signOutBtn = document.querySelector('.profile-dropdown-item--danger');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            AuthContext.logout();
            window.location.hash = '#/login';
        });
    }
    createIcons({ icons });
    wireTooltips();
    wireAppInteractions();
    if (spinner.parentNode) spinner.parentNode.removeChild(spinner);
    const app = document.querySelector('.app-shell');
    if (app) app.classList.add('app--ready');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
