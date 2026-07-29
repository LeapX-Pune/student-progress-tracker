/**
 * @fileoverview Custom hook for managing student profile data.
 *
 * @module hooks/useProfile
 */

import { getStudentProfile, updateStudentProfile } from '../services/studentApi.js';

/**
 * Creates the useProfile hook for fetching and updating profile.
 */
export function useProfile() {
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
    const fetchProfile = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const data = await getStudentProfile();
            state.data = data;
        } catch (err) {
            state.error = err.message || 'Failed to load profile';
        } finally {
            state.loading = false;
            notify();
        }
    };

    /**
     *
     */
    const updateProfile = async updates => {
        state.saving = true;
        state.error = null;
        notify();

        try {
            const updated = await updateStudentProfile(updates);
            state.data = updated;
            return { success: true };
        } catch (err) {
            state.error = err.message || 'Failed to update profile';
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
        fetchProfile,
        updateProfile,
        /**
         *
         */
        getState: () => ({ ...state }),
    };
}
