import { describe, it, expect } from 'vitest';
import {
    createSkeletonText,
    createSkeletonCard,
    createSkeletonChart,
    renderSkeleton,
    removeSkeletons,
} from '../../src/components/SkeletonLoader.js';

describe('SkeletonLoader', () => {
    it('creates skeleton text with correct number of lines', () => {
        const el = createSkeletonText(5);
        const items = el.querySelectorAll('.skeleton--text');
        expect(items.length).toBe(5);
    });

    it('creates skeleton text with default 3 lines', () => {
        const el = createSkeletonText();
        const items = el.querySelectorAll('.skeleton--text');
        expect(items.length).toBe(3);
    });

    it('sets role status on skeleton text', () => {
        const el = createSkeletonText();
        expect(el.getAttribute('role')).toBe('status');
        expect(el.getAttribute('aria-label')).toBe('Loading content');
    });

    it('creates a skeleton card', () => {
        const card = createSkeletonCard();
        expect(card.classList.contains('skeleton-card')).toBe(true);
        expect(card.querySelector('.skeleton-card__thumbnail')).toBeTruthy();
    });

    it('creates a skeleton chart', () => {
        const chart = createSkeletonChart();
        expect(chart.classList.contains('skeleton-chart')).toBe(true);
        expect(chart.querySelectorAll('.skeleton-chart__bar-item').length).toBe(5);
    });

    it('renderSkeleton fills container with cards', () => {
        const container = document.createElement('div');
        renderSkeleton(container, 'card', 3);
        expect(container.querySelectorAll('.skeleton-card').length).toBe(3);
    });

    it('renderSkeleton fills container with chart', () => {
        const container = document.createElement('div');
        renderSkeleton(container, 'chart', 1);
        expect(container.querySelectorAll('.skeleton-chart').length).toBe(1);
    });

    it('renderSkeleton text type renders text skeletons', () => {
        const container = document.createElement('div');
        renderSkeleton(container, 'text', 1);
        expect(container.querySelector('.skeleton-text-group')).toBeTruthy();
    });

    it('removeSkeletons removes all skeleton elements', () => {
        const container = document.createElement('div');
        renderSkeleton(container, 'card', 2);
        renderSkeleton(container, 'chart', 1);
        removeSkeletons(container);
        expect(
            container.querySelectorAll('.skeleton-card, .skeleton-chart, .skeleton-text-group')
                .length
        ).toBe(0);
    });
});
