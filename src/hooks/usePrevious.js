/**
 *
 */
export function usePrevious(value) {
    let _current = value;
    let _previous = undefined;

    /**
     *
     */
    function getCurrent() {
        return _current;
    }

    /**
     *
     */
    function getPrevious() {
        return _previous;
    }

    /**
     *
     */
    function update(newValue) {
        _previous = _current;
        _current = newValue;
    }

    return {
        getCurrent,
        getPrevious,
        update,
    };
}

export default usePrevious;
