/**
 * @fileoverview UserProfileHeader — Role-based Identity & Header Personalization (Phase 2).
 *
 * Dynamically updates header profile triggers, profile dropdown cards, status indicators,
 * role badges, and welcome greetings across the application shell based on authenticated
 * state from AuthContext.
 *
 * @module components/auth/UserProfileHeader
 */

import AuthContext from '../../context/AuthContext.js';
import { createUserAvatar } from './UserAvatar.js';

/**
 * Renders role-aware visual badge HTML for a given user role.
 *
 * @returns {string} Badge HTML string
 */
export function getRoleBadgeHtml() {
    return '<span class="role-badge role-badge--student">Student</span>';
}

/**
 * Updates header profile elements with authenticated user data.
 *
 * @param {Object} user - Authenticated user object from AuthContext
 * @returns {void}
 */
export function updateUserProfileHeader(user) {
    if (!user || typeof user !== 'object') return;

    const profileTrigger = document.querySelector('[data-profile-toggle]');
    if (profileTrigger) {
        // Update or replace avatar wrapper
        const oldAvatar = profileTrigger.querySelector('.avatar, .user-avatar');
        const roleRing = 'avatar-ring--student';
        const newAvatar = createUserAvatar(user, 'sm', roleRing);

        if (oldAvatar) {
            oldAvatar.replaceWith(newAvatar);
        } else {
            profileTrigger.prepend(newAvatar);
        }

        // Update profile name
        const nameEl = profileTrigger.querySelector('.profile-name');
        if (nameEl) {
            nameEl.textContent = user.name;
        }

        // Update role indicator badge
        const roleEl = profileTrigger.querySelector('.profile-role');
        if (roleEl) {
            roleEl.innerHTML = getRoleBadgeHtml();
        }
    }

    // Update Profile Dropdown Card
    const profileDropdown = document.querySelector('[data-profile-dropdown]');
    if (profileDropdown) {
        let summaryHeader = profileDropdown.querySelector('.profile-summary-header');
        if (!summaryHeader) {
            summaryHeader = document.createElement('div');
            summaryHeader.className = 'profile-summary-header';
            profileDropdown.prepend(summaryHeader);
        }

        const detailsLine = `${user.class ?? 'Student'} • Roll No: ${user.rollNumber ?? 'N/A'}`;
        const idLine = `ID: ${user.studentId ?? user.id}`;

        summaryHeader.innerHTML = `
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="profile-summary-name truncate">${user.name}</span>
              ${getRoleBadgeHtml()}
            </div>
            <div class="profile-summary-email truncate">${user.email}</div>
            <div class="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]">
              <span class="status-indicator">
                <span class="status-dot"></span> ${(user.status ?? 'active').charAt(0).toUpperCase() + (user.status ?? 'active').slice(1)}
              </span>
              <span class="text-[11px] font-mono text-[var(--text-tertiary)]">${idLine}</span>
            </div>
            <div class="profile-summary-details font-medium">${detailsLine}</div>
        `;
    }

    if (
        typeof window !== 'undefined' &&
        window.lucide &&
        typeof window.lucide.createIcons === 'function'
    ) {
        window.lucide.createIcons();
    }
}

/**
 * Updates welcome headers and greetings on dashboard / overview views.
 *
 * @param {Object} user - Authenticated user object
 * @param {HTMLElement|Document} [container=document] - Scope container
 * @returns {void}
 */
export function updateWelcomeHeader(user, container = document) {
    if (!user || typeof user !== 'object') return;

    const titleEl = container.querySelector('[data-welcome-title], #welcome-title, .welcome-title');
    if (titleEl) {
        titleEl.textContent = `Welcome back, ${user.name}`;
    }

    const subtitleEl = container.querySelector(
        '[data-welcome-subtitle], #welcome-subtitle, .welcome-subtitle'
    );
    if (subtitleEl) {
        subtitleEl.textContent = `${user.class ?? 'Class 10-A'} • Roll No: ${user.rollNumber ?? '24'}`;
    }
}

/**
 * Initializes reactive subscription to AuthContext for header profile updates.
 *
 * @returns {() => void} Unsubscribe function
 */
export function initUserProfileHeader() {
    /**
     *
     */
    function sync(state) {
        if (state.isAuthenticated && state.user) {
            updateUserProfileHeader(state.user);
            updateWelcomeHeader(state.user);
        }
    }

    const unsubscribe = AuthContext.subscribe(sync);
    sync(AuthContext.getState());
    return unsubscribe;
}

export default {
    getRoleBadgeHtml,
    updateUserProfileHeader,
    updateWelcomeHeader,
    initUserProfileHeader,
};
