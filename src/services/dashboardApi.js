/**
 * @fileoverview Dashboard API Service
 *
 * Orchestrates multiple student API endpoints to aggregate
 * a complete dashboard state for the authenticated student.
 *
 * @module services/dashboardApi
 */

import AuthContext from '../context/AuthContext.js';
import { ERROR_CODES } from '../utils/constants.js';
import {
    getStudentProfile,
    getStudentCourses,
    getStudentGrades,
    getStudentMetrics,
    getStudentNotifications,
    getStudentUpcomingActivities,
} from './studentApi.js';

/**
 * Fetches the aggregated dashboard metrics for the student.
 *
 * @param {string} [studentId] - Optional student ID. Defaults to current authenticated user.
 * @returns {Promise<Object>} Aggregated dashboard data.
 */
export async function getDashboardMetrics(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');

        // Fetch data in parallel to optimize load times
        const [profile, courses, grades, metrics, notifications, upcoming] = await Promise.all([
            getStudentProfile(targetId),
            getStudentCourses(targetId),
            getStudentGrades(targetId),
            getStudentMetrics(targetId),
            getStudentNotifications(targetId),
            getStudentUpcomingActivities(targetId),
        ]);

        return {
            profile,
            courses,
            grades,
            metrics,
            notifications,
            upcoming,
        };
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch dashboard metrics',
        };
    }
}
