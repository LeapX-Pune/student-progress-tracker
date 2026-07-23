/**
 * @fileoverview Form Validation Utilities — Part 3.
 *
 * Pure, synchronous, stateless validation functions.
 * No side effects, no DOM access, no async operations.
 *
 * Used by LoginForm and any future form component that needs
 * client-side validation with WCAG AA-compliant error messages.
 *
 * Error message style guide:
 * - Concise and actionable ("Enter a valid email" not "Invalid email")
 * - Not colour-dependent — always accompanied by text (FR-ERR-011)
 * - Starts with a capital letter; no trailing period
 *
 * @module utils/validation
 */

import { AUTH_CONSTANTS } from './constants.js';

// ─── Regex constants ───────────────────────────────────────────────────────────

/**
 * RFC 5322-simplified email pattern.
 * Validates the common cases while keeping the regex readable.
 * Does not validate full RFC compliance (e.g. quoted strings, IP literals)
 * since those are rarely encountered in real-world applications.
 *
 * @type {RegExp}
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Individual field validators ──────────────────────────────────────────────

/**
 * Validates an email address field.
 *
 * @param {string|undefined|null} value - The raw input value
 * @returns {string|null} An error message string, or `null` when valid
 *
 * @example
 * validateEmail('')                    // 'Email is required'
 * validateEmail('not-an-email')        // 'Enter a valid email address'
 * validateEmail('student@demo.com')    // null
 */
export function validateEmail(value) {
    const trimmed = (value ?? '').trim();

    if (!trimmed) {
        return 'Email is required';
    }

    if (!EMAIL_REGEX.test(trimmed)) {
        return 'Enter a valid email address';
    }

    return null;
}

/**
 * Validates a password field.
 *
 * @param {string|undefined|null} value - The raw input value
 * @returns {string|null} An error message string, or `null` when valid
 *
 * @example
 * validatePassword('')         // 'Password is required'
 * validatePassword('abc')      // 'Password must be at least 6 characters'
 * validatePassword('demo123')  // null
 */
export function validatePassword(value) {
    const raw = value ?? '';

    if (!raw) {
        return 'Password is required';
    }

    if (raw.length < AUTH_CONSTANTS.MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`;
    }

    return null;
}

// ─── Form-level validator ─────────────────────────────────────────────────────

/**
 * Validates the entire login form by running both field validators.
 *
 * Returns `null` when every field is valid (no errors).
 * Returns an `errors` object when one or more fields are invalid.
 *
 * The returned object always contains both keys so that the calling
 * component can read `errors.email` and `errors.password` unconditionally
 * without guard checks.
 *
 * @param {Object}          form          - Form values to validate
 * @param {string}          form.email    - Email field value
 * @param {string}          form.password - Password field value
 * @returns {{ email: string|null, password: string|null }|null}
 *   `null` when valid; error object when invalid
 *
 * @example
 * validateLoginForm({ email: '', password: '' })
 * // { email: 'Email is required', password: 'Password is required' }
 *
 * validateLoginForm({ email: 'student@demo.com', password: 'demo123' })
 * // null
 */
export function validateLoginForm({ email, password }) {
    const errors = {
        email: validateEmail(email),
        password: validatePassword(password),
    };

    // Return null when every value is null (all fields valid).
    return isFormValid(errors) ? null : errors;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Checks whether all values in an errors object are `null`.
 * A `null` value means the corresponding field passed validation.
 *
 * @param {Record<string, string|null>} errors - The errors object to inspect
 * @returns {boolean} `true` when every field is valid; `false` otherwise
 *
 * @example
 * isFormValid({ email: null, password: null })     // true
 * isFormValid({ email: 'Required', password: null }) // false
 */
export function isFormValid(errors) {
    if (!errors || typeof errors !== 'object') return false;
    return Object.values(errors).every(v => v === null);
}
