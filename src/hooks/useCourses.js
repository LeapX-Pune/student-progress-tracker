/**
 * @fileoverview Custom hook for managing course data, with search, filter, and sorting.
 *
 * @module hooks/useCourses
 */

import { getCourses } from '../services/api.js';
import {
    getCourseDetails,
    getCourseModules,
    getCourseTimeline,
    getCourseMetrics,
} from '../services/courseApi.js';

/**
 * Creates the useCourses hook.
 */
export function useCourses() {
    const state = {
        data: null,
        filteredData: null,
        loading: true,
        error: null,
        searchQuery: '',
        filterBy: 'all', // 'all', 'current', 'completed', 'in_progress'
        sortBy: 'alphabetical', // 'alphabetical', 'progress', 'recent'
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
        if (!state.data) {
            state.filteredData = null;
            return;
        }

        let result = [...state.data];

        // 1. Search
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            result = result.filter(
                c => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
            );
        }

        // 2. Filter
        if (state.filterBy !== 'all') {
            result = result.filter(c => {
                if (state.filterBy === 'current')
                    return c.status === 'in_progress' || c.status === 'active';
                if (state.filterBy === 'completed') return c.status === 'completed';
                if (state.filterBy === 'in_progress') return c.status === 'in_progress';
                return true;
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            if (state.sortBy === 'alphabetical') {
                return a.name.localeCompare(b.name);
            }
            if (state.sortBy === 'progress') {
                return (b.progress || 0) - (a.progress || 0);
            }
            if (state.sortBy === 'recent') {
                // Assuming lastAccessed exists or fallback to alphabetical
                const timeA = a.lastAccessed ? new Date(a.lastAccessed).getTime() : 0;
                const timeB = b.lastAccessed ? new Date(b.lastAccessed).getTime() : 0;
                return timeB - timeA || a.name.localeCompare(b.name);
            }
            return 0;
        });

        state.filteredData = result;
    };

    /**
     *
     */
    const fetchCourses = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const data = await getCourses();
            state.data = data;
            applyFiltersAndSort();
        } catch (err) {
            state.error = err.message || 'Failed to load courses';
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
        }, 300); // Debounce
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
        fetchCourses();
    };

    /**
     *
     */
    const fetchCourseDetails = async courseId => {
        state.loading = true;
        state.error = null;
        notify();
        try {
            const [details, modules, timeline, metrics] = await Promise.all([
                getCourseDetails(courseId),
                getCourseModules(courseId),
                getCourseTimeline(courseId),
                getCourseMetrics(courseId),
            ]);

            const fullCourseData = {
                ...details,
                modules,
                timeline,
                metrics,
            };

            state.data = [fullCourseData];
            state.filteredData = [fullCourseData];
        } catch (err) {
            state.error = err.message || 'Failed to load course details';
        } finally {
            state.loading = false;
            notify();
        }
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
        fetchCourses,
        fetchCourseDetails,
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
