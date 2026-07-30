import { createCourseCard } from './CourseCard.js';

/**
 *
 */
export function mountCourseGrid(containerElement, coursesData) {
    if (!containerElement) return;

    // Clear existing content
    containerElement.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'course-progress-grid';

    try {
        if (!coursesData || coursesData.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'course-progress-grid__empty';
            emptyState.textContent = 'No courses found.';
            containerElement.appendChild(emptyState);
            return;
        }

        coursesData.forEach(course => {
            const card = createCourseCard(course);
            grid.appendChild(card);
        });

        containerElement.appendChild(grid);
    } catch (err) {
        containerElement.innerHTML = `<div style="color:red; padding:20px; font-weight:bold;">Error rendering cards: ${err.message}<br/>${err.stack}</div>`;
    }
}
