import { describe, it, expect } from 'vitest';
import { createEmptyState, EMPTY_ILLUSTRATIONS } from '../../src/components/EmptyState.js';

describe('EmptyState', () => {
    it('creates empty state with title and description', () => {
        const el = createEmptyState({ title: 'No data', description: 'Nothing to show yet.' });
        expect(el.querySelector('.empty-state__title').textContent).toBe('No data');
        expect(el.querySelector('.empty-state__description').textContent).toBe(
            'Nothing to show yet.'
        );
    });

    it('renders illustration when provided', () => {
        const el = createEmptyState({ title: 'Test', illustration: '<svg></svg>' });
        expect(el.querySelector('.empty-state__illustration')).toBeTruthy();
    });

    it('renders action buttons when provided as strings', () => {
        const el = createEmptyState({
            title: 'Test',
            actions: ['<button>Action</button>'],
        });
        expect(el.querySelector('.empty-state__actions')).toBeTruthy();
        expect(el.querySelector('.empty-state__actions button').textContent).toBe('Action');
    });

    it('renders action buttons when provided as elements', () => {
        const btn = document.createElement('button');
        btn.textContent = 'Custom';
        const el = createEmptyState({ title: 'Test', actions: [btn] });
        expect(el.querySelector('.empty-state__actions button').textContent).toBe('Custom');
    });

    it('works with minimal options', () => {
        const el = createEmptyState();
        expect(el.classList.contains('empty-state')).toBe(true);
    });

    it('has default illustrations exported', () => {
        expect(EMPTY_ILLUSTRATIONS.search).toBeTruthy();
        expect(EMPTY_ILLUSTRATIONS.data).toBeTruthy();
        expect(EMPTY_ILLUSTRATIONS.course).toBeTruthy();
        expect(EMPTY_ILLUSTRATIONS.grade).toBeTruthy();
        expect(EMPTY_ILLUSTRATIONS.error).toBeTruthy();
    });
});
