/**
 * @fileoverview UserAvatar — Authenticated User Avatar — Part 3.
 *
 * Displays the authenticated user's avatar image with an initials-based
 * fallback when no avatarUrl is available or when the image fails to load.
 * The fallback background colour is deterministically derived from the user's
 * name/ID so it is consistent across page loads.
 *
 * @module components/auth/UserAvatar
 */

import { getInitials, getAvatarColor } from '../../utils/authHelpers.js';

// ─── Size map ─────────────────────────────────────────────────────────────────

/** @type {Record<string, number>} Size in pixels for each named variant. */
const SIZE_PX = { sm: 32, md: 40, lg: 56 };

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a user avatar element.
 *
 * When `user.avatarUrl` is present, renders an `<img>` and listens for the
 * `error` event to switch to the initials fallback automatically.
 * When no URL is provided, renders the initials fallback immediately.
 *
 * @param {Object}           user              - Authenticated user object
 * @param {string}           user.name         - Full display name
 * @param {string}           [user.id]         - User ID (seed for colour)
 * @param {string}           [user.avatarUrl]  - Optional avatar image URL
 * @param {'sm'|'md'|'lg'}  [size='md']       - Visual size variant
 * @param {string}           [className='']   - Extra CSS classes
 * @returns {HTMLElement} The avatar element (div or img depending on context)
 *
 * @example
 * const avatar = createUserAvatar(
 *   { id: 'stu_001', name: 'Alex Johnson', avatarUrl: 'https://…' },
 *   'md'
 * );
 * headerEl.prepend(avatar);
 */
export function createUserAvatar(user, size = 'md', className = '') {
    const px = SIZE_PX[size] ?? SIZE_PX.md;
    const initials = getInitials(user?.name ?? '');
    const color = getAvatarColor(user?.id ?? user?.name ?? '');

    const wrapper = document.createElement('div');
    wrapper.className = `user-avatar user-avatar--${size}${className ? ` ${className}` : ''}`;
    wrapper.style.width = `${px}px`;
    wrapper.style.height = `${px}px`;
    wrapper.setAttribute('aria-hidden', 'true'); // decorative when displayed next to visible text

    if (user?.avatarUrl) {
        const img = document.createElement('img');
        img.src = user.avatarUrl;
        img.alt = `${user.name ?? 'User'} avatar`;
        img.className = 'user-avatar__img';
        img.width = px;
        img.height = px;

        // Switch to initials fallback if the image fails to load.
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

// ─── Private ──────────────────────────────────────────────────────────────────

/**
 * Appends the initials fallback element to the avatar wrapper.
 *
 * @param {HTMLElement} wrapper   - The outer avatar wrapper
 * @param {string}      initials  - Up to 2-character initials string
 * @param {string}      color     - CSS background colour
 * @returns {void}
 */
function _appendInitials(wrapper, initials, color) {
    const span = document.createElement('span');
    span.className = 'user-avatar__initials';
    span.textContent = initials;
    span.style.backgroundColor = color;
    wrapper.appendChild(span);
}
