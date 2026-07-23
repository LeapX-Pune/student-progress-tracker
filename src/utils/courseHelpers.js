export function calculateProgress(completed, total) {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
}

export function getStatusConfig(status) {
    const config = {
        'completed': { className: 'course-status-badge--completed', label: 'Completed' },
        'in-progress': { className: 'course-status-badge--in-progress', label: 'In Progress' },
        'not-started': { className: 'course-status-badge--not-started', label: 'Not Started' }
    };
    return config[status] || config['not-started'];
}

export function formatGrade(grade) {
    if (grade === null || grade === undefined) return 'N/A';
    
    // If it's already a string, maybe they provided it fully formatted
    if (typeof grade === 'string') {
        // If it's a raw letter like "A-", let's append the percentage if possible, 
        // but since we don't have the percentage if they just pass "A-", we just return it.
        return grade; 
    }
    
    let letter = 'F';
    if (grade >= 97) letter = 'A+';
    else if (grade >= 93) letter = 'A';
    else if (grade >= 90) letter = 'A-';
    else if (grade >= 87) letter = 'B+';
    else if (grade >= 83) letter = 'B';
    else if (grade >= 80) letter = 'B-';
    else if (grade >= 77) letter = 'C+';
    else if (grade >= 73) letter = 'C';
    else if (grade >= 70) letter = 'C-';
    else if (grade >= 60) letter = 'D';
    
    return `${letter} (${Math.round(grade)}%)`;
}
