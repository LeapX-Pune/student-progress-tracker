(function () {
    'use strict';

    var chartInstance = null;
    var currentData = null;

    function destroyChart() {
        if (chartInstance && typeof chartInstance.destroy === 'function') {
            chartInstance.destroy();
            chartInstance = null;
        }
    }

    function render() {
        var container = document.querySelector('[data-page-content]');
        if (!container) return;

        var template = document.getElementById('attendance-template');
        if (!template) return;

        var clone = template.content.cloneNode(true);
        container.innerHTML = '';
        container.appendChild(clone);

        if (typeof createIcons === 'function') {
            createIcons({
                icons:
                    typeof iconsAndAliases_exports !== 'undefined'
                        ? iconsAndAliases_exports
                        : undefined,
            });
        }

        loadCourseAttendance();
        loadChartJS(createDonutChart);
    }

    function loadCourseAttendance() {
        var grid = document.getElementById('courseAttendanceGrid');
        if (!grid) return;

        fetch('/api/attendance')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                currentData = data;
                renderCourseCards(grid, data);
                updateBreakdownStats(data);
                if (chartInstance) {
                    updateDonutChart(data);
                }
            })
            .catch(function () {
                renderFallback(grid);
            });
    }

    function updateBreakdownStats(data) {
        var totalPresent = 0, totalAbsent = 0, totalLate = 0;
        for (var i = 0; i < data.length; i++) {
            totalPresent += data[i].attended || 0;
            totalAbsent += data[i].absent || 0;
            totalLate += data[i].late || 0;
        }
        var presentEl = document.getElementById('presentCount');
        var absentEl = document.getElementById('absentCount');
        var lateEl = document.getElementById('lateCount');
        if (presentEl) presentEl.textContent = totalPresent;
        if (absentEl) absentEl.textContent = totalAbsent;
        if (lateEl) lateEl.textContent = totalLate;
    }

    function loadChartJS(callback) {
        if (typeof Chart !== 'undefined') {
            callback();
            return;
        }

        var existing = document.querySelector('script[data-chartjs-loader]');
        if (existing) {
            existing.addEventListener('load', callback);
            return;
        }

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js';
        script.crossOrigin = 'anonymous';
        script.dataset.chartjsLoader = 'true';
        script.onload = callback;
        script.onerror = function () {
            console.error('[Attendance] Failed to load Chart.js');
        };
        document.head.appendChild(script);
    }

    function createDonutChart() {
        var canvas = document.getElementById('attendanceDonutChart');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Late'],
                datasets: [
                    {
                        data: [94.2, 3.8, 2.0],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                        borderWidth: 0,
                        hoverOffset: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                animation: { duration: 600, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleFont: { family: 'Inter, system-ui, sans-serif', size: 12 },
                        bodyFont: {
                            family: 'Inter, system-ui, sans-serif',
                            size: 13,
                            weight: '600',
                        },
                        padding: { x: 12, y: 8 },
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function (ctx) {
                                return ctx.parsed + '%';
                            },
                        },
                    },
                },
            },
        });

        if (currentData) {
            updateDonutChart(currentData);
        }
    }

    function updateDonutChart(data) {
        if (!chartInstance) return;

        var totalPresent = 0, totalAbsent = 0, totalLate = 0, totalAll = 0;
        for (var i = 0; i < data.length; i++) {
            totalPresent += data[i].attended || 0;
            totalAbsent += data[i].absent || 0;
            totalLate += data[i].late || 0;
        }
        totalAll = totalPresent + totalAbsent + totalLate;
        if (totalAll === 0) return;

        var presentPct = Math.round((totalPresent / totalAll) * 1000) / 10;
        var absentPct = Math.round((totalAbsent / totalAll) * 1000) / 10;
        var latePct = Math.round((totalLate / totalAll) * 1000) / 10;

        chartInstance.data.datasets[0].data = [presentPct, absentPct, latePct];
        chartInstance.update();
    }

    function renderCourseCards(grid, courses) {
        var colors = ['#8b5cf6', '#3b82f6', '#10b981'];
        var html = '';
        for (var i = 0; i < courses.length; i++) {
            html += buildCard(courses[i], colors[i % colors.length]);
        }
        grid.innerHTML = html;
    }

    function buildCard(course, color) {
        var pct = course.percentage;
        var badgeClass = getBadgeClass(pct);
        var badgeLabel = getBadgeLabel(pct);
        var missed = course.absent + course.late;
        var barWidth = Math.min(pct, 100);

        return [
            '<div class="course-attendance-card">',
            '  <div class="course-attendance-accent" style="background:' + color + '"></div>',
            '  <div class="course-attendance-header">',
            '    <h3 class="course-attendance-name">' + course.courseName + '</h3>',
            '    <span class="course-attendance-badge ' + badgeClass + '">' + badgeLabel + '</span>',
            '  </div>',
            '  <div class="course-attendance-pct">',
            '    <div class="course-attendance-pct-value" style="color:' + color + '">' + pct + '%</div>',
            '    <div class="course-attendance-pct-label">Attendance Rate</div>',
            '  </div>',
            '  <div class="course-attendance-stats">',
            '    <div class="course-attendance-stat">',
            '      <span class="course-attendance-stat-value">' + course.totalClasses + '</span>',
            '      <span class="course-attendance-stat-label">Total</span>',
            '    </div>',
            '    <div class="course-attendance-divider"></div>',
            '    <div class="course-attendance-stat">',
            '      <span class="course-attendance-stat-value">' + course.attended + '</span>',
            '      <span class="course-attendance-stat-label">Attended</span>',
            '    </div>',
            '    <div class="course-attendance-divider"></div>',
            '    <div class="course-attendance-stat">',
            '      <span class="course-attendance-stat-value">' + missed + '</span>',
            '      <span class="course-attendance-stat-label">Missed</span>',
            '    </div>',
            '    <div class="course-attendance-divider"></div>',
            '    <div class="course-attendance-stat">',
            '      <span class="course-attendance-stat-value">' + course.late + '</span>',
            '      <span class="course-attendance-stat-label">Late</span>',
            '    </div>',
            '  </div>',
            '  <div class="course-attendance-bar-wrap">',
            '    <div class="course-attendance-bar">',
            '      <div class="course-attendance-bar-fill" style="width:' + barWidth + '%; background:' + color + '"></div>',
            '    </div>',
            '    <div class="course-attendance-bar-label">',
            '      <span>' + course.attended + ' / ' + course.totalClasses + ' classes</span>',
            '      <span>' + pct + '%</span>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    function getBadgeClass(pct) {
        if (pct >= 90) return 'badge-excellent';
        if (pct >= 75) return 'badge-good';
        if (pct >= 60) return 'badge-warning';
        return 'badge-danger';
    }

    function getBadgeLabel(pct) {
        if (pct >= 90) return 'Excellent';
        if (pct >= 75) return 'Good';
        if (pct >= 60) return 'At Risk';
        return 'Poor';
    }

    function renderFallback(grid) {
        var fallback = [
            { courseName: 'UX Design Fundamentals', totalClasses: 30, attended: 28, absent: 1, late: 1, percentage: 93.3 },
            { courseName: 'Data Structures & Algorithms', totalClasses: 45, attended: 41, absent: 2, late: 2, percentage: 91.1 },
            { courseName: 'Full Stack Web Development', totalClasses: 38, attended: 36, absent: 1, late: 1, percentage: 94.7 }
        ];
        currentData = fallback;
        renderCourseCards(grid, fallback);
        updateBreakdownStats(fallback);
        if (chartInstance) {
            updateDonutChart(fallback);
        }
    }

    document.addEventListener('pathway:route', function (e) {
        if (e.detail && e.detail.route === 'attendance') {
            destroyChart();
            render();
        }
    });
})();
