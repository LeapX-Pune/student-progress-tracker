import { createEmptyState, EMPTY_ILLUSTRATIONS } from '../components/EmptyState.js';
import { mountCourseGrid } from '../components/courses/CourseGrid.js';
import { createErrorState } from '../components/courses/ErrorState.js';
import { createSkeletonCard } from '../components/courses/SkeletonCard.js';
import { useCourses } from '../hooks/useCourses.js';

/**
 *
 */
export function initCoursesPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    let gridContainer = null;
    let header = null;

    /**
     *
     */
    const setupContainer = () => {
        // Specifically locate the placeholder to replace, as per instructions.
        const placeholder = pageContent.querySelector('.route-placeholder');
        if (placeholder) {
            placeholder.remove();
        } else {
            pageContent.innerHTML = '';
        }

        // Add a header as per main application design
        header = document.createElement('h1');
        header.className = 'dashboard-title';
        header.textContent = 'Courses';
        header.style.marginBottom = '2rem';
        header.style.fontSize = '2.25rem';
        header.style.fontWeight = '700';

        gridContainer = document.createElement('div');

        pageContent.append(header, gridContainer);
    };

    const courseHook = useCourses({
        /**
         *
         */
        onLoading: () => {
            if (!gridContainer || !document.body.contains(gridContainer)) {
                setupContainer();
            }
            gridContainer.innerHTML = ''; // Clear previous grid content

            const grid = document.createElement('div');
            grid.className = 'course-progress-grid';

            // Render 3 skeleton cards based on available space
            for (let i = 0; i < 3; i++) {
                grid.appendChild(createSkeletonCard());
            }
            gridContainer.appendChild(grid);
        },
        /**
         *
         */
        onSuccess: courses => {
            if (!gridContainer) return;
            gridContainer.innerHTML = '';

            if (!courses || courses.length === 0) {
                gridContainer.appendChild(
                    createEmptyState({
                        title: 'No Courses Yet',
                        description: "You haven't been enrolled in any courses for this term.",
                        illustration: EMPTY_ILLUSTRATIONS.course,
                    })
                );
                return;
            }

            mountCourseGrid(gridContainer, courses);
        },
        /**
         *
         */
        onError: error => {
            if (!gridContainer) return;
            gridContainer.innerHTML = '';

            gridContainer.appendChild(
                createErrorState({
                    title: 'Failed to load courses',
                    message: error.message || 'There was a problem fetching your courses.',
                    /**
                     *
                     */
                    onRetry: () => courseHook.retry(),
                })
            );
        },
    });

    let isFetching = false;
    /**
     *
     */
    const fetchCourses = async () => {
        if (isFetching) return;
        isFetching = true;

        // Fetch courses for 'stu_001' as per mock API setup
        try {
            await courseHook.fetch('stu_001');
        } finally {
            isFetching = false;
        }
    };

    document.addEventListener('pathway:route', event => {
        if (event.detail.route === 'courses') {
            fetchCourses();
        }
    });

    // Check if we are already on the courses route upon initialization (solves the race condition)
    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'courses') {
        fetchCourses();
    }
}
