import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createImageLoader } from '../../src/components/ImageLoader.js';

describe('ImageLoader', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('creates container with image-loader class', () => {
        const { element } = createImageLoader({ src: 'test.jpg', alt: 'Test' });
        expect(element.classList.contains('image-loader')).toBe(true);
    });

    it('sets alt attribute on img', () => {
        const { element } = createImageLoader({ src: 'test.jpg', alt: 'Test image' });
        const img = element.querySelector('img');
        expect(img.alt).toBe('Test image');
    });

    it('shows placeholder element initially', () => {
        const { element } = createImageLoader({ src: 'test.jpg' });
        const placeholder = element.querySelector('.image-loader__placeholder');
        expect(placeholder).toBeTruthy();
    });

    it('hides placeholder and marks img loaded on load event', () => {
        const { element } = createImageLoader({ src: 'test.jpg' });
        const img = element.querySelector('img');
        const placeholder = element.querySelector('.image-loader__placeholder');

        img.dispatchEvent(new Event('load'));

        expect(element.contains(placeholder)).toBe(false);
        expect(img.classList.contains('image-loader__img--loaded')).toBe(true);
    });

    it('shows error state on error event', () => {
        const { element } = createImageLoader({ src: 'broken.jpg' });
        const img = element.querySelector('img');

        img.dispatchEvent(new Event('error'));

        const placeholder = element.querySelector('.image-loader__placeholder');
        expect(placeholder.classList.contains('image-loader__placeholder--error')).toBe(true);
    });

    it('sets width and height on img element', () => {
        const { element } = createImageLoader({ src: 'test.jpg', width: 300, height: 200 });
        const img = element.querySelector('img');
        expect(img.width).toBe(300);
        expect(img.height).toBe(200);
    });

    it('sets role="img" on container', () => {
        const { element } = createImageLoader({ src: 'test.jpg' });
        expect(element.getAttribute('role')).toBe('img');
    });

    it('destroy stops listening to load/error events', () => {
        const { element, destroy } = createImageLoader({ src: 'test.jpg' });
        const img = element.querySelector('img');

        destroy();
        img.dispatchEvent(new Event('load'));

        const placeholder = element.querySelector('.image-loader__placeholder');
        expect(placeholder).toBeTruthy();
    });
});
