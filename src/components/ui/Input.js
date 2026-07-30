/**
 * @fileoverview Input — Accessible Text Input Component — Part 3 / Part 10.
 *
 * Creates a labelled `<input>` element with inline error messaging and an
 * optional show/hide password toggle for `type="password"` inputs.
 *
 * @module components/ui/Input
 */

// ─── SVG icons ────────────────────────────────────────────────────────────────

const EYE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
  viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`;

const EYE_OFF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
  viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
  <line x1="2" x2="22" y1="2" y2="22"/>
</svg>`;

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a labelled input field with optional inline error and password toggle.
 *
 * Returns a wrapper `<div>` containing the label, input, and (when applicable)
 * the error message element.  The error element is always rendered (but empty
 * when there is no error) so DOM layout stays stable — no layout shift when
 * an error appears.
 *
 * @param {Object}   opts               - Input configuration
 * @param {string}   opts.id            - Element id (links label → input)
 * @param {string}   opts.name          - Input name attribute
 * @param {string}   [opts.type='text'] - Input type attribute
 * @param {string}   [opts.label]       - Visible label text
 * @param {string}   [opts.value='']    - Initial value
 * @param {string}   [opts.placeholder=''] - Placeholder text
 * @param {string}   [opts.error]       - Inline error message (sets aria-invalid)
 * @param {boolean}  [opts.required=false] - Marks field as required
 * @param {boolean}  [opts.disabled=false] - Disables the input
 * @param {string}   [opts.autocomplete]   - autocomplete attribute value
 * @param {function} [opts.onChange]    - input event handler (receives the Event)
 * @returns {{ wrapper: HTMLDivElement, input: HTMLInputElement, setError: function }}
 *   Returns the wrapper element, direct input reference, and an error updater
 *
 * @example
 * const { wrapper, input, setError } = createInput({
 *   id: 'email',
 *   name: 'email',
 *   type: 'email',
 *   label: 'Email address',
 *   required: true,
 *   onChange: e => validateEmailField(e.target.value),
 * });
 * formEl.append(wrapper);
 * setError('Enter a valid email address'); // shows inline error
 * setError(null);                          // clears it
 */
export function createInput({
    id,
    name,
    type = 'text',
    label,
    value = '',
    placeholder = '',
    error,
    required = false,
    disabled = false,
    autocomplete,
    onChange,
} = {}) {
    const isPassword = type === 'password';
    const errorId = `${id}-error`;

    // ── Wrapper ───────────────────────────────────────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'input-field';

    // ── Label ─────────────────────────────────────────────────────────────────
    if (label) {
        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.className = 'input-field__label';
        labelEl.textContent = label;
        if (required) {
            const req = document.createElement('span');
            req.setAttribute('aria-hidden', 'true');
            req.className = 'input-field__required';
            req.textContent = ' *';
            labelEl.appendChild(req);
        }
        wrapper.appendChild(labelEl);
    }

    // ── Input row (input + optional toggle button) ────────────────────────────
    const inputRow = document.createElement('div');
    inputRow.className = `input-field__row${isPassword ? ' input-field__row--password' : ''}`;

    const input = document.createElement('input');
    input.id = id;
    input.name = name;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    input.required = required;
    input.disabled = disabled;
    input.className = `input-field__input${error ? ' input-field__input--error' : ''}`;
    if (autocomplete) input.setAttribute('autocomplete', autocomplete);
    if (error) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorId);
    }
    if (typeof onChange === 'function') {
        input.addEventListener('input', onChange);
    }
    inputRow.appendChild(input);

    // ── Show/hide toggle (password only) ──────────────────────────────────────
    if (isPassword) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'input-field__toggle';
        toggleBtn.setAttribute('aria-label', 'Show password');
        toggleBtn.setAttribute('aria-pressed', 'false');
        toggleBtn.innerHTML = EYE_ICON;

        toggleBtn.addEventListener('click', () => {
            const isShowing = input.type === 'text';
            input.type = isShowing ? 'password' : 'text';
            toggleBtn.setAttribute('aria-pressed', String(!isShowing));
            toggleBtn.setAttribute('aria-label', isShowing ? 'Show password' : 'Hide password');
            toggleBtn.innerHTML = isShowing ? EYE_ICON : EYE_OFF_ICON;
        });

        inputRow.appendChild(toggleBtn);
    }

    wrapper.appendChild(inputRow);

    // ── Error message (always rendered, empty when no error) ──────────────────
    const errorEl = document.createElement('span');
    errorEl.id = errorId;
    errorEl.className = 'input-field__error';
    errorEl.setAttribute('role', 'alert');
    errorEl.setAttribute('aria-live', 'polite');
    errorEl.textContent = error ?? '';
    wrapper.appendChild(errorEl);

    // ── Error updater helper ──────────────────────────────────────────────────

    /**
     * Updates the inline error message and aria-invalid state.
     *
     * @param {string|null} message - Error text, or null to clear
     */
    function setError(message) {
        errorEl.textContent = message ?? '';
        if (message) {
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorId);
            input.classList.add('input-field__input--error');
        } else {
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
            input.classList.remove('input-field__input--error');
        }
    }

    return { wrapper, input, setError };
}
