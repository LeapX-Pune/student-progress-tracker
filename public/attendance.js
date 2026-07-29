(function () {
    'use strict';

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
    }

    function loadCourseAttendance() {
        var grid = document.getElementById('courseAttendanceGrid');
        if (!grid) return;

        fetch('/api/attendance')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                renderCourseCards(grid, data);
            })
            .catch(function () {
                renderFallback(grid);
            });
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
        renderCourseCards(grid, fallback);
    }

    document.addEventListener('pathway:route', function (e) {
        if (e.detail && e.detail.route === 'attendance') {
            render();
        }
    });
})();
