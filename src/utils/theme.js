/**
 * @fileoverview Theme Management Utility — Light/Dark Theme Recovery & Synchronization.
 *
 * Provides theme initialization, toggle, and persistence across browser sessions
 * using CSS design tokens and body.dark class hierarchy.
 *
 * @module utils/theme
 */

/**
 * Reads saved theme preference or defaults to system preference.
 *
 * @returns {'light'|'dark'} Active theme string
 */
export function getTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
        return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

/**
 * Sets the active theme and persists to localStorage.
 *
 * @param {'light'|'dark'} theme - Theme to apply
 * @returns {void}
 */
export function setTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Toggles theme between light and dark mode.
 *
 * @returns {'light'|'dark'} New active theme
 */
export function toggleTheme() {
    const current = document.body.classList.contains('dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}

/**
 * Initializes theme state at application startup.
 *
 * @returns {'light'|'dark'} Active theme applied
 */
export function initTheme() {
    const theme = getTheme();
    setTheme(theme);
    return theme;
}

export default {
    getTheme,
    setTheme,
    toggleTheme,
    initTheme,
};
