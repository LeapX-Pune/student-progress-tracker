import './styles/main.css';
import { withErrorBoundary } from './components/ErrorBoundary.js';
import { showError, showInfo } from './components/Toast.js';
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

    await initApi();

    const app = document.querySelector('.app-shell');
    if (app) {
        app.classList.add('app--ready');
    }
}

document.addEventListener('DOMContentLoaded', init);
