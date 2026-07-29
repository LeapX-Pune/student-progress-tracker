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

            // Generate Academic Insights
            const insights = {
                bestSubject: 'N/A',
                needsImprovement: 'N/A',
            };

            if (data.courses && data.courses.length > 0) {
                const validCourses = data.courses.filter(c => typeof c.currentGrade === 'number');
                if (validCourses.length > 0) {
                    const sorted = [...validCourses].sort(
                        (a, b) => b.currentGrade - a.currentGrade
                    );
                    insights.bestSubject = sorted[0].title;
                    insights.needsImprovement = sorted[sorted.length - 1].title;
                }
            }

            // Append insights to data payload
            const enrichedData = { ...data, insights };

            if (onSuccess) onSuccess(enrichedData);
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
