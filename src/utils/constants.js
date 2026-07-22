/**
 * Authentication Module — Part 3 (shared across all modules)
 * File: src/utils/constants.js
 *
 * Purpose:
 *   Central registry of application-wide constants and enums.
 *   Importing from this file ensures a single source of truth
 *   for magic strings and numbers used across all modules.
 *
 * Planned constant groups (to be implemented):
 *
 *   ROUTES
 *     - LOGIN:     '/login'
 *     - DASHBOARD: '/dashboard'
 *     - NOT_FOUND: '/404'
 *
 *   API_ENDPOINTS
 *     - AUTH_LOGIN:       '/api/auth/login'
 *     - STUDENT:          (id) => `/api/students/${id}`
 *     - STUDENT_COURSES:  (id) => `/api/students/${id}/courses`
 *     - STUDENT_GRADES:   (id) => `/api/students/${id}/grades`
 *     - COURSE:           (id) => `/api/courses/${id}`
 *     - COURSE_PROGRESS:  (id) => `/api/courses/${id}/progress`
 *
 *   AUTH_CONSTANTS
 *     - DEMO_EMAIL:      'student@demo.com'
 *     - DEMO_PASSWORD:   'demo123'
 *     - TOKEN_EXPIRY_MS: 30 * 24 * 60 * 60 * 1000  (30 days in ms)
 *
 *   STATUS (course status values)
 *     - NOT_STARTED:  'not-started'
 *     - IN_PROGRESS:  'in-progress'
 *     - COMPLETED:    'completed'
 *
 *   TOAST_DURATION (milliseconds)
 *     - SUCCESS: 3000
 *     - ERROR:   5000
 *     - INFO:    4000
 *
 * TODO: Implement all constant groups.
 *       (Referenced by Part 3 initially; shared with Parts 4-12)
 */

export {};
