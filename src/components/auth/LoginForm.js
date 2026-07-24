/**
 * @fileoverview LoginForm — Integrated Authentication Form Component.
 *
 * Combines the Login UI design (Material 3 Academic Precision), role selector,
 * mode toggle (Login vs Sign Up), password visibility mask toggle, Google OAuth UI,
 * and demo credentials hint while connecting cleanly to AuthContext, authApi,
 * authStorage, and validation utilities.
 *
 * @module components/auth/LoginForm
 */

import AuthContext from '../../context/AuthContext.js';
import { getRedirectPath } from '../../services/authStorage.js';
import { validateLoginForm } from '../../utils/validation.js';
import { createDemoCredentials } from './DemoCredentials.js';
import { createRememberMe } from './RememberMe.js';
import { createRoleSelector } from './RoleSelector.js';

/**
 * Creates the login form card element and mounts it into the supplied container.
 *
 * @param {HTMLElement} container        - The DOM element to mount the form into
 * @param {Object}      [opts={}]        - Options
 * @param {function}    [opts.onSuccess] - Called with `(user, redirectPath)` after successful login.
 * @returns {{ destroy: function }} Cleanup handle
 */
export function createLoginForm(container, { onSuccess } = {}) {
    let isLoginMode = true;

    // ── Outer Card Wrapper ──────────────────────────────────────────────────
    const cardEl = document.createElement('div');
    cardEl.className = 'auth-form-card slide-in-right delay-200';

    // ── 1. Brand Header ──────────────────────────────────────────────────────
    const brandHeader = document.createElement('div');
    brandHeader.className = 'auth-brand-header';

    const logoBadge = document.createElement('div');
    logoBadge.className = 'auth-logo-badge';
    logoBadge.innerHTML = '<span class="material-symbols-outlined text-[28px]">school</span>';

    const authTitle = document.createElement('h2');
    authTitle.className = 'auth-card-title';
    authTitle.id = 'auth-title';
    authTitle.textContent = 'Welcome back';

    const authSubtitle = document.createElement('p');
    authSubtitle.className = 'auth-card-subtitle';
    authSubtitle.id = 'auth-subtitle';
    authSubtitle.textContent = 'Log in to your The Reality account.';

    brandHeader.appendChild(logoBadge);
    brandHeader.appendChild(authTitle);
    brandHeader.appendChild(authSubtitle);
    cardEl.appendChild(brandHeader);

    // ── 2. Role Selector Tabs ────────────────────────────────────────────────
    const roleSelector = createRoleSelector({
        initialRole: 'student',
        /**
         * Role selection change callback.
         */
        onChange: role => {
            console.log(`[LoginForm] Selected role changed to: ${role}`);
        },
    });
    cardEl.appendChild(roleSelector.element);

    // ── 3. Top Error Banner ──────────────────────────────────────────────────
    const errorBanner = document.createElement('div');
    errorBanner.className = 'login-form__error-banner';
    errorBanner.setAttribute('role', 'alert');
    errorBanner.setAttribute('aria-live', 'assertive');
    errorBanner.style.cssText =
        'background-color: var(--auth-error-container); color: var(--auth-on-error-container); padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem; display: none;';
    cardEl.appendChild(errorBanner);

    // ── 4. Form Element ──────────────────────────────────────────────────────
    const formEl = document.createElement('form');
    formEl.id = 'auth-form';
    formEl.className = 'login-form';
    formEl.setAttribute('novalidate', '');

    // ── Full Name Input (Signup Mode Only) ────────────────────────────────────
    const nameGroup = document.createElement('div');
    nameGroup.className = 'auth-form-group';
    nameGroup.id = 'name-field';
    nameGroup.style.display = 'none';

    nameGroup.innerHTML = `
        <label class="auth-label" for="name">Full Name</label>
        <div class="auth-input-wrapper">
            <span class="material-symbols-outlined auth-input-icon">person</span>
            <input id="name" type="text" class="auth-input" placeholder="Your Name" />
        </div>
    `;
    formEl.appendChild(nameGroup);

    // ── Email Address Input ──────────────────────────────────────────────────
    const emailGroup = document.createElement('div');
    emailGroup.className = 'auth-form-group';

    emailGroup.innerHTML = `
        <label class="auth-label" for="email">Email Address</label>
        <div class="auth-input-wrapper">
            <span class="material-symbols-outlined auth-input-icon">mail</span>
            <input id="email" type="email" class="auth-input" placeholder="student@school.edu" required autocomplete="email" />
        </div>
        <span class="input__error-message" id="email-error" style="color: var(--auth-on-error-container); font-size: 0.75rem; margin-top: 0.25rem; display: block;"></span>
    `;
    formEl.appendChild(emailGroup);

    const emailInput = emailGroup.querySelector('#email');
    const emailErrorSpan = emailGroup.querySelector('#email-error');

    emailInput.addEventListener('input', () => {
        emailErrorSpan.textContent = '';
        clearBannerError();
    });

    // ── Password Input & Forgot Link ─────────────────────────────────────────
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'auth-form-group';

    passwordGroup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem;">
            <label class="auth-label" for="password" style="margin-bottom: 0;">Password</label>
            <a href="#" id="forgot-password-link" style="font-size: 0.75rem; color: var(--auth-on-surface-variant); text-decoration: none;">Forgot password?</a>
        </div>
        <div class="auth-input-wrapper">
            <span class="material-symbols-outlined auth-input-icon">lock</span>
            <input id="password" type="password" class="auth-input auth-input--password" placeholder="••••••••" required autocomplete="current-password" />
            <button type="button" id="toggle-password-btn" class="auth-password-toggle" aria-label="Toggle password visibility">
                <span class="material-symbols-outlined">visibility_off</span>
            </button>
        </div>
        <span class="input__error-message" id="password-error" style="color: var(--auth-on-error-container); font-size: 0.75rem; margin-top: 0.25rem; display: block;"></span>
    `;
    formEl.appendChild(passwordGroup);

    const passwordInput = passwordGroup.querySelector('#password');
    const togglePasswordBtn = passwordGroup.querySelector('#toggle-password-btn');
    const passwordErrorSpan = passwordGroup.querySelector('#password-error');
    const forgotPasswordLink = passwordGroup.querySelector('#forgot-password-link');

    passwordInput.addEventListener('input', () => {
        passwordErrorSpan.textContent = '';
        clearBannerError();
    });

    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        const icon = togglePasswordBtn.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = isPassword ? 'visibility' : 'visibility_off';
        }
    });

    forgotPasswordLink.addEventListener('click', e => {
        e.preventDefault();
        window.alert(
            'Password reset feature: Please contact your school administrator or check your email.'
        );
    });

    // ── Confirm Password Input (Signup Mode Only) ────────────────────────────
    const confirmPasswordGroup = document.createElement('div');
    confirmPasswordGroup.className = 'auth-form-group';
    confirmPasswordGroup.id = 'confirm-password-field';
    confirmPasswordGroup.style.display = 'none';

    confirmPasswordGroup.innerHTML = `
        <label class="auth-label" for="confirm-password">Confirm Password</label>
        <div class="auth-input-wrapper">
            <span class="material-symbols-outlined auth-input-icon">lock_reset</span>
            <input id="confirm-password" type="password" class="auth-input auth-input--password" placeholder="••••••••" />
        </div>
        <span class="input__error-message" id="confirm-password-error" style="color: var(--auth-on-error-container); font-size: 0.75rem; margin-top: 0.25rem; display: block;"></span>
    `;
    formEl.appendChild(confirmPasswordGroup);

    const confirmPasswordInput = confirmPasswordGroup.querySelector('#confirm-password');
    const confirmPasswordErrorSpan = confirmPasswordGroup.querySelector('#confirm-password-error');

    confirmPasswordInput.addEventListener('input', () => {
        confirmPasswordErrorSpan.textContent = '';
    });

    // ── Remember Me Checkbox ────────────────────────────────────────────────
    const rememberMe = createRememberMe({ checked: false });
    rememberMe.wrapper.style.marginBottom = '1.25rem';
    formEl.appendChild(rememberMe.wrapper);

    // ── Submit Action Button ────────────────────────────────────────────────
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.id = 'submit-btn';
    submitBtn.className = 'auth-submit-btn';
    submitBtn.innerHTML =
        'Sign In <span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
    formEl.appendChild(submitBtn);

    cardEl.appendChild(formEl);

    // ── 5. Divider Line ─────────────────────────────────────────────────────
    const divider = document.createElement('div');
    divider.className = 'auth-divider';
    divider.innerHTML = `
        <div class="auth-divider-line"></div>
        <span class="auth-divider-text">OR CONTINUE WITH</span>
        <div class="auth-divider-line"></div>
    `;
    cardEl.appendChild(divider);

    // ── 6. Social Authentication (Google OAuth Button) ─────────────────────
    const socialWrapper = document.createElement('div');
    socialWrapper.style.marginBottom = '1.5rem';

    const googleBtn = document.createElement('button');
    googleBtn.type = 'button';
    googleBtn.className = 'auth-social-btn';
    googleBtn.innerHTML = `
        <img class="auth-social-icon" alt="Google Logo" src="/src/assets/auth/google-icon.jpg" onerror="this.style.display='none'" />
        Continue with Google
    `;
    googleBtn.addEventListener('click', () => {
        window.alert('Google OAuth login is currently configured for demonstration purposes.');
    });
    socialWrapper.appendChild(googleBtn);
    cardEl.appendChild(socialWrapper);

    // ── 7. Auth Mode Switcher (Login vs Sign Up Toggle) ────────────────────
    const modeSwitcher = document.createElement('div');
    modeSwitcher.style.textAlign = 'center';
    modeSwitcher.style.fontSize = '0.9375rem';
    modeSwitcher.style.color = 'var(--auth-on-surface-variant)';

    const toggleText = document.createElement('span');
    toggleText.id = 'toggle-text';
    toggleText.textContent = "Don't have an account?";

    const toggleModeBtn = document.createElement('button');
    toggleModeBtn.type = 'button';
    toggleModeBtn.id = 'toggle-mode-btn';
    toggleModeBtn.style.cssText =
        'color: var(--auth-primary); font-weight: 600; background: none; border: none; cursor: pointer; margin-left: 0.35rem; text-decoration: underline; underline-offset: 4px;';
    toggleModeBtn.textContent = 'Sign up';

    modeSwitcher.appendChild(toggleText);
    modeSwitcher.appendChild(toggleModeBtn);
    cardEl.appendChild(modeSwitcher);

    // ── 8. Demo Credentials Panel (For quick testing) ──────────────────────
    const demoBlock = createDemoCredentials({
        /**
         * Fills email and password inputs with demo credentials.
         */
        onFill: ({ email, password }) => {
            emailInput.value = email;
            passwordInput.value = password;
            emailErrorSpan.textContent = '';
            passwordErrorSpan.textContent = '';
            clearBannerError();
        },
    });
    demoBlock.style.marginTop = '1.5rem';
    cardEl.appendChild(demoBlock);

    // ── Mount into container ────────────────────────────────────────────────
    container.appendChild(cardEl);

    // ── Helpers ─────────────────────────────────────────────────────────────
    /**
     * Shows error banner with message.
     *
     * @param {string} msg
     */
    function showBannerError(msg) {
        errorBanner.textContent = msg;
        errorBanner.style.display = 'block';
    }

    /**
     * Clears error banner message.
     */
    function clearBannerError() {
        errorBanner.textContent = '';
        errorBanner.style.display = 'none';
    }

    /**
     * Updates submit button loading state.
     *
     * @param {boolean} loading
     */
    function setSubmitLoading(loading) {
        submitBtn.disabled = loading;
        if (loading) {
            submitBtn.innerHTML =
                '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Processing...';
        } else {
            if (isLoginMode) {
                submitBtn.innerHTML =
                    'Sign In <span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
            } else {
                submitBtn.innerHTML =
                    'Create Account <span class="material-symbols-outlined text-[18px]">person_add</span>';
            }
        }
    }

    // ── Mode Switch Handler ──────────────────────────────────────────────────
    toggleModeBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        clearBannerError();

        formEl.style.opacity = '0';
        formEl.style.transition = 'opacity 0.15s ease-out';

        setTimeout(() => {
            if (isLoginMode) {
                authTitle.textContent = 'Welcome back';
                authSubtitle.textContent = 'Log in to your The Reality account.';
                submitBtn.innerHTML =
                    'Sign In <span class="material-symbols-outlined text-[18px]">arrow_forward</span>';

                nameGroup.style.display = 'none';
                confirmPasswordGroup.style.display = 'none';
                forgotPasswordLink.style.display = 'inline';

                toggleText.textContent = "Don't have an account?";
                toggleModeBtn.textContent = 'Sign up';
            } else {
                authTitle.textContent = 'Join The Reality';
                authSubtitle.textContent = 'Create an account to start tracking progress.';
                submitBtn.innerHTML =
                    'Create Account <span class="material-symbols-outlined text-[18px]">person_add</span>';

                nameGroup.style.display = 'block';
                confirmPasswordGroup.style.display = 'block';
                forgotPasswordLink.style.display = 'none';

                toggleText.textContent = 'Already have an account?';
                toggleModeBtn.textContent = 'Log in';
            }

            formEl.style.opacity = '1';
        }, 150);
    });

    // ── Submit Handler ───────────────────────────────────────────────────────
    /**
     * Form submission handler.
     *
     * @param {Event} e
     */
    async function handleSubmit(e) {
        e.preventDefault();
        clearBannerError();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const selectedRole = roleSelector.getSelectedRole();
        const shouldRememberMe = rememberMe.getValue();

        // Standard validation
        const errors = validateLoginForm({ email, password });
        if (errors) {
            if (errors.email) emailErrorSpan.textContent = errors.email;
            if (errors.password) passwordErrorSpan.textContent = errors.password;
            if (errors.email) emailInput.focus();
            else if (errors.password) passwordInput.focus();
            return;
        }

        // Additional Signup mode validation
        if (!isLoginMode) {
            const confirmPassword = confirmPasswordInput.value;
            if (confirmPassword !== password) {
                confirmPasswordErrorSpan.textContent = 'Passwords do not match.';
                confirmPasswordInput.focus();
                return;
            }
        }

        setSubmitLoading(true);

        const result = await AuthContext.login({
            email,
            password,
            role: selectedRole,
            rememberMe: shouldRememberMe,
        });

        setSubmitLoading(false);

        if (result.success) {
            const destination = getRedirectPath();
            if (typeof onSuccess === 'function') {
                onSuccess(result.user, destination);
            }
        } else {
            showBannerError(result.error ?? 'Login failed. Please verify your credentials.');
            emailInput.focus();
        }
    }

    formEl.addEventListener('submit', handleSubmit);

    return {
        /**
         * Cleans up event listeners and destroys components.
         */
        destroy() {
            formEl.removeEventListener('submit', handleSubmit);
            roleSelector.destroy();
            if (container.contains(cardEl)) {
                container.removeChild(cardEl);
            }
        },
    };
}

export default createLoginForm;
