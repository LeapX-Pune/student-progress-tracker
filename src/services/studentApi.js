/**
 * @fileoverview Student API Service
 *
 * Encapsulates every HTTP call related to the student resource.
 *
 * @module services/studentApi
 */

import AuthContext from '../context/AuthContext.js';
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
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT(targetId));
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
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_COURSES(targetId));
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
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_GRADES(targetId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student grades',
        };
    }
}

/**
 * Fetches the metrics for a specific student.
 */
export async function getStudentMetrics(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_METRICS(targetId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student metrics',
        };
    }
}

/**
 * Fetches the notifications for a specific student.
 */
export async function getStudentNotifications(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_NOTIFICATIONS(targetId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student notifications',
        };
    }
}

/**
 * Fetches the upcoming activities for a specific student.
 */
export async function getStudentUpcomingActivities(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_UPCOMING(targetId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student upcoming activities',
        };
    }
}

/**
 * Updates the status of a specific notification.
 */
export async function updateStudentNotification(notificationId, data) {
    try {
        if (!AuthContext.getCurrentUserId()) throw new Error('No user authenticated');
        return await api.patch(API_ENDPOINTS.NOTIFICATION(notificationId), data);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to update notification',
        };
    }
}

/**
 * Updates the status of a specific upcoming activity.
 */
export async function updateStudentActivity(activityId, data) {
    try {
        if (!AuthContext.getCurrentUserId()) throw new Error('No user authenticated');
        return await api.patch(API_ENDPOINTS.UPCOMING_ACTIVITY(activityId), data);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to update activity',
        };
    }
}

/**
 * Fetches the attendance for a specific student.
 */
export async function getStudentAttendance(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_ATTENDANCE(targetId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student attendance',
        };
    }
}

/**
 * Fetches the academic performance analytics for a specific student.
 */
export async function getAcademicPerformance(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_ACADEMIC_PERFORMANCE(targetId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch academic performance',
        };
    }
}

/**
 * Updates the profile details for a specific student.
 */
export async function updateStudentProfile(data, studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.put(API_ENDPOINTS.STUDENT(targetId), data);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to update student profile',
        };
    }
}

/**
 * Fetches the settings for a specific student.
 */
export async function getStudentSettings(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.get(API_ENDPOINTS.STUDENT_SETTINGS(targetId));
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to fetch student settings',
        };
    }
}

/**
 * Updates the settings for a specific student.
 */
export async function updateStudentSettings(data, studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.put(API_ENDPOINTS.STUDENT_SETTINGS(targetId), data);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to update student settings',
        };
    }
}

/**
 * Updates the preferences for a specific student.
 */
export async function updateStudentPreferences(data, studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.put(API_ENDPOINTS.STUDENT_PREFERENCES(targetId), data);
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to update student preferences',
        };
    }
}

/**
 * Marks all notifications as read for a specific student.
 */
export async function markAllNotificationsRead(studentId) {
    try {
        const targetId = studentId || AuthContext.getCurrentUserId();
        if (!targetId) throw new Error('No user authenticated');
        return await api.put(API_ENDPOINTS.STUDENT_MARK_ALL_NOTIFICATIONS(targetId), {});
    } catch (err) {
        throw {
            code: err.code || ERROR_CODES.UNKNOWN,
            message: err.message || 'Failed to mark all notifications read',
        };
    }
}
