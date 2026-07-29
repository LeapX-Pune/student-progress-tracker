/* ==========================================================================
   PATHWAY — CORE LAYOUT & NAVIGATION
   Part 4 responsibility only: shell chrome, drawer, routing scaffold.
   Other developers listen for "pathway:route" on document to mount pages.
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------------
     Route registry — labels other developers can extend from their modules.
     This only powers the breadcrumb + active nav state, not page content.
  ------------------------------------------------------------------------ */

    const ROUTES = {
        overview: 'Overview',
        students: 'Students',
        courses: 'Courses',
        grades: 'Grades',
        analytics: 'Analytics',
        attendance: 'Attendance',
        settings: 'Settings',
    };

    const DEFAULT_ROUTE = 'overview';

    /* ------------------------------------------------------------------------
     Cached DOM references
  ------------------------------------------------------------------------ */

    const appShell = document.querySelector('.app-shell');
    const sidebar = document.querySelector('[data-sidebar]');
    const drawerOverlay = document.querySelector('[data-drawer-overlay]');
    const drawerOpenBtn = document.querySelector('[data-drawer-open]');
    const drawerCloseBtn = document.querySelector('[data-drawer-close]');
    const collapseToggleBtn = document.querySelector('[data-collapse-toggle]');

    const navList = document.querySelector('.nav-list');
    const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    const breadcrumbLabel = document.querySelector('[data-breadcrumb-label]');
    const pageContent = document.querySelector('[data-page-content]');

    const notificationToggleBtn = document.querySelector('[data-notification-toggle]');
    const notificationPanel = document.querySelector('[data-notification-panel]');
    const notificationDot = document.querySelector('[data-notification-dot]');
    const notificationClearBtn = document.querySelector('[data-notification-clear]');

    const profileToggleBtn = document.querySelector('[data-profile-toggle]');
    const profileDropdown = document.querySelector('[data-profile-dropdown]');

    const MOBILE_BREAKPOINT = 960;

    /* ------------------------------------------------------------------------
     Utilities
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function isMobileViewport() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    /**
     *
     */
    function trapFocusables(container) {
        return Array.prototype.slice.call(
            container.querySelectorAll(
                'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
            )
        );
    }

    /* ------------------------------------------------------------------------
     Mobile drawer
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function openDrawer() {
        appShell.classList.add('is-drawer-open');
        drawerOverlay.classList.add('is-visible');
        drawerOpenBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        const focusables = trapFocusables(sidebar);
        if (focusables.length) focusables[0].focus();
    }

    /**
     *
     */
    function closeDrawer() {
        appShell.classList.remove('is-drawer-open');
        drawerOverlay.classList.remove('is-visible');
        drawerOpenBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    /**
     *
     */
    function toggleDrawer() {
        if (appShell.classList.contains('is-drawer-open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }

    if (drawerOpenBtn) drawerOpenBtn.addEventListener('click', toggleDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    /* ------------------------------------------------------------------------
     Desktop sidebar collapse
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function toggleCollapse() {
        if (isMobileViewport()) return; // collapse control is drawer-only on mobile
        appShell.classList.toggle('is-collapsed');
        const collapsed = appShell.classList.contains('is-collapsed');
        collapseToggleBtn.setAttribute(
            'aria-label',
            collapsed ? 'Expand sidebar' : 'Collapse sidebar'
        );
        // Reposition the highlight after the width transition settles
        window.setTimeout(positionHighlight, 240);
    }

    if (collapseToggleBtn) collapseToggleBtn.addEventListener('click', toggleCollapse);

    /* ------------------------------------------------------------------------
     Sliding nav highlight — moves to hovered link, snaps back to active
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function mountHighlightInGroup(group) {
        if (!group) return null;
        const existing = group.querySelector('.nav-highlight');
        if (existing) return existing;
        const el = document.createElement('div');
        el.className = 'nav-highlight';
        group.style.position = 'relative';
        group.insertBefore(el, group.firstChild);
        return el;
    }

    /**
     *
     */
    function positionHighlight(targetLink) {
        const link = targetLink || document.querySelector('.nav-link.is-active');
        if (!link) return;

        const group = link.closest('.nav-list');
        const el = mountHighlightInGroup(group);
        if (!el) return;

        const groupRect = group.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        el.style.transform = 'translateY(' + (linkRect.top - groupRect.top) + 'px)';
        el.style.height = linkRect.height + 'px';
        el.classList.add('is-visible');
        el.classList.toggle('is-active-style', link.classList.contains('is-active') && !targetLink);
    }

    /**
     *
     */
    function attachNavHoverHighlight() {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                positionHighlight(link);
                const group = link.closest('.nav-list');
                const el = group && group.querySelector('.nav-highlight');
                if (el) el.classList.remove('is-active-style');
            });

            link.addEventListener('focus', () => {
                positionHighlight(link);
            });
        });

        if (navList && navList.parentElement) {
            navList.parentElement.addEventListener('mouseleave', () => {
                const active = document.querySelector('.nav-link.is-active');
                positionHighlight(active || undefined);
            });
        }
    }

    /* ------------------------------------------------------------------------
     Active nav state
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function setActiveNav(routeKey) {
        navLinks.forEach(link => {
            const isActive = link.dataset.route === routeKey;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        window.requestAnimationFrame(() => {
            positionHighlight();
        });
    }

    /* ------------------------------------------------------------------------
     Hash routing
     Renders a lightweight placeholder only. Real page modules should listen
     for the "pathway:route" event and mount their own content into
     [data-page-content], overwriting the placeholder.
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function parseRoute() {
        const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
        return Object.prototype.hasOwnProperty.call(ROUTES, raw) ? raw : DEFAULT_ROUTE;
    }

    /**
     *
     */
    function renderPlaceholder(routeKey) {
        if (!pageContent) return;
        if (routeKey === 'settings') {
            pageContent.innerHTML = `
        <div class="settings-page">
            <h1>Settings</h1>
            <div class="settings-card">
                <div class="setting-row">
                    <div>
                        <h3>Dark Mode</h3>
                        <p>Switch between light and dark appearance.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="themeToggle">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>
        `;

            initThemeToggle();

            return;
        }

        if (routeKey === 'grades') {
            pageContent.innerHTML = `
        <div class="grades-dashboard" role="region" aria-label="Grades dashboard with performance charts">
            <header class="grades-header">
                <h1 id="grades-heading">Grades</h1>
                <p>Track your academic performance across quizzes, assignments, weekly progress, and attendance.</p>
            </header>

            <div class="grades-filter-section">
                <div class="grades-filter-buttons" role="group" aria-label="Quick course filter">
                    <button class="grades-chip active" data-course="all">All Courses</button>
                    <button class="grades-chip" data-course="crs_001">Advanced Mathematics</button>
                    <button class="grades-chip" data-course="crs_002">CS Fundamentals</button>
                    <button class="grades-chip" data-course="crs_003">Physics II</button>
                </div>
            </div>

            <nav class="grades-skip-nav" aria-label="Chart quick navigation">
                <a href="#chart-quiz" class="sr-only sr-only-focusable">Skip to Quiz Scores chart</a>
                <a href="#chart-assignment" class="sr-only sr-only-focusable">Skip to Assignment Performance chart</a>
                <a href="#chart-weekly" class="sr-only sr-only-focusable">Skip to Weekly Progress chart</a>
            </nav>

            <div class="charts-grid" role="list" aria-labelledby="grades-heading">

                <article class="chart-card chart-card--purple" role="listitem" id="chart-quiz" tabindex="0" aria-labelledby="quiz-title" aria-describedby="quiz-desc">
                    <div class="chart-card-header">
                        <div class="chart-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>
                        </div>
                        <div>
                            <h3 class="chart-title" id="quiz-title">Quiz Scores</h3>
                            <p class="chart-subtitle" id="quiz-desc">Your scores across all quizzes taken.</p>
                        </div>
                    </div>
                    <div class="chart-container" role="img" aria-label="Bar chart showing quiz scores">
                        <div class="chart-placeholder-text" aria-hidden="true">Chart.js charts displayed here</div>
                        <div class="loading-state" role="status" aria-live="polite">
                            <span class="sr-only">Loading quiz scores chart</span>
                            <div class="skeleton skeleton-title" aria-hidden="true"></div>
                            <div class="skeleton skeleton-subtitle" aria-hidden="true"></div>
                            <div class="skeleton skeleton-chart-area" aria-hidden="true"></div>
                            <div class="skeleton skeleton-legend" aria-hidden="true"></div>
                        </div>
                        <div class="error-state" role="alert" aria-live="assertive">
                            <span class="state-icon" aria-hidden="true">&#9888;&#65039;</span>
                            <h4>Failed to Load Chart</h4>
                            <p>Something went wrong while fetching quiz scores.</p>
                            <button class="retry-btn" aria-label="Retry loading quiz scores chart">Retry</button>
                        </div>
                        <div class="empty-state" role="status">
                            <span class="state-icon" aria-hidden="true">&#128202;</span>
                            <h4>No Quiz Data</h4>
                            <p>You haven't taken any quizzes yet.</p>
                        </div>
                    </div>
                    <p class="sr-only" aria-live="polite" data-chart-status="quiz"></p>
                </article>

                <article class="chart-card chart-card--green" role="listitem" id="chart-assignment" tabindex="0" aria-labelledby="assignment-title" aria-describedby="assignment-desc">
                    <div class="chart-card-header">
                        <div class="chart-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                        </div>
                        <div>
                            <h3 class="chart-title" id="assignment-title">Assignment Performance</h3>
                            <p class="chart-subtitle" id="assignment-desc">Grades earned on submitted assignments.</p>
                        </div>
                    </div>
                    <div class="chart-container" role="img" aria-label="Doughnut chart showing assignment grades">
                        <div class="chart-placeholder-text" aria-hidden="true">Chart.js charts displayed here</div>
                        <div class="loading-state" role="status" aria-live="polite">
                            <span class="sr-only">Loading assignment performance chart</span>
                            <div class="skeleton skeleton-title" aria-hidden="true"></div>
                            <div class="skeleton skeleton-subtitle" aria-hidden="true"></div>
                            <div class="skeleton skeleton-chart-area" aria-hidden="true"></div>
                            <div class="skeleton skeleton-legend" aria-hidden="true"></div>
                        </div>
                        <div class="error-state" role="alert" aria-live="assertive">
                            <span class="state-icon" aria-hidden="true">&#9888;&#65039;</span>
                            <h4>Failed to Load Chart</h4>
                            <p>Something went wrong while fetching assignment data.</p>
                            <button class="retry-btn" aria-label="Retry loading assignment performance chart">Retry</button>
                        </div>
                        <div class="empty-state" role="status">
                            <span class="state-icon" aria-hidden="true">&#128202;</span>
                            <h4>No Assignments</h4>
                            <p>No assignment submissions found yet.</p>
                        </div>
                    </div>
                    <p class="sr-only" aria-live="polite" data-chart-status="assignment"></p>
                </article>

                <article class="chart-card chart-card--blue chart-card--wide" role="listitem" id="chart-weekly" tabindex="0" aria-labelledby="weekly-title" aria-describedby="weekly-desc">
                    <div class="chart-card-header">
                        <div class="chart-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <div>
                            <h3 class="chart-title" id="weekly-title">Weekly Progress</h3>
                            <p class="chart-subtitle" id="weekly-desc">Your learning progress tracked week by week.</p>
                        </div>
                    </div>
                    <div class="chart-container" role="img" aria-label="Line chart showing weekly progress">
                        <div class="chart-placeholder-text" aria-hidden="true">Chart.js charts displayed here</div>
                        <div class="loading-state" role="status" aria-live="polite">
                            <span class="sr-only">Loading weekly progress chart</span>
                            <div class="skeleton skeleton-title" aria-hidden="true"></div>
                            <div class="skeleton skeleton-subtitle" aria-hidden="true"></div>
                            <div class="skeleton skeleton-chart-area" aria-hidden="true"></div>
                            <div class="skeleton skeleton-legend" aria-hidden="true"></div>
                        </div>
                        <div class="error-state" role="alert" aria-live="assertive">
                            <span class="state-icon" aria-hidden="true">&#9888;&#65039;</span>
                            <h4>Failed to Load Chart</h4>
                            <p>Something went wrong while fetching weekly progress.</p>
                            <button class="retry-btn" aria-label="Retry loading weekly progress chart">Retry</button>
                        </div>
                        <div class="empty-state" role="status">
                            <span class="state-icon" aria-hidden="true">&#128202;</span>
                            <h4>No Progress Data</h4>
                            <p>Weekly progress will appear here once you start.</p>
                        </div>
                    </div>
                    <p class="sr-only" aria-live="polite" data-chart-status="weekly"></p>
                </article>

            </div>
        </div>
        `;

            initGradesPage();
            return;
        }

        if (routeKey === 'students') {
            pageContent.innerHTML = `
                <iframe src="dashboard.html" style="width: 100%; height: calc(100vh - 140px); border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); background: transparent;" title="Student Dashboard"></iframe>
            `;
            return;
        }

        pageContent.innerHTML = `

        <div class="route-placeholder">

            <span class="route-placeholder-eyebrow">Route Ready</span>

            <h2 class="route-placeholder-title">${ROUTES[routeKey]}</h2>

            <p class="route-placeholder-body">


            </p>

        </div>

    `;
    }
    /**
     *
     */
    function initThemeToggle() {
        const toggle = document.getElementById('themeToggle');

        if (!toggle) return;

        if (localStorage.getItem('theme') === 'dark' || !localStorage.getItem('theme')) {
            document.body.classList.add('dark');
        }

        toggle.checked = document.body.classList.contains('dark');

        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                document.body.classList.add('dark');

                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark');

                localStorage.setItem('theme', 'light');
            }
        });
    }

    /**
     *
     */
    function playPageTransition() {
        if (!pageContent) return;
        pageContent.classList.remove('is-transitioning');
        // Force reflow so the animation can restart on repeated route changes
        void pageContent.offsetWidth;
        pageContent.classList.add('is-transitioning');
    }

    /**
     *
     */
    function handleRouteChange(pushState) {
        const routeKey = parseRoute();

        if (pushState !== false) {
            const target = '#/' + routeKey;
            if (window.location.hash !== target) {
                window.location.hash = target;
                return; // hashchange listener will re-invoke this
            }
        }

        setActiveNav(routeKey);
        if (breadcrumbLabel) breadcrumbLabel.textContent = ROUTES[routeKey];
        document.title = ROUTES[routeKey] + ' \u2014 The Reality';

        playPageTransition();

        try {
            renderPlaceholder(routeKey);
        } catch (err) {
            console.error('Route render error:', err);
            if (typeof window._showErrorBoundary === 'function') {
                window._showErrorBoundary({
                    title: 'Page Render Error',
                    message: err.message || 'Failed to render this page.',
                    /**
                     *
                     */
                    onRetry: () => handleRouteChange(pushState),
                });
            }
        }

        let event;
        if (typeof window.CustomEvent === 'function') {
            event = new window.CustomEvent('pathway:route', {
                detail: { route: routeKey, label: ROUTES[routeKey] },
            });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent('pathway:route', false, false, {
                route: routeKey,
                label: ROUTES[routeKey],
            });
        }
        document.dispatchEvent(event);

        if (isMobileViewport()) closeDrawer();
    }

    window.addEventListener('hashchange', () => {
        handleRouteChange(false);
    });

    /* ------------------------------------------------------------------------
     Notification panel
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function closeNotifications() {
        if (!notificationPanel || notificationPanel.hidden) return;
        notificationPanel.hidden = true;
        notificationToggleBtn.setAttribute('aria-expanded', 'false');
    }

    /**
     *
     */
    function toggleNotifications(event) {
        event.stopPropagation();
        const willOpen = notificationPanel.hidden;
        closeProfileDropdown();
        notificationPanel.hidden = !willOpen;
        notificationToggleBtn.setAttribute('aria-expanded', String(willOpen));
    }

    if (notificationToggleBtn) notificationToggleBtn.addEventListener('click', toggleNotifications);

    if (notificationClearBtn) {
        notificationClearBtn.addEventListener('click', () => {
            if (notificationDot) notificationDot.hidden = true;
        });
    }

    /* ------------------------------------------------------------------------
     Profile dropdown
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function closeProfileDropdown() {
        if (!profileDropdown || profileDropdown.hidden) return;
        profileDropdown.hidden = true;
        profileToggleBtn.setAttribute('aria-expanded', 'false');
    }

    /**
     *
     */
    function toggleProfileDropdown(event) {
        event.stopPropagation();
        const willOpen = profileDropdown.hidden;
        closeNotifications();
        profileDropdown.hidden = !willOpen;
        profileToggleBtn.setAttribute('aria-expanded', String(willOpen));
    }

    if (profileToggleBtn) profileToggleBtn.addEventListener('click', toggleProfileDropdown);

    /* Dismiss dropdowns on outside click */
    document.addEventListener('click', event => {
        if (
            notificationPanel &&
            !notificationPanel.hidden &&
            !notificationPanel.contains(event.target) &&
            event.target !== notificationToggleBtn
        ) {
            closeNotifications();
        }
        if (
            profileDropdown &&
            !profileDropdown.hidden &&
            !profileDropdown.contains(event.target) &&
            event.target !== profileToggleBtn
        ) {
            closeProfileDropdown();
        }
    });

    /* ------------------------------------------------------------------------
     Global escape key — closes whichever overlay is open, most recent first
  ------------------------------------------------------------------------ */

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;

        if (profileDropdown && !profileDropdown.hidden) {
            closeProfileDropdown();
            return;
        }
        if (notificationPanel && !notificationPanel.hidden) {
            closeNotifications();
            return;
        }
        if (appShell.classList.contains('is-drawer-open')) {
            closeDrawer();
        }
    });

    /* ------------------------------------------------------------------------
     Resize handling — clears mobile-only state when crossing breakpoints
  ------------------------------------------------------------------------ */

    let resizeTimer = null;

    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            if (!isMobileViewport()) {
                closeDrawer();
                document.body.style.overflow = '';
            }
            positionHighlight();
        }, 120);
    });

    /* ------------------------------------------------------------------------
     Ripple effect for interactive controls
  ------------------------------------------------------------------------ */

    /**
     *
     */
    function attachRipple(selector) {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('click', event => {
                const rect = el.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);

                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
                ripple.style.top = event.clientY - rect.top - size / 2 + 'px';

                el.appendChild(ripple);
                window.setTimeout(() => {
                    ripple.remove();
                }, 520);
            });
        });
    }

    /* ------------------------------------------------------------------------
     Grades Page — Chart states & initialization
   ------------------------------------------------------------------------ */

    /**
     *
     */
    function showLoading(container) {
        const ls = container.querySelector('.loading-state');
        const es = container.querySelector('.error-state');
        const ems = container.querySelector('.empty-state');
        const ph = container.querySelector('.chart-placeholder-text');
        if (ls) ls.style.display = 'flex';
        if (es) es.style.display = 'none';
        if (ems) ems.style.display = 'none';
        if (ph) ph.style.display = 'none';
    }

    /**
     *
     */
    function showChart(container) {
        const ls = container.querySelector('.loading-state');
        const es = container.querySelector('.error-state');
        const ems = container.querySelector('.empty-state');
        const ph = container.querySelector('.chart-placeholder-text');
        if (ls) ls.style.display = 'none';
        if (es) es.style.display = 'none';
        if (ems) ems.style.display = 'none';
        if (ph) ph.style.display = 'none';
    }

    /**
     *
     */
    function initGradesPage() {
        const containers = document.querySelectorAll('.chart-container');
        if (!containers.length) return;

        const sharedTooltip = {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#f1f5f9',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            borderWidth: 1,
            cornerRadius: 10,
            padding: { top: 10, bottom: 10, left: 14, right: 14 },
            titleFont: { size: 13, weight: '600' },
            bodyFont: { size: 12 },
            bodySpacing: 6,
            boxPadding: 4,
            usePointStyle: true,
            caretSize: 6,
            caretPadding: 8,
            shadowBlur: 12,
            shadowOffsetX: 0,
            shadowOffsetY: 4,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
        };

        const courseData = {
            all: {
                quizScores: {
                    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                    data: [85, 92, 76, 98, 88],
                },
                gradeDistribution: [40, 30, 15, 10, 5],
                weeklyProgress: {
                    assignments: [60, 68, 75, 82, 90, 96],
                    attendance: [90, 92, 88, 94, 96, 98],
                },
            },
            crs_001: {
                quizScores: {
                    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                    data: [90, 88, 95, 92, 87],
                },
                gradeDistribution: [50, 30, 12, 6, 2],
                weeklyProgress: {
                    assignments: [70, 78, 85, 88, 92, 97],
                    attendance: [95, 93, 96, 98, 97, 100],
                },
            },
            crs_002: {
                quizScores: {
                    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                    data: [95, 98, 92, 96, 94],
                },
                gradeDistribution: [60, 25, 10, 3, 2],
                weeklyProgress: {
                    assignments: [80, 85, 90, 94, 96, 98],
                    attendance: [92, 95, 90, 94, 96, 98],
                },
            },
            crs_003: {
                quizScores: {
                    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                    data: [72, 80, 68, 75, 78],
                },
                gradeDistribution: [15, 35, 25, 15, 10],
                weeklyProgress: {
                    assignments: [45, 55, 60, 68, 72, 80],
                    attendance: [85, 88, 82, 90, 88, 92],
                },
            },
        };

        /**
         * @param {string} courseId
         */
        function buildChartDefs(courseId) {
            const d = courseData[courseId] || courseData.all;

            return [
                {
                    title: 'Quiz Scores',
                    id: 'gradesQuizChart',
                    type: 'bar',
                    data: {
                        labels: d.quizScores.labels,
                        datasets: [
                            {
                                label: 'Score (%)',
                                data: d.quizScores.data,
                                backgroundColor: [
                                    'rgba(79, 70, 229, 0.85)',
                                    'rgba(59, 130, 246, 0.85)',
                                    'rgba(16, 185, 129, 0.85)',
                                    'rgba(245, 158, 11, 0.85)',
                                    'rgba(239, 68, 68, 0.85)',
                                ],
                                hoverBackgroundColor: [
                                    '#4F46E5',
                                    '#3B82F6',
                                    '#10B981',
                                    '#F59E0B',
                                    '#EF4444',
                                ],
                                borderRadius: 8,
                                borderSkipped: false,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            duration: 1200,
                            easing: 'easeOutQuart',
                        },
                        plugins: {
                            legend: { display: false },
                            title: { display: false },
                            tooltip: {
                                ...sharedTooltip,
                                callbacks: {
                                    /**
                                     *
                                     */
                                    title: items => items[0]?.label || '',
                                    /**
                                     *
                                     */
                                    label: ctx => ` Score: ${ctx.raw}%`,
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                grid: { color: 'rgba(148, 163, 184, 0.08)' },
                                ticks: {
                                    font: { size: 11 },
                                    /**
                                     *
                                     */
                                    callback: v => v + '%',
                                    color: '#94a3b8',
                                },
                                title: { display: false },
                            },
                            x: {
                                grid: { display: false },
                                ticks: { font: { size: 11 }, maxRotation: 0, color: '#94a3b8' },
                                title: { display: false },
                            },
                        },
                    },
                },
                {
                    title: 'Assignment Performance',
                    id: 'gradesAssignmentChart',
                    type: 'doughnut',
                    data: {
                        labels: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Grade F'],
                        datasets: [
                            {
                                data: d.gradeDistribution,
                                backgroundColor: [
                                    'rgba(34, 197, 94, 0.85)',
                                    'rgba(59, 130, 246, 0.85)',
                                    'rgba(250, 204, 21, 0.85)',
                                    'rgba(249, 115, 22, 0.85)',
                                    'rgba(239, 68, 68, 0.85)',
                                ],
                                hoverBackgroundColor: [
                                    '#22C55E',
                                    '#3B82F6',
                                    '#FACC15',
                                    '#F97316',
                                    '#EF4444',
                                ],
                                borderColor: 'rgba(15, 23, 42, 0.6)',
                                borderWidth: 2,
                                hoverOffset: 12,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '65%',
                        layout: { padding: 10 },
                        animation: {
                            animateRotate: true,
                            animateScale: true,
                            duration: 1400,
                            easing: 'easeOutQuart',
                        },
                        plugins: {
                            title: { display: false },
                            legend: {
                                position: 'right',
                                align: 'center',
                                labels: {
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                    boxWidth: 10,
                                    padding: 14,
                                    font: { size: 12 },
                                    color: '#94a3b8',
                                },
                            },
                            tooltip: {
                                ...sharedTooltip,
                                callbacks: {
                                    /**
                                     *
                                     */
                                    label(ctx) {
                                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                        return ` ${ctx.label}: ${ctx.raw} (${((ctx.raw / total) * 100).toFixed(1)}%)`;
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    title: 'Weekly Progress',
                    id: 'gradesWeeklyChart',
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                        datasets: [
                            {
                                label: 'Assignments Completed',
                                data: d.weeklyProgress.assignments,
                                borderColor: '#4F46E5',
                                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                borderWidth: 3,
                                pointRadius: 4,
                                pointHoverRadius: 7,
                                pointBackgroundColor: '#4F46E5',
                                pointBorderColor: '#ffffff',
                                pointBorderWidth: 2,
                                pointHoverBorderWidth: 3,
                                tension: 0.4,
                                fill: true,
                            },
                            {
                                label: 'Attendance',
                                data: d.weeklyProgress.attendance,
                                borderColor: '#10B981',
                                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                borderWidth: 3,
                                pointRadius: 4,
                                pointHoverRadius: 7,
                                pointBackgroundColor: '#10B981',
                                pointBorderColor: '#ffffff',
                                pointBorderWidth: 2,
                                pointHoverBorderWidth: 3,
                                tension: 0.4,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: { duration: 1400, easing: 'easeOutQuart' },
                        interaction: { intersect: false, mode: 'index' },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    color: '#94a3b8',
                                    font: { size: 12, weight: '600' },
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                    boxWidth: 8,
                                    padding: 16,
                                },
                            },
                            tooltip: {
                                ...sharedTooltip,
                                callbacks: {
                                    /**
                                     *
                                     */
                                    title: items => items[0]?.label || '',
                                    /**
                                     *
                                     */
                                    label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                grid: { color: 'rgba(148, 163, 184, 0.08)' },
                                ticks: {
                                    /**
                                     *
                                     */
                                    callback: v => v + '%',
                                    color: '#94a3b8',
                                    font: { size: 11 },
                                },
                                title: {
                                    display: true,
                                    text: 'Progress (%)',
                                    color: '#64748b',
                                    font: { size: 12 },
                                },
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: '#94a3b8', font: { size: 11 } },
                                title: {
                                    display: true,
                                    text: 'Weeks',
                                    color: '#64748b',
                                    font: { size: 12 },
                                },
                            },
                        },
                    },
                },
            ];
        }

        /**
         *
         */
        function announceToScreenReader(container, message) {
            const card = container.closest('.chart-card');
            if (!card) return;
            const liveRegion = card.querySelector('[data-chart-status]');
            if (liveRegion) liveRegion.textContent = message;
        }

        /**
         * @param {string} courseId
         */
        function renderCharts(courseId) {
            const chartDefs = buildChartDefs(courseId);

            ['gradesQuizChart', 'gradesAssignmentChart', 'gradesWeeklyChart'].forEach(
                function (id) {
                    var existing = Chart.getChart(id);
                    if (existing) existing.destroy();
                }
            );

            containers.forEach(function (container) {
                var canvas = container.querySelector('canvas');
                if (canvas) canvas.remove();
            });

            containers.forEach(function (container) {
                showLoading(container);
                announceToScreenReader(container, 'Loading chart data');
                setTimeout(function () {
                    showChart(container);

                    var cardTitle = container
                        .closest('.chart-card')
                        ?.querySelector('.chart-title')
                        ?.textContent?.trim();
                    var def = chartDefs.find(function (d) {
                        return d.title === cardTitle;
                    });
                    if (!def || typeof Chart === 'undefined') return;

                    var canvas = container.querySelector('#' + def.id);
                    if (!canvas) {
                        canvas = document.createElement('canvas');
                        canvas.id = def.id;
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                        canvas.setAttribute('role', 'img');
                        canvas.setAttribute(
                            'aria-label',
                            container.getAttribute('aria-label') || cardTitle + ' chart'
                        );
                        container.appendChild(canvas);
                    }

                    new Chart(canvas, { type: def.type, data: def.data, options: def.options });
                    announceToScreenReader(container, cardTitle + ' chart loaded successfully');
                }, 1200);
            });
        }

        renderCharts('all');

        const chips = document.querySelectorAll('.grades-chip');

        /**
         * @param {string} courseId
         */
        function applyFilter(courseId) {
            chips.forEach(chip => {
                chip.classList.toggle('active', chip.dataset.course === courseId);
            });
            renderCharts(courseId);
        }

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                applyFilter(chip.dataset.course);
            });
        });

        document.querySelectorAll('.retry-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const c = this.closest('.chart-container');
                showLoading(c);
                announceToScreenReader(c, 'Retrying chart load');
                setTimeout(() => {
                    showChart(c);
                    announceToScreenReader(c, 'Chart loaded successfully');
                }, 2000);
            });
        });
    }

    /* ------------------------------------------------------------------------
     Init
   ------------------------------------------------------------------------ */

    /**
     *
     */
    function init() {
        attachNavHoverHighlight();
        attachRipple('.icon-button, .nav-link, .profile-trigger, .collapse-toggle');
        handleRouteChange(false);

        // Keep the highlight aligned through the sidebar's own entrance/collapse animation
        window.setTimeout(positionHighlight, 60);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('app:shell-visible', () => {
        window.requestAnimationFrame(positionHighlight);
    });
})();
