/**
 * @fileoverview useApi — Reactive API Hook
 *
 * Provides a subscription-based interface for making API calls in
 * vanilla-JS components, managing loading, error, and data states automatically.
 */

/**
 * Creates a reactive API hook for a specific fetch function.
 * @param {Function} apiFunc - The API function to execute.
 * @returns {Object} The API hook object with subscribe, execute, reset, and getState methods.
 */
export function useApi(apiFunc) {
    let data = null;
    let error = null;
    let isLoading = false;
    let subscribers = [];
    let abortController = null;

    /**
     * Cancels any ongoing request.
     */
    const cancel = () => {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }
    };

    /**
     * Notifies all subscribers of the current state.
     */
    const notify = () => {
        const state = { data, error, isLoading };
        subscribers.forEach(fn => fn(state));
    };

    /**
     * Executes the API function with the given arguments.
     * @param {...any} args - Arguments to pass to the api function.
     * @returns {Promise<{data: any, error: any}>} The result of the API call.
     */
    const execute = async (...args) => {
        // Cancel previous request if still ongoing
        cancel();

        abortController = new AbortController();
        const signal = abortController.signal;

        isLoading = true;
        error = null;
        notify();

        try {
            // Pass the signal as part of an options object to the apiFunc
            // Assumes the underlying API function supports receiving options.
            data = await apiFunc(...args, { signal });
        } catch (err) {
            if (err.name === 'AbortError' || err.message === 'Request cancelled') {
                return { data, error }; // Ignore cancellation errors
            }
            error = err;
        } finally {
            isLoading = false;
            notify();
        }

        return { data, error };
    };

    /**
     * Resets the hook state to initial values.
     */
    const reset = () => {
        data = null;
        error = null;
        isLoading = false;
        notify();
    };

    return {
        /**
         * Subscribes to state changes.
         * @param {Function} fn - The callback function.
         * @returns {Function} An unsubscribe function.
         */
        subscribe: fn => {
            subscribers.push(fn);
            fn({ data, error, isLoading });
            return () => {
                subscribers = subscribers.filter(s => s !== fn);
                if (subscribers.length === 0) {
                    cancel(); // Auto-cancel on unmount
                }
            };
        },
        execute,
        cancel,
        reset,
        /**
         * Gets the current state snapshot.
         * @returns {Object} The current state snapshot.
         */
        getState: () => ({ data, error, isLoading }),
    };
}

export default useApi;
