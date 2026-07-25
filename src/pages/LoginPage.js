/**
 * @fileoverview LoginPage — Integrated Top-Level Authentication Page.
 *
 * Assembles the complete split-screen authentication view:
 *   • Left Panel (55% desktop width): Visual hero branding illustration,
 *     title, subtitle, 4 feature cards, and atmospheric glow accents.
 *   • Right Panel (45% desktop width): LoginForm card (Role selector, Sign In /
 *     Sign Up mode toggle, password mask toggle, Google OAuth button, and inputs).
 *   • Footer: Branding and legal/help links.
 *
 * Responsibilities:
 *   - Set `document.title` on mount
 *   - Redirect to /overview if the user is already authenticated
 *   - Compose LoginForm with a navigation callback
 *   - Clean up subscriptions and child components on destroy
 *
 * @module pages/LoginPage
 */

import heroIllustrationUrl from '../assets/auth/hero-illustration.jpg';
import { createLoginForm } from '../components/auth/LoginForm.js';
import AuthContext from '../context/AuthContext.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_TITLE = 'The Reality - Student Progress Tracker Authentication';

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates and mounts the login page into the given container.
 *
 * @param {HTMLElement} container - The root element to mount into (e.g. `#app`)
 * @returns {{ destroy: function }} Cleanup handle
 *
 * @example
 * const page = createLoginPage(document.getElementById('app'));
 * // On route change / page destroy:
 * page.destroy();
 */
export function createLoginPage(container) {
    // ── Guard: redirect authenticated users away from the login page ──────────
    const { isAuthenticated, isLoading } = AuthContext.getState();

    if (!isLoading && isAuthenticated) {
        window.location.hash = '/overview';
        return {
            /**
             * No-op destroy handle when user is already authenticated.
             *
             * @returns {void}
             */
            destroy: () => {},
        };
    }

    // ── Set document title ────────────────────────────────────────────────────
    document.title = PAGE_TITLE;

    // ── Build page wrapper shell ──────────────────────────────────────────────
    const pageWrapper = document.createElement('div');
    pageWrapper.id = 'login-page';
    pageWrapper.style.cssText =
        'width: 100%; height: 100%; display: flex; flex-direction: column; background-color: var(--surface); color: var(--on-surface); font-family: "Inter", sans-serif;';

    // Add tailwind outer classes
    pageWrapper.className =
        'bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed';

    pageWrapper.innerHTML = `
  <main class="flex-grow flex w-full">
    <section class="hidden lg:flex w-[55%] flex-col relative overflow-hidden bg-surface-container-lowest border-r border-outline-variant p-lg">
      <div class="flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full z-10 fade-in-up">
        
        <!-- Hero Branding Illustration -->
        <div class="mb-[60px] w-full flex justify-center h-[45vh] items-center relative">
          <img 
            alt="The Reality Student Progress Illustration" 
            class="max-h-full object-contain drop-shadow-sm mix-blend-multiply" 
            src="${heroIllustrationUrl}"
          />
        </div>

        <!-- Hero Title & Subtitle -->
        <div class="text-center mb-[60px] fade-in-up delay-100">
          <h1 class="font-display-lg text-[40px] leading-[48px] text-primary mb-sm">Student Progress Tracker</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">Track Learning. Measure Growth. Empower Education.</p>
        </div>

        <!-- Key Feature Highlights Grid (2 Columns) -->
        <div class="grid grid-cols-2 gap-[20px] fade-in-up delay-200">
          
          <div class="bg-surface-container-low p-[20px] rounded-2xl border border-outline-variant/50 hover:border-primary/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 shadow-sm">
            <div class="p-2 bg-primary-fixed/30 rounded-lg text-primary-container shrink-0 mt-1">
              <span class="material-symbols-outlined text-[18px]">monitoring</span>
            </div>
            <div>
              <h3 class="font-label-sm text-label-sm text-on-surface mb-1">Performance Analytics</h3>
              <p class="text-[13px] text-on-surface-variant leading-tight">Deep insights into student grades and trends.</p>
            </div>
          </div>

          <div class="bg-surface-container-low p-[20px] rounded-2xl border border-outline-variant/50 hover:border-primary/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 shadow-sm">
            <div class="p-2 bg-secondary-fixed/30 rounded-lg text-on-secondary-container shrink-0 mt-1">
              <span class="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <div>
              <h3 class="font-label-sm text-label-sm text-on-surface mb-1">Student Tracking</h3>
              <p class="text-[13px] text-on-surface-variant leading-tight">Monitor individual progress across all subjects.</p>
            </div>
          </div>

          <div class="bg-surface-container-low p-[20px] rounded-2xl border border-outline-variant/50 hover:border-primary/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 shadow-sm">
            <div class="p-2 bg-tertiary-fixed/30 rounded-lg text-on-tertiary-container shrink-0 mt-1">
              <span class="material-symbols-outlined text-[18px]">assignment</span>
            </div>
            <div>
              <h3 class="font-label-sm text-label-sm text-on-surface mb-1">Assignment Management</h3>
              <p class="text-[13px] text-on-surface-variant leading-tight">Streamlined submission and grading workflow.</p>
            </div>
          </div>

          <div class="bg-surface-container-low p-[20px] rounded-2xl border border-outline-variant/50 hover:border-primary/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-start gap-3 shadow-sm">
            <div class="p-2 bg-error-container/30 rounded-lg text-on-error-container shrink-0 mt-1">
              <span class="material-symbols-outlined text-[18px]">notifications_active</span>
            </div>
            <div>
              <h3 class="font-label-sm text-label-sm text-on-surface mb-1">Real-time Alerts</h3>
              <p class="text-[13px] text-on-surface-variant leading-tight">Instant notifications for deadlines and updates.</p>
            </div>
          </div>

        </div>
      </div>

      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-fixed/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
    </section>

    <!-- RIGHT AUTHENTICATION PANEL -->
    <section id="form-mount-container" class="w-full lg:w-[45%] flex items-center justify-center p-[20px] sm:p-lg bg-surface relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-fixed/20 via-surface to-surface lg:hidden z-0 pointer-events-none"></div>
    </section>
  </main>

  <footer class="bg-surface-container-lowest border-t border-outline-variant w-full py-md px-gutter flex flex-col md:flex-row justify-between items-center z-20">
    <div class="flex items-center gap-2 mb-4 md:mb-0">
      <span class="text-label-sm font-bold text-primary">The Reality</span>
      <span class="font-label-xs text-label-xs text-on-surface-variant">© 2024 The Reality Academy. All rights reserved.</span>
    </div>
    <nav class="flex gap-[20px]">
      <a class="font-label-xs text-label-xs text-on-surface-variant hover:underline transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
      <a class="font-label-xs text-label-xs text-on-surface-variant hover:underline transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
      <a class="font-label-xs text-label-xs text-on-surface-variant hover:underline transition-all opacity-80 hover:opacity-100" href="#">Help Center</a>
      <a class="font-label-xs text-label-xs text-on-surface-variant hover:underline transition-all opacity-80 hover:opacity-100" href="#">Contact</a>
    </nav>
  </footer>
    `;

    container.appendChild(pageWrapper);
    const formMountContainer = pageWrapper.querySelector('#form-mount-container');

    // ── Mount LoginForm into form panel ──────────────────────────────────────
    const loginFormHandle = createLoginForm(formMountContainer, {
        /**
         * Navigation callback on successful login.
         *
         * @param {Object} _user
         * @param {string} destination
         */
        onSuccess: (_user, destination) => {
            window.location.hash = destination;
        },
    });

    // ── Subscribe to AuthContext to handle mid-session auth changes ───────────
    const unsubscribe = AuthContext.subscribe(({ isAuthenticated: authed }) => {
        if (authed) {
            window.location.hash = '/overview';
        }
    });

    // ── Cleanup ────────────────────────────────────────────────────────────────

    return {
        /**
         * Tears down the login page, removing DOM elements and subscriptions.
         *
         * @returns {void}
         */
        destroy() {
            unsubscribe();
            loginFormHandle.destroy();
            if (container.contains(pageWrapper)) {
                container.removeChild(pageWrapper);
            }
            document.title = 'Student Progress Tracker';
        },
    };
}

export default createLoginPage;
