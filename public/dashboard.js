/* global DOMParser */

// Dashboard theme and live data synchronization
let progressChartInstance = null;
let weeklyProgressData = [];

/**
 *
 */
function applyTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    // Re-render chart if data exists to apply updated colors (grid, text)
    if (weeklyProgressData && weeklyProgressData.length > 0) {
        renderWeeklyProgressChart(weeklyProgressData);
    }
}

// Initial application
applyTheme();

// Helper to format date
/**
 *
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch (_e) {
        return dateString;
    }
}

// Helper to get grade letters
/**
 *
 */
function getGradeLetter(grade) {
    if (grade >= 90) return 'A';
    if (grade >= 85) return 'B+';
    if (grade >= 80) return 'B';
    if (grade >= 75) return 'C+';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
}

const DEFAULT_MOCK_COURSES = [
    {
        id: 'course_001',
        studentId: 'stu_001',
        title: 'Full Stack Web Development',
        instructor: 'Dr. Ankit Verma',
        thumbnailUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMiw4eziKnZ6okVY_lRgegT53w_bfaxA5sUs0Ng0QbCs4QwyszbRkV2Eq-&s=10',
        description:
            'Complete web development bootcamp covering HTML, CSS, JavaScript, React, Node.js',
        totalModules: 20,
        completedModules: 13,
        status: 'in-progress',
        currentGrade: 87.5,
        term: 'Spring 2024',
        lastAccessedAt: '2024-01-19T10:00:00Z',
        nextModule: 'React Hooks Deep Dive',
    },
    {
        id: 'course_002',
        studentId: 'stu_001',
        title: 'Data Structures & Algorithms',
        instructor: 'Prof. Priya Sharma',
        thumbnailUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU3_ZKJtTtwNplnn5J4iYmalV0v4rGBSDaWKPolk8j-WnHkPnlzumMXzc&s=10',
        description: 'Fundamental algorithms and data structures for technical interviews',
        totalModules: 15,
        completedModules: 8,
        status: 'in-progress',
        currentGrade: 78.2,
        term: 'Spring 2024',
        lastAccessedAt: '2024-01-18T14:30:00Z',
        nextModule: 'Graph Traversal Algorithms',
    },
    {
        id: 'course_003',
        studentId: 'stu_001',
        title: 'UX Design Fundamentals',
        instructor: 'Prof. Sneha Iyer',
        thumbnailUrl: 'https://spot-digital.com.tw/wp-content/uploads/2025/06/UIUX-1024x683.webp',
        description: 'User experience design principles, research, and prototyping',
        totalModules: 12,
        completedModules: 12,
        status: 'completed',
        currentGrade: 94.0,
        term: 'Fall 2023',
        lastAccessedAt: '2023-12-15T09:00:00Z',
    },
];

const DEFAULT_WEEKLY_PROGRESS = [
    { week: 1, dateRange: 'Jan 8-14', cumulative: 15 },
    { week: 2, dateRange: 'Jan 15-21', cumulative: 37 },
    { week: 3, dateRange: 'Jan 22-28', cumulative: 67 },
    { week: 4, dateRange: 'Jan 29-Feb 4', cumulative: 105 },
];

/**
 *
 */
async function loadStudentData() {
    // Determine active student
    let studentId = 'stu_001'; // Default fallback
    try {
        const authDataRaw = localStorage.getItem('student_tracker_auth');
        if (authDataRaw) {
            const authData = JSON.parse(authDataRaw);
            if (authData && authData.user && authData.user.id) {
                studentId = authData.user.id;
            }
        }
    } catch (e) {
        console.warn('Failed to parse auth token from localStorage:', e);
    }

    const apiBaseUrl = 'http://localhost:3001/api';

    // 1. Fetch Student Profile
    try {
        const studentResponse = await fetch(`${apiBaseUrl}/students/${studentId}`);
        if (studentResponse.ok) {
            const student = await studentResponse.json();

            const nameEl = document.getElementById('studentName');
            const emailEl = document.getElementById('studentEmail');
            const idEl = document.getElementById('studentId');
            const avatarEl = document.getElementById('studentAvatar');
            const sinceEl = document.getElementById('studentSince');

            if (nameEl) nameEl.textContent = student.name;
            if (emailEl) emailEl.textContent = student.email;
            if (idEl) idEl.textContent = student.studentId || student.id;
            if (avatarEl && student.avatarUrl) {
                avatarEl.src = student.avatarUrl;
                avatarEl.alt = student.name;
            }
            if (sinceEl && student.enrolledAt) {
                sinceEl.textContent = `Student since ${formatDate(student.enrolledAt)}`;
            }
        }
    } catch (e) {
        console.error('Failed to load student profile:', e);
    }

    // 2. Fetch and render Courses
    let allCourses = [];
    try {
        const coursesResponse = await fetch(`${apiBaseUrl}/students/${studentId}/courses`);
        if (coursesResponse.ok) {
            allCourses = await coursesResponse.json();
        }
    } catch (e) {
        console.error('Failed to load student courses:', e);
    }

    // If courses couldn't be loaded or list is empty, fallback to DEFAULT_MOCK_COURSES
    if (!allCourses || allCourses.length === 0) {
        allCourses = DEFAULT_MOCK_COURSES;
    }

    renderCourses(allCourses);

    // Bind search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = allCourses.filter(
                course =>
                    course.title.toLowerCase().includes(query) ||
                    (course.description && course.description.toLowerCase().includes(query)) ||
                    (course.instructor && course.instructor.toLowerCase().includes(query))
            );
            renderCourses(filtered);
        });
    }
}

/**
 *
 */
function renderCourses(courses) {
    const listContainer = document.querySelector('.course-list-container');
    if (!listContainer) return;

    if (courses.length === 0) {
        listContainer.innerHTML = '<div class="no-courses-message">No courses found.</div>';
        return;
    }

    const colors = ['purple', 'blue', 'green'];
    listContainer.innerHTML = courses
        .map((course, index) => {
            const colorClass = colors[index % colors.length];

            const progressPercent =
                course.totalModules > 0
                    ? Math.round((course.completedModules / course.totalModules) * 100)
                    : 0;

            const nextModuleHtml = course.nextModule
                ? `<div class="course-next-module">
                    <span class="next-label">Next:</span>
                    <span class="next-value">${course.nextModule}</span>
                </div>`
                : '';

            return `
            <div class="course-item-box ${colorClass}" style="margin-bottom: 1.25rem;">
                <div class="course-card-header">
                    <div class="course-card-header-text">
                        <h3 class="course-title-sub">${course.title}</h3>
                        <p class="course-instructor">${course.instructor}</p>
                    </div>
                    <span class="status-badge-new ${course.status}">${course.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                </div>

                <div class="course-details-grid">
                    <div>
                        <span class="label">Modules:</span>
                        <span class="value">${course.completedModules} / ${course.totalModules}</span>
                    </div>
                    <div>
                        <span class="label">Grade:</span>
                        <span class="value">${course.currentGrade ? `${getGradeLetter(course.currentGrade)} (${course.currentGrade}%)` : 'N/A'}</span>
                    </div>
                </div>

                ${nextModuleHtml}

                <div class="course-progress-section">
                    <div class="course-progress-header">
                        <span>Progress</span>
                        <span>${progressPercent}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>
            </div>
        `;
        })
        .join('');
}

/**
 *
 */
async function updateLiveAttendance() {
    try {
        const response = await fetch('index.html');
        if (!response.ok) return;
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const template = doc.getElementById('attendance-template');
        if (template) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = template.innerHTML;

            // Find Avg Attendance value
            const cards = tempDiv.querySelectorAll('.stat-card');
            let avgAttendance = '96.2%'; // Fallback
            cards.forEach(card => {
                const label = card.querySelector('.stat-card-label');
                if (label && label.textContent.trim().toLowerCase().includes('avg attendance')) {
                    const valueEl = card.querySelector('.stat-card-value');
                    if (valueEl) {
                        avgAttendance = valueEl.textContent.trim();
                    }
                }
            });

            // Update the UI
            const progressTextEl = document.querySelector('.progress-text');
            if (progressTextEl) {
                progressTextEl.innerHTML = `<span style="font-size: 0.6rem; font-weight: 600; display: block; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1;">Att.</span><span style="font-size: 0.85rem; font-weight: 800; display: block; margin-top: 0.1rem;">${avgAttendance}</span>`;
            }

            const progressValue = parseFloat(avgAttendance);
            if (!isNaN(progressValue)) {
                const r = 26;
                const circumference = 2 * Math.PI * r;
                const offset = circumference - (progressValue / 100) * circumference;
                const circleBar = document.querySelector('.progress-ring-circle-bar');
                if (circleBar) {
                    circleBar.style.strokeDasharray = `${circumference}`;
                    circleBar.style.strokeDashoffset = `${offset}`;
                }
            }
        }
    } catch (e) {
        console.error('Failed to fetch live attendance:', e);
    }
}

/**
 *
 */
async function loadWeeklyProgress() {
    const apiBaseUrl = 'http://localhost:3001/api';
    try {
        const response = await fetch(`${apiBaseUrl}/weeklyProgress`);
        if (response.ok) {
            weeklyProgressData = await response.json();
        }
    } catch (e) {
        console.error('Failed to fetch weekly progress:', e);
    }

    if (!weeklyProgressData || weeklyProgressData.length === 0) {
        weeklyProgressData = DEFAULT_WEEKLY_PROGRESS;
    }

    renderWeeklyProgressChart(weeklyProgressData);
}

/**
 *
 */
function renderWeeklyProgressChart(progressData) {
    const ctx = document.getElementById('weeklyProgressChart');
    if (!ctx) return;

    const existing = Chart.getChart(ctx);
    if (existing) existing.destroy();
    if (progressChartInstance) {
        progressChartInstance.destroy();
    }

    const isDark = document.body.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.8)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const labels = progressData.map(d => `Week ${d.week}`);
    const data = progressData.map(d => d.cumulative);

    progressChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Cumulative Progress',
                    data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointHoverRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#121824',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 8,
                },
            },
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Inter' } },
                    title: { display: true, text: 'Progress (cumulative)', color: textColor },
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: 'Inter' } },
                },
            },
        },
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');
    applyTheme();
    loadStudentData();
    updateLiveAttendance();
    loadWeeklyProgress();

    // Bar Chart (Homework / Quiz Scores)
    const quizCtx = document.getElementById('quizChart');
    if (quizCtx && typeof Chart !== 'undefined') {
        new Chart(quizCtx, {
            type: 'bar',
            data: {
                labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                datasets: [{
                    label: 'Score (%)',
                    data: [85, 92, 76, 98, 88],
                    backgroundColor: ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: { callbacks: { label: ctx => `Score: ${ctx.raw}%` } }
                },
                scales: {
                    y: {
                        beginAtZero: true, max: 100,
                        ticks: { font: { size: 11 }, callback: v => v + '%' },
                        title: { display: false }
                    },
                    x: {
                        ticks: { font: { size: 11 }, maxRotation: 0, minRotation: 0 },
                        title: { display: false }
                    }
                }
            }
        });
    }

    // Doughnut Chart (Grade Distribution / Friends Score)
    const gradeCtx = document.getElementById('gradeChart');
    if (gradeCtx && typeof Chart !== 'undefined') {
        new Chart(gradeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
                datasets: [{
                    data: [40, 30, 15, 10, 5],
                    backgroundColor: ['#22C55E', '#3B82F6', '#FACC15', '#F97316', '#EF4444'],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                layout: { padding: 10 },
                plugins: {
                    title: { display: false },
                    legend: {
                        position: 'right', align: 'center',
                        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 12, padding: 20, font: { size: 12 } }
                    },
                    tooltip: {
                        callbacks: {
                            label(ctx) {
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((ctx.raw / total) * 100).toFixed(1);
                                return `${ctx.label}: ${ctx.raw} Students (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
});
