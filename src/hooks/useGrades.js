/**
 * @fileoverview Custom hook for managing grades data, with search, filter, and sorting.
 *
 * @module hooks/useGrades
 */

import { getStudentGrades, getAcademicPerformance } from '../services/studentApi.js';

/**
 * Creates the useGrades hook.
 */
export function useGrades() {
    const state = {
        data: null, // { grades: [], performance: {} }
        filteredGrades: null,
        loading: true,
        error: null,
        searchQuery: '',
        filterBy: 'all', // 'all', 'current_semester'
        sortBy: 'highest', // 'highest', 'lowest', 'date'
    };

    const listeners = new Set();
    let searchTimeout = null;

    /**
     *
     */
    const notify = () => {
        listeners.forEach(listener => listener({ ...state }));
    };

    /**
     *
     */
    const applyFiltersAndSort = () => {
        if (!state.data || !state.data.grades) {
            state.filteredGrades = null;
            return;
        }

        let result = [...state.data.grades];

        // 1. Search (by course name or assignment title)
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            result = result.filter(
                g =>
                    (g.courseName && g.courseName.toLowerCase().includes(query)) ||
                    (g.title && g.title.toLowerCase().includes(query)) ||
                    (g.courseCode && g.courseCode.toLowerCase().includes(query))
            );
        }

        // 2. Filter (simplistic filter based on what data we have)
        if (state.filterBy !== 'all') {
            result = result.filter(g => {
                if (state.filterBy === 'current_semester') return g.semester === 6 || g.isCurrent; // Adjust logic to match actual mock structure if needed
                return true;
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            if (state.sortBy === 'highest') {
                return (b.score || 0) - (a.score || 0);
            }
            if (state.sortBy === 'lowest') {
                return (a.score || 0) - (b.score || 0);
            }
            if (state.sortBy === 'date') {
                const timeA = a.date ? new Date(a.date).getTime() : 0;
                const timeB = b.date ? new Date(b.date).getTime() : 0;
                return timeB - timeA;
            }
            return 0;
        });

        state.filteredGrades = result;
    };

    /**
     *
     */
    const fetchGrades = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const [gradesPayload, performance] = await Promise.all([
                getStudentGrades(), // Updated API to use current user
                getAcademicPerformance(),
            ]);

            // Normalize: mock returns grades as {quizScores, gradeDistribution, weeklyProgress}
            // The UI expects a flat array of grade items with .score/.title/.courseName
            let grades;
            if (Array.isArray(gradesPayload)) {
                grades = gradesPayload;
            } else if (gradesPayload && Array.isArray(gradesPayload.quizScores)) {
                grades = gradesPayload.quizScores.map((q, i) => ({
                    title: q.label || `Quiz ${i + 1}`,
                    courseName: 'General Assessment',
                    courseCode: '',
                    type: 'Quiz',
                    score: q.maxScore ? Math.round((q.score / q.maxScore) * 100) : q.score,
                    date: null,
                }));
            } else {
                grades = [];
            }

            state.data = { grades, performance };
            applyFiltersAndSort();
        } catch (err) {
            state.error = err.message || 'Failed to load grades';
        } finally {
            state.loading = false;
            notify();
        }
    };

    /**
     *
     */
    const setSearch = query => {
        state.searchQuery = query;
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyFiltersAndSort();
            notify();
        }, 300);
    };

    /**
     *
     */
    const setFilter = filter => {
        state.filterBy = filter;
        applyFiltersAndSort();
        notify();
    };

    /**
     *
     */
    const setSort = sort => {
        state.sortBy = sort;
        applyFiltersAndSort();
        notify();
    };

    /**
     *
     */
    const retry = () => {
        fetchGrades();
    };

    return {
        /**
         *
         */
        subscribe: listener => {
            listeners.add(listener);
            listener({ ...state }); // Immediate state
            return () => listeners.delete(listener);
        },
        fetchGrades,
        retry,
        setSearch,
        setFilter,
        setSort,
        /**
         *
         */
        getState: () => ({ ...state }),
    };
}
