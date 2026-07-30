(function () {
    'use strict';

    var cachedStudentId = 'stu_001';

    function render() {
        var container = document.querySelector('[data-page-content]');
        if (!container) return;

        container.innerHTML = [
            '<div class="overview-page">',
            '  <div class="page-header">',
            '    <h1>Overview</h1>',
            '    <p>Welcome back! Here\'s your academic summary.</p>',
            '  </div>',
            '  <div class="overview-profile-card" id="overviewProfile">',
            '    <div class="overview-profile-avatar" id="profileAvatar">SS</div>',
            '    <div class="overview-profile-info">',
            '      <h2 class="overview-profile-name" id="profileName">-</h2>',
            '      <p class="overview-profile-detail" id="profileEmail">-</p>',
            '      <p class="overview-profile-detail" id="profileId">-</p>',
            '    </div>',
            '  </div>',
            '  <div class="overview-stats-grid" id="overviewStats">',
            '    <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Courses</span><span class="stat-card-icon"><i data-lucide="book-open" aria-hidden="true"></i></span></div><div class="stat-card-value">-</div></div>',
            '    <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Attendance</span><span class="stat-card-icon"><i data-lucide="calendar-check" aria-hidden="true"></i></span></div><div class="stat-card-value">-</div></div>',
            '    <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Avg Grade</span><span class="stat-card-icon"><i data-lucide="trending-up" aria-hidden="true"></i></span></div><div class="stat-card-value">-</div></div>',
            '    <div class="stat-card"><div class="stat-card-header"><span class="stat-card-label">Completed</span><span class="stat-card-icon"><i data-lucide="check-circle" aria-hidden="true"></i></span></div><div class="stat-card-value">-</div></div>',
            '  </div>',
            '  <div class="overview-section">',
            '    <div class="overview-section-header">',
            '      <h2 class="overview-section-title">Course Progress</h2>',
            '      <p class="overview-section-subtitle">Your enrolled courses at a glance.</p>',
            '    </div>',
            '    <div class="overview-courses-grid" id="overviewCourses"></div>',
            '  </div>',
            '  <div class="overview-section">',
            '    <div class="overview-section-header">',
            '      <h2 class="overview-section-title">Recent Activity</h2>',
            '      <p class="overview-section-subtitle">Your latest course activity.</p>',
            '    </div>',
            '    <div class="overview-activity" id="overviewActivity"></div>',
            '  </div>',
            '</div>'
        ].join('\n');

        if (typeof createIcons === 'function') {
            createIcons({
                icons: typeof iconsAndAliases_exports !== 'undefined' ? iconsAndAliases_exports : undefined
            });
        }

        loadData();
    }

    function loadData() {
        fetchStudent().then(function (student) {
            if (!student) return;
            updateProfile(student);
            fetch('/api/attendance')
                .then(function (r) { return r.json(); })
                .then(function (attendance) { updateStats(student, attendance); })
                .catch(function () { updateStats(student, null); });
        });

        fetchCourses();
    }

    function updateProfile(student) {
        var nameEl = document.getElementById('profileName');
        var emailEl = document.getElementById('profileEmail');
        var idEl = document.getElementById('profileId');
        var avatarEl = document.getElementById('profileAvatar');
        if (nameEl) nameEl.textContent = student.name || 'Student';
        if (emailEl) emailEl.textContent = student.email || '';
        if (idEl) idEl.textContent = student.studentId || '';
        if (avatarEl) {
            var parts = (student.name || 'Student').split(' ');
            var initials = '';
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].length > 0) initials += parts[i][0];
            }
            avatarEl.textContent = initials.toUpperCase().slice(0, 2);
        }
    }

    function fetchStudent() {
        return fetch('/api/students/' + cachedStudentId)
            .then(function (r) { return r.json(); })
            .catch(function () {
                return {
                    name: 'Alex Johnson',
                    email: 'alex@student.edu',
                    studentId: 'STU-2024-001'
                };
            });
    }

    function updateStats(student, attendance) {
        var totalCourses = 3;
        var avgAttendance = '-';
        var avgGrade = '-';
        var completed = '-';

        if (attendance && attendance.length) {
            var sum = 0;
            for (var i = 0; i < attendance.length; i++) {
                sum += attendance[i].percentage;
            }
            avgAttendance = (sum / attendance.length).toFixed(1) + '%';
        }

        var statEls = document.querySelectorAll('#overviewStats .stat-card-value');
        if (statEls.length >= 4) {
            statEls[0].textContent = totalCourses;
            statEls[1].textContent = avgAttendance;
        }

        fetch('/api/courses?studentId=' + cachedStudentId)
            .then(function (r) { return r.json(); })
            .then(function (courses) {
                if (!courses || !courses.length) return;
                var gradeSum = 0;
                var completedCount = 0;
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i].currentGrade) gradeSum += courses[i].currentGrade;
                    if (courses[i].status === 'completed') completedCount++;
                }
                var computedAvg = courses.length ? (gradeSum / courses.length).toFixed(1) + '%' : '-';
                if (statEls.length >= 4) {
                    statEls[2].textContent = computedAvg;
                    statEls[3].textContent = completedCount + '/' + courses.length;
                }
            })
            .catch(function () {});
    }

    function fetchCourses() {
        fetch('/api/courses?studentId=' + cachedStudentId)
            .then(function (r) { return r.json(); })
            .then(function (courses) {
                renderCourses(courses);
                renderActivity(courses);
            })
            .catch(function () {
                var fallback = [
                    {
                        id: 'course_001', title: 'Full Stack Web Development',
                        instructor: 'Dr. Ankit Verma', totalModules: 20, completedModules: 13,
                        status: 'in-progress', currentGrade: 87.5, nextModule: 'React Hooks Deep Dive',
                        lastAccessedAt: '2024-01-19T10:00:00Z'
                    },
                    {
                        id: 'course_002', title: 'Data Structures & Algorithms',
                        instructor: 'Prof. Priya Sharma', totalModules: 15, completedModules: 8,
                        status: 'in-progress', currentGrade: 78.2, nextModule: 'Graph Traversal Algorithms',
                        lastAccessedAt: '2024-01-18T14:30:00Z'
                    },
                    {
                        id: 'course_003', title: 'UX Design Fundamentals',
                        instructor: 'Prof. Sneha Iyer', totalModules: 12, completedModules: 12,
                        status: 'completed', currentGrade: 94.0,
                        lastAccessedAt: '2023-12-15T09:00:00Z'
                    }
                ];
                renderCourses(fallback);
                renderActivity(fallback);
            });
    }

    function renderCourses(courses) {
        var grid = document.getElementById('overviewCourses');
        if (!grid) return;

        var colors = ['#8b5cf6', '#3b82f6', '#10b981'];
        var html = '';

        for (var i = 0; i < courses.length; i++) {
            var c = courses[i];
            var color = colors[i % colors.length];
            var pct = c.totalModules > 0 ? Math.round((c.completedModules / c.totalModules) * 100) : 0;
            var statusClass = c.status === 'completed' ? 'badge-completed' : 'badge-in-progress';
            var statusLabel = c.status === 'completed' ? 'Completed' : 'In Progress';

            html += [
                '<div class="overview-course-card">',
                '  <div class="overview-course-accent" style="background:' + color + '"></div>',
                '  <div class="overview-course-body">',
                '    <div class="overview-course-top">',
                '      <div class="overview-course-info">',
                '        <div class="overview-course-icon" style="background:' + color + '">' + getInitials(c.title) + '</div>',
                '        <div class="overview-course-meta">',
                '          <h3 class="overview-course-name">' + c.title + '</h3>',
                '          <p class="overview-course-instructor">' + c.instructor + '</p>',
                '        </div>',
                '      </div>',
                '      <span class="overview-course-badge ' + statusClass + '">' + statusLabel + '</span>',
                '    </div>',
                '    <div class="overview-course-progress">',
                '      <div class="overview-course-progress-value" style="color:' + color + '">' + pct + '%</div>',
                '      <div class="overview-course-progress-label">Course Progress</div>',
                '    </div>',
                '    <div class="overview-course-stats">',
                '      <div class="overview-course-stat">',
                '        <span class="overview-course-stat-value">' + c.completedModules + '/' + c.totalModules + '</span>',
                '        <span class="overview-course-stat-label">Modules</span>',
                '      </div>',
                '      <div class="overview-course-stat-divider"></div>',
                '      <div class="overview-course-stat">',
                '        <span class="overview-course-stat-value">' + (c.currentGrade || '-') + '%</span>',
                '        <span class="overview-course-stat-label">Grade</span>',
                '      </div>',
                '    </div>',
                '    <div class="overview-course-bar-wrap">',
                '      <div class="overview-course-bar">',
                '        <div class="overview-course-bar-fill" style="width:' + pct + '%; background:' + color + '"></div>',
                '      </div>',
                '      <div class="overview-course-bar-label">',
                '        <span>' + c.completedModules + ' / ' + c.totalModules + ' modules</span>',
                '        <span>' + pct + '%</span>',
                '      </div>',
                '    </div>',
                '    <div class="overview-course-next">',
                '      <span class="overview-course-next-label">Next up:</span>',
                '      <span class="overview-course-next-name">' + (c.nextModule || 'Course completed') + '</span>',
                '    </div>',
                '  </div>',
                '</div>'
            ].join('\n');
        }

        grid.innerHTML = html;
    }

    function renderActivity(courses) {
        var container = document.getElementById('overviewActivity');
        if (!container) return;

        var sorted = courses.slice().sort(function (a, b) {
            return new Date(b.lastAccessedAt || 0) - new Date(a.lastAccessedAt || 0);
        });

        var html = '';
        var colors = ['#8b5cf6', '#3b82f6', '#10b981'];
        var now = new Date();

        for (var i = 0; i < sorted.length; i++) {
            var c = sorted[i];
            var color = colors[i % colors.length];
            var date = c.lastAccessedAt ? new Date(c.lastAccessedAt) : null;
            var timeAgo = '-';
            if (date) {
                var diffMs = now - date;
                var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                var diffDays = Math.floor(diffHours / 24);
                if (diffHours < 1) timeAgo = 'Just now';
                else if (diffHours < 24) timeAgo = diffHours + 'h ago';
                else if (diffDays < 7) timeAgo = diffDays + 'd ago';
                else timeAgo = date.toLocaleDateString();
            }

            html += [
                '<div class="overview-activity-item">',
                '  <div class="overview-activity-dot" style="background:' + color + '"></div>',
                '  <div class="overview-activity-content">',
                '    <div class="overview-activity-title">Accessed "' + c.title + '"</div>',
                '    <div class="overview-activity-meta">' + timeAgo + ' &middot; ' + (c.nextModule || (c.status === 'completed' ? 'Completed' : 'No upcoming')) + '</div>',
                '  </div>',
                '</div>'
            ].join('\n');
        }

        container.innerHTML = html;
    }

    function getInitials(name) {
        var parts = name.split(' ');
        var initials = '';
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].length > 0) initials += parts[i][0];
        }
        return initials.toUpperCase().slice(0, 2);
    }

    document.addEventListener('pathway:route', function (e) {
        if (e.detail && e.detail.route === 'overview') {
            render();
        }
    });
})();