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
 *   - Redirect to /dashboard if the user is already authenticated
 *   - Compose LoginForm with a navigation callback
 *   - Clean up subscriptions and child components on destroy
 *
 * @module pages/LoginPage
 */

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
        window.location.hash = '/dashboard';
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
    pageWrapper.className = 'auth-page-wrapper';
    pageWrapper.id = 'login-page';

    const mainContainer = document.createElement('main');
    mainContainer.className = 'auth-main-container';

    // ── Left Showcase Panel (55% desktop) ─────────────────────────────────────
    const showcasePanel = document.createElement('section');
    showcasePanel.className = 'auth-showcase-panel';

    const showcaseInner = document.createElement('div');
    showcaseInner.className = 'auth-showcase-inner fade-in-up';

    // Hero Illustration
    const heroWrapper = document.createElement('div');
    heroWrapper.className = 'auth-hero-illustration-wrapper';

    const heroImg = document.createElement('img');
    heroImg.src = '/src/assets/auth/hero-illustration.jpg';
    heroImg.alt = 'The Reality Student Progress Illustration';
    heroImg.className = 'auth-hero-illustration';
    /**
     * Fallback if illustration is unreadable.
     */
    heroImg.onerror = () => {
        heroImg.style.display = 'none';
    };
    heroWrapper.appendChild(heroImg);

    // Hero Title & Subtitle
    const heroTextGroup = document.createElement('div');
    heroTextGroup.style.cssText = 'text-align: center; margin-bottom: 2rem;';
    heroTextGroup.className = 'fade-in-up delay-100';

    const heroTitle = document.createElement('h1');
    heroTitle.className = 'auth-showcase-title';
    heroTitle.textContent = 'Student Progress Tracker';

    const heroSubtitle = document.createElement('p');
    heroSubtitle.className = 'auth-showcase-subtitle';
    heroSubtitle.textContent = 'Track Learning. Measure Growth. Empower Education.';

    heroTextGroup.appendChild(heroTitle);
    heroTextGroup.appendChild(heroSubtitle);

    // 4 Key Feature Cards
    const featuresGrid = document.createElement('div');
    featuresGrid.className = 'auth-features-grid fade-in-up delay-200';

    const featuresData = [
        {
            icon: 'monitoring',
            variant: 'primary',
            title: 'Performance Analytics',
            desc: 'Deep insights into student grades and trends.',
        },
        {
            icon: 'psychology',
            variant: 'secondary',
            title: 'Student Tracking',
            desc: 'Monitor individual progress across all subjects.',
        },
        {
            icon: 'assignment',
            variant: 'tertiary',
            title: 'Assignment Management',
            desc: 'Streamlined submission and grading workflow.',
        },
        {
            icon: 'notifications_active',
            variant: 'error',
            title: 'Real-time Alerts',
            desc: 'Instant notifications for deadlines and updates.',
        },
    ];

    featuresData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'auth-feature-card';

        const iconBox = document.createElement('div');
        iconBox.className = `auth-feature-icon-box auth-feature-icon-box--${item.variant}`;
        iconBox.innerHTML = `<span class="material-symbols-outlined text-[20px]">${item.icon}</span>`;

        const content = document.createElement('div');

        const cardTitle = document.createElement('h3');
        cardTitle.className = 'auth-feature-card-title';
        cardTitle.textContent = item.title;

        const cardDesc = document.createElement('p');
        cardDesc.className = 'auth-feature-card-desc';
        cardDesc.textContent = item.desc;

        content.appendChild(cardTitle);
        content.appendChild(cardDesc);

        card.appendChild(iconBox);
        card.appendChild(content);

        featuresGrid.appendChild(card);
    });

    showcaseInner.appendChild(heroWrapper);
    showcaseInner.appendChild(heroTextGroup);
    showcaseInner.appendChild(featuresGrid);

    showcasePanel.appendChild(showcaseInner);

    // Background Glow Accents
    const glow1 = document.createElement('div');
    glow1.className = 'auth-glow-accent-1';
    const glow2 = document.createElement('div');
    glow2.className = 'auth-glow-accent-2';

    showcasePanel.appendChild(glow1);
    showcasePanel.appendChild(glow2);

    // ── Right Form Panel (45% desktop) ────────────────────────────────────────
    const formPanel = document.createElement('section');
    formPanel.className = 'auth-form-panel';

    const formMountContainer = document.createElement('div');
    formMountContainer.style.cssText = 'width: 100%; display: flex; justify-content: center;';

    formPanel.appendChild(formMountContainer);

    mainContainer.appendChild(showcasePanel);
    mainContainer.appendChild(formPanel);
    pageWrapper.appendChild(mainContainer);

    // ── Footer Section ────────────────────────────────────────────────────────
    const footer = document.createElement('footer');
    footer.className = 'auth-footer';

    footer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="auth-footer-brand">The Reality</span>
            <span class="auth-footer-copy">© 2024 The Reality Academy. All rights reserved.</span>
        </div>
        <nav class="auth-footer-links">
            <a class="auth-footer-link" href="#">Privacy Policy</a>
            <a class="auth-footer-link" href="#">Terms of Service</a>
            <a class="auth-footer-link" href="#">Help Center</a>
            <a class="auth-footer-link" href="#">Contact</a>
        </nav>
    `;

    pageWrapper.appendChild(footer);
    container.appendChild(pageWrapper);

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
            window.location.hash = '/dashboard';
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
