// =========================
// Day 2 - Quiz Scores Bar Chart
// =========================

const quizScores = {
    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],

    datasets: [
        {
            label: 'Score (%)',

            data: [85, 92, 76, 98, 88],

            backgroundColor: ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],

            borderRadius: 8,
            borderSkipped: false,
        },
    ],
};

const quizConfig = {
    type: 'bar',

    data: quizScores,

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false,
            },

            title: {
                display: false,
            },

            tooltip: {
                callbacks: {
                    label(context) {
                        return `Score: ${context.raw}%`;
                    },
                },
            },
        },

        scales: {
            y: {
                beginAtZero: true,
                max: 100,

                ticks: {
                    font: { size: 11 },
                    callback(value) {
                        return value + '%';
                    },
                },

                title: {
                    display: false,
                },
            },

            x: {
                ticks: {
                    font: { size: 11 },
                    maxRotation: 0,
                    minRotation: 0,
                },

                title: {
                    display: false,
                },
            },
        },
    },
};

const quizCtx = document.getElementById('quizChart');
if (quizCtx) {
    new Chart(quizCtx, quizConfig);
}

// =========================
// Day 3 - Grade Distribution Doughnut Chart
// =========================

const gradeDistribution = {
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

const gradeConfig = {
    type: 'doughnut',

    data: gradeDistribution,

    options: {
        responsive: true,
        maintainAspectRatio: false,

        cutout: '65%',

        layout: {
            padding: 10,
        },

        plugins: {
            title: {
                display: false,
            },

            legend: {
                position: 'right',
                align: 'center',

                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 12,
                    padding: 20,

                    font: {
                        size: 13,
                    },
                },
            },

            tooltip: {
                callbacks: {
                    label(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.raw / total) * 100).toFixed(1);

                        return `${context.label}: ${context.raw} Students (${percentage}%)`;
                    },
                },
            },
        },
    },
};

const gradeCtx = document.getElementById('gradeChart');
if (gradeCtx) {
    new Chart(gradeCtx, gradeConfig);
}

// weeklyProgressChart is handled by dashboard.js with live data
