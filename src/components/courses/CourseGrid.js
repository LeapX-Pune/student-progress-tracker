import { createCourseCard } from './CourseCard.js';

export function mountCourseGrid(containerElement, coursesData) {
    if (!containerElement) return;
    
    // Clear existing content
    containerElement.innerHTML = '';
    
    const grid = document.createElement('div');
    grid.className = 'course-progress-grid';
    
    if (!coursesData || coursesData.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.textContent = 'No courses found.';
        emptyState.style.padding = '40px';
        emptyState.style.textAlign = 'center';
        emptyState.style.color = '#6b7280';
        containerElement.appendChild(emptyState);
        return;
    }
    
    coursesData.forEach(course => {
        const card = createCourseCard(course);
        grid.appendChild(card);
    });
    
    containerElement.appendChild(grid);
}
