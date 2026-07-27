import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createProgressBar } from '../../src/components/courses/ProgressBar.js';

describe('ProgressBar', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correct percentage', () => {
        const el = createProgressBar(13, 20, 'in-progress');
        document.body.appendChild(el);
        expect(el.querySelector('.course-progress-percentage').textContent).toBe('65%');
    });

    it('renders 0% when no modules completed', () => {
        const el = createProgressBar(0, 20, 'not-started');
        document.body.appendChild(el);
        expect(el.querySelector('.course-progress-percentage').textContent).toBe('0%');
    });

    it('renders 100% when all modules completed', () => {
        const el = createProgressBar(20, 20, 'completed');
        document.body.appendChild(el);
        expect(el.querySelector('.course-progress-percentage').textContent).toBe('100%');
    });

    it('animates fill width on next frame', () => {
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
            cb();
            return 0;
        });
        const el = createProgressBar(13, 20, 'in-progress');
        document.body.appendChild(el);
        vi.advanceTimersByTime(100);
        const fill = el.querySelector('.course-progress-bar__fill');
        expect(fill.style.width).toBe('65%');
    });
});
