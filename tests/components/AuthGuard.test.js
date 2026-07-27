import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAuthGuard } from '../../src/components/auth/AuthGuard.js';

describe('AuthGuard', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.id = 'page-container';
        document.body.appendChild(container);
        vi.stubGlobal('location', { hash: '' });
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.unstubAllGlobals();
    });

    it('returns guard object with render, watch, unwatch methods', () => {
        const guard = createAuthGuard(container, '/dashboard');
        expect(guard).toHaveProperty('render');
        expect(guard).toHaveProperty('watch');
        expect(guard).toHaveProperty('unwatch');
    });
});
