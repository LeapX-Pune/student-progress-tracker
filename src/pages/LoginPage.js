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

    pageWrapper.innerHTML = `
  <main class="login-main">
    <!-- LEFT BRANDING PANEL -->
    <section class="login-left-panel">
      <div class="login-left-inner fade-in-up">
        
        <!-- Hero Branding Illustration -->
        <div class="login-hero-img-wrap">
          <img 
            alt="The Reality Student Progress Illustration" 
            class="login-hero-img"
            src="${heroIllustrationUrl}"
          />
        </div>

        <!-- Hero Title & Subtitle -->
        <div class="login-hero-text fade-in-up delay-100">
          <h1 class="login-hero-title">Student Progress Tracker</h1>
          <p class="login-hero-subtitle">Track Learning. Measure Growth. Empower Education.</p>
        </div>

        <!-- Key Feature Highlights Grid (2 Columns) -->
        <div class="login-features-grid fade-in-up delay-200">
          
          <div class="login-feature-card">
            <div class="login-feature-icon login-feature-icon--blue">
              <span class="material-symbols-outlined">monitoring</span>
            </div>
            <div>
              <h3 class="login-feature-title">Performance Analytics</h3>
              <p class="login-feature-desc">Deep insights into student grades and trends.</p>
            </div>
          </div>

          <div class="login-feature-card">
            <div class="login-feature-icon login-feature-icon--green">
              <span class="material-symbols-outlined">psychology</span>
            </div>
            <div>
              <h3 class="login-feature-title">Student Tracking</h3>
              <p class="login-feature-desc">Monitor individual progress across all subjects.</p>
            </div>
          </div>

          <div class="login-feature-card">
            <div class="login-feature-icon login-feature-icon--purple">
              <span class="material-symbols-outlined">assignment</span>
            </div>
            <div>
              <h3 class="login-feature-title">Assignment Management</h3>
              <p class="login-feature-desc">Streamlined submission and grading workflow.</p>
            </div>
          </div>

          <div class="login-feature-card">
            <div class="login-feature-icon login-feature-icon--red">
              <span class="material-symbols-outlined">notifications_active</span>
            </div>
            <div>
              <h3 class="login-feature-title">Real-time Alerts</h3>
              <p class="login-feature-desc">Instant notifications for deadlines and updates.</p>
            </div>
          </div>

        </div>
      </div>

      <div class="login-glow login-glow--top"></div>
      <div class="login-glow login-glow--bottom"></div>
    </section>

    <!-- RIGHT AUTHENTICATION PANEL -->
    <section id="form-mount-container" class="login-right-panel">
      <div class="login-right-bg-gradient"></div>
    </section>
  </main>

  <footer class="login-footer">
    <div class="login-footer-brand">
      <span class="login-footer-logo">The Reality</span>
      <span class="login-footer-copy">© 2024 The Reality Academy. All rights reserved.</span>
    </div>
    <nav class="login-footer-links" aria-label="Footer links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Help Center</a>
      <a href="#">Contact</a>
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
