/**
 * @fileoverview StudentProfileCard — Dashboard Student Profile — Part 5.
 *
 * Displays the student's name, email, and avatar image with an initials
 * fallback when no avatarUrl is available or when the image fails to load.
 * Also exports skeleton and error state variants for loading states.
 *
 * @module components/dashboard/StudentProfileCard
 */

import { getInitials, getAvatarColor } from '../../utils/authHelpers.js';

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a student profile card element.
 *
 * @param {Object} student - Student profile data
 * @param {string} student.name - Full display name
 * @param {string} student.email - Student email
 * @param {string} [student.id] - Student ID (seed for avatar color)
 * @param {string} [student.avatarUrl] - Optional avatar image URL
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.compact=false] - Compact mode for sidebar
 * @returns {HTMLElement} The profile card element
 */
export function createStudentProfileCard(student, { compact = false } = {}) {
    const card = document.createElement('div');
    card.className = `profile-card${compact ? ' profile-card--compact' : ''}`;
    card.setAttribute('role', 'region');
    card.setAttribute('aria-label', 'Student Profile');

    const avatar = _createAvatar(student);
    const info = _createInfo(student);

    card.appendChild(avatar);
    card.appendChild(info);

    return card;
}

/**
 * Creates a skeleton variant of the profile card for loading states.
 *
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.compact=false] - Compact mode for sidebar
 * @returns {HTMLElement} The skeleton profile card element
 */
export function createProfileCardSkeleton({ compact = false } = {}) {
    const card = document.createElement('div');
    card.className = `profile-card${compact ? ' profile-card--compact' : ''} profile-card--skeleton`;
    card.setAttribute('role', 'status');
    card.setAttribute('aria-label', 'Loading profile');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading profile...';
    card.appendChild(srOnly);

    const avatarSkeleton = document.createElement('div');
    avatarSkeleton.className = 'skeleton skeleton--circle';
    avatarSkeleton.setAttribute('aria-hidden', 'true');
    card.appendChild(avatarSkeleton);

    const infoSkeleton = document.createElement('div');
    infoSkeleton.className = 'profile-card__info';
    infoSkeleton.setAttribute('aria-hidden', 'true');
    infoSkeleton.innerHTML = `
    <div class="skeleton skeleton--text" style="width: 60%; height: 1.25rem;"></div>
    <div class="skeleton skeleton--text" style="width: 80%; height: 0.875rem;"></div>
  `;
    card.appendChild(infoSkeleton);

    return card;
}

/**
 * Creates an error state variant of the profile card.
 *
 * @param {Object} [options] - Additional options
 * @param {string} [options.message='Unable to load profile'] - Error message
 * @param {Function} [options.onRetry] - Retry callback
 * @returns {HTMLElement} The error state profile card element
 */
export function createProfileCardError({ message = 'Unable to load profile', onRetry } = {}) {
    const card = document.createElement('div');
    card.className = 'profile-card profile-card--error';
    card.setAttribute('role', 'alert');

    const errorIcon = document.createElement('div');
    errorIcon.className = 'profile-card__error-icon';
    errorIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    card.appendChild(errorIcon);

    const errorMsg = document.createElement('p');
    errorMsg.className = 'profile-card__error-message';
    errorMsg.textContent = message;
    card.appendChild(errorMsg);

    if (onRetry) {
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn--secondary btn--sm';
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', onRetry);
        card.appendChild(retryBtn);
    }

    return card;
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Creates the avatar element with initials fallback.
 *
 * @param {Object} student - Student data
 * @returns {HTMLElement} The avatar element
 * @private
 */
function _createAvatar(student) {
    const wrapper = document.createElement('div');
    wrapper.className = 'profile-card__avatar';

    const initials = getInitials(student?.name ?? '');
    const color = getAvatarColor(student?.id ?? student?.name ?? '');

    if (student?.avatarUrl) {
        const img = document.createElement('img');
        img.src = student.avatarUrl;
        img.alt = `${student.name ?? 'Student'} avatar`;
        img.className = 'profile-card__avatar-img';
        img.width = 80;
        img.height = 80;

        img.addEventListener('error', () => {
            wrapper.removeChild(img);
            _appendInitials(wrapper, initials, color);
        });

        wrapper.appendChild(img);
    } else {
        _appendInitials(wrapper, initials, color);
    }

    return wrapper;
}

/**
 * Creates the info section with name and email.
 *
 * @param {Object} student - Student data
 * @returns {HTMLElement} The info element
 * @private
 */
function _createInfo(student) {
    const info = document.createElement('div');
    info.className = 'profile-card__info';

    const name = document.createElement('h2');
    name.className = 'profile-card__name';
    name.textContent = student?.name || 'Unknown Student';
    info.appendChild(name);

    const email = document.createElement('p');
    email.className = 'profile-card__email';
    email.textContent = student?.email || '';
    info.appendChild(email);

    return info;
}

/**
 * Appends the initials fallback element to the avatar wrapper.
 *
 * @param {HTMLElement} wrapper - The outer avatar wrapper
 * @param {string} initials - Up to 2-character initials string
 * @param {string} color - CSS background color
 * @returns {void}
 * @private
 */
function _appendInitials(wrapper, initials, color) {
    const span = document.createElement('span');
    span.className = 'profile-card__avatar-initials';
    span.textContent = initials;
    span.style.backgroundColor = color;
    wrapper.appendChild(span);
}

export default {
    createStudentProfileCard,
    createProfileCardSkeleton,
    createProfileCardError,
};
