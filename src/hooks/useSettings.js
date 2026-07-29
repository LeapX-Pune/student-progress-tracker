/**
 * @fileoverview Custom hook for managing student settings data.
 *
 * @module hooks/useSettings
 */

import {
    getStudentSettings,
    updateStudentSettings,
    updateStudentPreferences,
} from '../services/studentApi.js';

/**
 * Creates the useSettings hook for fetching and updating settings.
 */
export function useSettings() {
    const state = {
        data: null,
        loading: true,
        error: null,
        saving: false,
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
    const fetchSettings = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const data = await getStudentSettings();
            state.data = data;
        } catch (err) {
            state.error = err.message || 'Failed to load settings';
        } finally {
            state.loading = false;
            notify();
        }
    };

    /**
     *
     */
    const updateSettings = async updates => {
        state.saving = true;
        state.error = null;
        notify();

        try {
            const updated = await updateStudentSettings(updates);
            state.data = updated;
            return { success: true };
        } catch (err) {
            state.error = err.message || 'Failed to update settings';
            return { success: false, error: state.error };
        } finally {
            state.saving = false;
            notify();
        }
    };

    /**
     *
     */
    const updatePreferences = async updates => {
        state.saving = true;
        state.error = null;
        notify();

        try {
            const updated = await updateStudentPreferences(updates);
            state.data = updated;
            return { success: true };
        } catch (err) {
            state.error = err.message || 'Failed to update preferences';
            return { success: false, error: state.error };
        } finally {
            state.saving = false;
            notify();
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
        fetchSettings,
        updateSettings,
        updatePreferences,
        /**
         *
         */
        getState: () => ({ ...state }),
    };
}
