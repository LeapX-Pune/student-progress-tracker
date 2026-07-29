import { getStudentGrades, getAcademicPerformance } from '../services/studentApi.js';

/**
 *
 */
export function useGrades({ onLoading, onSuccess, onError }) {
    /**
     *
     */
    const fetchGrades = async studentId => {
        if (onLoading) onLoading();
        try {
            const [grades, performance] = await Promise.all([
                getStudentGrades(studentId),
                getAcademicPerformance(studentId),
            ]);

            // grades dataset from mock.js contains a list of assignments and quizzes.
            // performance dataset contains the pre-calculated metrics.

            if (onSuccess) onSuccess({ grades, performance });
        } catch (error) {
            if (onError) onError(error);
        }
    };

    return { fetch: fetchGrades };
}
