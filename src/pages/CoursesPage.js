import { createEmptyState, EMPTY_ILLUSTRATIONS } from '../components/EmptyState.js';
import { createToolbar } from '../components/Toolbar.js';
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

    let cleanup = null;
    const { subscribe, fetchCourses, retry, setSearch, setFilter, setSort } = useCourses();

    /**
     *
     */
    function render(state) {
        if (!pageContent.querySelector('.courses-page')) {
            pageContent.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'courses-page';
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Courses dashboard');

            const header = document.createElement('h1');
            header.className = 'dashboard-title';
            header.textContent = 'Courses';
            header.style.marginBottom = '1rem';
            header.style.fontSize = '2.25rem';
            header.style.fontWeight = '700';

            const toolbar = createToolbar({
                searchPlaceholder: 'Search courses by name or code...',
                filterOptions: [
                    { value: 'all', label: 'All Semesters' },
                    { value: 'current', label: 'Current Semester' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'in_progress', label: 'In Progress' },
                ],
                sortOptions: [
                    { value: 'alphabetical', label: 'Alphabetical' },
                    { value: 'progress', label: 'Progress (High to Low)' },
                    { value: 'recent', label: 'Recently Accessed' },
                ],
                onSearch: setSearch,
                onFilter: setFilter,
                onSort: setSort,
            });

            const gridContainer = document.createElement('div');
            gridContainer.className = 'courses-grid-container';

            container.appendChild(header);
            container.appendChild(toolbar);
            container.appendChild(gridContainer);
            pageContent.appendChild(container);
        }

        const gridContainer = pageContent.querySelector('.courses-grid-container');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        if (state.loading) {
            const grid = document.createElement('div');
            grid.className = 'course-progress-grid';
            for (let i = 0; i < 3; i++) {
                grid.appendChild(createSkeletonCard());
            }
            gridContainer.appendChild(grid);
            return;
        }

        if (state.error) {
            gridContainer.appendChild(
                createErrorState({
                    title: 'Failed to load courses',
                    message: state.error || 'There was a problem fetching your courses.',
                    onRetry: retry,
                })
            );
            return;
        }

        const courses = state.filteredData;

        if (!courses || courses.length === 0) {
            gridContainer.appendChild(
                createEmptyState({
                    title:
                        state.searchQuery || state.filterBy !== 'all'
                            ? 'No Matches Found'
                            : 'No Courses Yet',
                    description:
                        state.searchQuery || state.filterBy !== 'all'
                            ? 'Try adjusting your search or filter.'
                            : "You haven't been enrolled in any courses for this term.",
                    illustration: EMPTY_ILLUSTRATIONS.course,
                })
            );
            return;
        }

        mountCourseGrid(gridContainer, courses);
    }

    /**
     *
     */
    function handleRoute(e) {
        if (e.detail.route === 'courses') {
            cleanup = subscribe(render);
            fetchCourses();
        } else {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }
        }
    }

    document.addEventListener('pathway:route', handleRoute);

    // Initial check
    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'courses') {
        cleanup = subscribe(render);
        fetchCourses();
    }
}
