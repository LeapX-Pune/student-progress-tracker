// Dashboard theme and live data synchronization
let progressChartInstance = null;
const weeklyProgressData = [];

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

let allCoursesData = [];
let dashboardActions = null;

window.markNotificationRead = id => {
    if (dashboardActions && dashboardActions.markNotificationRead) {
        dashboardActions.markNotificationRead(id);
    }
};

window.markActivityComplete = id => {
    if (dashboardActions && dashboardActions.markActivityComplete) {
        dashboardActions.markActivityComplete(id);
    }
};

let quizChartInstance = null;
let gradeChartInstance = null;

/**
 * Update the circular attendance ring
 */
function updateAttendanceRing(avgAttendance) {
    const progressTextEl = document.querySelector('.progress-text');
    if (progressTextEl) {
        progressTextEl.innerHTML = `<span style="font-size: 0.6rem; font-weight: 600; display: block; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1;">Att.</span><span style="font-size: 0.85rem; font-weight: 800; display: block; margin-top: 0.1rem;">${avgAttendance}%</span>`;
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

/**
 * Render the Quiz Scores Bar Chart
 */
function renderQuizChart(quizScores) {
    const ctx = document.getElementById('quizChart');
    if (!ctx) return;

    if (quizChartInstance) {
        quizChartInstance.destroy();
    }

    const labels = quizScores.map(q => q.label);
    const data = quizScores.map(q => q.score);

    quizChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Score (%)',
                    data,
                    backgroundColor: ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
                    borderRadius: 8,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        /**
                         *
                         */
                        label: c => `Score: ${c.raw}%`,
                    },
                },
            },
            scales: {
                y: { beginAtZero: true, max: 100 },
            },
        },
    });
}

/**
 * Render the Grade Distribution Doughnut Chart
 */
function renderGradeChart(distribution) {
    const ctx = document.getElementById('gradeChart');
    if (!ctx) return;

    if (gradeChartInstance) {
        gradeChartInstance.destroy();
    }

    if (distribution.length === 0) {
        // Clear canvas context if empty state is desired
        return;
    }

    const labels = distribution.map(d => `Grade ${d.label}`);
    const data = distribution.map(d => d.percentage);

    gradeChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: ['#22C55E', '#3B82F6', '#FACC15', '#F97316', '#EF4444'],
                    borderWidth: 3,
                    hoverOffset: 4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
                tooltip: {
                    callbacks: {
                        /**
                         *
                         */
                        label: c => ` ${c.label}: ${c.raw}%`,
                    },
                },
            },
        },
    });
}

/**
 *
 */
function renderAcademicSummary(summary) {
    const container = document.getElementById('academicSummaryContainer');
    if (!container) return;

    if (!summary) {
        container.innerHTML =
            '<div style="color: var(--text-secondary);">No academic data available.</div>';
        return;
    }

    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Overall GPA</span>
                <span style="font-weight: 600;">${summary.overallGpa || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Credits Earned</span>
                <span style="font-weight: 600;">${summary.creditsEarned || 0} / ${summary.totalRegisteredCredits || 0}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Credits Remaining</span>
                <span style="font-weight: 600;">${summary.creditsRemaining || 0}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Semester</span>
                <span style="font-weight: 600;">${summary.currentSemester || 'N/A'}</span>
            </div>
        </div>
    `;
}

/**
 *
 */
function renderInsights(insights, attendance) {
    const container = document.getElementById('insightsContainer');
    if (!container) return;

    if (!insights && !attendance) {
        container.innerHTML =
            '<div style="color: var(--text-secondary);">No insights available.</div>';
        return;
    }

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Best Subject</span>
            <span style="font-weight: 600;">${insights?.bestSubject || 'N/A'}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Needs Improvement</span>
            <span style="font-weight: 600;">${insights?.needsImprovement || 'N/A'}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-secondary);">Attendance Trend</span>
            <span style="font-weight: 600;">${attendance?.trend ? attendance.trend.charAt(0).toUpperCase() + attendance.trend.slice(1) : 'N/A'}</span>
        </div>
    `;
}

/**
 *
 */
function renderUpcomingActivities(activities) {
    const container = document.getElementById('upcomingContainer');
    if (!container) return;

    if (!activities || activities.length === 0) {
        container.innerHTML =
            '<div style="color: var(--text-secondary); font-size: 0.875rem;">No upcoming activities.</div>';
        return;
    }

    container.innerHTML = activities;
    container.innerHTML = activities
        .map(
            act => `
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 600; text-decoration: ${act.status === 'completed' ? 'line-through' : 'none'}; color: ${act.status === 'completed' ? 'var(--text-secondary)' : 'inherit'};">${act.title}</span>
                <span style="color: var(--text-secondary); font-size: 0.75rem;">${act.course} • ${act.type}</span>
            </div>
            ${
                act.status === 'completed'
                    ? `<span style="font-weight: 600; font-size: 0.75rem; color: #10b981;">Completed</span>`
                    : `<button onclick="window.markActivityComplete('${act.id}')" style="background: none; border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.75rem; cursor: pointer;">Mark Done</button>`
            }
        </div>
    `
        )
        .join(
            '<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 0.25rem 0;" />'
        );
}

/**
 *
 */
function renderNotifications(notifications) {
    const container = document.getElementById('notificationsContainer');
    if (!container) return;

    if (!notifications || notifications.length === 0) {
        container.innerHTML =
            '<div style="color: var(--text-secondary); font-size: 0.875rem;">No new notifications.</div>';
        return;
    }

    container.innerHTML = notifications
        .map(notif => {
            const color =
                notif.type === 'success'
                    ? '#10b981'
                    : notif.type === 'warning'
                      ? '#f59e0b'
                      : '#3b82f6';
            return `
        <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem; opacity: ${notif.isRead ? 0.6 : 1}; transition: opacity 0.2s;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: ${color}; cursor: pointer;" ${!notif.isRead ? `onclick="window.markNotificationRead('${notif.id}')"` : ''}>${notif.title}</span>
                ${!notif.isRead ? `<span onclick="window.markNotificationRead('${notif.id}')" style="width: 8px; height: 8px; border-radius: 50%; background-color: #ef4444; cursor: pointer; box-shadow: 0 0 4px #ef4444;"></span>` : ''}
            </div>
            <span style="color: var(--text-secondary); line-height: 1.4;">${notif.message}</span>
            <span style="color: var(--text-secondary); font-size: 0.7rem;">${formatDate(notif.timestamp)}</span>
        </div>
    `;
        })
        .join(
            '<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 0.25rem 0;" />'
        );
}

/**
 * Initialize dashboard data via window.parent.useDashboard hook
 */
function initDashboardData() {
    const useDashboard = window.parent?.useDashboard || window.useDashboard;
    if (!useDashboard) {
        console.warn(
            'Dashboard dependencies not found on window object. Ensure main app has exported them.'
        );
        renderCourses([]);
        renderWeeklyProgressChart([]);
        return;
    }

    dashboardActions = useDashboard({
        /**
         *
         */
        onLoading: () => {
            // Optional: Show loading indicators if implemented
        },
        /**
         *
         */
        onSuccess: data => {
            const { profile, courses, grades, metrics, notifications, upcoming, insights } = data;

            // 1. Profile bindings
            const nameEl = document.getElementById('studentName');
            const emailEl = document.getElementById('studentEmail');
            const idEl = document.getElementById('studentId');
            const avatarEl = document.getElementById('studentAvatar');
            const sinceEl = document.getElementById('studentSince');

            if (nameEl && profile.name) nameEl.textContent = profile.name;
            if (emailEl && profile.email) emailEl.textContent = profile.email;
            if (idEl) idEl.textContent = profile.studentId || profile.id;
            if (avatarEl && profile.avatarUrl) {
                avatarEl.src = profile.avatarUrl;
                avatarEl.alt = profile.name;
            }
            if (sinceEl && profile.enrolledAt) {
                sinceEl.textContent = `Student since ${formatDate(profile.enrolledAt)}`;
            }

            // 2. Courses bindings
            allCoursesData = courses && courses.length > 0 ? courses : [];
            renderCourses(allCoursesData);

            // 3. Charts bindings
            if (grades) {
                if (grades.weeklyProgress) {
                    const mappedProgress = grades.weeklyProgress.map((w, index) => ({
                        week: index + 1,
                        cumulative: w.completed * 10,
                    }));
                    renderWeeklyProgressChart(mappedProgress);
                } else {
                    renderWeeklyProgressChart([]);
                }

                if (grades.quizScores) {
                    renderQuizChart(grades.quizScores);
                } else {
                    renderQuizChart([]);
                }

                if (grades.gradeDistribution) {
                    renderGradeChart(grades.gradeDistribution);
                } else {
                    renderGradeChart([]);
                }
            } else {
                renderWeeklyProgressChart([]);
                renderQuizChart([]);
                renderGradeChart([]);
            }

            // 4. Attendance ring and GPA (derived from metrics or grades)
            const attendance =
                metrics?.attendanceOverview?.overallAttendance ?? grades?.overallAttendance ?? 0;
            updateAttendanceRing(attendance);

            // 5. New widgets
            renderAcademicSummary(metrics?.academicSummary);
            renderInsights(insights, metrics?.attendanceOverview);
            renderUpcomingActivities(upcoming);
            renderNotifications(notifications);
        },
        /**
         *
         */
        onError: err => {
            console.error('Failed to load dashboard data:', err);
            // Fallback to static UI if API fails
            allCoursesData = [];
            renderCourses(allCoursesData);
            renderWeeklyProgressChart([]);
            renderQuizChart([]);
            renderGradeChart([]);
            renderAcademicSummary(null);
            renderInsights(null, null);
            renderUpcomingActivities([]);
            renderNotifications([]);
        },
    });

    dashboardActions.fetch();

    // Bind search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = allCoursesData.filter(
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
                    <span class="status-badge-new ${course.status}">
                        ${course.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
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
 * Render the Weekly Progress Chart using Chart.js
 */
function renderWeeklyProgressChart(progressData) {
    const ctx = document.getElementById('weeklyProgressChart');
    if (!ctx) return;

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
    initDashboardData();
});
