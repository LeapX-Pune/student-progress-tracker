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
    const inactiveTabClasses =
        'text-[#64748B] hover:text-[#0F172A] font-medium opacity-80 hover:opacity-100';

    const container = document.createElement('div');
    container.className =
        'flex p-1 bg-[#E2E8F0] rounded-xl mb-4 border border-[#CBD5E1] shadow-inner';
    container.id = 'role-selector';
    container.setAttribute('role', 'tablist');

    const studentBtn = document.createElement('button');
    studentBtn.type = 'button';
    studentBtn.setAttribute('role', 'tab');
    studentBtn.setAttribute('data-role', 'student');
    studentBtn.setAttribute('aria-selected', initialRole === 'student' ? 'true' : 'false');
    studentBtn.className = `${baseTabClasses} ${initialRole === 'student' ? activeTabClasses : inactiveTabClasses}`;
    studentBtn.textContent = 'Student';

    const teacherBtn = document.createElement('button');
    teacherBtn.type = 'button';
    teacherBtn.setAttribute('role', 'tab');
    teacherBtn.setAttribute('data-role', 'teacher');
    teacherBtn.setAttribute('aria-selected', initialRole === 'teacher' ? 'true' : 'false');
    teacherBtn.className = `${baseTabClasses} ${initialRole === 'teacher' ? activeTabClasses : inactiveTabClasses}`;
    teacherBtn.textContent = 'Teacher';

    container.appendChild(studentBtn);
    container.appendChild(teacherBtn);

    /**
     * Updates internal state and UI tab styles
     */
    function setRole(role) {
        if (role !== 'student' && role !== 'teacher') return;
        currentRole = role;

        studentBtn.setAttribute('aria-selected', role === 'student' ? 'true' : 'false');
        studentBtn.className = `${baseTabClasses} ${role === 'student' ? activeTabClasses : inactiveTabClasses}`;

        teacherBtn.setAttribute('aria-selected', role === 'teacher' ? 'true' : 'false');
        teacherBtn.className = `${baseTabClasses} ${role === 'teacher' ? activeTabClasses : inactiveTabClasses}`;

        if (typeof onChange === 'function') {
            onChange(currentRole);
        }
    }

    /**
     * Click handler for tabs
     */
    function handleClick(e) {
        const btn = e.target.closest('button[data-role]');
        if (!btn) return;
        const role = btn.getAttribute('data-role');
        setRole(role);
    }

    container.addEventListener('click', handleClick);

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
         * Cleans up event listeners and removes container element.
         *
         * @returns {void}
         */
        destroy() {
            container.removeEventListener('click', handleClick);
            container.remove();
        },
    };
}
