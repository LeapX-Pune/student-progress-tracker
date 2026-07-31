import { getStatusConfig } from '../../utils/courseHelpers.js';

/**
 *
 */
export function createStatusBadge(status) {
    const config = getStatusConfig(status);

    const badge = document.createElement('span');
    badge.className = `course-status-badge ${config.className}`;
    badge.textContent = config.label;

    return badge;
}
