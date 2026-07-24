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

    const container = document.createElement('div');
    container.className = 'auth-role-selector';
    container.id = 'role-selector';
    container.setAttribute('role', 'tablist');

    const studentBtn = document.createElement('button');
    studentBtn.className = 'auth-role-tab';
    studentBtn.type = 'button';
    studentBtn.setAttribute('role', 'tab');
    studentBtn.setAttribute('data-role', 'student');
    studentBtn.setAttribute('aria-selected', initialRole === 'student' ? 'true' : 'false');
    studentBtn.textContent = 'Student';

    const teacherBtn = document.createElement('button');
    teacherBtn.className = 'auth-role-tab';
    teacherBtn.type = 'button';
    teacherBtn.setAttribute('role', 'tab');
    teacherBtn.setAttribute('data-role', 'teacher');
    teacherBtn.setAttribute('aria-selected', initialRole === 'teacher' ? 'true' : 'false');
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
        teacherBtn.setAttribute('aria-selected', role === 'teacher' ? 'true' : 'false');

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
