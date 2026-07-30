import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getTheme, setTheme, toggleTheme, initTheme } from '../../src/utils/theme.js';

describe('Theme System Recovery (Phase X)', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.className = '';
    });

    afterEach(() => {
        localStorage.clear();
        document.body.className = '';
    });

    it('defaults to light theme when no preference is saved', () => {
        const theme = getTheme();
        expect(theme).toBe('light');
    });

    it('applies dark theme and saves preference when setTheme("dark") is called', () => {
        setTheme('dark');
        expect(document.body.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(getTheme()).toBe('dark');
    });

    it('removes dark theme class and updates preference when setTheme("light") is called', () => {
        setTheme('dark');
        expect(document.body.classList.contains('dark')).toBe(true);

        setTheme('light');
        expect(document.body.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('theme')).toBe('light');
        expect(getTheme()).toBe('light');
    });

    it('toggles theme back and forth between light and dark using toggleTheme()', () => {
        expect(document.body.classList.contains('dark')).toBe(false);

        const firstToggle = toggleTheme();
        expect(firstToggle).toBe('dark');
        expect(document.body.classList.contains('dark')).toBe(true);

        const secondToggle = toggleTheme();
        expect(secondToggle).toBe('light');
        expect(document.body.classList.contains('dark')).toBe(false);
    });

    it('restores saved dark theme preference automatically on initTheme()', () => {
        localStorage.setItem('theme', 'dark');
        const activeTheme = initTheme();

        expect(activeTheme).toBe('dark');
        expect(document.body.classList.contains('dark')).toBe(true);
    });
});
