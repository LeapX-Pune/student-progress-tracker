import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    animate,
    stagger,
    initMotionPreferences,
    shouldAnimate,
    ANIMATION_CLASSES,
} from '../../src/utils/animations.js';

describe('animations', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('exports animation classes', () => {
        expect(ANIMATION_CLASSES.fadeIn).toBe('anim-fade-in');
        expect(ANIMATION_CLASSES.slideUp).toBe('anim-slide-up');
        expect(ANIMATION_CLASSES.scaleIn).toBe('anim-scale-in');
    });

    it('animate adds and removes class on animationend', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);

        animate(el, ANIMATION_CLASSES.fadeIn);
        expect(el.classList.contains('anim-fade-in')).toBe(true);

        el.dispatchEvent(new Event('animationend'));
        expect(el.classList.contains('anim-fade-in')).toBe(false);
    });

    it('animate calls onEnd callback', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const onEnd = vi.fn();

        animate(el, ANIMATION_CLASSES.fadeIn, { onEnd });
        el.dispatchEvent(new Event('animationend'));

        expect(onEnd).toHaveBeenCalledOnce();
    });

    it('stagger applies animation to children with delay', () => {
        const parent = document.createElement('div');
        parent.innerHTML = '<span></span><span></span><span></span>';
        document.body.appendChild(parent);

        stagger(parent, ANIMATION_CLASSES.fadeIn, { staggerDelay: 50 });

        parent.children[0].dispatchEvent(new Event('animationend'));
        expect(parent.children[0].classList.contains('anim-fade-in')).toBe(false);
    });

    it('initMotionPreferences sets reduced-motion class on html', () => {
        Object.defineProperty(window, 'matchMedia', {
            value: vi.fn().mockImplementation(query => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                addEventListener: vi.fn(),
            })),
        });

        initMotionPreferences();

        expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);
    });

    it('shouldAnimate returns false when reduced motion is preferred', () => {
        Object.defineProperty(window, 'matchMedia', {
            value: vi.fn().mockImplementation(() => ({
                matches: true,
                addEventListener: vi.fn(),
            })),
        });

        initMotionPreferences();
        expect(shouldAnimate()).toBe(false);
    });
});
