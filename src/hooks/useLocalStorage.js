/**
 *
 */
export function useLocalStorage(key, defaultValue) {
    /**
     *
     */
    function get() {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return defaultValue;
            return JSON.parse(raw);
        } catch (e) {
            console.warn(`[useLocalStorage] Failed to read "${key}":`, e);
            return defaultValue;
        }
    }

    /**
     *
     */
    function set(value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`[useLocalStorage] Failed to write "${key}":`, e);
        }
    }

    /**
     *
     */
    function remove() {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn(`[useLocalStorage] Failed to remove "${key}":`, e);
        }
    }

    return { get, set, remove };
}

export default useLocalStorage;
