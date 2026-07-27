import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createLoginForm } from '../../src/components/auth/LoginForm.js';

describe('LoginForm', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.id = 'login-container';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders form with title', () => {
        createLoginForm(container);
        const title = container.querySelector('.login-form__title');
        expect(title).toBeTruthy();
        expect(title.textContent).toBe('Sign in');
    });

    it('renders email and password inputs', () => {
        createLoginForm(container);
        expect(container.querySelector('#login-email')).toBeTruthy();
        expect(container.querySelector('#login-password')).toBeTruthy();
    });

    it('renders submit button', () => {
        createLoginForm(container);
        const submit = container.querySelector('#login-submit');
        expect(submit).toBeTruthy();
        expect(submit.textContent).toContain('Sign In');
    });

    it('cleanup removes form from DOM', () => {
        const form = createLoginForm(container);
        expect(container.querySelector('#login-form')).toBeTruthy();
        form.destroy();
        expect(container.querySelector('#login-form')).toBeNull();
    });
});
