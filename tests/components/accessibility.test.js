import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import axe from 'axe-core';
import { createModal } from '../../src/components/Modal.js';
import { showToast } from '../../src/components/Toast.js';
import { createEmptyState } from '../../src/components/EmptyState.js';
import { createErrorBoundary } from '../../src/components/ErrorBoundary.js';
import { createLoadingSpinner } from '../../src/components/LoadingSpinner.js';
import { createTooltip } from '../../src/components/Tooltip.js';

async function audit(container, options = {}) {
    const results = await axe.run(container, options);
    return results;
}

function violationsWithoutRegion(violations) {
    return violations.filter(v => v.id !== 'region');
}

describe('Component Accessibility (axe-core)', () => {
    let main;

    beforeEach(() => {
        document.body.innerHTML = '';
        main = document.createElement('main');
        document.body.appendChild(main);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('toast has no violations', async () => {
        showToast({ title: 'Success', message: 'Test', type: 'success' });
        const container = document.querySelector('.toast-container');
        const results = await audit(container);
        expect(results.violations).toHaveLength(0);
    });

    it('modal has no violations', async () => {
        const modal = createModal({ title: 'Test Dialog', body: '<p>Content</p>' });
        const results = await audit(modal.element);
        modal.close();
        expect(violationsWithoutRegion(results.violations)).toHaveLength(0);
    });

    it('empty state has no violations', async () => {
        const el = createEmptyState({
            title: 'No data',
            description: 'Nothing to show',
            illustration: '<svg width="24" height="24"></svg>',
        });
        main.appendChild(el);
        const results = await audit(main);
        expect(results.violations).toHaveLength(0);
    });

    it('error boundary has no violations', async () => {
        const el = createErrorBoundary({
            title: 'Error',
            message: 'Something broke',
            onRetry: async () => {},
        });
        main.appendChild(el);
        const results = await audit(main);
        expect(results.violations).toHaveLength(0);
    });

    it('loading spinner has no violations', async () => {
        const el = createLoadingSpinner({ size: 'lg', label: 'Loading...' });
        main.appendChild(el);
        const results = await audit(main);
        expect(results.violations).toHaveLength(0);
    });

    it('tooltip has no violations', async () => {
        const btn = document.createElement('button');
        btn.textContent = 'Hover me';
        btn.id = 'tooltip-btn';
        main.appendChild(btn);

        const tip = createTooltip(btn, { content: 'Helpful info', position: 'top', delay: 0 });
        btn.dispatchEvent(new MouseEvent('mouseenter'));
        await new Promise(r => setTimeout(r, 50));

        const results = await audit(document.body);
        tip.destroy();
        expect(violationsWithoutRegion(results.violations)).toHaveLength(0);
    });
});
