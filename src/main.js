import './styles/main.css';
import './dashboard/dashboard.css';
import { createIcons, icons } from 'lucide';
import { createEmptyState } from './components/EmptyState.js';
import { withErrorBoundary } from './components/ErrorBoundary.js';
import { initLoadingBar } from './components/LoadingBar.js';
import { createLoadingSpinner } from './components/LoadingSpinner.js';
import { createModal } from './components/Modal.js';
import { removeSkeletons } from './components/SkeletonLoader.js';
import { showError, showSuccess } from './components/Toast.js';
import { createTooltip } from './components/Tooltip.js';
import { initAppContext } from './context/AppContext.js';
import AuthContext from './context/AuthContext.js';
import { initCoursesPage } from './pages/CoursesPage.js';
import { initDashboardPage } from './pages/DashboardPage.js';
import { initGradesPage } from './pages/GradesPage.js';
import { createLoginPage } from './pages/LoginPage.js';
import { initApi } from './services/api.js';
import { initMotionPreferences } from './utils/animations.js';
import { handleGlobalErrors } from './utils/errors.js';
import { initScrollRestoration } from './utils/router.js';
import { initTheme } from './utils/theme.js';

/**
 *
 */
function wireGlobalErrorHandler() {
    handleGlobalErrors(error => {
        const message = error?.message || error?.reason?.message || 'An unexpected error occurred.';
        showError('Error', message);
    });
}

/**
 * Creates the persistent offline banner (FR-ERR-004).
 *
 * @returns {HTMLElement} The banner element
 */
function createOfflineBanner() {
    const banner = document.createElement('div');
    banner.className = 'offline-banner';
    banner.id = 'offline-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML = `
    <span class="offline-banner__icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>
    </span>
    <span class="offline-banner__text">You're offline. Data will refresh automatically when you're back online.</span>`;
    document.body.appendChild(banner);
    return banner;
}

/**
 * Wires the offline banner to the online/offline events. On reconnect the
 * banner is dismissed and a toast confirms the connection (FR-ERR-004/005).
 */
function wireNetworkDetection() {
    const banner = createOfflineBanner();

    /**
     *
     */
    const showBanner = () => banner.classList.add('offline-banner--visible');

    /**
     *
     */
    const hideBanner = () => {
        banner.classList.remove('offline-banner--visible');
        showSuccess('Back Online', 'Your internet connection has been restored.');
    };

    window.addEventListener('offline', showBanner);
    window.addEventListener('online', hideBanner);

    if (!navigator.onLine) showBanner();
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

let loginPageInstance = null;

/**
 *
 */
function showLoginView() {
    if (loginPageInstance) return;
    const authRoot = document.getElementById('auth-root');
    if (!authRoot) return;
    const appShell = document.querySelector('.app-shell');
    if (appShell) appShell.style.display = 'none';
    authRoot.style.display = '';
    loginPageInstance = createLoginPage(authRoot);
}

/**
 *
 */
function showAppView() {
    if (loginPageInstance) {
        loginPageInstance.destroy();
        loginPageInstance = null;
    }
    const authRoot = document.getElementById('auth-root');
    if (authRoot) authRoot.style.display = 'none';
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
        appShell.style.display = '';
        createIcons({ icons });
        requestAnimationFrame(() => window.dispatchEvent(new window.Event('app:shell-visible')));
    }
}

/**
 *
 */
function wireAuth() {
    AuthContext.subscribe(({ isAuthenticated, isLoading }) => {
        if (isLoading) return;
        if (isAuthenticated) showAppView();
        else showLoginView();
    });

    const signOutBtn = document.querySelector('.profile-dropdown-item--danger');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            AuthContext.logout();
            showSuccess('Signed Out', 'You have been signed out successfully.');
        });
    }

    // 401 responses from the API cause a global logout (FR-ERR-008).
    // Only notify when a session was actually active, since login failures
    // also produce 401 responses (handled inline by the login form).
    window.addEventListener('auth:unauthorized', () => {
        if (AuthContext.getState().isAuthenticated) {
            showError('Session Expired', 'Your session has expired. Please log in again.');
        }
    });

    // A stored token that expired between visits is detected at boot time.
    window.addEventListener('auth:session-expired', () => {
        showError('Session Expired', 'Your session has expired. Please log in again.');
    });
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
 *
 */
async function init() {
    initTheme();
    initMotionPreferences();
    initScrollRestoration();
    wireGlobalErrorHandler();
    wireNetworkDetection();
    wireErrorBoundary();
    wireAuth();
    wireLoadingStates();
    wireTooltips();
    wireAppInteractions();

    createIcons({ icons });

    const spinner = createLoadingSpinner({ size: 'lg', label: 'Loading application...' });
    spinner.style.cssText =
        'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1000;';
    document.body.appendChild(spinner);

    await initApi();
    await AuthContext.restoreSession();

    initAppContext();
    initLoadingBar();
    initCoursesPage();
    initDashboardPage();
    initGradesPage();

    if (spinner.parentNode) spinner.parentNode.removeChild(spinner);

    const app = document.querySelector('.app-shell');
    if (app) app.classList.add('app--ready');

    createIcons({ icons });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
