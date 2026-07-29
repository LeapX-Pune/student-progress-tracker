/**
 * @fileoverview Checkbox — Accessible Checkbox Component — Part 3 / Part 10.
 *
 * Creates a native `<input type="checkbox">` with a properly associated
 * `<label>`.  Used by the RememberMe component.
 *
 * @module components/ui/Checkbox
 */

/**
 * Creates an accessible labelled checkbox element.
 *
 * @param {Object}   opts              - Checkbox configuration
 * @param {string}   opts.id          - Element id (links label → input)
 * @param {string}   opts.name        - Input name attribute
 * @param {string}   opts.label       - Visible label text
 * @param {boolean}  [opts.checked=false]   - Initial checked state
 * @param {boolean}  [opts.disabled=false]  - Disables the checkbox
 * @param {string}   [opts.className='']   - Extra CSS classes on the wrapper
 * @param {function} [opts.onChange]  - change event handler (receives Event)
 * @returns {{ wrapper: HTMLDivElement, input: HTMLInputElement }}
 *
 * @example
 * const { wrapper, input } = createCheckbox({
 *   id: 'remember-me',
 *   name: 'rememberMe',
 *   label: 'Remember me',
 *   checked: false,
 *   onChange: e => console.log('checked:', e.target.checked),
 * });
 * formEl.append(wrapper);
 * // Read value:  input.checked
 */
export function createCheckbox({
    id,
    name,
    label,
    checked = false,
    disabled = false,
    className = '',
    onChange,
} = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = `flex items-center gap-2 my-3${className ? ` ${className}` : ''}`;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.name = name;
    input.checked = checked;
    input.disabled = disabled;
    input.setAttribute('width', '16');
    input.setAttribute('height', '16');
    input.style.cssText =
        'width: 16px !important; height: 16px !important; min-width: 16px !important; min-height: 16px !important; max-width: 16px !important; max-height: 16px !important; cursor: pointer; margin: 0; shrink: 0;';
    input.className =
        'w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary focus:ring-2 cursor-pointer shrink-0';

    if (typeof onChange === 'function') {
        input.addEventListener('change', onChange);
    }

    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.className =
        'font-label-sm text-xs font-medium text-on-surface select-none cursor-pointer leading-none';
    labelEl.textContent = label ?? '';

    wrapper.appendChild(input);
    wrapper.appendChild(labelEl);

    return { wrapper, input };
}
