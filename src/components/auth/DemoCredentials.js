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
        'p-4.5 sm:p-5 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-left shadow-xs';
    block.setAttribute('role', 'note');
    block.setAttribute('aria-label', 'Demo login credentials');

    const heading = document.createElement('p');
    heading.className =
        'text-xs text-[#334155] mb-2.5 font-bold uppercase tracking-wider flex items-center gap-1.5';
    heading.innerHTML =
        '<span class="material-symbols-outlined text-[16px] text-primary">info</span> <span>Demo credentials</span>';
    block.appendChild(heading);

    // Email row
    const emailRow = document.createElement('p');
    emailRow.className = 'text-[12px] leading-[1.5] text-[#475569] mb-1.5 flex items-center';
    emailRow.innerHTML = `<span class="w-20 font-medium">Email:</span>
      <code class="font-mono text-[#0F172A] bg-white border border-[#CBD5E1] px-2 py-0.5 rounded text-[12px] shadow-xs">${AUTH_CONSTANTS.DEMO_EMAIL}</code>`;
    block.appendChild(emailRow);

    // Password row
    const passRow = document.createElement('p');
    passRow.className = 'text-[12px] leading-[1.5] text-[#475569] mb-3 flex items-center';
    passRow.innerHTML = `<span class="w-20 font-medium">Password:</span>
      <code class="font-mono text-[#0F172A] bg-white border border-[#CBD5E1] px-2 py-0.5 rounded text-[12px] shadow-xs">${AUTH_CONSTANTS.DEMO_PASSWORD}</code>`;
    block.appendChild(passRow);

    // Auto-fill button (only rendered when a handler is provided)
    if (typeof onFill === 'function') {
        const fillBtn = document.createElement('button');
        fillBtn.type = 'button';
        fillBtn.className =
            'text-[12px] font-semibold text-primary hover:underline inline-flex items-center gap-1 focus:outline-none';
        fillBtn.innerHTML =
            '<span>Use demo credentials</span> <span class="material-symbols-outlined text-[14px]">arrow_forward</span>';
        fillBtn.addEventListener('click', () => {
            onFill({ email: AUTH_CONSTANTS.DEMO_EMAIL, password: AUTH_CONSTANTS.DEMO_PASSWORD });
        });
        block.appendChild(fillBtn);
    }

    return block;
}
