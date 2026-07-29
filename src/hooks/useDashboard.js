import { getDashboardMetrics } from '../services/dashboardApi.js';

/**
 * ----------------------------------------------------
 * useDashboard Hook
 * ----------------------------------------------------
 *
 * Purpose:
 * Encapsulates the logic for fetching and managing dashboard data state.
 *
 * @param {Object} config - State callbacks
 * @param {Function} config.onLoading - Called when fetch starts
 * @param {Function} config.onSuccess - Called with dashboard data on success
 * @param {Function} config.onError - Called with error object on failure
 * @returns {Object} - Object containing fetch and retry methods
 */
export function useDashboard({ onLoading, onSuccess, onError }) {
    /**
     *
     */
    const fetchDashboard = async () => {
        if (onLoading) onLoading();

        try {
            const data = await getDashboardMetrics();
            if (onSuccess) onSuccess(data);
        } catch (error) {
            if (onError) onError(error);
        }
    };

    /**
     *
     */
    const retry = () => {
        fetchDashboard();
    };

    return { fetch: fetchDashboard, retry };
}
