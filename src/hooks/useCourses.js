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
    /**
     *
     */
    const fetchCourses = async () => {
        if (onLoading) onLoading();

        try {
            const data = await getCourses();
            if (onSuccess) onSuccess(data);
        } catch (error) {
            if (onError) onError(error);
        }
    };

    /**
     *
     */
    const retry = () => {
        fetchCourses();
    };

    return { fetch: fetchCourses, retry };
}
