/**
 * @fileoverview Authorization Helper Layer
 *
 * Reusable utility functions for evaluating roles and permissions against
 * the central RBAC configuration.
 *
 * @module utils/authorization
 */

import { ROLES, ROLE_PERMISSIONS, MODULE_PERMISSIONS } from '../config/rbac.js';

/**
 * Checks if a given role exactly matches the target role.
 *
 * @param {string} currentRole - The user's active role
 * @param {string} targetRole - The role to check against
 * @returns {boolean}
 */
export function checkHasRole(currentRole, targetRole) {
    if (!currentRole) return false;
    return currentRole === targetRole;
}

/**
 * Checks if a given role is granted a specific permission.
 *
 * @param {string} currentRole - The user's active role
 * @param {string} requiredPermission - The permission to check
 * @returns {boolean}
 */
export function checkHasPermission(currentRole, requiredPermission) {
    if (!currentRole) return false;

    const permissions = ROLE_PERMISSIONS[currentRole] || [];

    return permissions.includes(requiredPermission);
}

/**
 * Determines if a role is authorized to access a specific route/module.
 *
 * @param {string} currentRole - The user's active role
 * @param {string} routeKey - The module/route identifier (e.g. 'overview', 'analytics')
 * @returns {boolean}
 */
export function checkCanAccessRoute(currentRole, routeKey) {
    if (!currentRole) return false;

    // If the route is not restricted in the matrix, allow access.
    const requiredPermission = MODULE_PERMISSIONS[routeKey];
    if (!requiredPermission) {
        return true;
    }

    return checkHasPermission(currentRole, requiredPermission);
}

// Role shorthand checks
/**
 *
 */
export function checkIsStudent(currentRole) {
    return checkHasRole(currentRole, ROLES.STUDENT);
}
