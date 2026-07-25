/**
 * @fileoverview Student API Service
 *
 * Encapsulates every HTTP call related to the student resource.
 *
 * @module services/studentApi
 */

import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants.js';
import { api } from './api.js';

/**
 * Fetches the profile details for a specific student.
 *
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} The student profile data.
 * @throws {{ code: string, message: string }} Normalised error on failure.
 */
export async function getStudentProfile(studentId) {
    try {
        return await api.get(API_ENDPOINTS.STUDENT(studentId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student profile',
        };
    }
}

/**
 * Fetches the courses a specific student is enrolled in.
 *
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Array>} List of courses.
 * @throws {{ code: string, message: string }} Normalised error on failure.
 */
export async function getStudentCourses(studentId) {
    try {
        return await api.get(API_ENDPOINTS.STUDENT_COURSES(studentId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student courses',
        };
    }
}

/**
 * Fetches the grades and progress data for a specific student.
 *
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} Grades data including quiz scores and progress.
 * @throws {{ code: string, message: string }} Normalised error on failure.
 */
export async function getStudentGrades(studentId) {
    try {
        return await api.get(API_ENDPOINTS.STUDENT_GRADES(studentId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student grades',
        };
    }
}
