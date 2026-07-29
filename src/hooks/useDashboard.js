import {
    getDashboardMetrics,
    updateNotificationStatus,
    updateActivityStatus,
} from '../services/dashboardApi.js';

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
    let cachedData = null;

    /**
     *
     */
    const fetchDashboard = async () => {
        if (onLoading) onLoading();

        try {
            const data = await getDashboardMetrics();
            cachedData = data;

            const insights = {
                bestSubject: 'N/A',
                needsImprovement: 'N/A',
                mostActiveCourse: 'N/A',
                leastActiveCourse: 'N/A',
            };

            if (data.courses && data.courses.length > 0) {
                const gradedCourses = data.courses.filter(c => typeof c.currentGrade === 'number');
                if (gradedCourses.length > 0) {
                    const sortedByGrade = [...gradedCourses].sort(
                        (a, b) => b.currentGrade - a.currentGrade
                    );
                    insights.bestSubject = sortedByGrade[0].title;
                    insights.needsImprovement = sortedByGrade[sortedByGrade.length - 1].title;
                }

                const accessedCourses = data.courses.filter(c => c.lastAccessedAt);
                if (accessedCourses.length > 0) {
                    const sortedByAccess = [...accessedCourses].sort(
                        (a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)
                    );
                    insights.mostActiveCourse = sortedByAccess[0].title;
                    insights.leastActiveCourse = sortedByAccess[sortedByAccess.length - 1].title;
                }
            }

            if (
                data.grades &&
                data.grades.weeklyProgress &&
                data.grades.weeklyProgress.length >= 2
            ) {
                const len = data.grades.weeklyProgress.length;
                const currentWeek = data.grades.weeklyProgress[len - 1].completed;
                const previousWeek = data.grades.weeklyProgress[len - 2].completed;
                if (previousWeek > 0) {
                    insights.weeklyImprovement = Math.round(
                        ((currentWeek - previousWeek) / previousWeek) * 100
                    );
                } else if (currentWeek > 0) {
                    insights.weeklyImprovement = 100;
                } else {
                    insights.weeklyImprovement = 0;
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

    /**
     *
     */
    const markNotificationRead = async id => {
        try {
            await updateNotificationStatus(id, true);
            if (cachedData && cachedData.notifications) {
                const notif = cachedData.notifications.find(n => n.id === id);
                if (notif) notif.isRead = true;
                if (onSuccess) onSuccess({ ...cachedData });
            }
        } catch (e) {
            console.error('Failed to mark notification read', e);
        }
    };

    /**
     *
     */
    const markActivityComplete = async id => {
        try {
            await updateActivityStatus(id, true);
            if (cachedData && cachedData.upcoming) {
                const act = cachedData.upcoming.find(a => a.id === id);
                if (act) act.status = 'completed';
                if (onSuccess) onSuccess({ ...cachedData });
            }
        } catch (e) {
            console.error('Failed to mark activity complete', e);
        }
    };

    return {
        fetch: fetchDashboard,
        retry,
        refresh: fetchDashboard,
        markNotificationRead,
        markActivityComplete,
    };
}
