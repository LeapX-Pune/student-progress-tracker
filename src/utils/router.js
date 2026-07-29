const scrollPositions = new Map();
import AuthContext from '../context/AuthContext.js';

/**
 *
 */
export function updateDocumentTitle(title, suffix = 'Student Progress Tracker') {
    document.title = title ? `${title} — ${suffix}` : suffix;
}

/**
 *
 */
export function saveScrollPosition(key) {
    scrollPositions.set(key, window.scrollY);
}

/**
 *
 */
export function restoreScrollPosition(key, { fallback = 0 } = {}) {
    const pos = scrollPositions.has(key) ? scrollPositions.get(key) : fallback;
    requestAnimationFrame(() => {
        window.scrollTo({ top: pos, behavior: 'instant' });
    });
}

/**
 *
 */
export function initScrollRestoration() {
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }

    window.addEventListener('beforeunload', () => {
        saveScrollPosition(window.location.pathname);
    });
}

/**
 *
 */
export function scrollToElement(selector, options = {}) {
    const { behavior = 'smooth', offset = 0 } = options;
    requestAnimationFrame(() => {
        const el = document.querySelector(selector);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior });
            el.focus({ preventScroll: true });
        }
    });
}

/**
 *
 */
export function scrollToTop(options = {}) {
    const { behavior = 'smooth' } = options;
    window.scrollTo({ top: 0, behavior });
}

const ROUTES = {
    overview: 'Overview',
    students: 'Students',
    courses: 'Courses',
    grades: 'Grades',
    attendance: 'Attendance',
    settings: 'Settings',
    profile: 'Profile',
};
const DEFAULT_ROUTE = 'overview';

/**
 *
 */
function parseRoute() {
    const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    return Object.prototype.hasOwnProperty.call(ROUTES, raw) ? raw : DEFAULT_ROUTE;
}

/**
 *
 */
function setActiveNav(routeKey) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const isActive = link.dataset.route === routeKey;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

/**
 *
 */
function renderPlaceholder(routeKey) {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;
    if (routeKey === 'settings') return;
    pageContent.innerHTML =
        '<div class="route-placeholder" style="padding: 2rem; display: flex; justify-content: center;"><div class="spinner"></div></div>';
}

/**
 *
 */
export function handleRouteChange(pushState) {
    const routeKey = parseRoute();

    if (AuthContext) {
        if (!AuthContext.canAccessRoute(routeKey)) {
            setActiveNav('');
            const pageContent = document.querySelector('[data-page-content]');
            if (pageContent) {
                pageContent.innerHTML =
                    '<div style="padding:2rem;text-align:center;"><h2>403 Forbidden</h2><p>You don\'t have access to this route.</p></div>';
            }
            return;
        }
    }

    if (pushState !== false) {
        const target = '#/' + routeKey;
        if (window.location.hash !== target) {
            window.location.hash = target;
            return;
        }
    }

    setActiveNav(routeKey);
    renderPlaceholder(routeKey);

    const breadcrumbLabel = document.querySelector('[data-breadcrumb-label]');
    if (breadcrumbLabel) breadcrumbLabel.textContent = ROUTES[routeKey];
    updateDocumentTitle(ROUTES[routeKey]);

    const event = new window.CustomEvent('pathway:route', {
        detail: { route: routeKey, label: ROUTES[routeKey] },
    });
    document.dispatchEvent(event);

    if (window.innerWidth <= 768) {
        const drawerOverlay = document.querySelector('[data-drawer-overlay]');
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar) sidebar.classList.remove('is-open');
        if (drawerOverlay) drawerOverlay.hidden = true;
    }
}

/**
 *
 */
export function initRouter() {
    window.addEventListener('hashchange', () => handleRouteChange(false));
    handleRouteChange(false);
}
