// =========================
// Day 2 - Quiz Scores Bar Chart
// =========================

const quizScores = {
    labels: [
        "Quiz 1",
        "Quiz 2",
        "Quiz 3",
        "Quiz 4",
        "Quiz 5"
    ],

    datasets: [
        {
            label: "Score (%)",

            data: [85, 92, 76, 98, 88],

            backgroundColor: [
                "#4F46E5",
                "#3B82F6",
                "#10B981",
                "#F59E0B",
                "#EF4444"
            ],

            borderRadius: 8,
            borderSkipped: false
        }
    ]
};

const quizConfig = {

    type: "bar",

    data: quizScores,

    options: {

        responsive: true,

        plugins: {

            legend: {
                display: false
            },

            title: {
                display: true,
                text: "Quiz Scores (%)",
                font: {
                    size: 20
                }
            },

            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Score: ${context.raw}%`;
                    }
                }
            }

        },

        scales: {

            y: {

                beginAtZero: true,
                max: 100,

                ticks: {
                    callback: function (value) {
                        return value + "%";
                    }
                },

                title: {
                    display: true,
                    text: "Percentage"
                }

            },

            x: {

                title: {
                    display: true,
                    text: "Quizzes"
                }

            }

        }

    }

};

const quizCtx = document.getElementById("quizChart");
new Chart(quizCtx, quizConfig);

// =========================
// Day 3 - Grade Distribution Doughnut Chart
// =========================

const gradeDistribution = {

    labels: [
        "Grade A",
        "Grade B",
        "Grade C",
        "Grade D",
        "Grade F"
    ],

    datasets: [
        {
            data: [40, 30, 15, 10, 5],

            backgroundColor: [
                "#22C55E",
                "#3B82F6",
                "#FACC15",
                "#F97316",
                "#EF4444"
            ],

            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 15
        }
    ]

};

const gradeConfig = {

    type: "doughnut",

    data: gradeDistribution,

    options: {

        responsive: true,
        maintainAspectRatio: false,

        cutout: "65%",

        layout: {
            padding: 10
        },

        plugins: {

            title: {
                display: false
            },

            legend: {

                position: "right",
                align: "center",

                labels: {

                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 12,
                    padding: 20,

                    font: {
                        size: 13
                    }

                }

            },

            tooltip: {

                callbacks: {

                    label: function (context) {

                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.raw / total) * 100).toFixed(1);

                        return `${context.label}: ${context.raw} Students (${percentage}%)`;

                    }

                }

            }

        }

    }

};

const gradeCtx = document.getElementById("gradeChart");
new Chart(gradeCtx, gradeConfig);


// =========================
// Day 4 - Weekly Progress Line Chart
// =========================

const weeklyProgress = {
    labels: [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6"
    ],

    datasets: [
        {
            label: "Assignments Completed",

            data: [60, 68, 75, 82, 90, 96],

            borderColor: "#4F46E5",

            backgroundColor: "rgba(79,70,229,0.15)",

            borderWidth: 3,

            pointRadius: 5,

            pointHoverRadius: 7,

            pointBackgroundColor: "#4F46E5",

            tension: 0.4,

            fill: true
        },

        {
            label: "Attendance",

            data: [90, 92, 88, 94, 96, 98],

            borderColor: "#10B981",

            backgroundColor: "rgba(16,185,129,0.15)",

            borderWidth: 3,

            pointRadius: 5,

            pointHoverRadius: 7,

            pointBackgroundColor: "#10B981",

            tension: 0.4,

            fill: false
        }
    ]
};

const weeklyProgressConfig = {

    type: "line",

    data: weeklyProgress,

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "top",

                labels: {

                    color: "#374151",

                    font: {

                        size: 13,

                        weight: "bold"

                    }

                }

            },

            tooltip: {

                backgroundColor: "#111827",

                titleColor: "#ffffff",

                bodyColor: "#ffffff",

                padding: 12,

                callbacks: {

                    label: function (context) {

                        return `${context.dataset.label}: ${context.parsed.y}%`;

                    }

                }

            }

        },

        scales: {

            y: {

                beginAtZero: true,

                max: 100,

                ticks: {

                    callback: function (value) {

                        return value + "%";

                    }

                },

                title: {

                    display: true,

                    text: "Progress (%)"

                }

            },

            x: {

                title: {

                    display: true,

                    text: "Weeks"

                }

            }

        }

    }

};

const weeklyProgressCtx = document.getElementById("weeklyProgressChart");

new Chart(weeklyProgressCtx, weeklyProgressConfig);
