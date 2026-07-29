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
    STUDENT: 'student',
    TEACHER: 'teacher', // Instructor
    ADMIN: 'admin',
};

/**
 * Granular Permissions
 */
export const PERMISSIONS = {
    // Dashboard
    READ_DASHBOARD: 'read:dashboard',

    // Courses
    READ_COURSES: 'read:courses',
    MANAGE_COURSES: 'manage:courses',

    // Attendance
    READ_ATTENDANCE: 'read:attendance',
    MANAGE_ATTENDANCE: 'manage:attendance',

    // Grades
    READ_GRADES: 'read:grades',
    MANAGE_GRADES: 'manage:grades',

    // Students
    READ_STUDENTS: 'read:students',
    MANAGE_STUDENTS: 'manage:students',

    // Analytics
    READ_ANALYTICS: 'read:analytics',

    // Settings
    READ_SETTINGS: 'read:settings',
    WRITE_SETTINGS: 'write:settings',

    // Admin overrides
    ADMIN_ALL: 'admin:all',
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
    ANALYTICS: 'analytics',
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
        PERMISSIONS.READ_SETTINGS,
    ],
    [ROLES.TEACHER]: [
        PERMISSIONS.READ_DASHBOARD,
        PERMISSIONS.READ_COURSES,
        PERMISSIONS.MANAGE_COURSES,
        PERMISSIONS.READ_GRADES,
        PERMISSIONS.MANAGE_GRADES,
        PERMISSIONS.READ_ATTENDANCE,
        PERMISSIONS.MANAGE_ATTENDANCE,
        PERMISSIONS.READ_STUDENTS,
        PERMISSIONS.READ_ANALYTICS,
        PERMISSIONS.READ_SETTINGS,
        PERMISSIONS.WRITE_SETTINGS,
    ],
    [ROLES.ADMIN]: [PERMISSIONS.ADMIN_ALL],
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
    [MODULES.ANALYTICS]: PERMISSIONS.READ_ANALYTICS,
    [MODULES.ATTENDANCE]: PERMISSIONS.READ_ATTENDANCE,
    [MODULES.SETTINGS]: PERMISSIONS.READ_SETTINGS,
};
