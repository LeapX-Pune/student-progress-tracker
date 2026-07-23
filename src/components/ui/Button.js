/**
 * @fileoverview Button — Generic Accessible Button Component — Part 3 / Part 10.
 *
 * Creates a `<button>` element with support for variants, sizes, loading state,
 * and ARIA attributes.  The loading state shows an inline spinner and prevents
 * interaction without changing the button's dimensions (layout-shift safe).
 *
 * @module components/ui/Button
 */

import { createSpinner } from './Spinner.js';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Valid visual variants. */
const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];

/** Valid size tokens. */
const SIZES = ['sm', 'md', 'lg'];

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates and returns an accessible `<button>` element.
 *
 * @param {Object}   opts                     - Button configuration
 * @param {string}   opts.label               - Visible button text
 * @param {string}   [opts.id]                - Optional DOM id attribute
 * @param {string}   [opts.variant='primary'] - Visual style variant
 * @param {string}   [opts.size='md']         - Size token: 'sm' | 'md' | 'lg'
 * @param {string}   [opts.type='button']     - HTML button type attribute
 * @param {boolean}  [opts.disabled=false]    - Disables the button
 * @param {boolean}  [opts.loading=false]     - Shows spinner; disables interactions
 * @param {string}   [opts.className='']      - Extra CSS classes
 * @param {function} [opts.onClick]           - Click event handler
 * @returns {HTMLButtonElement}
 *
 * @example
 * const btn = createButton({
 *   label: 'Sign In',
 *   variant: 'primary',
 *   loading: true,
 *   onClick: handleLogin,
 * });
 * formEl.append(btn);
 */
export function createButton({
    label,
    id,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    className = '',
    onClick,
} = {}) {
    const resolvedVariant = VARIANTS.includes(variant) ? variant : 'primary';
    const resolvedSize = SIZES.includes(size) ? size : 'md';

    const btn = document.createElement('button');
    btn.type = type;

    if (id) btn.id = id;

    const classes = [
        'btn',
        `btn--${resolvedVariant}`,
        `btn--${resolvedSize}`,
        ...(loading ? ['btn--loading'] : []),
        ...(className ? [className] : []),
    ];
    btn.className = classes.join(' ');

    // Disable the button when explicitly disabled or while loading.
    const isDisabled = disabled || loading;
    btn.disabled = isDisabled;
    btn.setAttribute('aria-disabled', String(isDisabled));
    if (loading) btn.setAttribute('aria-busy', 'true');

    // Label text — always present (screen readers will read it).
    const labelSpan = document.createElement('span');
    labelSpan.className = 'btn__label';
    labelSpan.textContent = label ?? '';
    btn.appendChild(labelSpan);

    // Spinner (hidden when not loading, visible when loading).
    if (loading) {
        const spinner = createSpinner({ size: resolvedSize === 'lg' ? 'md' : 'sm' });
        spinner.setAttribute('aria-hidden', 'true'); // main aria-busy on button is enough
        btn.appendChild(spinner);
    }

    if (typeof onClick === 'function' && !isDisabled) {
        btn.addEventListener('click', onClick);
    }

    return btn;
}

/**
 * Updates a button's loading state in-place without recreating the element.
 * Useful when the same button element needs to toggle loading during an async op.
 *
 * @param {HTMLButtonElement} btn       - The button element to update
 * @param {boolean}           isLoading - New loading state
 * @returns {void}
 */
export function setButtonLoading(btn, isLoading) {
    if (!btn || !(btn instanceof HTMLButtonElement)) return;

    btn.disabled = isLoading;
    btn.setAttribute('aria-disabled', String(isLoading));

    if (isLoading) {
        btn.setAttribute('aria-busy', 'true');
        btn.classList.add('btn--loading');

        if (!btn.querySelector('.spinner')) {
            const spinner = createSpinner({ size: 'sm' });
            spinner.setAttribute('aria-hidden', 'true');
            btn.appendChild(spinner);
        }
    } else {
        btn.removeAttribute('aria-busy');
        btn.classList.remove('btn--loading');
        btn.querySelector('.spinner')?.remove();
    }
}
