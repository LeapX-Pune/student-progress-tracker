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
        'bg-surface text-on-surface font-body-md antialiased h-screen h-full max-h-screen overflow-hidden flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed';

    pageWrapper.innerHTML = `
  <main class="flex-grow flex w-full min-h-0 overflow-hidden">
    <section class="hidden lg:flex w-[55%] flex-col relative overflow-hidden bg-surface-container-lowest border-r border-outline-variant p-8 lg:p-12 justify-center">
      <div class="flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full z-10 fade-in-up">
        
        <!-- Hero Branding Illustration -->
        <div class="mb-6 w-full flex justify-center h-[35vh] max-h-[290px] items-center relative">
          <img 
            alt="The Reality Student Progress Illustration" 
            class="max-h-full object-contain drop-shadow-md mix-blend-multiply transition-transform duration-300 hover:scale-[1.02]" 
            src="${heroIllustrationUrl}"
          />
        </div>

        <!-- Hero Title & Subtitle -->
        <div class="text-center mb-6 lg:mb-8 fade-in-up delay-100">
          <h1 class="font-display-lg text-2xl lg:text-[34px] text-primary font-bold leading-tight mb-2.5">Student Progress Tracker</h1>
          <p class="font-body-md text-sm lg:text-[15px] text-on-surface-variant max-w-[80%] mx-auto">Track Learning. Measure Growth. Empower Education.</p>
        </div>

        <!-- Key Feature Highlights Grid (2 Columns) -->
        <div class="grid grid-cols-2 gap-4.5 sm:gap-5 fade-in-up delay-200">
          
          <div class="bg-surface-container-low p-4.5 sm:p-5 rounded-xl border border-outline-variant/60 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-start gap-4 shadow-subtle">
            <div class="w-10 h-10 p-2 bg-primary-fixed/30 rounded-lg text-primary-container shrink-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">monitoring</span>
            </div>
            <div>
              <h3 class="font-label-sm text-sm lg:text-[15px] font-bold text-primary mb-1">Performance Analytics</h3>
              <p class="text-xs lg:text-[13px] text-on-surface-variant/90 leading-normal font-normal">Deep insights into student grades and trends.</p>
            </div>
          </div>

          <div class="bg-surface-container-low p-4.5 sm:p-5 rounded-xl border border-outline-variant/60 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-start gap-4 shadow-subtle">
            <div class="w-10 h-10 p-2 bg-secondary-fixed/30 rounded-lg text-on-secondary-container shrink-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">psychology</span>
            </div>
            <div>
              <h3 class="font-label-sm text-sm lg:text-[15px] font-bold text-primary mb-1">Student Tracking</h3>
              <p class="text-xs lg:text-[13px] text-on-surface-variant/90 leading-normal font-normal">Monitor individual progress across all subjects.</p>
            </div>
          </div>

          <div class="bg-surface-container-low p-4.5 sm:p-5 rounded-xl border border-outline-variant/60 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-start gap-4 shadow-subtle">
            <div class="w-10 h-10 p-2 bg-tertiary-fixed/30 rounded-lg text-on-tertiary-container shrink-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">assignment</span>
            </div>
            <div>
              <h3 class="font-label-sm text-sm lg:text-[15px] font-bold text-primary mb-1">Assignment Management</h3>
              <p class="text-xs lg:text-[13px] text-on-surface-variant/90 leading-normal font-normal">Streamlined submission and grading workflow.</p>
            </div>
          </div>

          <div class="bg-surface-container-low p-4.5 sm:p-5 rounded-xl border border-outline-variant/60 hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-start gap-4 shadow-subtle">
            <div class="w-10 h-10 p-2 bg-error-container/30 rounded-lg text-on-error-container shrink-0 flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">notifications_active</span>
            </div>
            <div>
              <h3 class="font-label-sm text-sm lg:text-[15px] font-bold text-primary mb-1">Real-time Alerts</h3>
              <p class="text-xs lg:text-[13px] text-on-surface-variant/90 leading-normal font-normal">Instant notifications for deadlines and updates.</p>
            </div>
          </div>

        </div>
      </div>

      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-fixed/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
    </section>

    <!-- RIGHT AUTHENTICATION PANEL -->
    <section id="form-mount-container" class="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 lg:p-8 bg-[#F8FAFC] relative overflow-y-auto min-h-0">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-fixed/20 via-surface to-surface lg:hidden z-0 pointer-events-none"></div>
    </section>
  </main>

  <footer class="bg-white border-t border-[#E5E7EB] w-full py-2 px-6 flex flex-col md:flex-row justify-between items-center z-20">
    <div class="flex items-center gap-2 mb-2 md:mb-0">
      <span class="text-xs font-bold text-primary">The Reality</span>
      <span class="font-label-xs text-[11px] text-[#6B7280]">© 2024 The Reality Academy. All rights reserved.</span>
    </div>
    <div class="flex items-center gap-6 text-xs text-[#6B7280]">
      <a class="hover:text-primary transition-colors" href="#">Privacy Policy</a>
      <a class="hover:text-primary transition-colors" href="#">Terms of Service</a>
      <a class="hover:text-primary transition-colors" href="#">Help Center</a>
      <a class="hover:text-primary transition-colors" href="#">Contact</a>
    </div>
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
