/**
 * @type {WeakMap<MediaQueryList, Set<Function>>}
 */
const _listeners = new WeakMap();

/**
 * Reactive hook for CSS media query changes.
 * @param {string} query - A CSS media query string (e.g. "(max-width: 768px)")
 * @returns {{ matches: boolean, subscribe: (callback: (matches: boolean) => void) => () => void }}
 */
export function useMediaQuery(query) {
    const mql = window.matchMedia(query);
    if (!_listeners.has(mql)) {
        _listeners.set(mql, new Set());
    }
    const listeners = _listeners.get(mql);

    return {
        /**
         * @returns {boolean}
         */
        get matches() {
            return mql.matches;
        },
        /**
         * Subscribe to media query changes.
         * @param {(matches: boolean) => void} callback
         * @returns {() => void} Unsubscribe function
         */
        subscribe(callback) {
            listeners.add(callback);

            /**
             * @returns {void}
             */
            const handler = function () {
                callback(mql.matches);
            };

            mql.addEventListener('change', handler);
            return function () {
                listeners.delete(callback);
                mql.removeEventListener('change', handler);
            };
        },
    };
}
