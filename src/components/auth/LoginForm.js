/**
 * @fileoverview LoginForm — Login Form Component — Part 3.
 *
 * Renders the complete login form: email input, password input, "Remember me"
 * checkbox, demo credentials hint, and submit button.  Handles client-side
 * validation, async submission, and error display.
 *
 * ─── Data flow ───────────────────────────────────────────────────────────────
 *   User fills form
 *     → client-side validation (validateLoginForm)
 *     → AuthContext.login(credentials)            ← state management layer
 *       → authApi.login(credentials)              ← HTTP layer
 *         → authStorage.saveAuthToken(…)          ← storage layer
 *     → success → onSuccess callback → caller navigates
 *     → failure → inline error displayed in form
 *
 * ─── Navigation ──────────────────────────────────────────────────────────────
 *   This component intentionally does NOT call router.navigate() directly.
 *   After a successful login it calls `opts.onSuccess(user, destination)`.
 *   The page that mounts this form (LoginPage) is responsible for routing.
 *
 * @module components/auth/LoginForm
 */

import { createInput } from '../ui/Input.js';
import { createButton, setButtonLoading } from '../ui/Button.js';
import { createRememberMe } from './RememberMe.js';
import { createDemoCredentials } from './DemoCredentials.js';
import { validateLoginForm } from '../../utils/validation.js';
import { getRedirectPath } from '../../services/authStorage.js';
import AuthContext from '../../context/AuthContext.js';

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates the login form element and mounts it into the supplied container.
 *
 * @param {HTMLElement} container        - The DOM element to mount the form into
 * @param {Object}      [opts={}]        - Options
 * @param {function}    [opts.onSuccess] - Called with `(user, redirectPath)` after
 *                                         a successful login. Use this to navigate.
 * @returns {{ destroy: function }} Cleanup handle — call `destroy()` on page unmount
 *
 * @example
 * const form = createLoginForm(document.getElementById('login-container'), {
 *   onSuccess: (user, path) => {
 *     window.location.hash = path;
 *   },
 * });
 * // On page destroy:
 * form.destroy();
 */
export function createLoginForm(container, { onSuccess } = {}) {
    // ── Build DOM ──────────────────────────────────────────────────────────────

    const formEl = document.createElement('form');
    formEl.id = 'login-form';
    formEl.className = 'login-form';
    formEl.setAttribute('novalidate', ''); // use custom validation messages

    // ── Form title ─────────────────────────────────────────────────────────────
    const title = document.createElement('h1');
    title.className = 'login-form__title';
    title.textContent = 'Sign in';
    formEl.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'login-form__subtitle';
    subtitle.textContent = 'Access your Student Progress Dashboard';
    formEl.appendChild(subtitle);

    // ── Error banner (top-level, shown for network / auth errors) ─────────────
    const errorBanner = document.createElement('div');
    errorBanner.className = 'login-form__error-banner';
    errorBanner.setAttribute('role', 'alert');
    errorBanner.setAttribute('aria-live', 'assertive');
    errorBanner.hidden = true;
    formEl.appendChild(errorBanner);

    // ── Email field ────────────────────────────────────────────────────────────
    const {
        wrapper: emailWrapper,
        input: emailInput,
        setError: setEmailError,
    } = createInput({
        id: 'login-email',
        name: 'email',
        type: 'email',
        label: 'Email address',
        placeholder: 'student@demo.com',
        required: true,
        autocomplete: 'email',
        onChange: () => setEmailError(null), // clear error on every keystroke
    });
    formEl.appendChild(emailWrapper);

    // ── Password field ─────────────────────────────────────────────────────────
    const {
        wrapper: passwordWrapper,
        input: passwordInput,
        setError: setPasswordError,
    } = createInput({
        id: 'login-password',
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: '••••••',
        required: true,
        autocomplete: 'current-password',
        onChange: () => setPasswordError(null),
    });
    formEl.appendChild(passwordWrapper);

    // ── Remember me ────────────────────────────────────────────────────────────
    const rememberMe = createRememberMe({ checked: false });
    formEl.appendChild(rememberMe.wrapper);

    // ── Submit button ──────────────────────────────────────────────────────────
    const submitBtn = createButton({
        id: 'login-submit',
        label: 'Sign In',
        variant: 'primary',
        size: 'lg',
        type: 'submit',
    });
    submitBtn.className += ' login-form__submit';
    formEl.appendChild(submitBtn);

    // ── Demo credentials ───────────────────────────────────────────────────────
    const demoBlock = createDemoCredentials({
        onFill: ({ email, password }) => {
            emailInput.value = email;
            passwordInput.value = password;
            setEmailError(null);
            setPasswordError(null);
        },
    });
    formEl.appendChild(demoBlock);

    // ── Mount into container ───────────────────────────────────────────────────
    container.appendChild(formEl);

    // ── Helpers ────────────────────────────────────────────────────────────────

    /** Shows the top-level error banner with a message. */
    function showBannerError(message) {
        errorBanner.textContent = message;
        errorBanner.hidden = false;
    }

    /** Hides the error banner. */
    function clearBannerError() {
        errorBanner.textContent = '';
        errorBanner.hidden = true;
    }

    // ── Submit handler ─────────────────────────────────────────────────────────

    async function handleSubmit(e) {
        e.preventDefault();
        clearBannerError();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const shouldRememberMe = rememberMe.getValue();

        // ── Client-side validation ─────────────────────────────────────────────
        const errors = validateLoginForm({ email, password });
        if (errors) {
            if (errors.email) setEmailError(errors.email);
            if (errors.password) setPasswordError(errors.password);
            // Focus the first field with an error for keyboard users.
            if (errors.email) emailInput.focus();
            else if (errors.password) passwordInput.focus();
            return; // stop — do not call API with invalid data
        }

        // ── Submit ─────────────────────────────────────────────────────────────
        setButtonLoading(submitBtn, true);

        const result = await AuthContext.login({
            email,
            password,
            rememberMe: shouldRememberMe,
        });

        setButtonLoading(submitBtn, false);

        if (result.success) {
            // Retrieve and clear the saved redirect path (consumed once).
            const destination = getRedirectPath(); // '/dashboard' if none saved

            if (typeof onSuccess === 'function') {
                onSuccess(result.user, destination);
            }
        } else {
            // Display the error returned by AuthContext.
            showBannerError(result.error ?? 'Login failed. Please try again.');
            emailInput.focus(); // return focus to first field
        }
    }

    formEl.addEventListener('submit', handleSubmit);

    // ── Cleanup ────────────────────────────────────────────────────────────────

    return {
        /**
         * Removes the form from the DOM and cleans up event listeners.
         * Call when the LoginPage is destroyed.
         *
         * @returns {void}
         */
        destroy() {
            formEl.removeEventListener('submit', handleSubmit);
            container.removeChild(formEl);
        },
    };
}
