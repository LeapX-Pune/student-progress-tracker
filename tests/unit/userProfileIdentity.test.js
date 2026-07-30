import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import AuthContext from '../../src/context/AuthContext.js';
import { AUTH_CONSTANTS } from '../../src/utils/constants.js';
import { createUserAvatar } from '../../src/components/auth/UserAvatar.js';
import {
    getRoleBadgeHtml,
    updateUserProfileHeader,
    updateWelcomeHeader,
    initUserProfileHeader,
} from '../../src/components/auth/UserProfileHeader.js';

describe('Role-Based User Identity & Personalization (Phase 2)', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="profile-menu" data-profile-menu>
              <button class="profile-trigger" type="button" data-profile-toggle>
                <span class="avatar">AJ</span>
                <span class="profile-meta">
                  <span class="profile-name">Alex Johnson</span>
                  <span class="profile-role">Administrator</span>
                </span>
              </button>
              <div class="profile-dropdown" data-profile-dropdown hidden>
                <button class="profile-dropdown-item profile-dropdown-item--danger">Sign out</button>
              </div>
            </div>
            <div id="welcome-container">
              <h1 id="welcome-title" data-welcome-title>Welcome</h1>
              <p id="welcome-subtitle" data-welcome-subtitle>Subtitle</p>
            </div>
        `;
        AuthContext.logout();
    });

    afterEach(() => {
        AuthContext.logout();
    });

    it('generates role badge HTML with correct accent classes', () => {
        const studentBadge = getRoleBadgeHtml('student');
        expect(studentBadge).toContain('role-badge--student');
        expect(studentBadge).toContain('Student');
    });

    it('creates user avatar with initials fallback when image URL fails or is missing', () => {
        const avatarEl = createUserAvatar({
            name: AUTH_CONSTANTS.DEMO_STUDENT.name,
            id: AUTH_CONSTANTS.DEMO_STUDENT.id,
        });

        expect(avatarEl.querySelector('.user-avatar__initials')).not.toBeNull();
        expect(avatarEl.querySelector('.user-avatar__initials').textContent).toBe('AJ');
    });

    it('updates header profile trigger and dropdown for authenticated Student user', () => {
        const user = { ...AUTH_CONSTANTS.DEMO_STUDENT };
        updateUserProfileHeader(user);

        const nameEl = document.querySelector('.profile-name');
        const roleEl = document.querySelector('.profile-role');
        const summaryHeader = document.querySelector('.profile-summary-header');

        expect(nameEl.textContent).toBe('Alex Johnson');
        expect(roleEl.innerHTML).toContain('role-badge--student');
        expect(summaryHeader).not.toBeNull();
        expect(summaryHeader.innerHTML).toContain('student@demo.com');
        expect(summaryHeader.innerHTML).toContain('Class 10-A');
        expect(summaryHeader.innerHTML).toContain('STU-2024-001');
    });

    it('updates welcome header title and subtitle dynamically based on user role', () => {
        updateWelcomeHeader(AUTH_CONSTANTS.DEMO_STUDENT);
        expect(document.querySelector('#welcome-title').textContent).toBe(
            'Welcome back, Alex Johnson'
        );
        expect(document.querySelector('#welcome-subtitle').textContent).toContain('Class 10-A');
    });

    it('reactively synchronizes UI when AuthContext state changes via initUserProfileHeader', () => {
        const unsubscribe = initUserProfileHeader();

        AuthContext.setState({
            user: AUTH_CONSTANTS.DEMO_STUDENT,
            token: 'mock-token',
            isAuthenticated: true,
            isLoading: false,
            error: null,
        });

        expect(document.querySelector('.profile-name').textContent).toBe('Alex Johnson');
        expect(document.querySelector('.profile-role').innerHTML).toContain('role-badge--student');

        unsubscribe();
    });
});
