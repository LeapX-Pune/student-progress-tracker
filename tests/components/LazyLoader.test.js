import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createLazyLoader, createLazyImage } from '../../src/components/LazyLoader.js';

describe('LazyLoader', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('creates container with lazy-loader class', () => {
        const { element } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });
        expect(element.classList.contains('lazy-loader')).toBe(true);
    });

    it('sets role="region" on container', () => {
        const { element } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });
        expect(element.getAttribute('role')).toBe('region');
    });

    it('sets aria-live="polite" on container', () => {
        const { element } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });
        expect(element.getAttribute('aria-live')).toBe('polite');
    });

    it('shows placeholder initially', () => {
        const { element } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });
        const placeholder = element.querySelector('.lazy-loader__placeholder');
        expect(placeholder).toBeTruthy();
    });

    it('does not load automatically without IntersectionObserver', () => {
        const { element } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });
        const placeholder = element.querySelector('.lazy-loader__placeholder');
        expect(placeholder).toBeTruthy();
        expect(element.classList.contains('lazy-loader--loaded')).toBe(false);
    });

    it('load method replaces placeholder with content', async () => {
        const { element, load } = createLazyLoader({
            onLoad: async () => '<p class="loaded-content">Hello</p>',
        });

        await load();

        const content = element.querySelector('.loaded-content');
        expect(content).toBeTruthy();
        expect(content.textContent).toBe('Hello');
    });

    it('adds loaded class after successful load', async () => {
        const { element, load } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });

        await load();

        expect(element.classList.contains('lazy-loader--loaded')).toBe(true);
    });

    it('handles errors gracefully', async () => {
        const { element, load } = createLazyLoader({
            onLoad: async () => {
                throw new Error('Fail');
            },
        });

        await load();

        expect(element.classList.contains('lazy-loader--error')).toBe(true);
        const errorEl = element.querySelector('.lazy-loader__error');
        expect(errorEl).toBeTruthy();
    });

    it('shows error with role="alert" on failure', async () => {
        const { element, load } = createLazyLoader({
            onLoad: async () => {
                throw new Error('Fail');
            },
        });

        await load();

        const errorEl = element.querySelector('[role="alert"]');
        expect(errorEl).toBeTruthy();
    });

    it('destroy prevents load from executing', async () => {
        const { element, load, destroy } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });

        destroy();
        await load();

        const placeholder = element.querySelector('.lazy-loader__placeholder');
        expect(placeholder).toBeTruthy();
        expect(element.classList.contains('lazy-loader--loaded')).toBe(false);
    });

    it('destroy before load keeps placeholder', async () => {
        const { element, destroy } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
        });

        destroy();

        const placeholder = element.querySelector('.lazy-loader__placeholder');
        expect(placeholder).toBeTruthy();
    });

    it('accepts a custom placeholder element', () => {
        const custom = document.createElement('div');
        custom.className = 'custom-placeholder';
        const { element } = createLazyLoader({
            onLoad: async () => '<p>Content</p>',
            placeholder: custom,
        });

        const found = element.querySelector('.custom-placeholder');
        expect(found).toBeTruthy();
    });
});

describe('createLazyImage', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('creates image placeholder with correct dimensions', () => {
        const { element } = createLazyImage({ src: 'test.jpg', width: 400, height: 300 });
        const placeholder = element.querySelector('.lazy-loader__image-placeholder');
        expect(placeholder).toBeTruthy();
        expect(placeholder.style.minHeight).toBe('300px');
    });

    it('sets role="region" on container', () => {
        const { element } = createLazyImage({ src: 'test.jpg' });
        expect(element.getAttribute('role')).toBe('region');
    });
});
