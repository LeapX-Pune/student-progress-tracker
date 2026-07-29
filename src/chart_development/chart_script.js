import {
    PALETTE_5,
    TOOLTIP_DEFAULTS,
    RESPONSIVE_DEFAULTS,
    percentageYAxis,
    defaultXAxis,
    destroyAllCharts,
    registerChart,
} from '../utils/chartConfig.js';

// ---------------------------------------------------------------------------
// Chart teardown on re-import (HMR safety)
// ---------------------------------------------------------------------------
destroyAllCharts();

// =========================
// Day 2 — Quiz Scores Bar Chart
// =========================

const quizData = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
    datasets: [
        {
            label: 'Score (%)',
            data: [85, 92, 76, 98, 88],
            backgroundColor: PALETTE_5,
            borderRadius: 8,
            borderSkipped: false,
        },
    ],
};

const quizCtx = document.getElementById('quizChart');
if (quizCtx) {
    registerChart(
        'quiz',
        new Chart(quizCtx, {
            type: 'bar',
            data: quizData,
            options: {
                ...RESPONSIVE_DEFAULTS,
                plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: {
                        ...TOOLTIP_DEFAULTS,
                        callbacks: {
                            /** @param {import('chart.js').TooltipContext} ctx */
                            label(ctx) {
                                return `Score: ${ctx.raw}%`;
                            },
                        },
                    },
                },
                scales: {
                    y: percentageYAxis(),
                    x: defaultXAxis(),
                },
            },
        })
    );
}

// =========================
// Day 3 — Grade Distribution Doughnut Chart
// =========================

const gradeData = {
    labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
    datasets: [
        {
            data: [40, 30, 15, 10, 5],
            backgroundColor: ['#22C55E', '#3B82F6', '#FACC15', '#F97316', '#EF4444'],
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 15,
        },
    ],
};

const gradeCtx = document.getElementById('gradeChart');
if (gradeCtx) {
    registerChart(
        'grade',
        new Chart(gradeCtx, {
            type: 'doughnut',
            data: gradeData,
            options: {
                ...RESPONSIVE_DEFAULTS,
                cutout: '65%',
                layout: { padding: 10 },
                plugins: {
                    title: { display: false },
                    legend: {
                        position: 'right',
                        align: 'center',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 12,
                            padding: 20,
                            font: { size: 13 },
                        },
                    },
                    tooltip: {
                        ...TOOLTIP_DEFAULTS,
                        callbacks: {
                            /** @param {import('chart.js').TooltipContext} ctx */
                            label(ctx) {
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((ctx.raw / total) * 100).toFixed(1);
                                return `${ctx.label}: ${ctx.raw} Students (${pct}%)`;
                            },
                        },
                    },
                },
            },
        })
    );
}

// =========================
// Day 4 — Weekly Progress Line Chart
// =========================

const weeklyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
        {
            label: 'Assignments Completed',
            data: [60, 68, 75, 82, 90, 96],
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79,70,229,0.15)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#4F46E5',
            tension: 0.4,
            fill: true,
        },
        {
            label: 'Attendance',
            data: [90, 92, 88, 94, 96, 98],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16,185,129,0.15)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#10B981',
            tension: 0.4,
            fill: false,
        },
    ],
};

const weeklyCtx = document.getElementById('weeklyProgressChart');
if (weeklyCtx) {
    registerChart(
        'weeklyProgress',
        new Chart(weeklyCtx, {
            type: 'line',
            data: weeklyData,
            options: {
                ...RESPONSIVE_DEFAULTS,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#374151',
                            font: { size: 13, weight: 'bold' },
                        },
                    },
                    tooltip: {
                        ...TOOLTIP_DEFAULTS,
                        callbacks: {
                            /** @param {import('chart.js').TooltipContext} ctx */
                            label(ctx) {
                                return `${ctx.dataset.label}: ${ctx.parsed.y}%`;
                            },
                        },
                    },
                },
                scales: {
                    y: percentageYAxis('Progress (%)'),
                    x: defaultXAxis('Weeks'),
                },
            },
        })
    );
}
