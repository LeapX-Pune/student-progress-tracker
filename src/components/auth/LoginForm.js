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

import googleIconUrl from '../../assets/auth/google-icon.jpg';
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
    cardEl.className =
        'w-full max-w-[400px] bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6 sm:p-7 relative z-10 slide-in-right delay-200 my-auto shrink-0';

    cardEl.innerHTML = `
        <!-- Brand Header (Logo Icon, Title & Subtitle toggled via JS) -->
        <div class="text-center mb-5 flex flex-col items-center pt-1">
          <div class="inline-flex items-center justify-center w-11 h-11 bg-primary rounded-xl mb-3 shadow-sm shrink-0">
            <span class="material-symbols-outlined text-on-primary text-[26px]">school</span>
          </div>
          <h2 class="font-headline-md text-[20px] font-bold text-primary mb-1.5" id="auth-title">Welcome back</h2>
          <p class="font-body-md text-sm text-on-surface-variant" id="auth-subtitle">Log in to your The Reality account.</p>
        </div>

        <div id="role-selector-mount" class="mb-4"></div>
        
        <!-- Top Error Banner -->
        <div id="error-banner" role="alert" aria-live="assertive" style="background-color: var(--error-container); color: var(--on-error-container); padding: 0.625rem 0.875rem; border-radius: 0.5rem; margin-bottom: 0.875rem; font-size: 0.8125rem; display: none;"></div>

        <!-- Primary Auth Form (Dynamic Login / Signup Form) -->
        <form class="space-y-3.5" id="auth-form" novalidate>
          
          <!-- Name Input Field (Conditionally rendered: hidden in Login mode, visible in Signup mode) -->
          <div class="hidden" id="name-field">
            <label class="block text-sm font-bold text-[#1E293B] mb-1.5" for="name">Full Name</label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-[20px]">person</span>
              <input class="w-full h-11 pl-10 pr-4 bg-white border border-[#CBD5E1] rounded-xl text-sm lg:text-[15px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs" id="name" placeholder="Your Name" type="text"/>
            </div>
          </div>

          <!-- Email Address Input Field -->
          <div>
            <label class="block text-sm font-bold text-[#1E293B] mb-1.5" for="email">Email Address</label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-[20px]">mail</span>
              <input class="w-full h-11 pl-10 pr-4 bg-white border border-[#CBD5E1] rounded-xl text-sm lg:text-[15px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs" id="email" placeholder="student@school.edu" required="" type="email" autocomplete="email"/>
            </div>
            <span id="email-error" style="color: var(--error); font-size: 0.75rem; margin-top: 0.25rem; display: block;"></span>
          </div>

          <!-- Password Input Field with Interactive Show/Hide Toggle -->
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-sm font-bold text-[#1E293B]" for="password">Password</label>
              <a class="text-xs font-semibold text-primary hover:underline transition-colors underline-offset-2" href="#" id="forgot-password-link">Forgot password?</a>
            </div>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-[20px]">lock</span>
              <input class="w-full h-11 pl-10 pr-12 bg-white border border-[#CBD5E1] rounded-xl text-sm lg:text-[15px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs" id="password" placeholder="••••••••" required="" type="password" autocomplete="current-password"/>
              <button class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-[#64748B] hover:text-[#0F172A] transition-colors focus:outline-none" id="toggle-password-btn" type="button" aria-label="Toggle password visibility">
                <span class="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>
            <span id="password-error" style="color: var(--error); font-size: 0.75rem; margin-top: 0.25rem; display: block;"></span>
          </div>

          <!-- Confirm Password Input Field (Conditionally rendered: hidden in Login mode, visible in Signup mode) -->
          <div class="hidden" id="confirm-password-field">
            <label class="block text-sm font-bold text-[#1E293B] mb-1.5" for="confirm-password">Confirm Password</label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] text-[20px]">lock_reset</span>
              <input class="w-full h-11 pl-10 pr-12 bg-white border border-[#CBD5E1] rounded-xl text-sm lg:text-[15px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-xs" id="confirm-password" placeholder="••••••••" type="password"/>
            </div>
            <span id="confirm-password-error" style="color: var(--error); font-size: 0.75rem; margin-top: 0.25rem; display: block;"></span>
          </div>

          <div id="remember-me-mount"></div>

          <!-- Dynamic Form Action Submit Button -->
          <button class="w-full h-11 px-6 bg-primary text-on-primary font-semibold text-sm rounded-xl hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-md flex items-center justify-center gap-2" id="submit-btn" type="submit">
            Sign In
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <!-- Divider Line -->
        <div class="flex items-center my-3.5">
          <div class="flex-1 border-t border-outline-variant"></div>
          <span class="px-3 font-label-xs text-[10px] font-medium tracking-wider text-outline bg-surface-container-lowest">OR CONTINUE WITH</span>
          <div class="flex-1 border-t border-outline-variant"></div>
        </div>

        <!-- Social Authentication Buttons (Google OAuth Integration Placeholder) -->
        <div class="mb-3.5 flex justify-center w-full" id="social-mount">
          <button id="google-btn" type="button" class="w-full h-11 flex items-center justify-center gap-2.5 px-4 border border-outline-variant rounded-xl bg-surface hover:bg-surface-container-low transition-all font-label-sm text-sm font-medium text-on-surface shadow-sm hover:shadow">
            <img width="18" height="18" class="w-[18px] h-[18px] shrink-0 object-contain" style="width: 18px !important; height: 18px !important; max-width: 18px !important; max-height: 18px !important;" alt="Google Logo" src="${googleIconUrl}"/>
            Continue with Google
          </button>
        </div>

        <!-- Auth Mode Toggle Switcher (Switch between Login and Sign Up) -->
        <div class="text-center font-body-md text-xs text-on-surface-variant" id="mode-switcher">
          <span id="toggle-text">Don't have an account?</span>
          <button class="text-primary font-semibold text-xs hover:underline underline-offset-4 ml-1 focus:outline-none transition-all" id="toggle-mode-btn" type="button">Sign up</button>
        </div>

        <div id="demo-mount" class="mt-3.5"></div>
    `;

    // ── Queries ──────────────────────────────────────────────────────────────
    const authTitle = cardEl.querySelector('#auth-title');
    const authSubtitle = cardEl.querySelector('#auth-subtitle');
    const errorBanner = cardEl.querySelector('#error-banner');
    const formEl = cardEl.querySelector('#auth-form');

    const nameGroup = cardEl.querySelector('#name-field');
    const emailInput = cardEl.querySelector('#email');
    const emailErrorSpan = cardEl.querySelector('#email-error');

    const passwordInput = cardEl.querySelector('#password');
    const togglePasswordBtn = cardEl.querySelector('#toggle-password-btn');
    const passwordErrorSpan = cardEl.querySelector('#password-error');
    const forgotPasswordLink = cardEl.querySelector('#forgot-password-link');

    const confirmPasswordGroup = cardEl.querySelector('#confirm-password-field');
    const confirmPasswordInput = cardEl.querySelector('#confirm-password');
    const confirmPasswordErrorSpan = cardEl.querySelector('#confirm-password-error');

    const submitBtn = cardEl.querySelector('#submit-btn');

    // Mount dynamically created components
    const roleSelector = createRoleSelector({
        initialRole: 'student',
        /**
         *
         */
        onChange: role => {
            console.log(`[LoginForm] Selected role changed to: ${role}`);
        },
    });
    cardEl.querySelector('#role-selector-mount').appendChild(roleSelector.element);

    const rememberMe = createRememberMe({ checked: false });
    cardEl.querySelector('#remember-me-mount').appendChild(rememberMe.wrapper);

    // Reattach Input Event Listeners
    emailInput.addEventListener('input', () => {
        emailErrorSpan.textContent = '';
        clearBannerError();
    });

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

    confirmPasswordInput.addEventListener('input', () => {
        confirmPasswordErrorSpan.textContent = '';
    });

    // ── 6. Social Authentication (Google OAuth Button) ─────────────────────
    const googleBtn = cardEl.querySelector('#google-btn');
    googleBtn.addEventListener('click', () => {
        window.alert('Google OAuth login is currently configured for demonstration purposes.');
    });

    // ── 7. Auth Mode Switcher (Login vs Sign Up Toggle) ────────────────────
    const toggleText = cardEl.querySelector('#toggle-text');
    const toggleModeBtn = cardEl.querySelector('#toggle-mode-btn');

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
    cardEl.querySelector('#demo-mount').appendChild(demoBlock);

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
