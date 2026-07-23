import { describe, it, expect } from 'vitest';
import { createLoadingSpinner } from '../../src/components/LoadingSpinner.js';

describe('LoadingSpinner', () => {
    it('creates a spinner with default medium size', () => {
        const spinner = createLoadingSpinner();
        expect(spinner.classList.contains('spinner--md')).toBe(true);
    });

    it('creates a spinner with small size', () => {
        const spinner = createLoadingSpinner({ size: 'sm' });
        expect(spinner.classList.contains('spinner--sm')).toBe(true);
    });

    it('creates a spinner with large size', () => {
        const spinner = createLoadingSpinner({ size: 'lg' });
        expect(spinner.classList.contains('spinner--lg')).toBe(true);
    });

    it('sets role status', () => {
        const spinner = createLoadingSpinner();
        expect(spinner.getAttribute('role')).toBe('status');
    });

    it('includes accessible label', () => {
        const spinner = createLoadingSpinner({ label: 'Please wait' });
        const srSpan = spinner.querySelector('.sr-only');
        expect(srSpan.textContent).toBe('Please wait');
    });

    it('uses default label', () => {
        const spinner = createLoadingSpinner();
        const srSpan = spinner.querySelector('.sr-only');
        expect(srSpan.textContent).toBe('Loading...');
    });
});
