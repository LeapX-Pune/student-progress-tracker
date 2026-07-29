import './styles/main.css';
import './dashboard/dashboard.css';
import { createIcons, icons } from 'lucide';
import { createEmptyState } from './components/EmptyState.js';
import { withErrorBoundary } from './components/ErrorBoundary.js';
import { createLoadingSpinner } from './components/LoadingSpinner.js';
import { createModal } from './components/Modal.js';
import { removeSkeletons } from './components/SkeletonLoader.js';
import { showError, showInfo } from './components/Toast.js';
import { createTooltip } from './components/Tooltip.js';
import AuthContext from './context/AuthContext.js';
import { useDashboard } from './hooks/useDashboard.js';
import { useNotifications } from './hooks/useNotifications.js';
import { initAttendancePage } from './pages/AttendancePage.js';
import { initCoursesPage } from './pages/CoursesPage.js';
import { initGradesPage } from './pages/GradesPage.js';
import { createLoginPage } from './pages/LoginPage.js';
import { initProfilePage } from './pages/ProfilePage.js';
import { initSettingsPage } from './pages/SettingsPage.js';
import { initApi } from './services/api.js';

// Export to window for iframe access
window.useDashboard = useDashboard;
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
    if (appShell) {
        appShell.style.display = '';
        createIcons({ icons });
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
 * Initialize notifications panel
 */
function initNotifications() {
    const panel = document.querySelector('[data-notification-panel]');
    if (!panel) return;

    const dot = document.querySelector('[data-notification-dot]');
    const {
        subscribe,
        fetchNotifications,
        markAsRead,
        markAllRead,
        setSearch,
        setFilter,
        setSort,
    } = useNotifications();

    // Setup Toolbar inside notification panel
    import('./components/Toolbar.js')
        .then(({ createToolbar }) => {
            const toolbar = createToolbar({
                searchPlaceholder: 'Search notifications...',
                filterOptions: [
                    { value: 'all', label: 'All' },
                    { value: 'read', label: 'Read' },
                    { value: 'unread', label: 'Unread' },
                    { value: 'system', label: 'System' },
                    { value: 'course', label: 'Course' },
                ],
                sortOptions: [
                    { value: 'newest', label: 'Newest' },
                    { value: 'oldest', label: 'Oldest' },
                    { value: 'priority', label: 'Priority' },
                ],
                onSearch: setSearch,
                onFilter: setFilter,
                onSort: setSort,
            });

            // Insert toolbar at the top of the panel, right after the header if it exists
            const header = panel.querySelector('.notification-header') || panel.firstElementChild;
            if (header) {
                header.insertAdjacentElement('afterend', toolbar);
            } else {
                panel.insertBefore(toolbar, panel.firstChild);
            }
            return true;
        })
        .catch(console.error);

    const listContainer = document.createElement('div');
    listContainer.className = 'notification-list';
    panel.appendChild(listContainer);

    subscribe(state => {
        if (state.loading) {
            listContainer.innerHTML =
                '<div style="padding: 1rem; text-align: center; color: var(--text-secondary);">Loading notifications...</div>';
            return;
        }

        if (state.error) {
            listContainer.innerHTML =
                '<div style="padding: 1rem; text-align: center; color: var(--color-danger);">Failed to load notifications.</div>';
            return;
        }

        if (!state.data) return;

        const unreadCount = state.data.filter(n => !n.isRead).length;
        if (dot) {
            dot.style.display = unreadCount > 0 ? 'block' : 'none';
        }

        const emptyMsg = panel.querySelector('.notification-empty');
        if (emptyMsg) emptyMsg.style.display = 'none';

        const notifications = state.filteredData || [];

        if (notifications.length === 0) {
            listContainer.innerHTML =
                '<div style="padding: 2rem 1rem; text-align: center; color: var(--text-secondary);">No notifications found.</div>';
            return;
        }

        listContainer.innerHTML = '';
        notifications.forEach(n => {
            const item = document.createElement('div');
            item.className = 'notification-item' + (n.isRead ? '' : ' unread');
            item.style.padding = '1rem';
            item.style.borderBottom = '1px solid var(--border-color)';
            if (!n.isRead) item.style.backgroundColor = 'var(--bg-surface-hover)';

            item.innerHTML = `
                <div style="font-weight: 500; font-size: 0.875rem; color: var(--text-primary); margin-bottom: 0.25rem;">${n.title}</div>
                <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${n.message}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">${new Date(n.timestamp).toLocaleString()}</div>
                ${!n.isRead ? '<button class="mark-read-btn" style="background:none; border:none; color:var(--primary-color); cursor:pointer; font-size:0.75rem; padding:0; margin-top:0.5rem;">Mark as read</button>' : ''}
            `;

            const btn = item.querySelector('.mark-read-btn');
            if (btn) {
                btn.addEventListener('click', async e => {
                    e.stopPropagation();
                    await markAsRead(n.id);
                });
            }

            listContainer.appendChild(item);
        });
    });

    // Handle "Clear All" confirm
    document.body.addEventListener('click', async e => {
        if (e.target.hasAttribute('data-confirm-clear')) {
            await markAllRead();
            const modal = e.target.closest('.modal-overlay');
            if (modal) modal.querySelector('[data-modal-close]')?.click();
        }
    });

    fetchNotifications();
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

    initCoursesPage();
    initGradesPage();
    initAttendancePage();
    initSettingsPage();
    initProfilePage();
    initNotifications();

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
