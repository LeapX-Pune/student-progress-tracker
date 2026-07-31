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
     * Removes off-canvas sidebar (and its focusable controls) from the
     * accessibility tree and tab order when the mobile drawer is closed.
     * Desktop always keeps the sidebar interactive.
     */
    function syncSidebarInert() {
        const drawerOpen = appShell?.classList.contains('is-drawer-open');
        sidebar.inert = isMobileViewport() && !drawerOpen;
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
        syncSidebarInert();

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
        syncSidebarInert();
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

    syncSidebarInert();

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
        <div class="route-placeholder">
            <span class="route-placeholder-eyebrow">Route Ready</span>
            <h2 class="route-placeholder-title">Grades</h2>
            <p class="route-placeholder-body">Loading grade visualizations...</p>
        </div>
            `;
            return;
        }

        if (routeKey === 'students') {
            pageContent.innerHTML = `
                <iframe src="dashboard.html" style="width: 100%; height: calc(100vh - 112px); max-height: calc(100vh - 112px); display: block; border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); background: transparent;" title="Student Dashboard"></iframe>
            `;
            return;
        }

        if (routeKey === 'overview' || routeKey === 'courses') {
            pageContent.innerHTML = '';
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
            syncSidebarInert();
            positionHighlight();
        }, 120);
    });

    /* ------------------------------------------------------------------------
     Global search
   ------------------------------------------------------------------------ */

    const searchInput = document.querySelector('#global-search');
    let searchDebounceTimer = null;
    let searchDropdown = null;

    if (searchInput) {
        searchInput.setAttribute('autocomplete', 'off');

        const menuItems = Array.prototype.slice
            .call(document.querySelectorAll('.nav-link'))
            .map(link => ({
                label: link.querySelector('.nav-label')?.textContent?.trim() || link.dataset.route,
                route: link.dataset.route,
                element: link,
            }));

        /**
         * @param {string} term
         */
        function filterSearchResults(term) {
            if (!term || term.length < 2) return [];
            const lower = term.toLowerCase();
            return menuItems.filter(item => item.label.toLowerCase().includes(lower));
        }

        /**
         *
         */
        function removeDropdown() {
            if (searchDropdown) {
                searchDropdown.remove();
                searchDropdown = null;
            }
        }

        /**
         * @param {string} term
         */
        function renderDropdown(term) {
            removeDropdown();
            const results = filterSearchResults(term);
            if (!results.length) return;

            searchDropdown = document.createElement('div');
            searchDropdown.className = 'search-dropdown';
            searchDropdown.setAttribute('role', 'listbox');
            searchDropdown.style.cssText =
                'position:absolute;top:100%;left:0;right:0;z-index:50;' +
                'background:var(--surface-card,#fff);border:1px solid var(--border-color,#e2e8f0);' +
                'border-radius:0.5rem;box-shadow:0 4px 12px rgba(0,0,0,0.1);' +
                'max-height:240px;overflow-y:auto;margin-top:4px;';

            results.forEach((item, i) => {
                const el = document.createElement('button');
                el.className = 'search-dropdown-item';
                el.setAttribute('role', 'option');
                el.textContent = item.label;
                el.style.cssText =
                    'display:block;width:100%;padding:0.625rem 1rem;text-align:left;' +
                    'background:none;border:none;cursor:pointer;font-size:0.875rem;' +
                    'color:var(--text-primary,#1e293b);transition:background 0.15s;';
                el.addEventListener('mouseenter', () => {
                    el.style.background = 'var(--surface-hover,#f1f5f9)';
                });
                el.addEventListener('mouseleave', () => {
                    el.style.background = 'none';
                });
                el.addEventListener('click', () => {
                    removeDropdown();
                    window.location.hash = '#/' + item.route;
                    searchInput.blur();
                });
                if (i === 0) el.style.background = 'var(--surface-hover,#f1f5f9)';
                searchDropdown.appendChild(el);
            });

            searchInput.parentElement.style.position = 'relative';
            searchInput.parentElement.appendChild(searchDropdown);
        }

        searchInput.addEventListener('input', function () {
            window.clearTimeout(searchDebounceTimer);
            const term = this.value.trim();
            if (term.length < 2) {
                removeDropdown();
                return;
            }
            searchDebounceTimer = window.setTimeout(function () {
                renderDropdown(term);
            }, 300);
        });

        searchInput.addEventListener('blur', function () {
            window.setTimeout(removeDropdown, 200);
        });

        searchInput.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                removeDropdown();
                this.blur();
            }
        });
    }

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
        window.requestAnimationFrame(() => positionHighlight());
    });

    // Trim whitespace-only text nodes inside nav links without removing child elements
    function trimNavLinks() {
        document.querySelectorAll('.nav-link').forEach(link => {
            Array.from(link.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = node.textContent.trim();
                }
            });
        });
    }
    document.addEventListener('DOMContentLoaded', trimNavLinks);
    window.addEventListener('pathway:route', trimNavLinks);
})();
