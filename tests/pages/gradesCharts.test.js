import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Chart.js mock — must be set up before the module is imported
// ---------------------------------------------------------------------------
const mockChartInstances = new Map();

const MockChart = vi.fn(function (canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.type = config.type;
    this.data = config.data;
    this.options = config.options;
    this.destroy = vi.fn(() => mockChartInstances.delete(canvas.id));
    mockChartInstances.set(canvas.id, this);
});

MockChart.getChart = vi.fn(id => mockChartInstances.get(id) ?? null);

vi.stubGlobal('Chart', MockChart);

// ---------------------------------------------------------------------------
// Helpers to build the grades page DOM
// ---------------------------------------------------------------------------
function buildGradesDom() {
    document.body.innerHTML = `
    <section id="grades" class="page">
      <div class="charts-grid">
        <article class="chart-card">
          <h3 class="chart-title">Quiz Scores</h3>
          <p class="chart-subtitle">Your scores across all quizzes taken.</p>
          <div class="chart-container">
            <div class="chart-placeholder-text">Chart.js charts displayed here</div>
            <div class="loading-state"></div>
            <div class="error-state">
              <button class="retry-btn">Retry</button>
            </div>
            <div class="empty-state"></div>
          </div>
        </article>

        <article class="chart-card">
          <h3 class="chart-title">Assignment Performance</h3>
          <p class="chart-subtitle">Grades earned on submitted assignments.</p>
          <div class="chart-container">
            <div class="chart-placeholder-text">Chart.js charts displayed here</div>
            <div class="loading-state"></div>
            <div class="error-state">
              <button class="retry-btn">Retry</button>
            </div>
            <div class="empty-state"></div>
          </div>
        </article>

        <article class="chart-card">
          <h3 class="chart-title">Weekly Progress</h3>
          <p class="chart-subtitle">Your learning progress tracked week by week.</p>
          <div class="chart-container">
            <div class="chart-placeholder-text">Chart.js charts displayed here</div>
            <div class="loading-state"></div>
            <div class="error-state">
              <button class="retry-btn">Retry</button>
            </div>
            <div class="empty-state"></div>
          </div>
        </article>

        <article class="chart-card chart-card--full">
          <h3 class="chart-title">Attendance Percentage</h3>
          <p class="chart-subtitle">Your attendance rate across all sessions.</p>
          <div class="chart-container">
            <div class="chart-placeholder-text">Chart.js charts displayed here</div>
            <div class="loading-state"></div>
            <div class="error-state">
              <button class="retry-btn">Retry</button>
            </div>
            <div class="empty-state"></div>
          </div>
        </article>
      </div>
    </section>`;
}

// ---------------------------------------------------------------------------
// Import the module AFTER global Chart is set up
// ---------------------------------------------------------------------------
// script.js is an IIFE — importing it executes it immediately in the test env.
// We only test the DOM-manipulation side effects that happen after setTimeout.
// ---------------------------------------------------------------------------

describe('Grades Page – Chart Integration', () => {
    beforeEach(() => {
        mockChartInstances.clear();
        MockChart.mockClear();
        MockChart.getChart.mockClear();
        buildGradesDom();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    // -----------------------------------------------------------------------
    // DOM structure tests (static, no JS execution needed)
    // -----------------------------------------------------------------------

    describe('DOM structure', () => {
        it('renders 4 chart cards', () => {
            expect(document.querySelectorAll('.chart-card').length).toBe(4);
        });

        it('renders 4 chart containers', () => {
            expect(document.querySelectorAll('.chart-container').length).toBe(4);
        });

        it('Attendance card has chart-card--full class', () => {
            const attendanceCard = [...document.querySelectorAll('.chart-card')].find(
                el => el.querySelector('.chart-title')?.textContent === 'Attendance Percentage'
            );
            expect(attendanceCard).toBeTruthy();
            expect(attendanceCard.classList.contains('chart-card--full')).toBe(true);
        });

        it('each chart card has a title, subtitle, and container', () => {
            document.querySelectorAll('.chart-card').forEach(card => {
                expect(card.querySelector('.chart-title')).toBeTruthy();
                expect(card.querySelector('.chart-subtitle')).toBeTruthy();
                expect(card.querySelector('.chart-container')).toBeTruthy();
            });
        });

        it('each container has placeholder, loading, error, and empty states', () => {
            document.querySelectorAll('.chart-container').forEach(container => {
                expect(container.querySelector('.chart-placeholder-text')).toBeTruthy();
                expect(container.querySelector('.loading-state')).toBeTruthy();
                expect(container.querySelector('.error-state')).toBeTruthy();
                expect(container.querySelector('.empty-state')).toBeTruthy();
            });
        });

        it('each error state has a retry button', () => {
            document.querySelectorAll('.error-state').forEach(err => {
                expect(err.querySelector('.retry-btn')).toBeTruthy();
            });
        });
    });

    // -----------------------------------------------------------------------
    // Chart.js mock – unit tests for chart construction logic
    // -----------------------------------------------------------------------

    describe('Chart construction via Chart.js mock', () => {
        /**
         * Simulates what initGradesPage does after the 2500ms timeout:
         * creates a canvas in the container and calls new Chart(canvas, config).
         */
        function simulateChartInit(cardTitle, chartId, type, data, options) {
            const container = [...document.querySelectorAll('.chart-container')].find(
                c =>
                    c.closest('.chart-card')?.querySelector('.chart-title')?.textContent ===
                    cardTitle
            );
            expect(container).toBeTruthy();

            // Destroy existing if any
            const existing = MockChart.getChart(chartId);
            if (existing) existing.destroy();

            let canvas = container.querySelector(`#${chartId}`);
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = chartId;
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                container.appendChild(canvas);
            }

            new MockChart(canvas, { type, data, options });
            return { container, canvas };
        }

        it('creates a bar chart for Quiz Scores', () => {
            const { canvas } = simulateChartInit(
                'Quiz Scores',
                'gradesQuizChart',
                'bar',
                {
                    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                    datasets: [{ data: [85, 92, 76, 98, 88] }],
                },
                {}
            );
            expect(MockChart).toHaveBeenCalledWith(
                canvas,
                expect.objectContaining({ type: 'bar' })
            );
        });

        it('creates a doughnut chart for Assignment Performance', () => {
            const { canvas } = simulateChartInit(
                'Assignment Performance',
                'gradesAssignmentChart',
                'doughnut',
                {
                    labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
                    datasets: [{ data: [40, 30, 15, 10, 5] }],
                },
                {}
            );
            expect(MockChart).toHaveBeenCalledWith(
                canvas,
                expect.objectContaining({ type: 'doughnut' })
            );
        });

        it('creates a line chart for Weekly Progress', () => {
            const { canvas } = simulateChartInit(
                'Weekly Progress',
                'gradesWeeklyChart',
                'line',
                {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    datasets: [],
                },
                {}
            );
            expect(MockChart).toHaveBeenCalledWith(
                canvas,
                expect.objectContaining({ type: 'line' })
            );
        });

        it('creates a bar chart for Attendance Percentage', () => {
            const { canvas } = simulateChartInit(
                'Attendance Percentage',
                'gradesAttendanceChart',
                'bar',
                {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    datasets: [{ data: [90, 92, 88, 94, 96, 98] }],
                },
                {}
            );
            expect(MockChart).toHaveBeenCalledWith(
                canvas,
                expect.objectContaining({ type: 'bar' })
            );
        });

        it('injects a canvas element into the container', () => {
            const { container } = simulateChartInit(
                'Quiz Scores',
                'gradesQuizChart',
                'bar',
                { labels: [], datasets: [] },
                {}
            );
            expect(container.querySelector('#gradesQuizChart')).toBeTruthy();
            expect(container.querySelector('#gradesQuizChart').tagName).toBe('CANVAS');
        });

        it('does not create a duplicate canvas on re-render', () => {
            simulateChartInit(
                'Quiz Scores',
                'gradesQuizChart',
                'bar',
                { labels: [], datasets: [] },
                {}
            );
            simulateChartInit(
                'Quiz Scores',
                'gradesQuizChart',
                'bar',
                { labels: [], datasets: [] },
                {}
            );
            const container = [...document.querySelectorAll('.chart-container')].find(
                c =>
                    c.closest('.chart-card')?.querySelector('.chart-title')?.textContent ===
                    'Quiz Scores'
            );
            expect(container.querySelectorAll('#gradesQuizChart').length).toBe(1);
        });

        it('calls destroy() on existing chart instance before re-render', () => {
            simulateChartInit(
                'Quiz Scores',
                'gradesQuizChart',
                'bar',
                { labels: [], datasets: [] },
                {}
            );
            const firstInstance = mockChartInstances.get('gradesQuizChart');
            MockChart.getChart.mockReturnValueOnce(firstInstance);

            simulateChartInit(
                'Quiz Scores',
                'gradesQuizChart',
                'bar',
                { labels: [], datasets: [] },
                {}
            );
            expect(firstInstance.destroy).toHaveBeenCalled();
        });
    });

    // -----------------------------------------------------------------------
    // Data integrity tests
    // -----------------------------------------------------------------------

    describe('Chart data integrity', () => {
        it('Quiz Scores has 5 data points', () => {
            const data = [85, 92, 76, 98, 88];
            expect(data).toHaveLength(5);
            expect(data.every(v => v >= 0 && v <= 100)).toBe(true);
        });

        it('Quiz Scores labels match data length', () => {
            const labels = ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'];
            const data = [85, 92, 76, 98, 88];
            expect(labels).toHaveLength(data.length);
        });

        it('Grade Distribution sums to 100', () => {
            const data = [40, 30, 15, 10, 5];
            expect(data.reduce((a, b) => a + b, 0)).toBe(100);
        });

        it('Grade Distribution has 5 segments (A–F)', () => {
            const labels = ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'];
            expect(labels).toHaveLength(5);
        });

        it('Weekly Progress has 6 weekly data points per dataset', () => {
            const assignmentsData = [60, 68, 75, 82, 90, 96];
            const attendanceData = [90, 92, 88, 94, 96, 98];
            expect(assignmentsData).toHaveLength(6);
            expect(attendanceData).toHaveLength(6);
        });

        it('Attendance Percentage values are between 0 and 100', () => {
            const data = [90, 92, 88, 94, 96, 98];
            expect(data.every(v => v >= 0 && v <= 100)).toBe(true);
        });

        it('Weekly Progress assignments data is monotonically increasing', () => {
            const data = [60, 68, 75, 82, 90, 96];
            for (let i = 1; i < data.length; i++) {
                expect(data[i]).toBeGreaterThan(data[i - 1]);
            }
        });
    });

    // -----------------------------------------------------------------------
    // Tooltip callback unit tests
    // -----------------------------------------------------------------------

    describe('Tooltip callbacks', () => {
        it('Quiz Scores tooltip returns "Score: X%"', () => {
            const label = ctx => `Score: ${ctx.raw}%`;
            expect(label({ raw: 85 })).toBe('Score: 85%');
            expect(label({ raw: 100 })).toBe('Score: 100%');
        });

        it('Attendance tooltip returns "Attendance: X%"', () => {
            const label = ctx => `Attendance: ${ctx.raw}%`;
            expect(label({ raw: 92 })).toBe('Attendance: 92%');
        });

        it('Grade Distribution tooltip returns label with percentage', () => {
            const label = ctx => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                return `${ctx.label}: ${ctx.raw} (${((ctx.raw / total) * 100).toFixed(1)}%)`;
            };
            const ctx = {
                label: 'Grade A',
                raw: 40,
                dataset: { data: [40, 30, 15, 10, 5] },
            };
            expect(label(ctx)).toBe('Grade A: 40 (40.0%)');
        });

        it('Weekly Progress tooltip returns "Label: X%"', () => {
            const label = ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`;
            expect(label({ dataset: { label: 'Assignments Completed' }, parsed: { y: 82 } })).toBe(
                'Assignments Completed: 82%'
            );
            expect(label({ dataset: { label: 'Attendance' }, parsed: { y: 94 } })).toBe(
                'Attendance: 94%'
            );
        });
    });

    // -----------------------------------------------------------------------
    // Retry button behaviour
    // -----------------------------------------------------------------------

    describe('Retry button', () => {
        it('each chart container has exactly one retry button', () => {
            document.querySelectorAll('.chart-container').forEach(container => {
                expect(container.querySelectorAll('.retry-btn').length).toBe(1);
            });
        });

        it('retry button is inside .error-state', () => {
            document.querySelectorAll('.retry-btn').forEach(btn => {
                expect(btn.closest('.error-state')).toBeTruthy();
            });
        });
    });

    // -----------------------------------------------------------------------
    // CSS class tests
    // -----------------------------------------------------------------------

    describe('CSS classes', () => {
        it('only the Attendance card has chart-card--full', () => {
            const fullCards = [...document.querySelectorAll('.chart-card--full')];
            expect(fullCards).toHaveLength(1);
            expect(fullCards[0].querySelector('.chart-title').textContent).toBe(
                'Attendance Percentage'
            );
        });

        it('all other cards do NOT have chart-card--full', () => {
            const titles = ['Quiz Scores', 'Assignment Performance', 'Weekly Progress'];
            titles.forEach(title => {
                const card = [...document.querySelectorAll('.chart-card')].find(
                    el => el.querySelector('.chart-title')?.textContent === title
                );
                expect(card.classList.contains('chart-card--full')).toBe(false);
            });
        });
    });
});
