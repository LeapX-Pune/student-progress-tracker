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
        loading: true,
        error: null,
    };

    const listeners = new Set();

    /**
     *
     */
    const notify = () => {
        listeners.forEach(listener => listener({ ...state }));
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
                notify();
            }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
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
        /**
         *
         */
        getState: () => ({ ...state }),
    };
}
