import { ROLES } from '../../config/rbac.js';

/**
 * @fileoverview RoleSelector — Tabbed role selector component (Student vs Teacher).
 *
 * Renders the role selection tabs and updates ARIA accessibility attributes
 * (`aria-selected`). Integrates seamlessly into the Login UI form.
 *
 * @module components/auth/RoleSelector
 */

/**
 * Creates the role selector element and attaches event listeners.
 *
 * @param {Object}   [opts={}]
 * @param {string}   [opts.initialRole='student'] - Initially selected role ('student' | 'teacher')
 * @param {function} [opts.onChange]              - Callback fired when selected role changes
 * @returns {{ element: HTMLElement, getSelectedRole: function, setRole: function, destroy: function }}
 */
export function createRoleSelector({ initialRole = 'student', onChange } = {}) {
    let currentRole = initialRole;

    const baseTabClasses =
        'flex-1 py-2 px-4 rounded-lg text-sm font-semibold text-center transition-all duration-200 cursor-pointer select-none';
    const activeTabClasses = 'bg-white shadow-md border border-[#CBD5E1] text-primary font-bold';

    const container = document.createElement('div');
    container.className =
        'flex p-1 bg-[#E2E8F0] rounded-xl mb-4 border border-[#CBD5E1] shadow-inner';
    container.id = 'role-selector';
    container.setAttribute('role', 'tablist');

    const studentBtn = document.createElement('div');
    studentBtn.setAttribute('data-role', ROLES.STUDENT);
    studentBtn.className = `${baseTabClasses} ${activeTabClasses}`;
    studentBtn.innerHTML = `
        <i data-lucide="graduation-cap" class="role-icon" aria-hidden="true"></i>
        <span>Student Account</span>
    `;

    container.appendChild(studentBtn);

    /**
     *
     */
    function setRole(role) {
        if (role !== ROLES.STUDENT) return;
        currentRole = role;

        if (typeof onChange === 'function') {
            onChange(currentRole);
        }
    }

    return {
        element: container,
        /**
         * Returns the currently selected role string ('student' | 'teacher').
         *
         * @returns {string}
         */
        getSelectedRole() {
            return currentRole;
        },
        setRole,
        /**
         * Cleans up container element.
         *
         * @returns {void}
         */
        destroy() {
            container.remove();
        },
    };
}
