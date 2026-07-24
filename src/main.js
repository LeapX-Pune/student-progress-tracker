import './styles/main.css';
import { createEmptyState } from './components/EmptyState.js';
import { withErrorBoundary } from './components/ErrorBoundary.js';
import { createLoadingSpinner } from './components/LoadingSpinner.js';
import { createModal } from './components/Modal.js';
import { renderSkeleton, removeSkeletons } from './components/SkeletonLoader.js';
import { showError, showInfo } from './components/Toast.js';
import { createTooltip } from './components/Tooltip.js';
import AuthContext from './context/AuthContext.js';
import { createLoginPage } from './pages/LoginPage.js';
import { initApi } from './services/api.js';
import { initMotionPreferences } from './utils/animations.js';
import { handleGlobalErrors } from './utils/errors.js';
import { initScrollRestoration, updateDocumentTitle } from './utils/router.js';

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
    if (appShell) appShell.style.display = '';
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
            showInfo('Signed Out', 'You have been signed out successfully.');
        });
    }
}

/**
 *
 */
function wireLoadingStates() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    document.addEventListener('pathway:route', () => {
        renderSkeleton(pageContent, 'card', 3);
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
    document.querySelectorAll('.icon-button, .nav-link, .action-btn-circle').forEach(el => {
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
    };

    /**
     *
     */
    window._showModal = opts => {
        return createModal(opts);
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
    initMotionPreferences();
    initScrollRestoration();
    updateDocumentTitle();
    wireGlobalErrorHandler();
    wireNetworkDetection();
    wireErrorBoundary();
    wireAuth();
    wireLoadingStates();
    wireTooltips();
    wireAppInteractions();

    const spinner = createLoadingSpinner({ size: 'lg', label: 'Loading application...' });
    spinner.style.cssText =
        'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1000;';
    document.body.appendChild(spinner);

    await AuthContext.restoreSession();
    await initApi();

    if (spinner.parentNode) spinner.parentNode.removeChild(spinner);

    const app = document.querySelector('.app-shell');
    if (app) app.classList.add('app--ready');
}

document.addEventListener('DOMContentLoaded', init);
