const scrollPositions = new Map();

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
