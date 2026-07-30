const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable]';

/**
 *
 */
export function getFocusableElements(containerEl) {
    return Array.from(containerEl.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
    );
}

/**
 *
 */
export function focusFirst(containerEl) {
    const focusable = getFocusableElements(containerEl);
    if (focusable.length > 0) {
        focusable[0].focus();
    }
}

/**
 *
 */
export function focusLast(containerEl) {
    const focusable = getFocusableElements(containerEl);
    if (focusable.length > 0) {
        focusable[focusable.length - 1].focus();
    }
}

/**
 *
 */
export function focusElement(el) {
    if (el && typeof el.focus === 'function') {
        el.focus();
        if (el.select && typeof el.select === 'function') {
            el.select();
        }
    }
}

/**
 *
 */
export function returnFocus(el) {
    if (el && typeof el.focus === 'function') {
        el.focus();
    }
}
