/**
 * @fileoverview Custom hook for managing attendance data, with search, filter, and sorting.
 *
 * @module hooks/useAttendance
 */

import { getStudentAttendance } from '../services/studentApi.js';

/**
 * Creates the useAttendance hook.
 */
export function useAttendance() {
    const state = {
        data: null, // Full attendance object including summary and records
        filteredRecords: null,
        loading: true,
        error: null,
        searchQuery: '',
        filterBy: 'all', // 'all', 'excellent', 'good', 'warning'
        sortBy: 'highest', // 'highest', 'lowest', 'alphabetical'
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
        if (!state.data || !state.data.records) {
            state.filteredRecords = null;
            return;
        }

        let result = [...state.data.records];

        // 1. Search (by course name)
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            result = result.filter(
                a =>
                    (a.courseName && a.courseName.toLowerCase().includes(query)) ||
                    (a.courseId && a.courseId.toLowerCase().includes(query))
            );
        }

        // 2. Filter by status (Excellent, Good, Needs Improvement etc.)
        if (state.filterBy !== 'all') {
            result = result.filter(a => {
                if (state.filterBy === 'excellent') return a.status === 'Excellent';
                if (state.filterBy === 'good') return a.status === 'Good';
                if (state.filterBy === 'warning')
                    return a.status !== 'Excellent' && a.status !== 'Good';
                return true;
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            if (state.sortBy === 'highest') {
                return (b.percentage || 0) - (a.percentage || 0);
            }
            if (state.sortBy === 'lowest') {
                return (a.percentage || 0) - (b.percentage || 0);
            }
            if (state.sortBy === 'alphabetical') {
                return (a.courseName || '').localeCompare(b.courseName || '');
            }
            return 0;
        });

        state.filteredRecords = result;
    };

    /**
     *
     */
    const fetchAttendance = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const attendance = await getStudentAttendance();
            const isAtRisk = attendance.overallPercentage < 75;
            // Normalize: mock returns array as `courses`, hook reads `records`
            const records = attendance.records || attendance.courses || [];
            state.data = { ...attendance, records, isAtRisk };
            applyFiltersAndSort();
        } catch (err) {
            state.error = err.message || 'Failed to load attendance';
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
        fetchAttendance();
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
        fetchAttendance,
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
