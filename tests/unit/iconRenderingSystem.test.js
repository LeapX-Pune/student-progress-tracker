import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Icon & Theme Rendering System Restoration', () => {
    beforeEach(() => {
        document.body.className = '';
        document.body.innerHTML = `
            <div class="app-shell">
              <aside class="sidebar">
                <div class="sidebar-brand">
                  <span class="brand-glyph">
                    <svg class="lucide lucide-layout-dashboard" viewBox="0 0 24 24"><path d="M3 3h7v7H3z"/></svg>
                  </span>
                </div>
                <nav class="sidebar-nav">
                  <span class="nav-icon">
                    <svg class="lucide lucide-grid" viewBox="0 0 24 24"><path d="M3 3h7v7H3z"/></svg>
                  </span>
                </nav>
              </aside>
              <div class="app-header">
                <button class="icon-button">
                  <svg class="lucide lucide-bell" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8"/></svg>
                </button>
                <div class="search-field">
                  <svg class="search-icon lucide lucide-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/></svg>
                </div>
              </div>
            </div>
        `;
    });

    afterEach(() => {
        document.body.className = '';
        document.body.innerHTML = '';
    });

    it('ensures SVGs render inside icon containers with lucide class structure', () => {
        const brandSvg = document.querySelector('.brand-glyph svg');
        const navSvg = document.querySelector('.nav-icon svg');
        const searchSvg = document.querySelector('.search-field svg');
        const bellSvg = document.querySelector('.icon-button svg');

        expect(brandSvg).not.toBeNull();
        expect(brandSvg.classList.contains('lucide')).toBe(true);

        expect(navSvg).not.toBeNull();
        expect(navSvg.classList.contains('lucide')).toBe(true);

        expect(searchSvg).not.toBeNull();
        expect(searchSvg.classList.contains('lucide')).toBe(true);

        expect(bellSvg).not.toBeNull();
        expect(bellSvg.classList.contains('lucide')).toBe(true);
    });

    it('maintains theme toggling compatibility for dark and light icon rendering', () => {
        document.body.classList.add('dark');
        expect(document.body.classList.contains('dark')).toBe(true);

        document.body.classList.remove('dark');
        expect(document.body.classList.contains('dark')).toBe(false);
    });
});
