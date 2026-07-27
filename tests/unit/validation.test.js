import { describe, it, expect } from 'vitest';
import { validateLoginForm } from '../../src/utils/validation.js';

describe('validateLoginForm', () => {
    it('returns null for valid inputs', () => {
        const result = validateLoginForm({
            email: 'student@demo.com',
            password: 'demo123',
        });
        expect(result).toBeNull();
    });

    it('returns error for empty email', () => {
        const result = validateLoginForm({
            email: '',
            password: 'demo123',
        });
        expect(result.email).toBeTruthy();
        expect(result.password).toBeNull();
    });

    it('returns error for invalid email format', () => {
        const result = validateLoginForm({
            email: 'not-an-email',
            password: 'demo123',
        });
        expect(result.email).toBeTruthy();
    });

    it('returns error for empty password', () => {
        const result = validateLoginForm({
            email: 'student@demo.com',
            password: '',
        });
        expect(result.password).toBeTruthy();
    });

    it('returns error for short password', () => {
        const result = validateLoginForm({
            email: 'student@demo.com',
            password: '12',
        });
        expect(result.password).toBeTruthy();
    });

    it('returns multiple errors when both fields are invalid', () => {
        const result = validateLoginForm({
            email: '',
            password: '',
        });
        expect(result.email).toBeTruthy();
        expect(result.password).toBeTruthy();
    });
});
