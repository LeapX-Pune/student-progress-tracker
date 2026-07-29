/**
 * @fileoverview Custom hook for managing student notifications data.
 *
 * @module hooks/useNotifications
 */

import {
    getStudentNotifications,
    markAllNotificationsRead,
    updateStudentNotification,
} from '../services/studentApi.js';

/**
 * Creates the useNotifications hook for fetching and updating notifications.
 */
export function useNotifications() {
    const state = {
        data: null,
        filteredData: null,
        loading: true,
        error: null,
        searchQuery: '',
        filterBy: 'all', // 'all', 'read', 'unread', 'system', 'course'
        sortBy: 'newest', // 'newest', 'oldest', 'priority'
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

        // 1. Search (by title or message)
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            result = result.filter(
                n =>
                    (n.title && n.title.toLowerCase().includes(query)) ||
                    (n.message && n.message.toLowerCase().includes(query))
            );
        }

        // 2. Filter
        if (state.filterBy !== 'all') {
            result = result.filter(n => {
                if (state.filterBy === 'read') return n.isRead === true;
                if (state.filterBy === 'unread') return n.isRead === false;
                if (state.filterBy === 'system') return n.type === 'system';
                if (state.filterBy === 'course') return n.type === 'course';
                return true;
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;

            if (state.sortBy === 'newest') {
                return timeB - timeA;
            }
            if (state.sortBy === 'oldest') {
                return timeA - timeB;
            }
            if (state.sortBy === 'priority') {
                // Assuming priority fields or fallback to newest
                const pA = a.priority === 'high' ? 2 : a.priority === 'medium' ? 1 : 0;
                const pB = b.priority === 'high' ? 2 : b.priority === 'medium' ? 1 : 0;
                if (pA !== pB) return pB - pA;
                return timeB - timeA; // tie breaker
            }
            return 0;
        });

        state.filteredData = result;
    };

    /**
     *
     */
    const fetchNotifications = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const data = await getStudentNotifications();
            state.data = data;
            applyFiltersAndSort();
        } catch (err) {
            state.error = err.message || 'Failed to load notifications';
        } finally {
            state.loading = false;
            notify();
        }
    };

    /**
     *
     */
    const markAsRead = async notificationId => {
        try {
            await updateStudentNotification(notificationId, { isRead: true });
            if (state.data) {
                const index = state.data.findIndex(n => n.id === notificationId);
                if (index !== -1) {
                    state.data[index].isRead = true;
                    applyFiltersAndSort(); // re-apply filters in case they are filtered by unread
                    notify();
                }
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    /**
     *
     */
    const markAllRead = async () => {
        try {
            await markAllNotificationsRead();
            if (state.data) {
                state.data.forEach(n => (n.isRead = true));
                applyFiltersAndSort();
                notify();
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
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

    return {
        /**
         *
         */
        subscribe: listener => {
            listeners.add(listener);
            listener({ ...state }); // Immediate initial state
            return () => listeners.delete(listener);
        },
        fetchNotifications,
        markAsRead,
        markAllRead,
        setSearch,
        setFilter,
        setSort,
        /**
         *
         */
        getState: () => ({ ...state }),
    };
}
