import { describe, it, expect } from 'vitest';
import { calculateProgress, getStatusConfig, formatGrade } from '../../src/utils/courseHelpers.js';

describe('calculateProgress', () => {
    it('returns 0 for zero total', () => {
        expect(calculateProgress(0, 0)).toBe(0);
        expect(calculateProgress(5, 0)).toBe(0);
    });

    it('returns 100 when completed equals total', () => {
        expect(calculateProgress(20, 20)).toBe(100);
    });

    it('calculates correct percentage', () => {
        expect(calculateProgress(13, 20)).toBe(65);
        expect(calculateProgress(8, 15)).toBe(53);
    });

    it('rounds to nearest integer', () => {
        expect(calculateProgress(1, 3)).toBe(33);
        expect(calculateProgress(2, 3)).toBe(67);
    });
});

describe('getStatusConfig', () => {
    it('returns completed config', () => {
        const config = getStatusConfig('completed');
        expect(config.label).toBe('Completed');
        expect(config.className).toContain('completed');
    });

    it('returns in-progress config', () => {
        const config = getStatusConfig('in-progress');
        expect(config.label).toBe('In Progress');
        expect(config.className).toContain('in-progress');
    });

    it('returns not-started config', () => {
        const config = getStatusConfig('not-started');
        expect(config.label).toBe('Not Started');
        expect(config.className).toContain('not-started');
    });

    it('defaults to not-started for unknown status', () => {
        const config = getStatusConfig('unknown');
        expect(config.label).toBe('Not Started');
    });
});

describe('formatGrade', () => {
    it('returns N/A for null or undefined', () => {
        expect(formatGrade(null)).toBe('N/A');
        expect(formatGrade(undefined)).toBe('N/A');
    });

    it('returns string grades as-is', () => {
        expect(formatGrade('A-')).toBe('A-');
    });

    it('formats numeric grades with letter and percentage', () => {
        expect(formatGrade(95)).toContain('A');
        expect(formatGrade(95)).toContain('95%');
        expect(formatGrade(85)).toContain('B');
        expect(formatGrade(72)).toContain('C');
        expect(formatGrade(65)).toContain('D');
        expect(formatGrade(50)).toContain('F');
    });

    it('handles edge case grades', () => {
        expect(formatGrade(100)).toContain('A+');
        expect(formatGrade(0)).toContain('F');
    });
});
