import { createIcons, icons } from 'lucide';
import {
    addChartKeyboardNavigation,
    createBarChart,
    createChartEmpty,
    createChartError,
    createChartSkeleton,
    createDoughnutChart,
    createLineChart,
    destroyAllCharts,
} from '../services/charts.js';
import { getStudentGrades } from '../services/studentApi.js';

let _currentContainer = null;
let _abortController = null;
let _isLoading = false;
let _lastData = null;
let _activeCourse = 'all';
const _keyboardCleanups = new Map();

const ICONS = {
    quiz: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>',
    assignment:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
    weekly: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
};

const CHART_DEFS = [
    {
        id: 'chart-quiz',
        variant: 'purple',
        title: 'Quiz Scores',
        subtitle: 'Your scores across all quizzes taken.',
        icon: ICONS.quiz,
        chartType: 'bar',
        chartId: 'gradesQuizChart',
    },
    {
        id: 'chart-assignment',
        variant: 'green',
        title: 'Assignment Performance',
        subtitle: 'Grades earned on submitted assignments.',
        icon: ICONS.assignment,
        chartType: 'doughnut',
        chartId: 'gradesAssignmentChart',
    },
    {
        id: 'chart-weekly',
        variant: 'blue',
        title: 'Weekly Progress',
        subtitle: 'Your learning progress tracked week by week.',
        icon: ICONS.weekly,
        chartType: 'line',
        chartId: 'gradesWeeklyChart',
        wide: true,
    },
];

/**
 *
 */
export function initGradesPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent)
        return {
            /**
             *
             */
            destroy() {},
        };
    _currentContainer = pageContent;

    /**
     *
     */
    const handleRoute = event => {
        if (event.detail?.route === 'grades') _fetchGradesData();
    };
    document.addEventListener('pathway:route', handleRoute);

    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'grades') _fetchGradesData();

    return {
        /**
         *
         */
        destroy() {
            document.removeEventListener('pathway:route', handleRoute);
            _cleanup();
        },
    };
}

/**
 * Builds a single chart card element (shared by loading and render states).
 *
 * @param {Object} def - Chart card definition from CHART_DEFS
 * @param {string} [skeletonType] - When set, a loading skeleton is appended
 * @returns {HTMLElement} The chart card element
 */
function _buildChartCard(def, skeletonType) {
    const card = document.createElement('article');
    card.className = `chart-card chart-card--${def.variant}${def.wide ? ' chart-card--wide' : ''}`;
    card.setAttribute('role', 'listitem');
    card.id = def.id;

    card.innerHTML = `<div class="chart-card-header">
        <div class="chart-card-icon">${def.icon}</div>
        <div><h3 class="chart-title">${def.title}</h3><p class="chart-subtitle">${def.subtitle}</p></div>
    </div>
    <div class="chart-container" role="img" aria-label="${def.title} chart">
        <canvas id="${def.chartId}" style="width:100%;height:100%;display:none;" aria-label="${def.title} chart"></canvas>
    </div>`;

    if (skeletonType) {
        card.querySelector('.chart-container').appendChild(
            createChartSkeleton({ type: skeletonType })
        );
    }

    return card;
}

/**
 *
 */
function _showLoading() {
    if (!_currentContainer) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'grades-dashboard';
    wrapper.id = 'grades-page';
    wrapper.innerHTML = `<div class="grades-header"><h1>Grades</h1><p>Loading grade data...</p></div>
        <div class="grades-filter-section"><div class="grades-filter-buttons"></div></div>`;

    const grid = document.createElement('div');
    grid.className = 'charts-grid';
    grid.setAttribute('role', 'list');

    CHART_DEFS.forEach(def => {
        grid.appendChild(_buildChartCard(def, def.chartType));
    });

    wrapper.appendChild(grid);
    _currentContainer.appendChild(wrapper);
}

/**
 *
 */
function _renderGrades(data) {
    if (!_currentContainer) return;
    const existing = _currentContainer.querySelector('#grades-page');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'grades-dashboard';
    wrapper.id = 'grades-page';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'Grades dashboard with performance charts');

    const header = document.createElement('header');
    header.className = 'grades-header';
    header.innerHTML =
        '<h1 id="grades-heading">Grades</h1><p>Track your academic performance across quizzes, assignments, and weekly progress.</p>';
    wrapper.appendChild(header);

    const filterSection = document.createElement('div');
    filterSection.className = 'grades-filter-section';
    filterSection.innerHTML = `<div class="grades-filter-buttons" role="group" aria-label="Quick course filter">
        <button class="grades-chip active" data-course="all">All Courses</button>
        <button class="grades-chip" data-course="crs_001">Advanced Mathematics</button>
        <button class="grades-chip" data-course="crs_002">CS Fundamentals</button>
        <button class="grades-chip" data-course="crs_003">Physics II</button></div>`;
    wrapper.appendChild(filterSection);

    const skipNav = document.createElement('nav');
    skipNav.className = 'grades-skip-nav';
    skipNav.setAttribute('aria-label', 'Chart quick navigation');
    skipNav.innerHTML =
        '<a href="#chart-quiz" class="sr-only sr-only-focusable">Skip to Quiz Scores chart</a><a href="#chart-assignment" class="sr-only sr-only-focusable">Skip to Assignment Performance chart</a><a href="#chart-weekly" class="sr-only sr-only-focusable">Skip to Weekly Progress chart</a>';
    wrapper.appendChild(skipNav);

    const grid = document.createElement('div');
    grid.className = 'charts-grid';
    grid.setAttribute('role', 'list');
    grid.setAttribute('aria-labelledby', 'grades-heading');

    CHART_DEFS.forEach(def => {
        grid.appendChild(_buildChartCard(def));
    });

    wrapper.appendChild(grid);

    const srAnnounce = document.createElement('p');
    srAnnounce.className = 'sr-only';
    srAnnounce.setAttribute('aria-live', 'polite');
    wrapper.appendChild(srAnnounce);

    _currentContainer.appendChild(wrapper);
    _renderCharts(_activeCourse, data);
    _wireFilters(data);
}

/**
 * Removes any chart state overlay (skeleton/error/empty) from a container.
 *
 * @param {HTMLElement} container - Chart container element
 */
function _clearChartState(container) {
    if (!container) return;
    container.querySelectorAll('.chart-state').forEach(el => el.remove());
}

/**
 * Cleans up keyboard navigation listeners attached to chart containers.
 */
function _clearKeyboardNav() {
    _keyboardCleanups.forEach(cleanup => cleanup());
    _keyboardCleanups.clear();
}

/**
 * Renders a single chart with loading/empty/error states handled per chart.
 *
 * @param {string} canvasId - Canvas element ID
 * @param {Function} create - Factory that returns the chart instance, or
 *   { empty: true } when no data is available
 * @param {Function} onRetry - Retry callback for the chart's error state
 */
function _renderChart(canvasId, create, onRetry) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const container = canvas.closest('.chart-container');

    _clearChartState(container);

    let result;
    try {
        result = create(canvas);
    } catch (error) {
        console.error(`[GradesPage] Failed to render chart "${canvasId}":`, error);
        canvas.style.display = 'none';
        if (container) {
            container.appendChild(
                createChartError({
                    message: 'Unable to load chart data',
                    /**
                     *
                     */
                    onRetry,
                })
            );
        }
        return;
    }

    if (!result || result.empty) {
        canvas.style.display = 'none';
        if (container) container.appendChild(createChartEmpty());
        return;
    }

    canvas.style.display = '';
    if (container && result.chart) {
        _keyboardCleanups.set(container, addChartKeyboardNavigation(container, result.chart));
    }
}

/**
 *
 */
function _renderCharts(courseId, data) {
    const d = courseId === 'all' ? data : _filterCourseData(data, courseId);
    if (!d) return;

    destroyAllCharts();
    _clearKeyboardNav();

    _renderChart(
        'gradesQuizChart',
        canvas => {
            const labels = d.quizScores?.labels || [];
            const values = d.quizScores?.data || [];
            if (!labels.length || !values.length) return { empty: true };
            return createBarChart(
                canvas,
                { labels, values },
                {
                    label: 'Score (%)',
                    showLegend: false,
                    backgroundColor: 'rgba(99, 102, 241, 0.85)',
                    borderColor: '#6366f1',
                }
            );
        },
        () => _retryCharts()
    );

    _renderChart(
        'gradesAssignmentChart',
        canvas => {
            const values = Array.isArray(d.gradeDistribution) ? d.gradeDistribution : [];
            if (!values.length) return { empty: true };
            return createDoughnutChart(
                canvas,
                {
                    labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
                    values,
                },
                { showLegend: true, cutout: '65%' }
            );
        },
        () => _retryCharts()
    );

    _renderChart(
        'gradesWeeklyChart',
        canvas => {
            const values = d.weeklyProgress?.assignments || [];
            if (!values.length) return { empty: true };
            return createLineChart(
                canvas,
                {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    values,
                },
                { label: 'Assignments', yAxisLabel: 'Progress (%)', showLegend: false }
            );
        },
        () => _retryCharts()
    );

    createIcons({ icons });
}

/**
 * Re-renders charts from the last fetched data, or refetches if unavailable.
 */
function _retryCharts() {
    if (_lastData) {
        _renderCharts(_activeCourse, _lastData);
        return;
    }
    _fetchGradesData();
}

/**
 *
 */
function _mapGradesData(rawData) {
    if (!rawData) return null;
    return {
        quizScores: {
            labels: (rawData.quizScores || []).map((q, i) => q.label || `Quiz ${i + 1}`),
            data: (rawData.quizScores || []).map(q => (q.score != null ? q.score : q)),
        },
        gradeDistribution: Array.isArray(rawData.gradeDistribution)
            ? rawData.gradeDistribution.map(g => (g.percentage != null ? g.percentage : g))
            : [],
        weeklyProgress: {
            assignments: (rawData.weeklyProgress || []).map(
                w => w.cumulative || w.assignments || w
            ),
        },
    };
}

/**
 * Filters grade data down to a single course.
 *
 * @param {Object} data - Full grades data for the active student
 * @param {string} courseId - Course identifier (e.g. "crs_001") or "all"
 * @returns {Object|null} Course-specific chart data, or the original data
 */
function _filterCourseData(data, courseId) {
    if (!data || !data.quizScores || !Array.isArray(data.quizScores)) return null;
    const idx = { crs_001: 0, crs_002: 1, crs_003: 2 }[courseId];
    if (idx === undefined) return data;
    const courseQuiz = data.quizScores[idx];
    if (!courseQuiz) return data;
    return {
        quizScores: {
            labels: courseQuiz.scores?.map((_, i) => `Quiz ${i + 1}`) || [
                'Quiz 1',
                'Quiz 2',
                'Quiz 3',
            ],
            data: courseQuiz.scores || [85, 90, 80],
        },
        gradeDistribution: data.gradeDistribution?.[idx]?.distribution || [30, 25, 20, 15, 10],
        weeklyProgress: {
            assignments: data.weeklyProgress?.[idx]?.scores || [60, 68, 75, 82, 90, 96],
        },
    };
}

/**
 *
 */
function _wireFilters(data) {
    const chips = document.querySelectorAll('.grades-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            _activeCourse = chip.dataset.course;
            _renderCharts(_activeCourse, data);
        });
    });
}

/**
 *
 */
function _showError(error) {
    if (!_currentContainer) return;
    const existing = _currentContainer.querySelector('#grades-page');
    if (existing) existing.remove();
    const wrapper = document.createElement('div');
    wrapper.className = 'grades-dashboard';
    wrapper.id = 'grades-page';
    wrapper.innerHTML = `<div class="grades-header"><h1>Grades</h1></div>
        <div class="chart-container" role="alert" style="display:flex;justify-content:center;align-items:center;min-height:200px">
        <p>${error?.message || 'Unable to load grades'}</p>
        <button class="btn btn--secondary" id="grades-retry">Retry</button></div>`;
    _currentContainer.appendChild(wrapper);
    document.getElementById('grades-retry')?.addEventListener('click', _fetchGradesData);
}

/**
 *
 */
async function _fetchGradesData() {
    if (_isLoading) return;
    _isLoading = true;
    _cleanup();
    _showLoading();
    _abortController = new AbortController();
    try {
        const rawData = await getStudentGrades(_getStudentId());
        if (_abortController.signal.aborted) return;
        const data = _mapGradesData(rawData) || rawData;
        _lastData = data;
        _renderGrades(data);
    } catch (error) {
        if (_abortController.signal.aborted) return;
        console.error('[GradesPage] Failed to fetch grades:', error);
        _showError(error);
    } finally {
        _isLoading = false;
    }
}

/**
 *
 */
function _cleanup() {
    if (_abortController) {
        _abortController.abort();
        _abortController = null;
    }
    destroyAllCharts();
    _clearKeyboardNav();
    if (_currentContainer) {
        const existing = _currentContainer.querySelector('#grades-page');
        if (existing) existing.remove();

        const placeholder = _currentContainer.querySelector('.route-placeholder');
        if (placeholder) placeholder.remove();
    }
}

/**
 *
 */
function _getStudentId() {
    try {
        const raw = localStorage.getItem('student_tracker_auth');
        if (raw) {
            const d = JSON.parse(raw);
            if (d?.user?.id) return d.user.id;
        }
    } catch (_e) {
        /* ignore */
    }
    return 'stu_001';
}

export default { initGradesPage };
