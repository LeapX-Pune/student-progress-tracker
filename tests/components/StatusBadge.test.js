import { describe, it, expect } from 'vitest';
import { createStatusBadge } from '../../src/components/courses/StatusBadge.js';

describe('StatusBadge', () => {
    it('renders completed badge', () => {
        const badge = createStatusBadge('completed');
        expect(badge.textContent).toBe('Completed');
        expect(badge.className).toContain('course-status-badge--completed');
    });

    it('renders in-progress badge', () => {
        const badge = createStatusBadge('in-progress');
        expect(badge.textContent).toBe('In Progress');
        expect(badge.className).toContain('course-status-badge--in-progress');
    });

    it('renders not-started badge', () => {
        const badge = createStatusBadge('not-started');
        expect(badge.textContent).toBe('Not Started');
        expect(badge.className).toContain('course-status-badge--not-started');
    });
});
