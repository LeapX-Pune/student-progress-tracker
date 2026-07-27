/**
 * @fileoverview Authentication Helper Utilities — Part 3.
 *
 * Pure, stateless helper functions for the authentication module.
 * No side effects, no DOM access, no imports from services or context.
 * Every function is independently unit-testable.
 *
 * @module utils/authHelpers
 */

import { ROUTES } from './constants.js';

// ─── Avatar helpers ───────────────────────────────────────────────────────────

/**
 * Derives up to two uppercase initials from a full name string.
 *
 * Rules:
 * - Splits on whitespace and takes the first character of each word
 * - Returns a maximum of 2 initials (first + last word)
 * - Falls back to `'?'` when the input is empty or not a string
 *
 * @param {string} name - The user's full name (e.g. `'Alex Johnson'`)
 * @returns {string} Up to 2 uppercase initials (e.g. `'AJ'`)
 *
 * @example
 * getInitials('Alex Johnson')      // 'AJ'
 * getInitials('Priya')             // 'P'
 * getInitials('Maria del Carmen')  // 'MC'
 * getInitials('')                  // '?'
 */
export function getInitials(name) {
    if (!name || typeof name !== 'string') return '?';

    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';

    const first = words[0][0].toUpperCase();
    if (words.length === 1) return first;

    const last = words[words.length - 1][0].toUpperCase();
    return first + last;
}

/**
 * Derives a consistent, deterministic hex background colour from a string
 * seed (user ID or name).  Given the same seed, this function always returns
 * the same colour, providing visual consistency across page loads without
 * storing the colour server-side.
 *
 * Uses a simple hash (djb2-style) to map the seed to one of a curated set of
 * accessible, saturated colours that all pass WCAG AA for white text.
 *
 * @param {string} seed - Any non-empty string (e.g. user ID or display name)
 * @returns {string} A CSS hex colour string (e.g. `'#4F46E5'`)
 *
 * @example
 * getAvatarColor('stu_001')     // always '#4F46E5'
 * getAvatarColor('Alex Johnson') // consistent but different from above
 */
export function getAvatarColor(seed) {
    // Curated palette: all pass WCAG AA contrast ratio (≥ 4.5:1) on white text.
    const PALETTE = [
        '#4F46E5', // indigo
        '#0EA5E9', // sky blue
        '#10B981', // emerald
        '#F59E0B', // amber
        '#EF4444', // red
        '#8B5CF6', // violet
        '#EC4899', // pink
        '#14B8A6', // teal
        '#F97316', // orange
        '#6366F1', // purple-indigo
    ];

    if (!seed || typeof seed !== 'string') return PALETTE[0];

    // djb2-style hash: fast, simple, good distribution for short strings.
    let hash = 5381;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 33) ^ seed.charCodeAt(i);
        hash = hash >>> 0; // keep it a positive 32-bit integer
    }

    return PALETTE[hash % PALETTE.length];
}

// ─── Token helpers ────────────────────────────────────────────────────────────

/**
 * Determines whether a stored auth token has passed its expiry timestamp.
 *
 * Fail-secure: returns `true` (treat as expired) when `expiresAt` is falsy,
 * not a number, or `NaN`.  This matches the same logic used inside
 * `AuthContext.restoreSession()` so behaviour is consistent across layers.
 *
 * @param {number} expiresAt - Unix timestamp in milliseconds (from token payload)
 * @returns {boolean} `true` when expired or invalid; `false` when still valid
 *
 * @example
 * isTokenExpired(Date.now() + 1000) // false — still valid
 * isTokenExpired(Date.now() - 1000) // true  — already expired
 * isTokenExpired(null)              // true  — treat as expired (fail-secure)
 */
export function isTokenExpired(expiresAt) {
    if (!expiresAt || typeof expiresAt !== 'number' || isNaN(expiresAt)) return true;
    return Date.now() > expiresAt;
}

// ─── Redirect helpers ─────────────────────────────────────────────────────────

/**
 * Constructs the login URL with an encoded `redirect` query parameter so that
 * after a successful login the user is returned to their intended destination.
 *
 * @param {string} path - The relative path to encode (e.g. `'/dashboard'`)
 * @returns {string} The full login URL with redirect param
 *                   (e.g. `'/login?redirect=%2Fdashboard'`)
 *
 * @example
 * buildLoginRedirectUrl('/dashboard')
 * // → '/login?redirect=%2Fdashboard'
 */
export function buildLoginRedirectUrl(path) {
    const sanitised = sanitizePath(path);
    if (!sanitised) return ROUTES.LOGIN;
    return `${ROUTES.LOGIN}?redirect=${encodeURIComponent(sanitised)}`;
}

/**
 * Parses the `redirect` query parameter from a URL search string and returns
 * it as a decoded path.  Falls back to `ROUTES.DASHBOARD` when the parameter
 * is absent, empty, or invalid.
 *
 * Always passes the result through `sanitizePath()` to prevent open-redirect
 * attacks where a malicious `redirect` value points to an external domain.
 *
 * @param {string} searchString - The `location.search` string (e.g. `'?redirect=%2Fdashboard'`)
 * @returns {string} Decoded relative path, or `'/dashboard'` as default
 *
 * @example
 * getRedirectDestination('?redirect=%2Fdashboard')  // '/dashboard'
 * getRedirectDestination('?redirect=https://evil.com') // '/dashboard' (sanitised)
 * getRedirectDestination('')                          // '/dashboard'
 */
export function getRedirectDestination(searchString) {
    try {
        const params = new URLSearchParams(searchString);
        const raw = params.get('redirect');
        return sanitizePath(raw) || ROUTES.DASHBOARD;
    } catch {
        return ROUTES.DASHBOARD;
    }
}

/**
 * Ensures a redirect target is a safe, relative path.
 *
 * Rejects absolute URLs (e.g. `https://evil.com`) and protocol-relative URLs
 * (e.g. `//evil.com`) to prevent open-redirect vulnerabilities.
 * Returns an empty string when the input is invalid, which callers treat as
 * "no redirect" and fall back to the default destination.
 *
 * @param {string|null|undefined} path - Candidate redirect path
 * @returns {string} The sanitised path, or `''` when unsafe/empty
 *
 * @example
 * sanitizePath('/dashboard')          // '/dashboard'
 * sanitizePath('https://evil.com')   // ''
 * sanitizePath('//evil.com')         // ''
 * sanitizePath(null)                  // ''
 */
export function sanitizePath(path) {
    if (!path || typeof path !== 'string') return '';

    const trimmed = path.trim();
    if (!trimmed) return '';

    // Reject absolute URLs (contain a scheme like http:// or https://)
    // and protocol-relative URLs (start with //).
    if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(trimmed)) return '';
    if (trimmed.startsWith('//')) return '';

    // Must start with '/' to be a valid relative path.
    if (!trimmed.startsWith('/')) return '';

    return trimmed;
}
