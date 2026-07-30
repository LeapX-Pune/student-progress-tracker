const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable]';

/**
 *
 */
export function useFocusTrap(containerEl) {
    if (!containerEl) {
        return {
            /**
             *
             */
            destroy() {},
        };
    }

    /**
     *
     */
    function getFocusable() {
        return Array.from(containerEl.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
            el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
        );
    }

    /**
     *
     */
    function handleKeydown(e) {
        if (e.key !== 'Tab') return;
        const focusable = getFocusable();
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    document.addEventListener('keydown', handleKeydown);

    const firstFocusable = getFocusable()[0];
    if (firstFocusable) {
        firstFocusable.focus();
    }

    return {
        /**
         *
         */
        destroy() {
            document.removeEventListener('keydown', handleKeydown);
        },
    };
}

export default useFocusTrap;
