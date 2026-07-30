import { createIcons, icons } from 'lucide';
import {
    createBarChart,
    createDoughnutChart,
    createLineChart,
    createChartSkeleton,
    createChartError,
    destroyAllCharts,
} from '../services/charts.js';
import { getStudentGrades } from '../services/studentApi.js';

let _currentContainer = null;
let _abortController = null;
let _isLoading = false;

/**
 *
 */
export function initGradesPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) {
        return {
            /**
             *
             */
            destroy() {},
        };
    }

    _currentContainer = pageContent;

    /**
     *
     */
    const handleRoute = event => {
        if (event.detail?.route === 'grades') {
            _fetchGradesData();
        }
    };

    document.addEventListener('pathway:route', handleRoute);

    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'grades') {
        _fetchGradesData();
    }

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
    wrapper.className = 'grades-page';
    wrapper.id = 'grades-page';
    const title = document.createElement('h1');
    title.className = 'route-placeholder-title';
    title.textContent = 'Grades';
    wrapper.appendChild(title);
    const grid = document.createElement('div');
    grid.className = 'grades-chart-grid';
    grid.appendChild(createChartSkeleton({ type: 'bar' }));
    grid.appendChild(createChartSkeleton({ type: 'doughnut' }));
    grid.appendChild(createChartSkeleton({ type: 'bar' }));
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
    wrapper.className = 'grades-page';
    wrapper.id = 'grades-page';

    const header = document.createElement('div');
    header.className = 'grades-header';
    header.innerHTML = `<h1 class="route-placeholder-title">Grades</h1>
        <p>Track your academic performance across quizzes, assignments, and weekly progress.</p>`;
    wrapper.appendChild(header);

    const filterBar = document.createElement('div');
    filterBar.className = 'grades-filter-bar';
    filterBar.innerHTML = `<button class="grades-chip active" data-course="all">All Courses</button>
        <button class="grades-chip" data-course="crs_001">Advanced Mathematics</button>
        <button class="grades-chip" data-course="crs_002">CS Fundamentals</button>
        <button class="grades-chip" data-course="crs_003">Physics II</button>`;
    wrapper.appendChild(filterBar);

    const grid = document.createElement('div');
    grid.className = 'grades-chart-grid';
    grid.id = 'grades-chart-grid';

    const quizSection = _createChartCard('Quiz Scores', 'bar');
    const assignmentSection = _createChartCard('Assignment Distribution', 'doughnut');
    const weeklySection = _createChartCard('Weekly Progress', 'line');

    grid.appendChild(quizSection);
    grid.appendChild(assignmentSection);
    grid.appendChild(weeklySection);
    wrapper.appendChild(grid);
    _currentContainer.appendChild(wrapper);

    _renderCharts('all', data);
    _wireFilters(data);
}

/**
 *
 */
function _createChartCard(title, type) {
    const card = document.createElement('div');
    card.className = `chart-card chart-card--${type}`;
    card.setAttribute('role', 'region');
    card.setAttribute('aria-label', title);
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${type}-${Date.now()}`;
    canvas.setAttribute('aria-label', `${title} chart`);
    const loadingEl = createChartSkeleton({ type });
    card.appendChild(loadingEl);
    card.appendChild(canvas);
    return card;
}

/**
 *
 */
function _renderCharts(courseId, data) {
    const d = courseId === 'all' ? data : _filterCourseData(data, courseId);
    if (!d) return;

    destroyAllCharts();

    const barCanvas = document.querySelector('.chart-card--bar canvas');
    if (barCanvas && d.quizScores) {
        createBarChart(
            barCanvas,
            {
                labels: d.quizScores.labels || ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                values: d.quizScores.data || [85, 92, 76, 98, 88],
            },
            { label: 'Score (%)', showLegend: false }
        );
        _hideSkeleton(barCanvas);
    }

    const doughnutCanvas = document.querySelector('.chart-card--doughnut canvas');
    if (doughnutCanvas && d.gradeDistribution) {
        createDoughnutChart(
            doughnutCanvas,
            {
                labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
                values: d.gradeDistribution,
            },
            { showLegend: true, cutout: '65%' }
        );
        _hideSkeleton(doughnutCanvas);
    }

    const lineCanvas = document.querySelector('.chart-card--line canvas');
    if (lineCanvas && d.weeklyProgress) {
        createLineChart(
            lineCanvas,
            {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                values: d.weeklyProgress.assignments || [60, 68, 75, 82, 90, 96],
            },
            { label: 'Assignments', yAxisLabel: 'Progress (%)', showLegend: false }
        );
        _hideSkeleton(lineCanvas);
    }

    createIcons({ icons });
}

/**
 *
 */
function _hideSkeleton(canvas) {
    const card = canvas.closest('.chart-card');
    if (card) {
        const skeleton = card.querySelector('[role="status"]');
        if (skeleton) skeleton.style.display = 'none';
        canvas.style.display = 'block';
    }
}

/**
 *
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
    wrapper.className = 'grades-page';
    wrapper.id = 'grades-page';
    const title = document.createElement('h1');
    title.className = 'route-placeholder-title';
    title.textContent = 'Grades';
    wrapper.appendChild(title);
    wrapper.appendChild(
        createChartError({
            message: error?.message || 'Unable to load grades',
            /**
             *
             */
            onRetry: () => _fetchGradesData(),
        })
    );
    _currentContainer.appendChild(wrapper);
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
        const studentId = _getStudentId();
        const data = await getStudentGrades(studentId);
        if (_abortController.signal.aborted) return;
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
    }
}

/**
 *
 */
function _getStudentId() {
    try {
        const authDataRaw = localStorage.getItem('student_tracker_auth');
        if (authDataRaw) {
            const authData = JSON.parse(authDataRaw);
            if (authData?.user?.id) return authData.user.id;
        }
    } catch (e) {
        console.warn('[GradesPage] Failed to parse auth token:', e);
    }
    return 'stu_001';
}

export default { initGradesPage };
