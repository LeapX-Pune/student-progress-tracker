/**
 * @fileoverview StudentMetadata — Dashboard Student Metadata — Part 5.
 *
 * Displays the student ID, enrollment date, and current learning streak
 * from the student profile data, with graceful degradation for missing
 * fields and a loading skeleton variant.
 *
 * @module components/dashboard/StudentMetadata
 */

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a student metadata component.
 *
 * @param {Object} student - Student profile data
 * @param {string} [student.studentId] - Student ID (e.g., 'STU-2024-001')
 * @param {string} [student.enrolledAt] - Enrollment date ISO string
 * @param {number} [student.currentStreak] - Current learning streak in days
 * @param {Object} [_options] - Additional options
 * @returns {HTMLElement} The metadata component element
 */
export function createStudentMetadata(student, _options = {}) {
    const container = document.createElement('div');
    container.className = 'student-metadata';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Student Information');

    const items = [];

    if (student?.studentId) {
        items.push(_createMetadataItem('Student ID', student.studentId, 'id'));
    }

    if (student?.enrolledAt) {
        const formattedDate = _formatDate(student.enrolledAt);
        items.push(_createMetadataItem('Enrolled', formattedDate, 'enrolled'));
    }

    if (student?.currentStreak !== undefined && student?.currentStreak !== null) {
        items.push(
            _createMetadataItem('Learning Streak', `${student.currentStreak} days`, 'streak')
        );
    }

    if (items.length === 0) {
        items.push(_createMetadataItem('Student ID', 'N/A', 'id'));
        items.push(_createMetadataItem('Enrolled', 'N/A', 'enrolled'));
        items.push(_createMetadataItem('Learning Streak', '0 days', 'streak'));
    }

    const list = document.createElement('div');
    list.className = 'student-metadata__list';
    items.forEach(item => list.appendChild(item));

    container.appendChild(list);
    return container;
}

/**
 * Creates a skeleton variant of the metadata component for loading states.
 *
 * @returns {HTMLElement} The skeleton metadata element
 */
export function createMetadataSkeleton() {
    const container = document.createElement('div');
    container.className = 'student-metadata student-metadata--skeleton';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-label', 'Loading student information');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading student information...';
    container.appendChild(srOnly);

    const list = document.createElement('div');
    list.className = 'student-metadata__list';
    list.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 3; i++) {
        const item = document.createElement('div');
        item.className = 'student-metadata__item';
        item.innerHTML = `
      <div class="skeleton skeleton--text" style="width: 60px; height: 0.75rem;"></div>
      <div class="skeleton skeleton--text" style="width: 80px; height: 1rem;"></div>
    `;
        list.appendChild(item);
    }

    container.appendChild(list);
    return container;
}

/**
 * Creates an error state variant of the metadata component.
 *
 * @param {Object} [options] - Additional options
 * @param {string} [options.message='Unable to load student info'] - Error message
 * @param {Function} [options.onRetry] - Retry callback
 * @returns {HTMLElement} The error state metadata element
 */
export function createMetadataError({ message = 'Unable to load student info', onRetry } = {}) {
    const container = document.createElement('div');
    container.className = 'student-metadata student-metadata--error';
    container.setAttribute('role', 'alert');

    const errorIcon = document.createElement('div');
    errorIcon.className = 'student-metadata__error-icon';
    errorIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    container.appendChild(errorIcon);

    const errorMsg = document.createElement('p');
    errorMsg.className = 'student-metadata__error-message';
    errorMsg.textContent = message;
    container.appendChild(errorMsg);

    if (onRetry) {
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn--secondary btn--sm';
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', onRetry);
        container.appendChild(retryBtn);
    }

    return container;
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Creates a single metadata item.
 *
 * @param {string} label - The label text
 * @param {string} value - The value text
 * @param {string} type - The metadata type for styling
 * @returns {HTMLElement} The metadata item element
 * @private
 */
function _createMetadataItem(label, value, type) {
    const item = document.createElement('div');
    item.className = `student-metadata__item student-metadata__item--${type}`;

    const labelEl = document.createElement('span');
    labelEl.className = 'student-metadata__label';
    labelEl.textContent = label;
    item.appendChild(labelEl);

    const valueEl = document.createElement('span');
    valueEl.className = 'student-metadata__value';
    valueEl.textContent = value;
    item.appendChild(valueEl);

    return item;
}

/**
 * Formats a date string to a human-readable format.
 *
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 * @private
 */
function _formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
}

export default {
    createStudentMetadata,
    createMetadataSkeleton,
    createMetadataError,
};
