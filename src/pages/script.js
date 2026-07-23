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

  var ROUTES = {
    overview: 'Overview',
    students: 'Students',
    courses: 'Courses',
    grades: 'Grades',
    analytics: 'Analytics',
    attendance: 'Attendance',
    settings: 'Settings'
  };

  var DEFAULT_ROUTE = 'overview';

  /* ------------------------------------------------------------------------
     Cached DOM references
  ------------------------------------------------------------------------ */

  var appShell = document.querySelector('.app-shell');
  var sidebar = document.querySelector('[data-sidebar]');
  var drawerOverlay = document.querySelector('[data-drawer-overlay]');
  var drawerOpenBtn = document.querySelector('[data-drawer-open]');
  var drawerCloseBtn = document.querySelector('[data-drawer-close]');
  var collapseToggleBtn = document.querySelector('[data-collapse-toggle]');

  var navList = document.querySelector('.nav-list');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var breadcrumbLabel = document.querySelector('[data-breadcrumb-label]');
  var pageContent = document.querySelector('[data-page-content]');

  var notificationToggleBtn = document.querySelector('[data-notification-toggle]');
  var notificationPanel = document.querySelector('[data-notification-panel]');
  var notificationDot = document.querySelector('[data-notification-dot]');
  var notificationClearBtn = document.querySelector('[data-notification-clear]');

  var profileToggleBtn = document.querySelector('[data-profile-toggle]');
  var profileDropdown = document.querySelector('[data-profile-dropdown]');

  var MOBILE_BREAKPOINT = 960;

  /* ------------------------------------------------------------------------
     Utilities
  ------------------------------------------------------------------------ */

  function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function trapFocusables(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')
    );
  }

  /* ------------------------------------------------------------------------
     Mobile drawer
  ------------------------------------------------------------------------ */

  function openDrawer() {
    appShell.classList.add('is-drawer-open');
    drawerOverlay.classList.add('is-visible');
    drawerOpenBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    var focusables = trapFocusables(sidebar);
    if (focusables.length) focusables[0].focus();
  }

  function closeDrawer() {
    appShell.classList.remove('is-drawer-open');
    drawerOverlay.classList.remove('is-visible');
    drawerOpenBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

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

  function toggleCollapse() {
    if (isMobileViewport()) return; // collapse control is drawer-only on mobile
    appShell.classList.toggle('is-collapsed');
    var collapsed = appShell.classList.contains('is-collapsed');
    collapseToggleBtn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
    // Reposition the highlight after the width transition settles
    window.setTimeout(positionHighlight, 240);
  }

  if (collapseToggleBtn) collapseToggleBtn.addEventListener('click', toggleCollapse);

  /* ------------------------------------------------------------------------
     Sliding nav highlight — moves to hovered link, snaps back to active
  ------------------------------------------------------------------------ */

  var highlightEl = null;

  function ensureHighlightEl() {
    if (highlightEl || !navList) return;
    highlightEl = document.createElement('div');
    highlightEl.className = 'nav-highlight';
    navList.parentElement && navList.parentElement.style.setProperty('position', 'relative');
  }

  function mountHighlightInGroup(group) {
    if (!group) return null;
    var existing = group.querySelector('.nav-highlight');
    if (existing) return existing;
    var el = document.createElement('div');
    el.className = 'nav-highlight';
    group.style.position = 'relative';
    group.insertBefore(el, group.firstChild);
    return el;
  }

  function positionHighlight(targetLink) {
    var link = targetLink || document.querySelector('.nav-link.is-active');
    if (!link) return;

    var group = link.closest('.nav-list');
    var el = mountHighlightInGroup(group);
    if (!el) return;

    var groupRect = group.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();

    el.style.transform = 'translateY(' + (linkRect.top - groupRect.top) + 'px)';
    el.style.height = linkRect.height + 'px';
    el.classList.add('is-visible');
    el.classList.toggle('is-active-style', link.classList.contains('is-active') && !targetLink);
  }

  function attachNavHoverHighlight() {
    navLinks.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        positionHighlight(link);
        var group = link.closest('.nav-list');
        var el = group && group.querySelector('.nav-highlight');
        if (el) el.classList.remove('is-active-style');
      });

      link.addEventListener('focus', function () {
        positionHighlight(link);
      });
    });

    if (navList && navList.parentElement) {
      navList.parentElement.addEventListener('mouseleave', function () {
        var active = document.querySelector('.nav-link.is-active');
        positionHighlight(active || undefined);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Active nav state
  ------------------------------------------------------------------------ */

  function setActiveNav(routeKey) {
    navLinks.forEach(function (link) {
      var isActive = link.dataset.route === routeKey;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    window.requestAnimationFrame(function () {
      positionHighlight();
    });
  }

  /* ------------------------------------------------------------------------
     Hash routing
     Renders a lightweight placeholder only. Real page modules should listen
     for the "pathway:route" event and mount their own content into
     [data-page-content], overwriting the placeholder.
  ------------------------------------------------------------------------ */

  function parseRoute() {
    var raw = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    return ROUTES.hasOwnProperty(raw) ? raw : DEFAULT_ROUTE;
  }

  function renderPlaceholder(routeKey) {

    if (!pageContent) return;
    if (routeKey === "settings") {
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

    pageContent.innerHTML = `

        <div class="route-placeholder">

            <span class="route-placeholder-eyebrow">Route Ready</span>

            <h2 class="route-placeholder-title">${ROUTES[routeKey]}</h2>

            <p class="route-placeholder-body">


            </p>

        </div>

    `;

}
function initThemeToggle(){

    const toggle = document.getElementById("themeToggle");

    if(!toggle) return;

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark");

        toggle.checked=true;

    }

    toggle.addEventListener("change",()=>{

        if(toggle.checked){

            document.body.classList.add("dark");

            localStorage.setItem("theme","dark");

        }

        else{

            document.body.classList.remove("dark");

            localStorage.setItem("theme","light");

        }

    });

}

  function playPageTransition() {
    if (!pageContent) return;
    pageContent.classList.remove('is-transitioning');
    // Force reflow so the animation can restart on repeated route changes
    void pageContent.offsetWidth;
    pageContent.classList.add('is-transitioning');
  }

  function handleRouteChange(pushState) {
    var routeKey = parseRoute();

    if (pushState !== false) {
      var target = '#/' + routeKey;
      if (window.location.hash !== target) {
        window.location.hash = target;
        return; // hashchange listener will re-invoke this
      }
    }

    setActiveNav(routeKey);
    if (breadcrumbLabel) breadcrumbLabel.textContent = ROUTES[routeKey];
    document.title = ROUTES[routeKey] + ' \u2014 The Reality';

    playPageTransition();
    renderPlaceholder(routeKey);

    document.dispatchEvent(new CustomEvent('pathway:route', {
      detail: { route: routeKey, label: ROUTES[routeKey] }
    }));

    if (isMobileViewport()) closeDrawer();
  }

  window.addEventListener('hashchange', function () {
    handleRouteChange(false);
  });

  /* ------------------------------------------------------------------------
     Notification panel
  ------------------------------------------------------------------------ */

  function closeNotifications() {
    if (!notificationPanel || notificationPanel.hidden) return;
    notificationPanel.hidden = true;
    notificationToggleBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleNotifications(event) {
    event.stopPropagation();
    var willOpen = notificationPanel.hidden;
    closeProfileDropdown();
    notificationPanel.hidden = !willOpen;
    notificationToggleBtn.setAttribute('aria-expanded', String(willOpen));
  }

  if (notificationToggleBtn) notificationToggleBtn.addEventListener('click', toggleNotifications);

  if (notificationClearBtn) {
    notificationClearBtn.addEventListener('click', function () {
      if (notificationDot) notificationDot.hidden = true;
    });
  }

  /* ------------------------------------------------------------------------
     Profile dropdown
  ------------------------------------------------------------------------ */

  function closeProfileDropdown() {
    if (!profileDropdown || profileDropdown.hidden) return;
    profileDropdown.hidden = true;
    profileToggleBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleProfileDropdown(event) {
    event.stopPropagation();
    var willOpen = profileDropdown.hidden;
    closeNotifications();
    profileDropdown.hidden = !willOpen;
    profileToggleBtn.setAttribute('aria-expanded', String(willOpen));
  }

  if (profileToggleBtn) profileToggleBtn.addEventListener('click', toggleProfileDropdown);

  /* Dismiss dropdowns on outside click */
  document.addEventListener('click', function (event) {
    if (notificationPanel && !notificationPanel.hidden &&
        !notificationPanel.contains(event.target) &&
        event.target !== notificationToggleBtn) {
      closeNotifications();
    }
    if (profileDropdown && !profileDropdown.hidden &&
        !profileDropdown.contains(event.target) &&
        event.target !== profileToggleBtn) {
      closeProfileDropdown();
    }
  });

  /* ------------------------------------------------------------------------
     Global escape key — closes whichever overlay is open, most recent first
  ------------------------------------------------------------------------ */

  document.addEventListener('keydown', function (event) {
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

  var resizeTimer = null;

  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
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

  function attachRipple(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.addEventListener('click', function (event) {
        var rect = el.getBoundingClientRect();
        var ripple = document.createElement('span');
        var size = Math.max(rect.width, rect.height);

        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';

        el.appendChild(ripple);
        window.setTimeout(function () {
          ripple.remove();
        }, 520);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Init
  ------------------------------------------------------------------------ */

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
})();
