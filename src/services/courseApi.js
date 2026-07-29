/**
 * @fileoverview Course API Service
 *
 * Encapsulates every HTTP call related to the course resource.
 *
 * @module services/courseApi
 */

import AuthContext from '../context/AuthContext.js';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants.js';
import { api } from './api.js';

/**
 * Fetches details for a specific course.
 *
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Object>} The course details.
 * @throws {{ code: string, message: string }} Normalised error on failure.
 */
export async function getCourseDetails(courseId) {
    try {
        return await api.get(API_ENDPOINTS.COURSE(courseId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch course details',
        };
    }
}

/**
 * Fetches the progress for a specific course.
 *
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Object>} Course progress data.
 * @throws {{ code: string, message: string }} Normalised error on failure.
 */
export async function getCourseProgress(courseId, studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        // Pass studentId as query param so mock server can read it if needed
        const url = targetId
            ? `${API_ENDPOINTS.COURSE_PROGRESS(courseId)}?studentId=${targetId}`
            : API_ENDPOINTS.COURSE_PROGRESS(courseId);
        return await api.get(url);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch course progress',
        };
    }
}

/**
 * Fetches the modules for a specific course.
 */
export async function getCourseModules(courseId) {
    try {
        return await api.get(API_ENDPOINTS.COURSE_MODULES(courseId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch course modules',
        };
    }
}

/**
 * Fetches the timeline for a specific course.
 */
export async function getCourseTimeline(courseId, studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        const url = targetId
            ? `${API_ENDPOINTS.COURSE_TIMELINE(courseId)}?studentId=${targetId}`
            : API_ENDPOINTS.COURSE_TIMELINE(courseId);
        return await api.get(url);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch course timeline',
        };
    }
}

/**
 * Fetches the metrics for a specific course.
 */
export async function getCourseMetrics(courseId, studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        const url = targetId
            ? `${API_ENDPOINTS.COURSE_METRICS(courseId)}?studentId=${targetId}`
            : API_ENDPOINTS.COURSE_METRICS(courseId);
        return await api.get(url);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch course metrics',
        };
    }
}
