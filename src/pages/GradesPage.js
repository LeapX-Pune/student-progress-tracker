import { createEmptyState, EMPTY_ILLUSTRATIONS } from '../components/EmptyState.js';
import { createToolbar } from '../components/Toolbar.js';
import { createErrorState } from '../components/courses/ErrorState.js';
import { useGrades } from '../hooks/useGrades.js';

/**
 * Initializes the Grades page.
 */
export function initGradesPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    let cleanup = null;
    const { subscribe, fetchGrades, retry, setSearch, setFilter, setSort } = useGrades();

    /**
     *
     */
    function render(state) {
        if (!pageContent.querySelector('.grades-page')) {
            pageContent.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'grades-page';
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Grades dashboard');

            const header = document.createElement('header');
            header.className = 'grades-header';
            header.innerHTML = `
                <h1 id="grades-heading" class="dashboard-title" style="margin-bottom: 0.5rem; font-size: 2.25rem; font-weight: 700;">Grades & Analytics</h1>
                <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">Track your academic performance across quizzes, assignments, and weekly progress.</p>
                <div id="gpa-summary" class="metrics-grid" style="margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <!-- dynamic gpa -->
                </div>
            `;

            const toolbar = createToolbar({
                searchPlaceholder: 'Search by course or assignment...',
                filterOptions: [
                    { value: 'all', label: 'All Semesters' },
                    { value: 'current_semester', label: 'Current Semester' },
                ],
                sortOptions: [
                    { value: 'highest', label: 'Highest Grade' },
                    { value: 'lowest', label: 'Lowest Grade' },
                    { value: 'date', label: 'Recent' },
                ],
                onSearch: setSearch,
                onFilter: setFilter,
                onSort: setSort,
            });

            const contentContainer = document.createElement('div');
            contentContainer.className = 'grades-content-container';

            container.appendChild(header);
            container.appendChild(toolbar);
            container.appendChild(contentContainer);
            pageContent.appendChild(container);
        }

        const container = pageContent.querySelector('.grades-content-container');
        if (!container) return;

        container.innerHTML = '';

        if (state.loading) {
            container.innerHTML = `
                <div class="loading-state" role="status" aria-live="polite">
                    <span class="sr-only">Loading grades data</span>
                    <div class="skeleton skeleton-chart" aria-hidden="true" style="height: 300px; border-radius: 12px; margin-bottom: 1rem;"></div>
                    <div class="skeleton skeleton-chart" aria-hidden="true" style="height: 300px; border-radius: 12px;"></div>
                </div>
            `;
            return;
        }

        if (state.error) {
            container.appendChild(
                createErrorState({
                    title: 'Failed to load grades',
                    message: state.error || 'There was a problem fetching your grades.',
                    onRetry: retry,
                })
            );
            return;
        }

        const { performance } = state.data || {};
        const grades = state.filteredGrades;

        const summary = document.getElementById('gpa-summary');
        if (summary && performance) {
            summary.innerHTML = `
                <div class="metric-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 12px; flex: 1; min-width: 150px;">
                    <h4 style="margin: 0; font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Semester GPA</h4>
                    <p style="margin: 0.5rem 0 0; font-size: 1.75rem; font-weight: 700; color: var(--text-primary);">${performance.semesterGpa || 'N/A'}</p>
                </div>
                <div class="metric-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 12px; flex: 1; min-width: 150px;">
                    <h4 style="margin: 0; font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Overall GPA</h4>
                    <p style="margin: 0.5rem 0 0; font-size: 1.75rem; font-weight: 700; color: var(--text-primary);">${performance.overallGpa || 'N/A'}</p>
                </div>
                <div class="metric-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 12px; flex: 1; min-width: 150px;">
                    <h4 style="margin: 0; font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Credits</h4>
                    <p style="margin: 0.5rem 0 0; font-size: 1.75rem; font-weight: 700; color: var(--text-primary);">${performance.creditsCompleted || 0}</p>
                </div>
                <div class="metric-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 12px; flex: 1; min-width: 150px;">
                    <h4 style="margin: 0; font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Standing</h4>
                    <p style="margin: 0.5rem 0 0; font-size: 1.25rem; font-weight: 700; color: var(--color-success);">${performance.overallStanding || 'N/A'}</p>
                </div>
            `;
        }

        if (!grades || grades.length === 0) {
            container.appendChild(
                createEmptyState({
                    title:
                        state.searchQuery || state.filterBy !== 'all'
                            ? 'No Matches Found'
                            : 'Grades Not Published',
                    description:
                        state.searchQuery || state.filterBy !== 'all'
                            ? 'Try adjusting your search or filter.'
                            : 'Your grades for this semester have not been published yet.',
                    illustration: EMPTY_ILLUSTRATIONS.grades,
                })
            );
            return;
        }

        const listContainer = document.createElement('div');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        listContainer.style.gap = '0.75rem';

        grades.forEach(g => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '1.25rem';
            item.style.background = 'var(--bg-surface)';
            item.style.border = '1px solid var(--border-color)';
            item.style.borderRadius = '12px';

            const left = document.createElement('div');
            left.innerHTML = `
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${g.title || g.courseName || 'Assignment'}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">${g.courseCode || ''} &bull; ${g.type || 'Assessment'}</div>
            `;

            const right = document.createElement('div');
            right.style.fontWeight = '700';
            right.style.fontSize = '1.125rem';
            right.style.color = 'var(--text-primary)';
            right.textContent = g.score !== undefined ? g.score + '%' : 'N/A';

            item.appendChild(left);
            item.appendChild(right);
            listContainer.appendChild(item);
        });

        container.appendChild(listContainer);
    }

    /**
     *
     */
    function handleRoute(e) {
        if (e.detail.route === 'grades') {
            cleanup = subscribe(render);
            fetchGrades();
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
    if (currentHash === 'grades') {
        cleanup = subscribe(render);
        fetchGrades();
    }
}
