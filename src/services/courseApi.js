/**
 * @fileoverview Course API Service
 *
 * Encapsulates every HTTP call related to the course resource.
 *
 * @module services/courseApi
 */

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
export async function getCourseProgress(courseId) {
    try {
        return await api.get(API_ENDPOINTS.COURSE_PROGRESS(courseId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch course progress',
        };
    }
}
