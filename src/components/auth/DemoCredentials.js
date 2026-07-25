/**
 * @fileoverview DemoCredentials — Demo Login Hint Block — Part 3.
 *
 * Renders a visually distinct info box showing the demo email and password.
 * Includes an optional "Use demo credentials" button that auto-fills the
 * connected login form inputs.
 *
 * @module components/auth/DemoCredentials
 */

import { AUTH_CONSTANTS } from '../../utils/constants.js';

/**
 * Creates the demo credentials hint block.
 *
 * @param {Object}  [opts={}]          - Configuration
 * @param {function} [opts.onFill]     - Called with `{ email, password }` when
 *                                       the user clicks "Use demo credentials".
 *                                       Attach a handler to auto-fill form inputs.
 * @returns {HTMLElement} The rendered hint block element
 *
 * @example
 * const hint = createDemoCredentials({
 *   onFill: ({ email, password }) => {
 *     emailInput.value = email;
 *     passwordInput.value = password;
 *   },
 * });
 * loginFormEl.append(hint);
 */
export function createDemoCredentials({ onFill } = {}) {
    const block = document.createElement('div');
    block.className =
        'p-3 bg-surface-container-low border border-outline-variant rounded-lg text-left';
    block.setAttribute('role', 'note');
    block.setAttribute('aria-label', 'Demo login credentials');

    const heading = document.createElement('p');
    heading.className = 'font-label-sm text-label-sm text-primary mb-2 font-medium';
    heading.textContent = 'Demo credentials';
    block.appendChild(heading);

    // Email row
    const emailRow = document.createElement('p');
    emailRow.className = 'font-body-sm text-body-sm text-on-surface-variant mb-1';
    emailRow.innerHTML = `<span>Email:</span>
      <code class="ml-1 font-mono text-on-surface bg-surface-container px-1 py-0.5 rounded">${AUTH_CONSTANTS.DEMO_EMAIL}</code>`;
    block.appendChild(emailRow);

    // Password row
    const passRow = document.createElement('p');
    passRow.className = 'font-body-sm text-body-sm text-on-surface-variant mb-2';
    passRow.innerHTML = `<span>Password:</span>
      <code class="ml-1 font-mono text-on-surface bg-surface-container px-1 py-0.5 rounded">${AUTH_CONSTANTS.DEMO_PASSWORD}</code>`;
    block.appendChild(passRow);

    // Auto-fill button (only rendered when a handler is provided)
    if (typeof onFill === 'function') {
        const fillBtn = document.createElement('button');
        fillBtn.type = 'button';
        fillBtn.className = 'text-xs font-medium text-primary hover:underline focus:outline-none';
        fillBtn.textContent = 'Use demo credentials';
        fillBtn.addEventListener('click', () => {
            onFill({ email: AUTH_CONSTANTS.DEMO_EMAIL, password: AUTH_CONSTANTS.DEMO_PASSWORD });
        });
        block.appendChild(fillBtn);
    }

    return block;
}
