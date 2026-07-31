/**
 *
 */
export function calculateProgress(completed, total) {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
}

/**
 *
 */
export function getStatusConfig(status) {
    const config = {
        completed: { className: 'course-status-badge--completed', label: 'Completed' },
        'in-progress': { className: 'course-status-badge--in-progress', label: 'In Progress' },
        'not-started': { className: 'course-status-badge--not-started', label: 'Not Started' },
    };
    return config[status] || config['not-started'];
}

/**
 * Maps a numeric grade to its letter equivalent.
 *
 * @param {number} grade - Numeric grade (0-100)
 * @returns {string} Letter grade
 */
export function getLetterGrade(grade) {
    if (grade === null || grade === undefined || Number.isNaN(grade)) return '';
    if (grade >= 97) return 'A+';
    if (grade >= 93) return 'A';
    if (grade >= 90) return 'A-';
    if (grade >= 87) return 'B+';
    if (grade >= 83) return 'B';
    if (grade >= 80) return 'B-';
    if (grade >= 77) return 'C+';
    if (grade >= 73) return 'C';
    if (grade >= 70) return 'C-';
    if (grade >= 60) return 'D';
    return 'F';
}

/**
 *
 */
export function formatGrade(grade) {
    if (grade === null || grade === undefined) return 'N/A';

    // If it's already a string, maybe they provided it fully formatted
    if (typeof grade === 'string') {
        // If it's a raw letter like "A-", let's append the percentage if possible,
        // but since we don't have the percentage if they just pass "A-", we just return it.
        return grade;
    }

    const letter = getLetterGrade(grade);
    return `${letter} (${Math.round(grade)}%)`;
}
