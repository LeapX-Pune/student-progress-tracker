import { getStudentAttendance } from '../services/studentApi.js';

/**
 *
 */
export function useAttendance({ onLoading, onSuccess, onError }) {
    /**
     *
     */
    const fetchAttendance = async studentId => {
        if (onLoading) onLoading();
        try {
            const attendance = await getStudentAttendance(studentId);

            // Derive some analytics
            const isAtRisk = attendance.overallPercentage < 75;

            if (onSuccess) onSuccess({ ...attendance, isAtRisk });
        } catch (error) {
            if (onError) onError(error);
        }
    };

    return { fetch: fetchAttendance };
}
