import { createEmptyState, EMPTY_ILLUSTRATIONS } from '../components/EmptyState.js';
import { createToolbar } from '../components/Toolbar.js';
import { createErrorState } from '../components/courses/ErrorState.js';
import { useAttendance } from '../hooks/useAttendance.js';

/**
 * Initializes the Attendance page.
 */
export function initAttendancePage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    let cleanup = null;
    const { subscribe, fetchAttendance, retry, setSearch, setFilter, setSort } = useAttendance();

    /**
     *
     */
    function render(state) {
        if (!pageContent.querySelector('.attendance-page')) {
            pageContent.innerHTML = '';
            const container = document.createElement('div');
            container.className = 'attendance-page';
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Attendance dashboard');

            const header = document.createElement('header');
            header.className = 'grades-header';
            header.innerHTML = `
                <h1 id="grades-heading" class="dashboard-title" style="margin-bottom: 0.5rem; font-size: 2.25rem; font-weight: 700;">Attendance</h1>
                <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">Track your attendance across all registered courses.</p>
                <div id="attendance-summary" class="metrics-grid" style="margin-bottom: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <!-- dynamic summary -->
                </div>
            `;

            const toolbar = createToolbar({
                searchPlaceholder: 'Search by course name or code...',
                filterOptions: [
                    { value: 'all', label: 'All Statuses' },
                    { value: 'excellent', label: 'Excellent' },
                    { value: 'good', label: 'Good' },
                    { value: 'warning', label: 'Needs Improvement' },
                ],
                sortOptions: [
                    { value: 'highest', label: 'Highest Attendance' },
                    { value: 'lowest', label: 'Lowest Attendance' },
                    { value: 'alphabetical', label: 'Alphabetical' },
                ],
                onSearch: setSearch,
                onFilter: setFilter,
                onSort: setSort,
            });

            const contentContainer = document.createElement('div');
            contentContainer.className = 'attendance-content-container';

            container.appendChild(header);
            container.appendChild(toolbar);
            container.appendChild(contentContainer);
            pageContent.appendChild(container);
        }

        const container = pageContent.querySelector('.attendance-content-container');
        if (!container) return;

        container.innerHTML = '';

        if (state.loading) {
            container.innerHTML = `
                <div class="loading-state" role="status" aria-live="polite">
                    <span class="sr-only">Loading attendance data</span>
                    <div class="skeleton skeleton-chart" aria-hidden="true" style="height: 150px; border-radius: 12px; margin-bottom: 1rem;"></div>
                    <div class="skeleton skeleton-chart" aria-hidden="true" style="height: 150px; border-radius: 12px; margin-bottom: 1rem;"></div>
                    <div class="skeleton skeleton-chart" aria-hidden="true" style="height: 150px; border-radius: 12px;"></div>
                </div>
            `;
            return;
        }

        if (state.error) {
            container.appendChild(
                createErrorState({
                    title: 'Failed to load attendance',
                    message: state.error || 'There was a problem fetching your attendance data.',
                    onRetry: retry,
                })
            );
            return;
        }

        const attendanceData = state.data || {};
        const records = state.filteredRecords;

        const summary = document.getElementById('attendance-summary');
        if (summary && attendanceData) {
            summary.innerHTML = `
                <div class="metric-card" style="background: var(--bg-surface); padding: 1.25rem; border-radius: 12px; flex: 1; border: 1px solid ${attendanceData.isAtRisk ? 'var(--color-danger)' : 'var(--border-color)'};">
                    <h4 style="margin: 0; font-size: 0.875rem; color: var(--text-secondary); font-weight: 500;">Overall Attendance</h4>
                    <p style="margin: 0.5rem 0 0; font-size: 1.75rem; font-weight: 700; color: ${attendanceData.isAtRisk ? 'var(--color-danger)' : 'var(--text-primary)'};">${attendanceData.overallPercentage || 0}%</p>
                    ${attendanceData.isAtRisk ? '<span style="color: var(--color-danger); font-size: 0.75rem; font-weight: bold; margin-top: 0.5rem; display: block;">AT RISK - BELOW 75%</span>' : ''}
                </div>
            `;
        }

        if (!records || records.length === 0) {
            container.appendChild(
                createEmptyState({
                    title:
                        state.searchQuery || state.filterBy !== 'all'
                            ? 'No Matches Found'
                            : 'No Attendance Available',
                    description:
                        state.searchQuery || state.filterBy !== 'all'
                            ? 'Try adjusting your search or filter.'
                            : 'Your attendance data is not available yet.',
                    illustration: EMPTY_ILLUSTRATIONS.grades, // Reuse grades illustration for now
                })
            );
            return;
        }

        const listContainer = document.createElement('div');
        listContainer.style.display = 'flex';
        listContainer.style.flexDirection = 'column';
        listContainer.style.gap = '0.75rem';

        records.forEach(c => {
            const isLow = c.percentage < (c.required || 75);

            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '1.25rem';
            item.style.background = 'var(--bg-surface)';
            item.style.border = '1px solid var(--border-color)';
            item.style.borderRadius = '12px';
            item.style.flexWrap = 'wrap';
            item.style.gap = '1rem';

            const left = document.createElement('div');
            left.style.flex = '1';
            left.innerHTML = `
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.125rem;">${c.courseName || 'Unknown Course'}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); display: flex; gap: 1rem; flex-wrap: wrap;">
                    <span><strong style="color: var(--text-primary);">Conducted:</strong> ${c.conducted || 0}</span>
                    <span><strong style="color: var(--text-primary);">Attended:</strong> ${c.attended || 0}</span>
                    <span><strong style="color: var(--text-primary);">Missed:</strong> ${c.missed || 0}</span>
                </div>
            `;

            const right = document.createElement('div');
            right.style.textAlign = 'right';
            right.innerHTML = `
                <strong style="font-size: 1.5rem; font-weight: 700; color: ${isLow ? 'var(--color-danger)' : 'var(--color-success)'}">${c.percentage}%</strong>
                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Required: ${c.required || 75}%</span>
            `;

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
        if (e.detail.route === 'attendance') {
            cleanup = subscribe(render);
            fetchAttendance();
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
    if (currentHash === 'attendance') {
        cleanup = subscribe(render);
        fetchAttendance();
    }
}
