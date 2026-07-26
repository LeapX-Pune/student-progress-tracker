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
 * @param {Object}  [opts={}]               - Configuration
 * @param {string}  [opts.initialRole='student'] - Initially selected role ('student' | 'teacher')
 * @param {function} [opts.onFill]          - Called with `{ email, password, role }` when
 *                                            the user clicks "Use demo credentials".
 *                                            Attach a handler to auto-fill form inputs.
 * @returns {HTMLElement & { setRole: function }} The rendered hint block element
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
export function createDemoCredentials({ initialRole = 'student', onFill } = {}) {
    let currentRole = initialRole;

    const block = document.createElement('div');
    block.className =
        'p-4.5 sm:p-5 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-left shadow-xs';
    block.setAttribute('role', 'note');
    block.setAttribute('aria-label', 'Demo login credentials');

    let isOpen = window.innerWidth >= 640;

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className =
        'w-full text-xs text-[#334155] font-bold uppercase tracking-wider flex items-center gap-1.5 focus:outline-none';
    toggleBtn.innerHTML =
        '<span class="material-symbols-outlined text-[16px] text-primary">info</span> <span id="demo-title">Demo credentials</span> <span class="material-symbols-outlined text-[16px] ml-auto transition-transform duration-200" id="demo-chevron">expand_more</span>';
    block.appendChild(toggleBtn);

    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'demo-content';

    const emailRow = document.createElement('p');
    emailRow.className = 'text-[12px] leading-[1.5] text-[#475569] mb-1.5 flex items-center';

    const passRow = document.createElement('p');
    passRow.className = 'text-[12px] leading-[1.5] text-[#475569] mb-3 flex items-center';

    /**
     *
     */
    function getCredentialsForRole(role) {
        if (role === 'teacher' && AUTH_CONSTANTS.DEMO_TEACHER) {
            return AUTH_CONSTANTS.DEMO_TEACHER;
        }
        return (
            AUTH_CONSTANTS.DEMO_STUDENT || {
                email: AUTH_CONSTANTS.DEMO_EMAIL,
                password: AUTH_CONSTANTS.DEMO_PASSWORD,
            }
        );
    }

    /**
     *
     */
    function renderRole(role) {
        currentRole = role;
        const creds = getCredentialsForRole(role);
        const roleName = role.charAt(0).toUpperCase() + role.slice(1);
        const titleSpan = toggleBtn.querySelector('#demo-title');
        if (titleSpan) titleSpan.textContent = `Demo ${roleName} credentials`;

        emailRow.innerHTML = `<span class="w-20 font-medium">Email:</span>
      <code class="font-mono text-[#0F172A] bg-white border border-[#CBD5E1] px-2 py-0.5 rounded text-[12px] shadow-xs">${creds.email}</code>`;

        passRow.innerHTML = `<span class="w-20 font-medium">Password:</span>
      <code class="font-mono text-[#0F172A] bg-white border border-[#CBD5E1] px-2 py-0.5 rounded text-[12px] shadow-xs">${creds.password}</code>`;
    }

    renderRole(initialRole);

    contentWrapper.appendChild(emailRow);
    contentWrapper.appendChild(passRow);

    if (typeof onFill === 'function') {
        const fillBtn = document.createElement('button');
        fillBtn.type = 'button';
        fillBtn.className =
            'text-[12px] font-semibold text-primary hover:underline inline-flex items-center gap-1 focus:outline-none';
        fillBtn.innerHTML =
            '<span>Use demo credentials</span> <span class="material-symbols-outlined text-[14px]">arrow_forward</span>';
        fillBtn.addEventListener('click', () => {
            const creds = getCredentialsForRole(currentRole);
            onFill({ email: creds.email, password: creds.password, role: currentRole });
        });
        contentWrapper.appendChild(fillBtn);
    }

    block.appendChild(contentWrapper);

    /**
     *
     */
    function applyState() {
        contentWrapper.style.display = isOpen ? '' : 'none';
        const chevron = block.querySelector('#demo-chevron');
        if (chevron) chevron.style.transform = isOpen ? 'rotate(180deg)' : '';
    }

    applyState();

    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        applyState();
    });

    block.setRole = renderRole;
    return block;
}
