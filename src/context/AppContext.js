const _subscribers = new Set();
let _state = {
    theme: 'light',
    sidebarCollapsed: false,
    coursesFilter: { search: '', sort: 'name', status: 'all' },
};

/**
 *
 */
function _notify(prevState) {
    _subscribers.forEach(fn => {
        try {
            fn(_state, prevState);
        } catch (e) {
            console.warn('[AppContext] Subscriber error:', e);
        }
    });
}

/**
 *
 */
export function getState() {
    return { ..._state };
}

/**
 *
 */
export function setState(partial) {
    const prev = { ..._state };
    _state = { ..._state, ...partial };
    _notify(prev);
}

/**
 *
 */
export function subscribe(fn) {
    _subscribers.add(fn);
    return () => _subscribers.delete(fn);
}

/**
 *
 */
export function getCoursesFilter() {
    return { ..._state.coursesFilter };
}

/**
 *
 */
export function setCoursesFilter(filter) {
    const prev = { ..._state };
    _state.coursesFilter = { ..._state.coursesFilter, ...filter };
    try {
        localStorage.setItem('app_courses_filter', JSON.stringify(_state.coursesFilter));
    } catch (e) {
        console.warn('[AppContext] Failed to persist filter:', e);
    }
    _notify(prev);
}

/**
 *
 */
export function initAppContext() {
    try {
        const saved = localStorage.getItem('app_courses_filter');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                _state.coursesFilter = { ..._state.coursesFilter, ...parsed };
            }
        }
    } catch (e) {
        console.warn('[AppContext] Failed to restore filter:', e);
    }
}

export default {
    getState,
    setState,
    subscribe,
    getCoursesFilter,
    setCoursesFilter,
    initAppContext,
};
