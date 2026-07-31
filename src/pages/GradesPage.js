import { createIcons, icons } from 'lucide';
import {
    createBarChart,
    createDoughnutChart,
    createLineChart,
    destroyAllCharts,
} from '../services/charts.js';
import { getStudentGrades } from '../services/studentApi.js';

let _currentContainer = null;
let _abortController = null;
let _isLoading = false;

const ICONS = {
    quiz: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>',
    assignment:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
    weekly: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
};

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
 *
 */
function _showLoading() {
    if (!_currentContainer) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'grades-dashboard';
    wrapper.id = 'grades-page';
    wrapper.innerHTML = `<div class="grades-header"><h1>Grades</h1><p>Loading grade data...</p></div>
        <div class="grades-filter-section"><div class="grades-filter-buttons"></div></div>
        <div class="charts-grid" role="list">
            ${[1, 2, 3].map(() => '<article class="chart-card" role="listitem"><div class="chart-container" style="min-height:280px"><div class="loading-state" style="display:flex"><div class="skeleton skeleton-chart-area"></div></div></div></article>').join('')}
        </div>`;
    _currentContainer.appendChild(wrapper);
}

/**
 *
 */
function _renderGrades(data) {
    if (!_currentContainer) return;
    const existing = _currentContainer.querySelector('#grades-page');
    if (existing) existing.remove();

    const chartCards = [
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

    chartCards.forEach(c => {
        const card = document.createElement('article');
        card.className = `chart-card chart-card--${c.variant}${c.wide ? ' chart-card--wide' : ''}`;
        card.setAttribute('role', 'listitem');
        card.id = c.id;

        card.innerHTML = `<div class="chart-card-header">
            <div class="chart-card-icon">${c.icon}</div>
            <div><h3 class="chart-title">${c.title}</h3><p class="chart-subtitle">${c.subtitle}</p></div>
        </div>
        <div class="chart-container" role="img" aria-label="${c.title} chart">
            <canvas id="${c.chartId}" style="width:100%;height:100%;display:none;" aria-label="${c.title} chart"></canvas>
        </div>`;
        grid.appendChild(card);
    });

    wrapper.appendChild(grid);

    const srAnnounce = document.createElement('p');
    srAnnounce.className = 'sr-only';
    srAnnounce.setAttribute('aria-live', 'polite');
    wrapper.appendChild(srAnnounce);

    _currentContainer.appendChild(wrapper);
    _renderCharts('all', data);
    _wireFilters(data);
}

/**
 *
 */
function _renderCharts(courseId, data) {
    const d = courseId === 'all' ? data : _filterCourseData(data, courseId);
    if (!d) return;

    destroyAllCharts();

    const barCanvas = document.getElementById('gradesQuizChart');
    if (barCanvas && d.quizScores) {
        barCanvas.style.display = '';
        createBarChart(
            barCanvas,
            {
                labels: d.quizScores.labels || ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                values: d.quizScores.data || [85, 92, 76, 98, 88],
            },
            {
                label: 'Score (%)',
                showLegend: false,
                backgroundColor: 'rgba(99, 102, 241, 0.85)',
                borderColor: '#6366f1',
            }
        );
    }

    const doughnutCanvas = document.getElementById('gradesAssignmentChart');
    if (doughnutCanvas && d.gradeDistribution) {
        doughnutCanvas.style.display = '';
        createDoughnutChart(
            doughnutCanvas,
            {
                labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
                values: d.gradeDistribution,
            },
            { showLegend: true, cutout: '65%' }
        );
    }

    const lineCanvas = document.getElementById('gradesWeeklyChart');
    if (lineCanvas && d.weeklyProgress) {
        lineCanvas.style.display = '';
        createLineChart(
            lineCanvas,
            {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                values: d.weeklyProgress.assignments || [60, 68, 75, 82, 90, 96],
            },
            { label: 'Assignments', yAxisLabel: 'Progress (%)', showLegend: false }
        );
    }

    createIcons({ icons });
}

/**
 *
 */
function _mapGradesData(rawData) {
    if (!rawData) return null;
    const quizLabels = (rawData.quizScores || []).map((q, i) => q.label || `Quiz ${i + 1}`);
    const quizData = (rawData.quizScores || []).map(q => (q.score != null ? q.score : q));
    const gradeDistArray = Array.isArray(rawData.gradeDistribution)
        ? rawData.gradeDistribution.map(g => (g.percentage != null ? g.percentage : g))
        : [30, 25, 20, 15, 10];
    const weeklyAssignments = (rawData.weeklyProgress || []).map(
        w => w.cumulative || w.assignments || w
    );
    return {
        quizScores: {
            labels: quizLabels.length
                ? quizLabels
                : ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
            data: quizData.length ? quizData : [85, 92, 76, 98, 88],
        },
        gradeDistribution: gradeDistArray,
        weeklyProgress: {
            assignments: weeklyAssignments.length ? weeklyAssignments : [60, 68, 75, 82, 90, 96],
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
            destroyAllCharts();
            _renderCharts(chip.dataset.course, data);
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
