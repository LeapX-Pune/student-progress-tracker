/**
 * @fileoverview RememberMe — "Remember me" Checkbox — Part 3.
 *
 * A labelled checkbox sub-component rendered inside LoginForm.
 * When checked, auth tokens are persisted in localStorage (30-day expiry);
 * when unchecked, tokens are stored in sessionStorage only.
 *
 * @module components/auth/RememberMe
 */

import { createCheckbox } from '../ui/Checkbox.js';

/**
 * Creates the "Remember me" checkbox wrapper.
 *
 * @param {Object}  [opts={}]           - Configuration
 * @param {boolean} [opts.checked=false] - Initial checked state
 * @param {function} [opts.onChange]    - Called with the new boolean value
 *                                        when the checkbox changes
 * @returns {{ wrapper: HTMLDivElement, getValue: function(): boolean }}
 *
 * @example
 * const rememberMe = createRememberMe({
 *   onChange: checked => console.log('rememberMe:', checked),
 * });
 * formEl.append(rememberMe.wrapper);
 * const shouldRemember = rememberMe.getValue();
 */
export function createRememberMe({ checked = false, onChange } = {}) {
    const { wrapper, input } = createCheckbox({
        id: 'remember-me',
        name: 'rememberMe',
        label: 'Remember me',
        checked,
        className: 'remember-me',
        onChange: typeof onChange === 'function' ? e => onChange(e.target.checked) : undefined,
    });

    return {
        wrapper,
        /** @returns {boolean} Current checked state */
        getValue: () => input.checked,
    };
}
