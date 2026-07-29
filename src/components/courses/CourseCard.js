import { formatGrade } from '../../utils/courseHelpers.js';
import { createCourseThumbnail } from './CourseThumbnail.js';
import { createProgressBar } from './ProgressBar.js';
import { createStatusBadge } from './StatusBadge.js';

/**
 *
 */
export function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.setAttribute('tabindex', '0');

    /**
     *
     */
    const navigateToCourse = () => {
        window.location.hash = `/courses/${course.id}`;
    };

    card.addEventListener('click', navigateToCourse);
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateToCourse();
        }
    });

    card.appendChild(createCourseThumbnail(course.thumbnailUrl, course.title));

    const content = document.createElement('div');
    content.className = 'course-card__content';

    const header = document.createElement('div');
    header.className = 'course-card__header';

    const title = document.createElement('h3');
    title.className = 'course-card__title';
    title.textContent = course.title;

    const instructor = document.createElement('p');
    instructor.className = 'course-card__instructor';
    instructor.textContent = course.instructor;

    header.appendChild(title);
    header.appendChild(instructor);
    content.appendChild(header);

    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'course-card__status-wrapper';
    statusWrapper.appendChild(createStatusBadge(course.status));
    content.appendChild(statusWrapper);

    const details = document.createElement('div');
    details.className = 'course-card__details';

    // Modules Row
    const modulesRow = document.createElement('div');
    modulesRow.className = 'course-card__detail-row';
    const modulesLabel = document.createElement('span');
    modulesLabel.className = 'course-card__detail-label';
    modulesLabel.textContent = 'Modules';
    const modulesValue = document.createElement('span');
    modulesValue.className = 'course-card__detail-value';
    modulesValue.textContent = `${course.completedModules} / ${course.totalModules}`;
    modulesRow.appendChild(modulesLabel);
    modulesRow.appendChild(modulesValue);
    details.appendChild(modulesRow);

    // Grade Row
    const gradeRow = document.createElement('div');
    gradeRow.className = 'course-card__detail-row';
    const gradeLabel = document.createElement('span');
    gradeLabel.className = 'course-card__detail-label';
    gradeLabel.textContent = 'Grade';
    const gradeValue = document.createElement('span');
    gradeValue.className = 'course-card__detail-value';
    if (course.currentGrade !== null && course.currentGrade !== undefined) {
        gradeValue.textContent = formatGrade(course.currentGrade);
    } else {
        gradeValue.textContent = 'N/A';
    }
    gradeRow.appendChild(gradeLabel);
    gradeRow.appendChild(gradeValue);
    details.appendChild(gradeRow);

    // Next Row
    const nextRow = document.createElement('div');
    nextRow.className = 'course-card__detail-row';
    const nextLabel = document.createElement('span');
    nextLabel.className = 'course-card__detail-label';
    nextLabel.textContent = 'Next';
    const nextValue = document.createElement('span');
    nextValue.className = 'course-card__detail-value';

    if (course.status === 'completed') {
        nextValue.textContent = '-';
        nextValue.classList.add('course-card__detail-value--muted');
    } else if (course.nextModule) {
        nextValue.textContent = course.nextModule;
    } else {
        nextValue.textContent = 'N/A';
    }

    nextRow.appendChild(nextLabel);
    nextRow.appendChild(nextValue);
    details.appendChild(nextRow);

    content.appendChild(details);

    // Progress Bar
    content.appendChild(
        createProgressBar(course.completedModules, course.totalModules, course.status)
    );

    card.appendChild(content);
    return card;
}
