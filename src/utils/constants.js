/**
 * @fileoverview Application-wide constants and enumerations.
 *
 * Single source of truth for all magic strings and numbers
 * used across the Student Progress Tracking SaaS.
 *
 * Import only the groups you need — tree-shaking keeps the
 * bundle minimal when individual named exports are used.
 *
 * @module utils/constants
 */

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/** Hash-router path constants used across the application. */
export const ROUTES = /** @type {const} */ ({
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    NOT_FOUND: '/404',
});

// ---------------------------------------------------------------------------
// API Endpoints
// ---------------------------------------------------------------------------

/**
 * API endpoint factory functions and static paths.
 * All paths are relative to ENV.API_BASE_URL.
 */
export const API_ENDPOINTS = /** @type {const} */ ({
    AUTH_LOGIN: '/auth/login',

    /** @param {string} id - Student ID */
    STUDENT: id => `/students/${id}`,

    /** @param {string} id - Student ID */
    STUDENT_COURSES: id => `/students/${id}/courses`,

    /** @param {string} id - Student ID */
    STUDENT_GRADES: id => `/students/${id}/grades`,

    /** @param {string} id - Course ID */
    COURSE: id => `/courses/${id}`,

    /** @param {string} id - Course ID */
    COURSE_PROGRESS: id => `/courses/${id}/progress`,
});

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

/** Authentication-specific constants. */
export const AUTH_CONSTANTS = /** @type {const} */ ({
    DEMO_EMAIL: 'student@demo.com',
    DEMO_PASSWORD: 'demo123',

    /** 30-day token lifetime in milliseconds. */
    TOKEN_EXPIRY_MS: 30 * 24 * 60 * 60 * 1000,

    /** Minimum password length for client-side validation. */
    MIN_PASSWORD_LENGTH: 6,
});

// ---------------------------------------------------------------------------
// Course status
// ---------------------------------------------------------------------------

/** Valid values for Course.status received from the API. */
export const COURSE_STATUS = /** @type {const} */ ({
    NOT_STARTED: 'not-started',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
});

// ---------------------------------------------------------------------------
// Toast durations
// ---------------------------------------------------------------------------

/** Auto-dismiss durations (ms) for toast notifications (Part 10). */
export const TOAST_DURATION = /** @type {const} */ ({
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 4000,
});

// ---------------------------------------------------------------------------
// Error codes
// ---------------------------------------------------------------------------

/**
 * Normalised error codes used across service and context layers.
 * Prevents scattered string literals when comparing error types.
 */
export const ERROR_CODES = /** @type {const} */ ({
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNKNOWN: 'UNKNOWN',
});
