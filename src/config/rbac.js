/**
 * @fileoverview Central Role-Based Access Control (RBAC) Configuration
 *
 * Defines the core roles, permissions, modules, and route access levels
 * for the entire Student Progress Tracker.
 *
 * @module config/rbac
 */

/**
 * System Roles
 */
export const ROLES = {
    STUDENT: 'student', // Learner
};

/**
 * Granular Permissions
 */
export const PERMISSIONS = {
    // Dashboard
    READ_DASHBOARD: 'read:dashboard',

    // Courses
    READ_COURSES: 'read:courses',

    // Grades
    READ_GRADES: 'read:grades',

    // Attendance
    READ_ATTENDANCE: 'read:attendance',

    // Students
    READ_STUDENTS: 'read:students',

    // Profile & Settings
    READ_SETTINGS: 'read:settings',
};

/**
 * System Modules / Route Keys
 * These align with the `ROUTES` keys in `script.js`
 */
export const MODULES = {
    OVERVIEW: 'overview',
    STUDENTS: 'students',
    COURSES: 'courses',
    GRADES: 'grades',
    ATTENDANCE: 'attendance',
    SETTINGS: 'settings',
};

/**
 * Permission Matrix
 * Maps each role to the array of permissions they are granted.
 */
export const ROLE_PERMISSIONS = {
    [ROLES.STUDENT]: [
        PERMISSIONS.READ_DASHBOARD,
        PERMISSIONS.READ_COURSES,
        PERMISSIONS.READ_GRADES,
        PERMISSIONS.READ_ATTENDANCE,
        PERMISSIONS.READ_STUDENTS,
        PERMISSIONS.READ_SETTINGS,
    ],
};

/**
 * Route / Module Access Configuration
 */
export const ROUTE_PERMISSIONS = {
    // Public / Fallback
    login: { requiresAuth: false },
    overview: { requiresAuth: false },

    // Student Routes
    dashboard: { requiresAuth: true, permission: PERMISSIONS.READ_DASHBOARD },
    students: { requiresAuth: true, permission: PERMISSIONS.READ_STUDENTS },
    courses: { requiresAuth: true, permission: PERMISSIONS.READ_COURSES },
    grades: { requiresAuth: true, permission: PERMISSIONS.READ_GRADES },
    attendance: { requiresAuth: true, permission: PERMISSIONS.READ_ATTENDANCE },
    settings: { requiresAuth: true, permission: PERMISSIONS.READ_SETTINGS },
};

/**
 * Route / Module Access Matrix
 * Maps a route key (module) to the baseline permission required to access it.
 */
export const MODULE_PERMISSIONS = {
    [MODULES.OVERVIEW]: PERMISSIONS.READ_DASHBOARD,
    [MODULES.STUDENTS]: PERMISSIONS.READ_STUDENTS,
    [MODULES.COURSES]: PERMISSIONS.READ_COURSES,
    [MODULES.GRADES]: PERMISSIONS.READ_GRADES,
    [MODULES.ATTENDANCE]: PERMISSIONS.READ_ATTENDANCE,
    [MODULES.SETTINGS]: PERMISSIONS.READ_SETTINGS,
};
