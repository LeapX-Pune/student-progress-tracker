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
        attendance: 'Attendance',
        settings: 'Settings',
        profile: 'Profile',
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
     Navigation Access Filtering (Phase 3.4B)
  ------------------------------------------------------------------------ */

    /**
     * Determines whether navigation items should be visible based on user permissions.
     */
    function updateNavigationVisibility() {
        if (!window.AuthContext) return;

        navLinks.forEach(link => {
            const route = link.dataset.route;
            const canAccess = window.AuthContext.canAccessRoute(route);

            if (!canAccess) {
                // For Phase 3.4B, we simply mark it. Later phases will hide it completely.
                // link.style.display = 'none';
                link.setAttribute('aria-disabled', 'true');
                link.classList.add('is-unauthorized');
            } else {
                // link.style.display = '';
                link.removeAttribute('aria-disabled');
                link.classList.remove('is-unauthorized');
            }
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
     * Renders a 403 Access Denied block directly in the shell.
     */
    function render403() {
        if (!pageContent) return;
        pageContent.innerHTML = `
            <div class="empty-state flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-[#E2E8F0] min-h-[400px] w-full" style="margin-top:2rem;">
                <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                        <path d="M12 8v4"/>
                        <path d="M12 16h.01"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-[#0F172A] mb-2 tracking-tight">Access Denied</h2>
                <p class="text-[#64748B] text-base mb-8 max-w-md mx-auto leading-relaxed">
                    You do not have permission to view this module.
                </p>
                <a href="#/overview" class="inline-flex items-center gap-2 px-6 py-3 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] text-sm font-semibold rounded-lg transition-colors border border-[#CBD5E1] shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Return to Dashboard
                </a>
            </div>
        `;
    }
    /**
     *
     */

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
        let routeKey = parseRoute();

        // RBAC Check
        if (window.AuthContext) {
            if (!window.AuthContext.canAccessRoute(routeKey)) {
                console.warn(`[Router] Access denied to route: ${routeKey}`);

                // If it's the initial load or they navigated here, render 403
                setActiveNav('');
                render403();

                // Also optionally fix the URL to avoid them staying on a blocked hash,
                // but we might want them to see the 403 on that URL. We'll leave the URL as-is.
                return; // Stop routing!
            }
        }

        if (pushState !== false) {
            const target = '#/' + routeKey;
            if (window.location.hash !== target) {
                window.location.hash = target;
                return; // hashchange listener will re-invoke this
            }
        }

        setActiveNav(routeKey);
        renderPlaceholder(routeKey);
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
        if (ph) ph.style.display = 'flex';
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

        const chartDefs = [
            {
                title: 'Quiz Scores',
                id: 'gradesQuizChart',
                type: 'bar',
                data: {
                    labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
                    datasets: [
                        {
                            label: 'Score (%)',
                            data: [85, 92, 76, 98, 88],
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
                    animation: { duration: 800, easing: 'easeOutQuart' },
                    plugins: {
                        legend: { display: false },
                        title: { display: false },
                        tooltip: {
                            ...sharedTooltip,
                            callbacks: {
                                title: items => items[0]?.label || '',
                                label: ctx => ' Score: ' + ctx.raw + '%',
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
                                callback: function (v) {
                                    return v + '%';
                                },
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
                            data: [40, 30, 15, 10, 5],
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
                    animation: { animateRotate: true, duration: 1000, easing: 'easeOutQuart' },
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
                                label: function (ctx) {
                                    var total = ctx.dataset.data.reduce(function (a, b) {
                                        return a + b;
                                    }, 0);
                                    return (
                                        ' ' +
                                        ctx.label +
                                        ': ' +
                                        ctx.raw +
                                        ' (' +
                                        ((ctx.raw / total) * 100).toFixed(1) +
                                        '%)'
                                    );
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
                            data: [60, 68, 75, 82, 90, 96],
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
                            data: [90, 92, 88, 94, 96, 98],
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
                    animation: { duration: 900, easing: 'easeOutQuart' },
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
                                title: function (items) {
                                    return items[0]?.label || '';
                                },
                                label: function (ctx) {
                                    return ' ' + ctx.dataset.label + ': ' + ctx.parsed.y + '%';
                                },
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(148, 163, 184, 0.08)' },
                            ticks: {
                                callback: function (v) {
                                    return v + '%';
                                },
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
            {
                title: 'Attendance Percentage',
                id: 'gradesAttendanceChart',
                type: 'bar',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    datasets: [
                        {
                            label: 'Attendance (%)',
                            data: [90, 92, 88, 94, 96, 98],
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            hoverBackgroundColor: '#10B981',
                            borderRadius: 6,
                            borderSkipped: false,
                            barPercentage: 0.5,
                            categoryPercentage: 0.7,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 800, easing: 'easeOutQuart' },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            ...sharedTooltip,
                            callbacks: {
                                title: function (items) {
                                    return items[0]?.label || '';
                                },
                                label: function (ctx) {
                                    return ' Attendance: ' + ctx.raw + '%';
                                },
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(148, 163, 184, 0.08)' },
                            ticks: {
                                callback: function (v) {
                                    return v + '%';
                                },
                                color: '#94a3b8',
                                font: { size: 11 },
                            },
                            title: {
                                display: true,
                                text: 'Attendance (%)',
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

        function announceToScreenReader(container, message) {
            var card = container.closest('.chart-card');
            if (!card) return;
            var liveRegion = card.querySelector('[data-chart-status]');
            if (liveRegion) liveRegion.textContent = message;
        }

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

                var canvas = container.querySelector('canvas');
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

                var existing = Chart.getChart(canvas);
                if (existing) existing.destroy();

                new Chart(canvas, { type: def.type, data: def.data, options: def.options });
                announceToScreenReader(container, cardTitle + ' chart loaded successfully');
            }, 2500);
        });

        document.querySelectorAll('.retry-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var c = this.closest('.chart-container');
                showLoading(c);
                announceToScreenReader(c, 'Retrying chart load');
                setTimeout(function () {
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
        updateNavigationVisibility();

        // Keep the highlight aligned through the sidebar's own entrance/collapse animation
        window.setTimeout(positionHighlight, 60);

        // Listen to Auth state changes to refresh navigation if user roles change
        if (window.AuthContext) {
            window.AuthContext.subscribe(() => {
                updateNavigationVisibility();
                // We re-evaluate current route access
                handleRouteChange(false);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
