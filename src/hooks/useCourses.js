import { getCourses } from '../services/api.js';

/**
 * ----------------------------------------------------
 * useCourses Hook
 * ----------------------------------------------------
 *
 * Purpose:
 * Encapsulates the logic for fetching and managing course data state.
 *
 * @param {Object} config - State callbacks
 * @param {Function} config.onLoading - Called when fetch starts
 * @param {Function} config.onSuccess - Called with courses data on success
 * @param {Function} config.onError - Called with error object on failure
 * @returns {Object} - Object containing fetch and retry methods
 */
export function useCourses({ onLoading, onSuccess, onError }) {
    let currentStudentId = null;

    /**
     *
     */
    const fetchCourses = async studentId => {
        currentStudentId = studentId;

        if (onLoading) onLoading();

        try {
            console.log('[useCourses] Fetching courses for student:', studentId);
            const data = await getCourses(studentId);
            console.log('[useCourses] API Response data:', data);
            if (onSuccess) {
                console.log('[useCourses] Calling onSuccess with hook response data');
                onSuccess(data);
            }
        } catch (error) {
            console.error('[useCourses] Error fetching courses:', error);
            if (onError) onError(error);
        }
    };

    /**
     *
     */
    const retry = () => {
        if (currentStudentId) {
            fetchCourses(currentStudentId);
        }
    };

    return { fetch: fetchCourses, retry };
}
