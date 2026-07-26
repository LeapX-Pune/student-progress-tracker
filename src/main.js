import './styles/main.css';
import { initUserProfileHeader, updateWelcomeHeader } from './components/auth/UserProfileHeader.js';
import AuthContext from './context/AuthContext.js';
import createLoginPage from './pages/LoginPage.js';
import { initApi } from './services/api.js';
import { initMotionPreferences } from './utils/animations.js';
import { initScrollRestoration, updateDocumentTitle } from './utils/router.js';

/** @type {{ destroy: function }|null} Active page handle for cleanup */
let activePageHandle = null;

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
}

/**
 * Application initialization entry point.
 *
 * @returns {Promise<void>}
 */
async function init() {
    initMotionPreferences();
    initScrollRestoration();
    updateDocumentTitle();

    await initApi();
    await AuthContext.restoreSession();
    initUserProfileHeader();

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

    const signOutBtn = document.querySelector('.profile-dropdown-item--danger');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            AuthContext.logout();
            window.location.hash = '#/login';
        });
    }

    const app = document.getElementById('app');
    if (app) {
        app.classList.add('app--ready', 'anim-fade-in');
    }
}

document.addEventListener('DOMContentLoaded', init);
