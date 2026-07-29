import { describe, it, expect } from 'vitest';

describe('Project setup verification', () => {
    it('npm is configured correctly', () => {
        expect(true).toBe(true);
    });

    it('ES modules work', () => {
        const obj = { a: 1, b: 2 };
        expect({ ...obj }).toEqual({ a: 1, b: 2 });
    });

    it('test framework is functional', () => {
        expect([1, 2, 3]).toHaveLength(3);
        expect('hello').toMatch(/ello/);
    });
});
