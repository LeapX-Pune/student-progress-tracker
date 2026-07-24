var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) =>
    function __init() {
        if (err) throw err[0];
        try {
            return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res);
        } catch (e) {
            throw ((err = [e]), e);
        }
    };
var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};

// src/services/mock.js
var mock_exports = {};
__export(mock_exports, {
    setupMockServer: () => setupMockServer,
});
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function handleLogin(url, options) {
    await delay(300);
    const body = JSON.parse(options.body || '{}');
    if (body.email === 'student@demo.com' && body.password === 'demo123') {
        return new Response(
            JSON.stringify({
                token: 'mock-jwt-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 36e5).toISOString(),
                user: {
                    id: 'stu_001',
                    name: 'Alex Johnson',
                    email: 'student@demo.com',
                    role: 'student',
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
    });
}
async function handleGetStudent(request) {
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (id === 'stu_001') {
        return new Response(JSON.stringify(mockStudent), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify({ message: 'Student not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}
async function handleGetCourses(request) {
    await delay(250);
    const url = new URL(request.url);
    const id = url.pathname.split('/')[3];
    if (id === 'stu_001') {
        return new Response(JSON.stringify(mockCourses), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify({ message: 'Courses not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}
async function handleGetGrades(request) {
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/')[3];
    if (id === 'stu_001') {
        return new Response(JSON.stringify(mockGrades), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify({ message: 'Grades not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}
function setupMockServer() {
    const originalFetch = window.fetch;
    window.fetch = async (input, options = {}) => {
        const url = typeof input === 'string' ? input : input.url;
        const method = (options.method || 'GET').toUpperCase();
        const key = `${method}:${new URL(url, window.location.origin).pathname}`;
        let matchedRoute = routes[key];
        if (!matchedRoute) {
            const pathname = new URL(url, window.location.origin).pathname;
            for (const [routeKey, handler] of Object.entries(routes)) {
                const [routeMethod, routePattern] = routeKey.split(':');
                if (routeMethod !== method) continue;
                const routeParts = routePattern.split('/');
                const pathParts = pathname.split('/');
                if (routeParts.length !== pathParts.length) continue;
                let match = true;
                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith(':')) continue;
                    if (routeParts[i] !== pathParts[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    matchedRoute = handler;
                    break;
                }
            }
        }
        if (matchedRoute) {
            const request = new Request(url, options);
            return matchedRoute(request);
        }
        return originalFetch.call(window, input, options);
    };
    return () => {
        window.fetch = originalFetch;
    };
}
var mockStudent, mockCourses, mockGrades, routes;
var init_mock = __esm({
    'src/services/mock.js'() {
        mockStudent = {
            id: 'stu_001',
            name: 'Alex Johnson',
            email: 'student@demo.com',
            avatarUrl: 'https://i.pravatar.cc/150?u=stu_001',
            studentId: 'STU-2024-001',
            enrolledAt: '2024-01-15T00:00:00.000Z',
            currentStreak: 5,
            lastActiveAt: '2024-03-20T10:30:00.000Z',
        };
        mockCourses = [
            {
                id: 'crs_001',
                studentId: 'stu_001',
                title: 'Advanced Mathematics',
                instructor: 'Dr. Smith',
                thumbnailUrl: 'https://picsum.photos/seed/math/400/225',
                description: 'Advanced topics in calculus, linear algebra, and statistics',
                totalModules: 12,
                completedModules: 8,
                status: 'in-progress',
                currentGrade: 88,
                term: 'Spring 2024',
                lastAccessedAt: '2024-03-19T14:30:00.000Z',
                nextModule: 'Module 9: Differential Equations',
            },
            {
                id: 'crs_002',
                studentId: 'stu_001',
                title: 'Computer Science Fundamentals',
                instructor: 'Prof. Davis',
                thumbnailUrl: 'https://picsum.photos/seed/cs/400/225',
                description: 'Data structures, algorithms, and software design patterns',
                totalModules: 10,
                completedModules: 10,
                status: 'completed',
                currentGrade: 94,
                term: 'Spring 2024',
                lastAccessedAt: '2024-03-18T09:15:00.000Z',
                nextModule: null,
            },
            {
                id: 'crs_003',
                studentId: 'stu_001',
                title: 'Physics II: Electromagnetism',
                instructor: 'Dr. Wilson',
                thumbnailUrl: 'https://picsum.photos/seed/physics/400/225',
                description: 'Electromagnetic theory, circuits, and wave propagation',
                totalModules: 14,
                completedModules: 5,
                status: 'in-progress',
                currentGrade: 76,
                term: 'Spring 2024',
                lastAccessedAt: '2024-03-17T11:00:00.000Z',
                nextModule: 'Module 6: Electric Potential',
            },
        ];
        mockGrades = {
            quizScores: [
                { label: 'Quiz 1', score: 85, maxScore: 100 },
                { label: 'Quiz 2', score: 92, maxScore: 100 },
                { label: 'Quiz 3', score: 78, maxScore: 100 },
                { label: 'Quiz 4', score: 95, maxScore: 100 },
                { label: 'Quiz 5', score: 88, maxScore: 100 },
            ],
            gradeDistribution: [
                { label: 'A', percentage: 25 },
                { label: 'B', percentage: 40 },
                { label: 'C', percentage: 20 },
                { label: 'D', percentage: 10 },
                { label: 'F', percentage: 5 },
            ],
            weeklyProgress: [
                { week: 'Week 1', completed: 3, total: 3 },
                { week: 'Week 2', completed: 2, total: 3 },
                { week: 'Week 3', completed: 3, total: 3 },
                { week: 'Week 4', completed: 1, total: 3 },
                { week: 'Week 5', completed: 3, total: 3 },
                { week: 'Week 6', completed: 2, total: 3 },
            ],
        };
        routes = {
            'POST:/api/auth/login': handleLogin,
            'GET:/api/students/:id': handleGetStudent,
            'GET:/api/students/:id/courses': handleGetCourses,
            'GET:/api/students/:id/grades': handleGetGrades,
        };
    },
});

// src/components/EmptyState.js
function createEmptyState({ title, description, illustration, actions = [] } = {}) {
    const container2 = document.createElement('div');
    container2.className = 'empty-state';
    container2.setAttribute('role', 'status');
    if (illustration) {
        const img = document.createElement('div');
        img.className = 'empty-state__illustration';
        img.setAttribute('aria-hidden', 'true');
        img.innerHTML = illustration;
        container2.appendChild(img);
    }
    if (title) {
        const titleEl = document.createElement('h2');
        titleEl.className = 'empty-state__title';
        titleEl.textContent = title;
        container2.appendChild(titleEl);
    }
    if (description) {
        const descEl = document.createElement('p');
        descEl.className = 'empty-state__description';
        descEl.textContent = description;
        container2.appendChild(descEl);
    }
    if (actions.length > 0) {
        const actionsEl = document.createElement('div');
        actionsEl.className = 'empty-state__actions';
        actions.forEach(action => {
            if (typeof action === 'string') {
                actionsEl.insertAdjacentHTML('beforeend', action);
            } else if (action instanceof HTMLElement) {
                actionsEl.appendChild(action);
            }
        });
        container2.appendChild(actionsEl);
    }
    return container2;
}

// src/components/ErrorBoundary.js
function createErrorBoundary({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    onRetry = null,
} = {}) {
    const container2 = document.createElement('div');
    container2.className = 'error-boundary';
    container2.setAttribute('role', 'alert');
    container2.setAttribute('aria-live', 'assertive');
    container2.innerHTML = `
    <div class="error-boundary__icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    </div>
    <h2 class="error-boundary__title">${title}</h2>
    <p class="error-boundary__message">${message}</p>
  `;
    if (onRetry) {
        const actions = document.createElement('div');
        actions.className = 'error-boundary__actions';
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn--primary';
        retryBtn.textContent = 'Try again';
        retryBtn.addEventListener('click', async () => {
            retryBtn.disabled = true;
            retryBtn.innerHTML =
                '<span class="spinner spinner--sm"><svg class="spinner__circle" viewBox="0 0 24 24"><circle class="spinner__path" cx="12" cy="12" r="10" fill="none" stroke-width="3"/></svg></span> Retrying...';
            try {
                await onRetry();
            } finally {
                retryBtn.disabled = false;
                retryBtn.textContent = 'Try again';
            }
        });
        actions.appendChild(retryBtn);
        container2.appendChild(actions);
    }
    return container2;
}
function withErrorBoundary(container2, { title, message, onRetry } = {}) {
    const errorUI = createErrorBoundary({ title, message, onRetry });
    container2.innerHTML = '';
    container2.appendChild(errorUI);
    return errorUI;
}

// src/components/LoadingSpinner.js
function createLoadingSpinner({ size = 'md', label = 'Loading...' } = {}) {
    const container2 = document.createElement('div');
    container2.className = `spinner spinner--${size}`;
    container2.setAttribute('role', 'status');
    container2.setAttribute('aria-label', label);
    container2.innerHTML = `
    <svg class="spinner__circle" viewBox="0 0 24 24" aria-hidden="true">
      <circle class="spinner__path" cx="12" cy="12" r="10" fill="none" stroke-width="3"/>
    </svg>
  `;
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = label;
    container2.appendChild(srOnly);
    return container2;
}

// src/components/Modal.js
var FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
var openModal = null;
var modalIdCounter = 0;
function createModal({ title, body, footer, onClose, size = 'md', ariaDescription } = {}) {
    if (openModal) {
        openModal.close();
    }
    const modalId = `modal-${++modalIdCounter}`;
    const titleId = `${modalId}-title`;
    const descId = `${modalId}-desc`;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', titleId);
    if (ariaDescription) overlay.setAttribute('aria-describedby', descId);
    const modal = document.createElement('div');
    modal.className = 'modal';
    if (size === 'lg') modal.style.maxWidth = '700px';
    if (size === 'sm') modal.style.maxWidth = '360px';
    modal.innerHTML = `
    <div class="modal__header">
      <h2 class="modal__title" id="${titleId}">${title || ''}</h2>
      <button class="modal__close" aria-label="Close dialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  `;
    const bodyEl = document.createElement('div');
    bodyEl.className = 'modal__body';
    if (ariaDescription) bodyEl.id = descId;
    if (typeof body === 'string') {
        bodyEl.innerHTML = body;
    } else if (body instanceof HTMLElement) {
        bodyEl.appendChild(body);
    }
    modal.appendChild(bodyEl);
    if (footer) {
        const footerEl = document.createElement('div');
        footerEl.className = 'modal__footer';
        if (typeof footer === 'string') {
            footerEl.innerHTML = footer;
        } else if (footer instanceof HTMLElement) {
            footerEl.appendChild(footer);
        } else if (Array.isArray(footer)) {
            footer.forEach(el => footerEl.appendChild(el));
        }
        modal.appendChild(footerEl);
    }
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
        overlay.classList.add('modal-overlay--open');
    });
    const modalObj = {
        element: overlay,
        /**
         *
         */
        close: () => {
            overlay.classList.remove('modal-overlay--open');
            overlay.addEventListener(
                'transitionend',
                () => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                },
                { once: true }
            );
            if (openModal === modalObj) openModal = null;
            if (onClose) onClose();
            document.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';
        },
    };
    openModal = modalObj;
    function handleKeydown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            modalObj.close();
        }
        if (e.key === 'Tab') {
            const focusable = modal.querySelectorAll(FOCUSABLE_SELECTOR);
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
    document.addEventListener('keydown', handleKeydown);
    const closeBtn = modal.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => modalObj.close());
    overlay.addEventListener('mousedown', e => {
        if (e.target === overlay) modalObj.close();
    });
    requestAnimationFrame(() => {
        const firstFocusable = modal.querySelector(FOCUSABLE_SELECTOR);
        if (firstFocusable) firstFocusable.focus();
    });
    document.body.style.overflow = 'hidden';
    return modalObj;
}

// src/components/SkeletonLoader.js
function createSkeletonText(lines = 3) {
    const wrapper = document.createElement('div');
    wrapper.className = 'skeleton-text-group';
    wrapper.setAttribute('role', 'status');
    wrapper.setAttribute('aria-label', 'Loading content');
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading...';
    wrapper.appendChild(srOnly);
    const group = document.createElement('div');
    group.style.cssText = 'display:flex;flex-direction:column;gap:0.75rem;';
    group.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < lines; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton--text';
        if (i === lines - 1) {
            skeleton.style.width = '40%';
        }
        group.appendChild(skeleton);
    }
    wrapper.appendChild(group);
    return wrapper;
}
function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.setAttribute('role', 'status');
    card.setAttribute('aria-label', 'Loading card content');
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading...';
    card.appendChild(srOnly);
    const content = document.createElement('div');
    content.setAttribute('aria-hidden', 'true');
    content.innerHTML = `
    <div class="skeleton-card__thumbnail"></div>
    <div class="skeleton-card__lines">
      <div class="skeleton-card__line" style="width:70%"></div>
      <div class="skeleton-card__line"></div>
      <div class="skeleton-card__line"></div>
    </div>
  `;
    card.appendChild(content);
    return card;
}
function createSkeletonChart() {
    const chart = document.createElement('div');
    chart.className = 'skeleton-chart';
    chart.setAttribute('role', 'status');
    chart.setAttribute('aria-label', 'Loading chart');
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading chart...';
    chart.appendChild(srOnly);
    const content = document.createElement('div');
    content.setAttribute('aria-hidden', 'true');
    content.innerHTML = '<div class="skeleton-chart__bar"></div>';
    const bar = content.querySelector('.skeleton-chart__bar');
    for (let i = 0; i < 5; i++) {
        const item = document.createElement('div');
        item.className = 'skeleton-chart__bar-item';
        bar.appendChild(item);
    }
    chart.appendChild(content);
    return chart;
}
function renderSkeleton(container2, type = 'card', count = 1) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        let el;
        switch (type) {
            case 'card':
                el = createSkeletonCard();
                break;
            case 'chart':
                el = createSkeletonChart();
                break;
            case 'text':
                el = createSkeletonText(3);
                break;
            default:
                el = createSkeletonCard();
        }
        fragment.appendChild(el);
    }
    container2.innerHTML = '';
    container2.appendChild(fragment);
}
function removeSkeletons(container2) {
    const skeletons = container2.querySelectorAll(
        '.skeleton-card, .skeleton-chart, .skeleton-text-group'
    );
    skeletons.forEach(el => el.remove());
}

// src/components/Toast.js
var TOAST_DEFAULTS = {
    type: 'info',
    duration: 5e3,
};
var ICONS = {
    success:
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    warning:
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
};
var container = null;
function getContainer() {
    const existing = document.getElementById('toast-root');
    if (existing && document.body.contains(existing)) {
        existing.className = 'toast-container';
        existing.removeAttribute('aria-live');
        existing.removeAttribute('aria-atomic');
        return existing;
    }
    if (!container || !document.body.contains(container)) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
    return container;
}
function showToast({
    title,
    message,
    type = TOAST_DEFAULTS.type,
    duration = TOAST_DEFAULTS.duration,
}) {
    const toastContainer = getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
    <span class="toast__icon">${ICONS[type] || ICONS.info}</span>
    <div class="toast__content">
      <p class="toast__title">${title}</p>
      ${message ? `<p class="toast__message">${message}</p>` : ''}
    </div>
    <button class="toast__close" aria-label="Dismiss notification">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    toastContainer.appendChild(toast);
    if (duration > 0) {
        toast._timeout = setTimeout(() => removeToast(toast), duration);
    }
    return toast;
}
function removeToast(toast) {
    if (toast._timeout) {
        clearTimeout(toast._timeout);
    }
    toast.classList.add('toast--removing');
    toast.addEventListener(
        'animationend',
        () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        },
        { once: true }
    );
}
function showError(title, message) {
    return showToast({ type: 'error', title, message });
}
function showInfo(title, message) {
    return showToast({ type: 'info', title, message });
}

// src/components/Tooltip.js
var tooltipIdCounter = 0;
function createTooltip(triggerEl, { content, position = 'top', delay: delay2 = 200 } = {}) {
    const tooltipId = `tooltip-${++tooltipIdCounter}`;
    const wrapper = document.createElement('span');
    wrapper.className = 'tooltip-wrapper';
    triggerEl.parentNode.insertBefore(wrapper, triggerEl);
    wrapper.appendChild(triggerEl);
    triggerEl.setAttribute('aria-describedby', tooltipId);
    const tooltip = document.createElement('span');
    tooltip.className = `tooltip tooltip--${position}`;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.id = tooltipId;
    tooltip.textContent = content;
    document.body.appendChild(tooltip);
    let showTimeout = null;
    let hideTimeout = null;
    function show() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        showTimeout = setTimeout(() => {
            positionTooltip();
            tooltip.classList.add('tooltip--visible');
        }, delay2);
    }
    function hide() {
        if (showTimeout) {
            clearTimeout(showTimeout);
            showTimeout = null;
        }
        hideTimeout = setTimeout(() => {
            tooltip.classList.remove('tooltip--visible');
        }, 100);
    }
    function positionTooltip() {
        const triggerRect = triggerEl.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const gap = 8;
        let top, left;
        switch (position) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - gap;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + gap;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.left - tooltipRect.width - gap;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.right + gap;
                break;
        }
        const padding = 8;
        if (left < padding) left = padding;
        if (left + tooltipRect.width > window.innerWidth - padding) {
            left = window.innerWidth - tooltipRect.width - padding;
        }
        if (top < padding) top = padding;
        if (top + tooltipRect.height > window.innerHeight - padding) {
            top = window.innerHeight - tooltipRect.height - padding;
        }
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }
    triggerEl.addEventListener('mouseenter', show);
    triggerEl.addEventListener('mouseleave', hide);
    triggerEl.addEventListener('focus', show);
    triggerEl.addEventListener('blur', hide);
    return {
        /**
         *
         */
        destroy: () => {
            triggerEl.removeEventListener('mouseenter', show);
            triggerEl.removeEventListener('mouseleave', hide);
            triggerEl.removeEventListener('focus', show);
            triggerEl.removeEventListener('blur', hide);
            tooltip.remove();
        },
        /**
         *
         */
        update: newContent => {
            tooltip.textContent = newContent;
        },
    };
}

// src/config/env.js
var DEFAULTS = {
    APP_NAME: 'Student Progress Tracker',
    APP_VERSION: '0.1.0',
    API_BASE_URL: '/api',
    API_TIMEOUT: 1e4,
    AUTH_TOKEN_KEY: 'student_tracker_auth',
    AUTH_REDIRECT_KEY: 'student_tracker_redirect',
    AUTH_REMEMBER_DAYS: 30,
    ENABLE_MOCK_API: true,
    ENABLE_PWA: false,
    ENABLE_ANALYTICS: false,
    CHART_ANIMATION_DURATION: 750,
    CHART_RESPONSIVE: true,
};
function getEnv(key, defaultValue) {
    const value = import.meta.env[key];
    if (value === void 0 || value === '') return defaultValue;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value) && value !== '') return Number(value);
    return value;
}
var ENV = {
    APP_NAME: getEnv('VITE_APP_NAME', DEFAULTS.APP_NAME),
    APP_VERSION: getEnv('VITE_APP_VERSION', DEFAULTS.APP_VERSION),
    API_BASE_URL: getEnv('VITE_API_BASE_URL', DEFAULTS.API_BASE_URL),
    API_TIMEOUT: getEnv('VITE_API_TIMEOUT', DEFAULTS.API_TIMEOUT),
    AUTH_TOKEN_KEY: getEnv('VITE_AUTH_TOKEN_KEY', DEFAULTS.AUTH_TOKEN_KEY),
    AUTH_REDIRECT_KEY: getEnv('VITE_AUTH_REDIRECT_KEY', DEFAULTS.AUTH_REDIRECT_KEY),
    AUTH_REMEMBER_DAYS: getEnv('VITE_AUTH_REMEMBER_DAYS', DEFAULTS.AUTH_REMEMBER_DAYS),
    ENABLE_MOCK_API: getEnv('VITE_ENABLE_MOCK_API', DEFAULTS.ENABLE_MOCK_API),
    ENABLE_PWA: getEnv('VITE_ENABLE_PWA', DEFAULTS.ENABLE_PWA),
    ENABLE_ANALYTICS: getEnv('VITE_ENABLE_ANALYTICS', DEFAULTS.ENABLE_ANALYTICS),
    CHART_ANIMATION_DURATION: getEnv(
        'VITE_CHART_ANIMATION_DURATION',
        DEFAULTS.CHART_ANIMATION_DURATION
    ),
    CHART_RESPONSIVE: getEnv('VITE_CHART_RESPONSIVE', DEFAULTS.CHART_RESPONSIVE),
};
if (!ENV.API_BASE_URL) {
    console.warn('[Config] VITE_API_BASE_URL not set, using default');
}

// src/utils/constants.js
var ROUTES =
    /** @type {const} */
    {
        LOGIN: '/login',
        DASHBOARD: '/dashboard',
        NOT_FOUND: '/404',
    };
var API_ENDPOINTS =
    /** @type {const} */
    {
        AUTH_LOGIN: '/auth/login',
        /** @param {string} id - Student ID */
        STUDENT: id => `/students/${id}`,
        /** @param {string} id - Student ID */
        STUDENT_COURSES: id => `/students/${id}/courses`,
        /** @param {string} id - Student ID */
        STUDENT_GRADES: id => `/students/${id}/grades`,
        /** @param {string} id - Course ID */
        COURSE: id => `/courses/${id}`,
        /** @param {string} id - Course ID */
        COURSE_PROGRESS: id => `/courses/${id}/progress`,
    };
var AUTH_CONSTANTS =
    /** @type {const} */
    {
        DEMO_EMAIL: 'student@demo.com',
        DEMO_PASSWORD: 'demo123',
        /** 30-day token lifetime in milliseconds. */
        TOKEN_EXPIRY_MS: 30 * 24 * 60 * 60 * 1e3,
        /** Minimum password length for client-side validation. */
        MIN_PASSWORD_LENGTH: 6,
    };
var ERROR_CODES =
    /** @type {const} */
    {
        INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
        SESSION_EXPIRED: 'SESSION_EXPIRED',
        NETWORK_ERROR: 'NETWORK_ERROR',
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        UNKNOWN: 'UNKNOWN',
    };

// src/utils/env.js
var config = {
    appName: import.meta.env.VITE_APP_NAME || 'Student Progress Tracker',
    appEnv: import.meta.env.VITE_APP_ENV || 'development',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    apiMockEnabled: import.meta.env.VITE_API_MOCK_ENABLED === 'true',
    authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
    sessionTimeoutMinutes: parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '60', 10),
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    cacheTtlSeconds: parseInt(import.meta.env.VITE_CACHE_TTL_SECONDS || '300', 10),
};
function getConfig() {
    return { ...config };
}

// src/utils/errors.js
var AppError = class extends Error {
    /**
     *
     */
    constructor(message, { status, code, data } = {}) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        this.code = code;
        this.data = data;
    }
};
function normalizeApiError(error) {
    if (error instanceof AppError) return error;
    const status = error.status || 0;
    const statusMessages = {
        0: {
            title: 'Network Error',
            message: 'Unable to connect to the server. Please check your internet connection.',
        },
        400: { title: 'Bad Request', message: 'The request was invalid. Please check your input.' },
        401: {
            title: 'Session Expired',
            message: 'Your session has expired. Please log in again.',
        },
        403: {
            title: 'Access Denied',
            message: 'You do not have permission to perform this action.',
        },
        404: { title: 'Not Found', message: 'The requested resource could not be found.' },
        429: { title: 'Too Many Requests', message: 'Please wait a moment before trying again.' },
        500: {
            title: 'Server Error',
            message: 'An unexpected server error occurred. Please try again later.',
        },
        503: {
            title: 'Service Unavailable',
            message: 'The service is temporarily unavailable. Please try again later.',
        },
    };
    const info = statusMessages[status] || {
        title: 'Error',
        message: error.message || 'An unexpected error occurred.',
    };
    return new AppError(info.message, { status, data: error.data });
}
function handleGlobalErrors(onError) {
    window.addEventListener('error', event => {
        console.error('Global error caught:', event.error || event.message);
        if (onError) onError(event.error || { message: event.message });
        event.preventDefault();
    });
    window.addEventListener('unhandledrejection', event => {
        console.error('Unhandled promise rejection:', event.reason);
        if (onError) onError(event.reason);
        event.preventDefault();
    });
}

// src/services/authStorage.js
var TOKEN_KEY = ENV.AUTH_TOKEN_KEY;
var REDIRECT_KEY = ENV.AUTH_REDIRECT_KEY;
var _memoryStore = /* @__PURE__ */ new Map();
function _storageRead(storage, key) {
    try {
        const raw = storage.getItem(key);
        if (raw === null || raw === '') return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}
function _storageWrite(storage, key, value) {
    try {
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        _memoryStore.set(key, JSON.stringify(value));
        return false;
    }
}
function _storageRemove(storage, key) {
    try {
        storage.removeItem(key);
    } catch {}
    _memoryStore.delete(key);
}
function saveAuthToken({ token, expiresAt, user, rememberMe = false }) {
    const normalised =
        typeof expiresAt === 'string' ? new Date(expiresAt).getTime() : Number(expiresAt);
    const payload = { token, expiresAt: normalised, user };
    if (rememberMe) {
        _storageWrite(localStorage, TOKEN_KEY, payload);
    } else {
        _storageWrite(sessionStorage, TOKEN_KEY, payload);
    }
}
function getAuthToken() {
    const fromLocal = _storageRead(localStorage, TOKEN_KEY);
    if (fromLocal) return fromLocal;
    const fromSession = _storageRead(sessionStorage, TOKEN_KEY);
    if (fromSession) return fromSession;
    const raw = _memoryStore.get(TOKEN_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}
function clearAuthToken() {
    _storageRemove(localStorage, TOKEN_KEY);
    _storageRemove(sessionStorage, TOKEN_KEY);
    _storageRemove(sessionStorage, REDIRECT_KEY);
}
function getRedirectPath() {
    let path = null;
    try {
        path = sessionStorage.getItem(REDIRECT_KEY);
        sessionStorage.removeItem(REDIRECT_KEY);
    } catch {}
    if (!path) {
        path = _memoryStore.get(REDIRECT_KEY) ?? null;
        _memoryStore.delete(REDIRECT_KEY);
    }
    return path ?? '/dashboard';
}

// src/services/api.js
var mockHandlers = null;
async function initApi() {
    const config2 = getConfig();
    if (config2.apiMockEnabled) {
        const { setupMockServer: setupMockServer2 } = await Promise.resolve().then(
            () => (init_mock(), mock_exports)
        );
        mockHandlers = setupMockServer2();
    }
}
var ApiService = class {
    /**
     *
     */
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl || (window.CONFIG && window.CONFIG.API_BASE_URL) || '/api';
        this.pendingRequests = /* @__PURE__ */ new Map();
        this.timeoutMs = 1e4;
        this.maxRetries = 3;
    }
    /**
     * Request interceptor to inject authentication tokens.
     */
    _requestInterceptor(options, endpoint) {
        const headers = new Headers(options.headers || {});
        headers.set('Content-Type', 'application/json');
        if (!options.noToken && !endpoint.startsWith('/auth/')) {
            const authData = getAuthToken();
            if (authData?.token) {
                headers.set('Authorization', `Bearer ${authData.token}`);
            }
        }
        return {
            ...options,
            headers,
        };
    }
    /**
     * Response interceptor to normalize the response format and handle common errors.
     */
    async _responseInterceptor(response) {
        if (!response.ok) {
            const error = new Error(`HTTP ${response.status}`);
            error.status = response.status;
            try {
                const errorData = await response.json();
                error.message = errorData.message || error.message;
                error.data = errorData;
            } catch (_e) {
                const errorText = await response.text();
                error.message = errorText || error.message;
            }
            const normalizedError = normalizeApiError(error);
            if (response.status === 401) {
                window.dispatchEvent(new window.CustomEvent('auth:unauthorized'));
            }
            throw normalizedError;
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return response.text();
    }
    /**
     * Generate a unique key for deduplication based on method, url, and body.
     */
    _getRequestKey(method, url, body) {
        return `${method}:${url}:${body || ''}`;
    }
    /**
     * Helper to detect network errors for retry logic.
     */
    _isNetworkError(error) {
        return (
            error.name === 'TypeError' ||
            error.message === 'Failed to fetch' ||
            error.message.includes('NetworkError')
        );
    }
    /**
     * Core request method
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            body,
            retryCount = 0,
            skipDedup = false,
            ...otherOptions
        } = options;
        const url = `${this.baseUrl}${endpoint}`;
        const requestKey = !skipDedup && this._getRequestKey(method, url, body);
        if (requestKey && this.pendingRequests.has(requestKey)) {
            return this.pendingRequests.get(requestKey);
        }
        const fetchOptions = this._requestInterceptor({ method, body, ...otherOptions }, endpoint);
        const controller = new AbortController();
        fetchOptions.signal = controller.signal;
        const timeoutPromise = new Promise((_resolve, reject) => {
            setTimeout(() => {
                controller.abort();
                reject(new Error('Request timeout'));
            }, this.timeoutMs);
        });
        const fetchPromise = fetch(url, fetchOptions)
            .then(async response => {
                if (requestKey) this.pendingRequests.delete(requestKey);
                return await this._responseInterceptor(response);
            })
            .catch(error => {
                if (requestKey) this.pendingRequests.delete(requestKey);
                if (error.name === 'AbortError') {
                    throw new Error(
                        error.message === 'The user aborted a request.'
                            ? 'Request cancelled'
                            : 'Request timeout'
                    );
                }
                if (retryCount < this.maxRetries && this._isNetworkError(error)) {
                    const delay2 = Math.pow(2, retryCount) * 1e3;
                    return new Promise(resolve =>
                        setTimeout(
                            () =>
                                resolve(
                                    this.request(endpoint, {
                                        ...options,
                                        retryCount: retryCount + 1,
                                    })
                                ),
                            delay2
                        )
                    );
                }
                console.error(`API Error on ${endpoint}:`, error);
                throw error;
            });
        const requestPromise = Promise.race([fetchPromise, timeoutPromise]);
        if (requestKey) {
            this.pendingRequests.set(requestKey, requestPromise);
            requestPromise.finally(() => this.pendingRequests.delete(requestKey));
        }
        return requestPromise;
    }
    /**
     *
     */
    get(endpoint, options = {}) {
        return this.request(endpoint, { method: 'GET', ...options });
    }
    /**
     *
     */
    post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            ...options,
        });
    }
    /**
     *
     */
    put(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            ...options,
        });
    }
    /**
     *
     */
    patch(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
            ...options,
        });
    }
    /**
     *
     */
    delete(endpoint, options = {}) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    }
};
var api = new ApiService();

// src/services/authApi.js
async function login({ email, password }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ENV.API_TIMEOUT || 1e4);
    try {
        const response = await api.post(
            API_ENDPOINTS.AUTH_LOGIN,
            { email, password },
            {
                signal: controller.signal,
            }
        );
        clearTimeout(timeoutId);
        return response;
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError' || err instanceof TypeError) {
            throw {
                code: ERROR_CODES.NETWORK_ERROR,
                message: 'Unable to connect. Please check your internet connection.',
            };
        }
        if (err.status === 400) {
            throw {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: err.data?.message ?? 'The request contained invalid data.',
            };
        }
        if (err.status === 401) {
            throw {
                code: ERROR_CODES.INVALID_CREDENTIALS,
                message: err.data?.message ?? 'Invalid email or password.',
            };
        }
        throw {
            code: ERROR_CODES.UNKNOWN,
            message: err.data?.message ?? err.message ?? 'An unexpected error occurred.',
        };
    }
}

// src/utils/authHelpers.js
function isTokenExpired(expiresAt) {
    if (!expiresAt || typeof expiresAt !== 'number' || isNaN(expiresAt)) return true;
    return Date.now() > expiresAt;
}

// src/context/AuthContext.js
function normaliseError(err, fallback) {
    if (err && typeof err === 'object' && 'code' in err) {
        return (
            /** @type {{ code: string, message: string }} */
            err
        );
    }
    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : fallback;
    return { code: ERROR_CODES.UNKNOWN, message };
}
var INITIAL_STATE = Object.freeze({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
});
var AuthContext = (() => {
    let _state = { ...INITIAL_STATE };
    const _subscribers = /* @__PURE__ */ new Set();
    function subscribe(callback) {
        if (typeof callback !== 'function') {
            console.warn(
                '[AuthContext] subscribe() expects a function, received:',
                typeof callback
            );
            return () => {};
        }
        _subscribers.add(callback);
        return () => unsubscribe(callback);
    }
    function unsubscribe(callback) {
        _subscribers.delete(callback);
    }
    function notify() {
        const snapshot = Object.freeze({ ..._state });
        _subscribers.forEach(callback => {
            try {
                callback(snapshot);
            } catch (err) {
                console.error('[AuthContext] A subscriber threw an error:', err);
            }
        });
    }
    function setState(partialState) {
        _state = { ..._state, ...partialState };
        notify();
    }
    function getState() {
        return Object.freeze({ ..._state });
    }
    async function restoreSession() {
        setState({ isLoading: true, error: null });
        try {
            const stored = getAuthToken();
            if (!stored) {
                if (ENV.ENABLE_MOCK_API) {
                    const mockUser = {
                        id: 'mock-001',
                        name: 'Sai Shendge',
                        email: 'sai@example.com',
                    };
                    const mockToken = 'mock-jwt-token-dev';
                    saveAuthToken({
                        token: mockToken,
                        expiresAt: Date.now() + 864e5,
                        user: mockUser,
                        rememberMe: true,
                    });
                    setState({
                        user: mockUser,
                        token: mockToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                    return;
                }
                setState({ isLoading: false });
                return;
            }
            const { token, expiresAt, user } = stored;
            if (!token || !user || typeof user !== 'object') {
                console.warn(
                    '[AuthContext] Malformed session payload found in storage \u2014 clearing.'
                );
                clearAuthToken();
                setState({ isLoading: false });
                return;
            }
            if (isTokenExpired(expiresAt)) {
                console.warn('[AuthContext] Stored token has expired \u2014 clearing session.');
                clearAuthToken();
                setState({ isLoading: false });
                return;
            }
            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            if (!ENV.ENABLE_ANALYTICS) {
                console.warn('[AuthContext] Session restored for user ID:', user.id);
            }
        } catch (err) {
            console.error('[AuthContext] restoreSession() encountered an unexpected error:', err);
            clearAuthToken();
            setState({ isLoading: false, error: null });
        }
    }
    async function login2(credentials) {
        setState({ isLoading: true, error: null });
        try {
            const authResponse = await login(credentials);
            const { token, expiresAt, user } = authResponse;
            if (!token || !user || !expiresAt) {
                throw new Error(
                    'Auth response is missing required fields: token, expiresAt, user.'
                );
            }
            const rememberMe = credentials.rememberMe === true;
            saveAuthToken({ token, expiresAt, user, rememberMe });
            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
            return { success: true, user };
        } catch (err) {
            const normalisedError = normaliseError(err, 'Login failed. Please try again.');
            setState({
                isLoading: false,
                error: normalisedError,
                isAuthenticated: false,
                user: null,
                token: null,
            });
            return { success: false, error: normalisedError.message };
        }
    }
    function logout() {
        clearAuthToken();
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
        console.warn(`[AuthContext] Session ended. Navigate to ${ROUTES.LOGIN} via the router.`);
    }
    window.addEventListener('auth:unauthorized', () => {
        if (_state.isAuthenticated) {
            console.warn('[AuthContext] 401 Unauthorized detected globally. Logging out.');
            logout();
        }
    });
    return {
        subscribe,
        unsubscribe,
        notify,
        getState,
        setState,
        restoreSession,
        login: login2,
        logout,
        clearStorage: clearAuthToken,
    };
})();
var AuthContext_default = AuthContext;

// src/utils/validation.js
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(value) {
    const trimmed = (value ?? '').trim();
    if (!trimmed) {
        return 'Email is required';
    }
    if (!EMAIL_REGEX.test(trimmed)) {
        return 'Enter a valid email address';
    }
    return null;
}
function validatePassword(value) {
    const raw = value ?? '';
    if (!raw) {
        return 'Password is required';
    }
    if (raw.length < AUTH_CONSTANTS.MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`;
    }
    return null;
}
function validateLoginForm({ email, password }) {
    const errors = {
        email: validateEmail(email),
        password: validatePassword(password),
    };
    return isFormValid(errors) ? null : errors;
}
function isFormValid(errors) {
    if (!errors || typeof errors !== 'object') return false;
    return Object.values(errors).every(v => v === null);
}

// src/components/ui/Spinner.js
var SIZE_MAP = {
    sm: { size: 16, stroke: 2 },
    md: { size: 24, stroke: 2.5 },
    lg: { size: 40, stroke: 3 },
};
function createSpinner({
    size = 'md',
    label = 'Loading',
    color = 'currentColor',
    className = '',
} = {}) {
    const { size: px, stroke } = SIZE_MAP[size] ?? SIZE_MAP.md;
    const r = (px - stroke) / 2;
    const cx = px / 2;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `spinner spinner--${size}${className ? ` ${className}` : ''}`);
    svg.setAttribute('width', String(px));
    svg.setAttribute('height', String(px));
    svg.setAttribute('viewBox', `0 0 ${px} ${px}`);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('role', 'status');
    svg.setAttribute('aria-live', 'polite');
    svg.setAttribute('aria-label', label);
    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('cx', String(cx));
    track.setAttribute('cy', String(cx));
    track.setAttribute('r', String(r));
    track.setAttribute('stroke', color);
    track.setAttribute('stroke-width', String(stroke));
    track.setAttribute('opacity', '0.2');
    svg.appendChild(track);
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    arc.setAttribute('class', 'spinner__arc');
    arc.setAttribute('cx', String(cx));
    arc.setAttribute('cy', String(cx));
    arc.setAttribute('r', String(r));
    arc.setAttribute('stroke', color);
    arc.setAttribute('stroke-width', String(stroke));
    arc.setAttribute('stroke-linecap', 'round');
    const circumference = 2 * Math.PI * r;
    arc.setAttribute('stroke-dasharray', String(circumference));
    arc.setAttribute('stroke-dashoffset', String(circumference * 0.75));
    svg.appendChild(arc);
    return svg;
}

// src/components/ui/Button.js
var VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];
var SIZES = ['sm', 'md', 'lg'];
function createButton({
    label,
    id,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    className = '',
    onClick,
} = {}) {
    const resolvedVariant = VARIANTS.includes(variant) ? variant : 'primary';
    const resolvedSize = SIZES.includes(size) ? size : 'md';
    const btn = document.createElement('button');
    btn.type = type;
    if (id) btn.id = id;
    const classes = [
        'btn',
        `btn--${resolvedVariant}`,
        `btn--${resolvedSize}`,
        ...(loading ? ['btn--loading'] : []),
        ...(className ? [className] : []),
    ];
    btn.className = classes.join(' ');
    const isDisabled = disabled || loading;
    btn.disabled = isDisabled;
    btn.setAttribute('aria-disabled', String(isDisabled));
    if (loading) btn.setAttribute('aria-busy', 'true');
    const labelSpan = document.createElement('span');
    labelSpan.className = 'btn__label';
    labelSpan.textContent = label ?? '';
    btn.appendChild(labelSpan);
    if (loading) {
        const spinner = createSpinner({ size: resolvedSize === 'lg' ? 'md' : 'sm' });
        spinner.setAttribute('aria-hidden', 'true');
        btn.appendChild(spinner);
    }
    if (typeof onClick === 'function' && !isDisabled) {
        btn.addEventListener('click', onClick);
    }
    return btn;
}
function setButtonLoading(btn, isLoading) {
    if (!btn || !(btn instanceof HTMLButtonElement)) return;
    btn.disabled = isLoading;
    btn.setAttribute('aria-disabled', String(isLoading));
    if (isLoading) {
        btn.setAttribute('aria-busy', 'true');
        btn.classList.add('btn--loading');
        if (!btn.querySelector('.spinner')) {
            const spinner = createSpinner({ size: 'sm' });
            spinner.setAttribute('aria-hidden', 'true');
            btn.appendChild(spinner);
        }
    } else {
        btn.removeAttribute('aria-busy');
        btn.classList.remove('btn--loading');
        btn.querySelector('.spinner')?.remove();
    }
}

// src/components/ui/Input.js
var EYE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
  viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`;
var EYE_OFF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
  viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
  <line x1="2" x2="22" y1="2" y2="22"/>
</svg>`;
function createInput({
    id,
    name,
    type = 'text',
    label,
    value = '',
    placeholder = '',
    error,
    required = false,
    disabled = false,
    autocomplete,
    onChange,
} = {}) {
    const isPassword = type === 'password';
    const errorId = `${id}-error`;
    const wrapper = document.createElement('div');
    wrapper.className = 'input-field';
    if (label) {
        const labelEl = document.createElement('label');
        labelEl.htmlFor = id;
        labelEl.className = 'input-field__label';
        labelEl.textContent = label;
        if (required) {
            const req = document.createElement('span');
            req.setAttribute('aria-hidden', 'true');
            req.className = 'input-field__required';
            req.textContent = ' *';
            labelEl.appendChild(req);
        }
        wrapper.appendChild(labelEl);
    }
    const inputRow = document.createElement('div');
    inputRow.className = `input-field__row${isPassword ? ' input-field__row--password' : ''}`;
    const input = document.createElement('input');
    input.id = id;
    input.name = name;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    input.required = required;
    input.disabled = disabled;
    input.className = `input-field__input${error ? ' input-field__input--error' : ''}`;
    if (autocomplete) input.setAttribute('autocomplete', autocomplete);
    if (error) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorId);
    }
    if (typeof onChange === 'function') {
        input.addEventListener('input', onChange);
    }
    inputRow.appendChild(input);
    if (isPassword) {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'input-field__toggle';
        toggleBtn.setAttribute('aria-label', 'Show password');
        toggleBtn.setAttribute('aria-pressed', 'false');
        toggleBtn.innerHTML = EYE_ICON;
        toggleBtn.addEventListener('click', () => {
            const isShowing = input.type === 'text';
            input.type = isShowing ? 'password' : 'text';
            toggleBtn.setAttribute('aria-pressed', String(!isShowing));
            toggleBtn.setAttribute('aria-label', isShowing ? 'Show password' : 'Hide password');
            toggleBtn.innerHTML = isShowing ? EYE_ICON : EYE_OFF_ICON;
        });
        inputRow.appendChild(toggleBtn);
    }
    wrapper.appendChild(inputRow);
    const errorEl = document.createElement('span');
    errorEl.id = errorId;
    errorEl.className = 'input-field__error';
    errorEl.setAttribute('role', 'alert');
    errorEl.setAttribute('aria-live', 'polite');
    errorEl.textContent = error ?? '';
    wrapper.appendChild(errorEl);
    function setError(message) {
        errorEl.textContent = message ?? '';
        if (message) {
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorId);
            input.classList.add('input-field__input--error');
        } else {
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
            input.classList.remove('input-field__input--error');
        }
    }
    return { wrapper, input, setError };
}

// src/components/auth/DemoCredentials.js
function createDemoCredentials({ onFill } = {}) {
    const block = document.createElement('div');
    block.className = 'demo-credentials';
    block.setAttribute('role', 'note');
    block.setAttribute('aria-label', 'Demo login credentials');
    const heading = document.createElement('p');
    heading.className = 'demo-credentials__heading';
    heading.textContent = 'Demo credentials';
    block.appendChild(heading);
    const emailRow = document.createElement('p');
    emailRow.className = 'demo-credentials__row';
    emailRow.innerHTML = `<span class="demo-credentials__key">Email:</span>
      <code class="demo-credentials__value">${AUTH_CONSTANTS.DEMO_EMAIL}</code>`;
    block.appendChild(emailRow);
    const passRow = document.createElement('p');
    passRow.className = 'demo-credentials__row';
    passRow.innerHTML = `<span class="demo-credentials__key">Password:</span>
      <code class="demo-credentials__value">${AUTH_CONSTANTS.DEMO_PASSWORD}</code>`;
    block.appendChild(passRow);
    if (typeof onFill === 'function') {
        const fillBtn = document.createElement('button');
        fillBtn.type = 'button';
        fillBtn.className = 'demo-credentials__fill-btn';
        fillBtn.textContent = 'Use demo credentials';
        fillBtn.addEventListener('click', () => {
            onFill({ email: AUTH_CONSTANTS.DEMO_EMAIL, password: AUTH_CONSTANTS.DEMO_PASSWORD });
        });
        block.appendChild(fillBtn);
    }
    return block;
}

// src/components/ui/Checkbox.js
function createCheckbox({
    id,
    name,
    label,
    checked = false,
    disabled = false,
    className = '',
    onChange,
} = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = `checkbox${className ? ` ${className}` : ''}`;
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.name = name;
    input.checked = checked;
    input.disabled = disabled;
    input.className = 'checkbox__input';
    if (typeof onChange === 'function') {
        input.addEventListener('change', onChange);
    }
    const labelEl = document.createElement('label');
    labelEl.htmlFor = id;
    labelEl.className = 'checkbox__label';
    labelEl.textContent = label ?? '';
    wrapper.appendChild(input);
    wrapper.appendChild(labelEl);
    return { wrapper, input };
}

// src/components/auth/RememberMe.js
function createRememberMe({ checked = false, onChange } = {}) {
    const { wrapper, input } = createCheckbox({
        id: 'remember-me',
        name: 'rememberMe',
        label: 'Remember me',
        checked,
        className: 'remember-me',
        onChange: typeof onChange === 'function' ? e => onChange(e.target.checked) : void 0,
    });
    return {
        wrapper,
        /** @returns {boolean} Current checked state */
        getValue: () => input.checked,
    };
}

// src/components/auth/LoginForm.js
function createLoginForm(container2, { onSuccess } = {}) {
    const formEl = document.createElement('form');
    formEl.id = 'login-form';
    formEl.className = 'login-form';
    formEl.setAttribute('novalidate', '');
    const title = document.createElement('h1');
    title.className = 'login-form__title';
    title.textContent = 'Sign in';
    formEl.appendChild(title);
    const subtitle = document.createElement('p');
    subtitle.className = 'login-form__subtitle';
    subtitle.textContent = 'Access your Student Progress Dashboard';
    formEl.appendChild(subtitle);
    const errorBanner = document.createElement('div');
    errorBanner.className = 'login-form__error-banner';
    errorBanner.setAttribute('role', 'alert');
    errorBanner.setAttribute('aria-live', 'assertive');
    errorBanner.hidden = true;
    formEl.appendChild(errorBanner);
    const {
        wrapper: emailWrapper,
        input: emailInput,
        setError: setEmailError,
    } = createInput({
        id: 'login-email',
        name: 'email',
        type: 'email',
        label: 'Email address',
        placeholder: 'student@demo.com',
        required: true,
        autocomplete: 'email',
        /**
         *
         */
        onChange: () => setEmailError(null),
        // clear error on every keystroke
    });
    formEl.appendChild(emailWrapper);
    const {
        wrapper: passwordWrapper,
        input: passwordInput,
        setError: setPasswordError,
    } = createInput({
        id: 'login-password',
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: '\u2022\u2022\u2022\u2022\u2022\u2022',
        required: true,
        autocomplete: 'current-password',
        /**
         *
         */
        onChange: () => setPasswordError(null),
    });
    formEl.appendChild(passwordWrapper);
    const rememberMe = createRememberMe({ checked: false });
    formEl.appendChild(rememberMe.wrapper);
    const submitBtn = createButton({
        id: 'login-submit',
        label: 'Sign In',
        variant: 'primary',
        size: 'lg',
        type: 'submit',
    });
    submitBtn.className += ' login-form__submit';
    formEl.appendChild(submitBtn);
    const demoBlock = createDemoCredentials({
        /**
         *
         */
        onFill: ({ email, password }) => {
            emailInput.value = email;
            passwordInput.value = password;
            setEmailError(null);
            setPasswordError(null);
        },
    });
    formEl.appendChild(demoBlock);
    container2.appendChild(formEl);
    function showBannerError(message) {
        errorBanner.textContent = message;
        errorBanner.hidden = false;
    }
    function clearBannerError() {
        errorBanner.textContent = '';
        errorBanner.hidden = true;
    }
    async function handleSubmit(e) {
        e.preventDefault();
        clearBannerError();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const shouldRememberMe = rememberMe.getValue();
        const errors = validateLoginForm({ email, password });
        if (errors) {
            if (errors.email) setEmailError(errors.email);
            if (errors.password) setPasswordError(errors.password);
            if (errors.email) emailInput.focus();
            else if (errors.password) passwordInput.focus();
            return;
        }
        setButtonLoading(submitBtn, true);
        const result = await AuthContext_default.login({
            email,
            password,
            rememberMe: shouldRememberMe,
        });
        setButtonLoading(submitBtn, false);
        if (result.success) {
            const destination = getRedirectPath();
            if (typeof onSuccess === 'function') {
                onSuccess(result.user, destination);
            }
        } else {
            showBannerError(result.error ?? 'Login failed. Please try again.');
            emailInput.focus();
        }
    }
    formEl.addEventListener('submit', handleSubmit);
    return {
        /**
         * Removes the form from the DOM and cleans up event listeners.
         * Call when the LoginPage is destroyed.
         *
         * @returns {void}
         */
        destroy() {
            formEl.removeEventListener('submit', handleSubmit);
            container2.removeChild(formEl);
        },
    };
}

// src/pages/LoginPage.js
var PAGE_TITLE = 'Sign In | Student Progress Tracker';
function createLoginPage(container2) {
    const { isAuthenticated, isLoading } = AuthContext_default.getState();
    if (!isLoading && isAuthenticated) {
        window.location.hash = '/dashboard';
        return {
            /**
             *
             */
            destroy: () => {},
        };
    }
    document.title = PAGE_TITLE;
    const pageEl = document.createElement('div');
    pageEl.className = 'login-page';
    pageEl.id = 'login-page';
    const heroPanel = document.createElement('div');
    heroPanel.className = 'login-page__hero';
    heroPanel.setAttribute('aria-hidden', 'true');
    const logoArea = document.createElement('div');
    logoArea.className = 'login-page__logo-area';
    const logoImg = document.createElement('img');
    logoImg.src = '/src/assets/auth/logo.svg';
    logoImg.alt = 'Student Progress Tracker logo';
    logoImg.className = 'login-page__logo';
    logoImg.width = 48;
    logoImg.height = 48;
    logoImg.onerror = () => {
        logoImg.style.display = 'none';
    };
    const appName = document.createElement('span');
    appName.className = 'login-page__app-name';
    appName.textContent = 'Student Progress Tracker';
    logoArea.appendChild(logoImg);
    logoArea.appendChild(appName);
    const heroTagline = document.createElement('p');
    heroTagline.className = 'login-page__tagline';
    heroTagline.textContent = 'Track your learning journey, one course at a time.';
    const illustration = document.createElement('img');
    illustration.src = '/src/assets/auth/login.svg';
    illustration.alt = '';
    illustration.setAttribute('aria-hidden', 'true');
    illustration.className = 'login-page__illustration';
    illustration.onerror = () => {
        illustration.style.display = 'none';
    };
    heroPanel.appendChild(logoArea);
    heroPanel.appendChild(heroTagline);
    heroPanel.appendChild(illustration);
    const formPanel = document.createElement('div');
    formPanel.className = 'login-page__form-panel';
    const formCard = document.createElement('div');
    formCard.className = 'login-page__form-card';
    formPanel.appendChild(formCard);
    pageEl.appendChild(heroPanel);
    pageEl.appendChild(formPanel);
    container2.appendChild(pageEl);
    const loginFormHandle = createLoginForm(formCard, {
        /**
         *
         */
        onSuccess: (_user, destination) => {
            window.location.hash = destination;
        },
    });
    const unsubscribe = AuthContext_default.subscribe(({ isAuthenticated: authed }) => {
        if (authed) {
            window.location.hash = '/dashboard';
        }
    });
    return {
        /**
         * Tears down the login page, removing DOM elements and subscriptions.
         * Call this when the router navigates away from the login route.
         *
         * @returns {void}
         */
        destroy() {
            unsubscribe();
            loginFormHandle.destroy();
            if (container2.contains(pageEl)) {
                container2.removeChild(pageEl);
            }
            document.title = 'Student Progress Tracker';
        },
    };
}

// src/utils/animations.js
var prefersReducedMotion = false;
function initMotionPreferences() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mq.matches;
    mq.addEventListener('change', e => {
        prefersReducedMotion = e.matches;
        document.documentElement.classList.toggle('reduced-motion', e.matches);
    });
    document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion);
}

// src/utils/router.js
var scrollPositions = /* @__PURE__ */ new Map();
function updateDocumentTitle(title, suffix = 'Student Progress Tracker') {
    document.title = title ? `${title} \u2014 ${suffix}` : suffix;
}
function saveScrollPosition(key) {
    scrollPositions.set(key, window.scrollY);
}
function initScrollRestoration() {
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
    window.addEventListener('beforeunload', () => {
        saveScrollPosition(window.location.pathname);
    });
}

// src/main.js
function wireGlobalErrorHandler() {
    handleGlobalErrors(error => {
        const message = error?.message || error?.reason?.message || 'An unexpected error occurred.';
        showError('Error', message);
    });
}
function wireNetworkDetection() {
    window.addEventListener('offline', () => {
        showInfo('Offline', 'You are currently offline. Some features may be unavailable.');
    });
    window.addEventListener('online', () => {
        showInfo('Back Online', 'Your internet connection has been restored.');
    });
}
function wireErrorBoundary() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;
    document.addEventListener('pathway:route', () => {
        window._pageContent = pageContent;
    });
    window._showErrorBoundary = ({ title, message, onRetry } = {}) => {
        withErrorBoundary(pageContent, { title, message, onRetry });
    };
}
var loginPageInstance = null;
function showLoginView() {
    if (loginPageInstance) return;
    const authRoot = document.getElementById('auth-root');
    if (!authRoot) return;
    const appShell = document.querySelector('.app-shell');
    if (appShell) appShell.style.display = 'none';
    authRoot.style.display = '';
    loginPageInstance = createLoginPage(authRoot);
}
function showAppView() {
    if (loginPageInstance) {
        loginPageInstance.destroy();
        loginPageInstance = null;
    }
    const authRoot = document.getElementById('auth-root');
    if (authRoot) authRoot.style.display = 'none';
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
        appShell.style.display = '';
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}
function wireAuth() {
    AuthContext_default.subscribe(({ isAuthenticated, isLoading }) => {
        if (isLoading) return;
        if (isAuthenticated) showAppView();
        else showLoginView();
    });
    const signOutBtn = document.querySelector('.profile-dropdown-item--danger');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            AuthContext_default.logout();
            showInfo('Signed Out', 'You have been signed out successfully.');
        });
    }
}
function wireLoadingStates() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;
    document.addEventListener('pathway:route', () => {
        renderSkeleton(pageContent, 'card', 3);
    });
    window._removePageSkeletons = () => {
        removeSkeletons(pageContent);
    };
}
function wireTooltips() {
    document.querySelectorAll('.icon-button, .nav-link, .action-btn-circle').forEach(el => {
        const label =
            el.getAttribute('aria-label') || el.querySelector('.nav-label')?.textContent?.trim();
        if (label) {
            createTooltip(el, { content: label, position: 'bottom' });
        }
    });
}
function wireAppInteractions() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;
    document.addEventListener('pathway:route', () => {
        if (!pageContent.querySelector('.route-placeholder, .settings-page')) {
            return;
        }
    });
    window._showEmptyState = opts => {
        const emptyEl = createEmptyState(opts);
        pageContent.innerHTML = '';
        pageContent.appendChild(emptyEl);
    };
    window._showModal = opts => {
        return createModal(opts);
    };
    document.querySelector('[data-notification-clear]')?.addEventListener('click', () => {
        createModal({
            title: 'Clear Notifications',
            body: 'Mark all notifications as read?',
            footer: '<button class="btn btn--primary" data-confirm-clear>Clear all</button>',
            /**
             *
             */
            onClose: () => {},
        });
    });
}
async function init() {
    initMotionPreferences();
    initScrollRestoration();
    updateDocumentTitle();
    wireGlobalErrorHandler();
    wireNetworkDetection();
    wireErrorBoundary();
    wireAuth();
    wireLoadingStates();
    wireTooltips();
    wireAppInteractions();
    const spinner = createLoadingSpinner({ size: 'lg', label: 'Loading application...' });
    spinner.style.cssText =
        'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1000;';
    document.body.appendChild(spinner);
    await AuthContext_default.restoreSession();
    await initApi();
    if (spinner.parentNode) spinner.parentNode.removeChild(spinner);
    const app = document.querySelector('.app-shell');
    if (app) app.classList.add('app--ready');
}
document.addEventListener('DOMContentLoaded', init);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NlcnZpY2VzL21vY2suanMiLCAiLi4vc3JjL2NvbXBvbmVudHMvRW1wdHlTdGF0ZS5qcyIsICIuLi9zcmMvY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL0xvYWRpbmdTcGlubmVyLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL01vZGFsLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1NrZWxldG9uTG9hZGVyLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1RvYXN0LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1Rvb2x0aXAuanMiLCAiLi4vc3JjL2NvbmZpZy9lbnYuanMiLCAiLi4vc3JjL3V0aWxzL2NvbnN0YW50cy5qcyIsICIuLi9zcmMvdXRpbHMvZW52LmpzIiwgIi4uL3NyYy91dGlscy9lcnJvcnMuanMiLCAiLi4vc3JjL3NlcnZpY2VzL2F1dGhTdG9yYWdlLmpzIiwgIi4uL3NyYy9zZXJ2aWNlcy9hcGkuanMiLCAiLi4vc3JjL3NlcnZpY2VzL2F1dGhBcGkuanMiLCAiLi4vc3JjL3V0aWxzL2F1dGhIZWxwZXJzLmpzIiwgIi4uL3NyYy9jb250ZXh0L0F1dGhDb250ZXh0LmpzIiwgIi4uL3NyYy91dGlscy92YWxpZGF0aW9uLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL1NwaW5uZXIuanMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdWkvQnV0dG9uLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL0lucHV0LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL2F1dGgvRGVtb0NyZWRlbnRpYWxzLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL0NoZWNrYm94LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL2F1dGgvUmVtZW1iZXJNZS5qcyIsICIuLi9zcmMvY29tcG9uZW50cy9hdXRoL0xvZ2luRm9ybS5qcyIsICIuLi9zcmMvcGFnZXMvTG9naW5QYWdlLmpzIiwgIi4uL3NyYy91dGlscy9hbmltYXRpb25zLmpzIiwgIi4uL3NyYy91dGlscy9yb3V0ZXIuanMiLCAiLi4vc3JjL21haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IG1vY2tTdHVkZW50ID0ge1xuICAgIGlkOiAnc3R1XzAwMScsXG4gICAgbmFtZTogJ0FsZXggSm9obnNvbicsXG4gICAgZW1haWw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICBhdmF0YXJVcmw6ICdodHRwczovL2kucHJhdmF0YXIuY2MvMTUwP3U9c3R1XzAwMScsXG4gICAgc3R1ZGVudElkOiAnU1RVLTIwMjQtMDAxJyxcbiAgICBlbnJvbGxlZEF0OiAnMjAyNC0wMS0xNVQwMDowMDowMC4wMDBaJyxcbiAgICBjdXJyZW50U3RyZWFrOiA1LFxuICAgIGxhc3RBY3RpdmVBdDogJzIwMjQtMDMtMjBUMTA6MzA6MDAuMDAwWicsXG59O1xuXG5jb25zdCBtb2NrQ291cnNlcyA9IFtcbiAgICB7XG4gICAgICAgIGlkOiAnY3JzXzAwMScsXG4gICAgICAgIHN0dWRlbnRJZDogJ3N0dV8wMDEnLFxuICAgICAgICB0aXRsZTogJ0FkdmFuY2VkIE1hdGhlbWF0aWNzJyxcbiAgICAgICAgaW5zdHJ1Y3RvcjogJ0RyLiBTbWl0aCcsXG4gICAgICAgIHRodW1ibmFpbFVybDogJ2h0dHBzOi8vcGljc3VtLnBob3Rvcy9zZWVkL21hdGgvNDAwLzIyNScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQWR2YW5jZWQgdG9waWNzIGluIGNhbGN1bHVzLCBsaW5lYXIgYWxnZWJyYSwgYW5kIHN0YXRpc3RpY3MnLFxuICAgICAgICB0b3RhbE1vZHVsZXM6IDEyLFxuICAgICAgICBjb21wbGV0ZWRNb2R1bGVzOiA4LFxuICAgICAgICBzdGF0dXM6ICdpbi1wcm9ncmVzcycsXG4gICAgICAgIGN1cnJlbnRHcmFkZTogODgsXG4gICAgICAgIHRlcm06ICdTcHJpbmcgMjAyNCcsXG4gICAgICAgIGxhc3RBY2Nlc3NlZEF0OiAnMjAyNC0wMy0xOVQxNDozMDowMC4wMDBaJyxcbiAgICAgICAgbmV4dE1vZHVsZTogJ01vZHVsZSA5OiBEaWZmZXJlbnRpYWwgRXF1YXRpb25zJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6ICdjcnNfMDAyJyxcbiAgICAgICAgc3R1ZGVudElkOiAnc3R1XzAwMScsXG4gICAgICAgIHRpdGxlOiAnQ29tcHV0ZXIgU2NpZW5jZSBGdW5kYW1lbnRhbHMnLFxuICAgICAgICBpbnN0cnVjdG9yOiAnUHJvZi4gRGF2aXMnLFxuICAgICAgICB0aHVtYm5haWxVcmw6ICdodHRwczovL3BpY3N1bS5waG90b3Mvc2VlZC9jcy80MDAvMjI1JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdEYXRhIHN0cnVjdHVyZXMsIGFsZ29yaXRobXMsIGFuZCBzb2Z0d2FyZSBkZXNpZ24gcGF0dGVybnMnLFxuICAgICAgICB0b3RhbE1vZHVsZXM6IDEwLFxuICAgICAgICBjb21wbGV0ZWRNb2R1bGVzOiAxMCxcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudEdyYWRlOiA5NCxcbiAgICAgICAgdGVybTogJ1NwcmluZyAyMDI0JyxcbiAgICAgICAgbGFzdEFjY2Vzc2VkQXQ6ICcyMDI0LTAzLTE4VDA5OjE1OjAwLjAwMFonLFxuICAgICAgICBuZXh0TW9kdWxlOiBudWxsLFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDogJ2Nyc18wMDMnLFxuICAgICAgICBzdHVkZW50SWQ6ICdzdHVfMDAxJyxcbiAgICAgICAgdGl0bGU6ICdQaHlzaWNzIElJOiBFbGVjdHJvbWFnbmV0aXNtJyxcbiAgICAgICAgaW5zdHJ1Y3RvcjogJ0RyLiBXaWxzb24nLFxuICAgICAgICB0aHVtYm5haWxVcmw6ICdodHRwczovL3BpY3N1bS5waG90b3Mvc2VlZC9waHlzaWNzLzQwMC8yMjUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0VsZWN0cm9tYWduZXRpYyB0aGVvcnksIGNpcmN1aXRzLCBhbmQgd2F2ZSBwcm9wYWdhdGlvbicsXG4gICAgICAgIHRvdGFsTW9kdWxlczogMTQsXG4gICAgICAgIGNvbXBsZXRlZE1vZHVsZXM6IDUsXG4gICAgICAgIHN0YXR1czogJ2luLXByb2dyZXNzJyxcbiAgICAgICAgY3VycmVudEdyYWRlOiA3NixcbiAgICAgICAgdGVybTogJ1NwcmluZyAyMDI0JyxcbiAgICAgICAgbGFzdEFjY2Vzc2VkQXQ6ICcyMDI0LTAzLTE3VDExOjAwOjAwLjAwMFonLFxuICAgICAgICBuZXh0TW9kdWxlOiAnTW9kdWxlIDY6IEVsZWN0cmljIFBvdGVudGlhbCcsXG4gICAgfSxcbl07XG5cbmNvbnN0IG1vY2tHcmFkZXMgPSB7XG4gICAgcXVpelNjb3JlczogW1xuICAgICAgICB7IGxhYmVsOiAnUXVpeiAxJywgc2NvcmU6IDg1LCBtYXhTY29yZTogMTAwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdRdWl6IDInLCBzY29yZTogOTIsIG1heFNjb3JlOiAxMDAgfSxcbiAgICAgICAgeyBsYWJlbDogJ1F1aXogMycsIHNjb3JlOiA3OCwgbWF4U2NvcmU6IDEwMCB9LFxuICAgICAgICB7IGxhYmVsOiAnUXVpeiA0Jywgc2NvcmU6IDk1LCBtYXhTY29yZTogMTAwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdRdWl6IDUnLCBzY29yZTogODgsIG1heFNjb3JlOiAxMDAgfSxcbiAgICBdLFxuICAgIGdyYWRlRGlzdHJpYnV0aW9uOiBbXG4gICAgICAgIHsgbGFiZWw6ICdBJywgcGVyY2VudGFnZTogMjUgfSxcbiAgICAgICAgeyBsYWJlbDogJ0InLCBwZXJjZW50YWdlOiA0MCB9LFxuICAgICAgICB7IGxhYmVsOiAnQycsIHBlcmNlbnRhZ2U6IDIwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdEJywgcGVyY2VudGFnZTogMTAgfSxcbiAgICAgICAgeyBsYWJlbDogJ0YnLCBwZXJjZW50YWdlOiA1IH0sXG4gICAgXSxcbiAgICB3ZWVrbHlQcm9ncmVzczogW1xuICAgICAgICB7IHdlZWs6ICdXZWVrIDEnLCBjb21wbGV0ZWQ6IDMsIHRvdGFsOiAzIH0sXG4gICAgICAgIHsgd2VlazogJ1dlZWsgMicsIGNvbXBsZXRlZDogMiwgdG90YWw6IDMgfSxcbiAgICAgICAgeyB3ZWVrOiAnV2VlayAzJywgY29tcGxldGVkOiAzLCB0b3RhbDogMyB9LFxuICAgICAgICB7IHdlZWs6ICdXZWVrIDQnLCBjb21wbGV0ZWQ6IDEsIHRvdGFsOiAzIH0sXG4gICAgICAgIHsgd2VlazogJ1dlZWsgNScsIGNvbXBsZXRlZDogMywgdG90YWw6IDMgfSxcbiAgICAgICAgeyB3ZWVrOiAnV2VlayA2JywgY29tcGxldGVkOiAyLCB0b3RhbDogMyB9LFxuICAgIF0sXG59O1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGRlbGF5KG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKHVybCwgb3B0aW9ucykge1xuICAgIGF3YWl0IGRlbGF5KDMwMCk7XG4gICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2Uob3B0aW9ucy5ib2R5IHx8ICd7fScpO1xuXG4gICAgaWYgKGJvZHkuZW1haWwgPT09ICdzdHVkZW50QGRlbW8uY29tJyAmJiBib2R5LnBhc3N3b3JkID09PSAnZGVtbzEyMycpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0b2tlbjogJ21vY2stand0LXRva2VuLScgKyBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGV4cGlyZXNBdDogbmV3IERhdGUoRGF0ZS5ub3coKSArIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3N0dV8wMDEnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWxleCBKb2huc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogJ3N0dWRlbnQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHsgc3RhdHVzOiAyMDAsIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0ludmFsaWQgY3JlZGVudGlhbHMnIH0pLCB7XG4gICAgICAgIHN0YXR1czogNDAxLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHZXRTdHVkZW50KHJlcXVlc3QpIHtcbiAgICBhd2FpdCBkZWxheSgyMDApO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGlkID0gdXJsLnBhdGhuYW1lLnNwbGl0KCcvJykucG9wKCk7XG5cbiAgICBpZiAoaWQgPT09ICdzdHVfMDAxJykge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KG1vY2tTdHVkZW50KSwge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdTdHVkZW50IG5vdCBmb3VuZCcgfSksIHtcbiAgICAgICAgc3RhdHVzOiA0MDQsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdldENvdXJzZXMocmVxdWVzdCkge1xuICAgIGF3YWl0IGRlbGF5KDI1MCk7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG4gICAgY29uc3QgaWQgPSB1cmwucGF0aG5hbWUuc3BsaXQoJy8nKVszXTtcblxuICAgIGlmIChpZCA9PT0gJ3N0dV8wMDEnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkobW9ja0NvdXJzZXMpLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0NvdXJzZXMgbm90IGZvdW5kJyB9KSwge1xuICAgICAgICBzdGF0dXM6IDQwNCxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2V0R3JhZGVzKHJlcXVlc3QpIHtcbiAgICBhd2FpdCBkZWxheSgyMDApO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGlkID0gdXJsLnBhdGhuYW1lLnNwbGl0KCcvJylbM107XG5cbiAgICBpZiAoaWQgPT09ICdzdHVfMDAxJykge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KG1vY2tHcmFkZXMpLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0dyYWRlcyBub3QgZm91bmQnIH0pLCB7XG4gICAgICAgIHN0YXR1czogNDA0LFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICB9KTtcbn1cblxuY29uc3Qgcm91dGVzID0ge1xuICAgICdQT1NUOi9hcGkvYXV0aC9sb2dpbic6IGhhbmRsZUxvZ2luLFxuICAgICdHRVQ6L2FwaS9zdHVkZW50cy86aWQnOiBoYW5kbGVHZXRTdHVkZW50LFxuICAgICdHRVQ6L2FwaS9zdHVkZW50cy86aWQvY291cnNlcyc6IGhhbmRsZUdldENvdXJzZXMsXG4gICAgJ0dFVDovYXBpL3N0dWRlbnRzLzppZC9ncmFkZXMnOiBoYW5kbGVHZXRHcmFkZXMsXG59O1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cE1vY2tTZXJ2ZXIoKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxGZXRjaCA9IHdpbmRvdy5mZXRjaDtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgd2luZG93LmZldGNoID0gYXN5bmMgKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/IGlucHV0IDogaW5wdXQudXJsO1xuICAgICAgICBjb25zdCBtZXRob2QgPSAob3B0aW9ucy5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke21ldGhvZH06JHtuZXcgVVJMKHVybCwgd2luZG93LmxvY2F0aW9uLm9yaWdpbikucGF0aG5hbWV9YDtcblxuICAgICAgICBsZXQgbWF0Y2hlZFJvdXRlID0gcm91dGVzW2tleV07XG5cbiAgICAgICAgaWYgKCFtYXRjaGVkUm91dGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhuYW1lID0gbmV3IFVSTCh1cmwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pLnBhdGhuYW1lO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbcm91dGVLZXksIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHJvdXRlcykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbcm91dGVNZXRob2QsIHJvdXRlUGF0dGVybl0gPSByb3V0ZUtleS5zcGxpdCgnOicpO1xuICAgICAgICAgICAgICAgIGlmIChyb3V0ZU1ldGhvZCAhPT0gbWV0aG9kKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlUGFydHMgPSByb3V0ZVBhdHRlcm4uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoUGFydHMgPSBwYXRobmFtZS5zcGxpdCgnLycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlUGFydHMubGVuZ3RoICE9PSBwYXRoUGFydHMubGVuZ3RoKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGxldCBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3V0ZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZVBhcnRzW2ldLnN0YXJ0c1dpdGgoJzonKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZVBhcnRzW2ldICE9PSBwYXRoUGFydHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUm91dGUgPSBoYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hlZFJvdXRlKSB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVkUm91dGUocmVxdWVzdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3JpZ2luYWxGZXRjaC5jYWxsKHdpbmRvdywgaW5wdXQsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICB3aW5kb3cuZmV0Y2ggPSBvcmlnaW5hbEZldGNoO1xuICAgIH07XG59XG4iLCAiLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlTdGF0ZSh7IHRpdGxlLCBkZXNjcmlwdGlvbiwgaWxsdXN0cmF0aW9uLCBhY3Rpb25zID0gW10gfSA9IHt9KSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdlbXB0eS1zdGF0ZSc7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcblxuICAgIGlmIChpbGx1c3RyYXRpb24pIHtcbiAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGltZy5jbGFzc05hbWUgPSAnZW1wdHktc3RhdGVfX2lsbHVzdHJhdGlvbic7XG4gICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgaW1nLmlubmVySFRNTCA9IGlsbHVzdHJhdGlvbjtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGltZyk7XG4gICAgfVxuXG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICB0aXRsZUVsLmNsYXNzTmFtZSA9ICdlbXB0eS1zdGF0ZV9fdGl0bGUnO1xuICAgICAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gdGl0bGU7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgZGVzY0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBkZXNjRWwuY2xhc3NOYW1lID0gJ2VtcHR5LXN0YXRlX19kZXNjcmlwdGlvbic7XG4gICAgICAgIGRlc2NFbC50ZXh0Q29udGVudCA9IGRlc2NyaXB0aW9uO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGVzY0VsKTtcbiAgICB9XG5cbiAgICBpZiAoYWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbnNFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhY3Rpb25zRWwuY2xhc3NOYW1lID0gJ2VtcHR5LXN0YXRlX19hY3Rpb25zJztcbiAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zRWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBhY3Rpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGFjdGlvbnNFbC5hcHBlbmRDaGlsZChhY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFjdGlvbnNFbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IGNvbnN0IEVNUFRZX0lMTFVTVFJBVElPTlMgPSB7XG4gICAgc2VhcmNoOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMjBcIiBoZWlnaHQ9XCIxMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI4XCIvPjxwYXRoIGQ9XCJtMjEgMjEtNC4zLTQuM1wiLz48L3N2Zz4nLFxuICAgIGRhdGE6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEyMFwiIGhlaWdodD1cIjEyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjFcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48L3N2Zz4nLFxuICAgIGNvdXJzZTogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTIwXCIgaGVpZ2h0PVwiMTIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNNCAxOS41di0xNUEyLjUgMi41IDAgMCAxIDYuNSAySDIwdjIwSDYuNWEyLjUgMi41IDAgMCAxIDAtNUgyMFwiLz48L3N2Zz4nLFxuICAgIGdyYWRlOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMjBcIiBoZWlnaHQ9XCIxMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMiAxMmgtNGwtMyA5TDkgM2wtMyA5SDJcIi8+PC9zdmc+JyxcbiAgICBlcnJvcjogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTIwXCIgaGVpZ2h0PVwiMTIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xNiAxNnMtMS41LTItNC0yLTQgMi00IDJcIi8+PGxpbmUgeDE9XCI5XCIgeTE9XCI5XCIgeDI9XCI5LjAxXCIgeTI9XCI5XCIvPjxsaW5lIHgxPVwiMTVcIiB5MT1cIjlcIiB4Mj1cIjE1LjAxXCIgeTI9XCI5XCIvPjwvc3ZnPicsXG59O1xuIiwgIi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVycm9yQm91bmRhcnkoe1xuICAgIHRpdGxlID0gJ1NvbWV0aGluZyB3ZW50IHdyb25nJyxcbiAgICBtZXNzYWdlID0gJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICBvblJldHJ5ID0gbnVsbCxcbn0gPSB7fSkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAnZXJyb3ItYm91bmRhcnknO1xuICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XG5cbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJlcnJvci1ib3VuZGFyeV9faWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCI2NFwiIGhlaWdodD1cIjY0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgMTZzLTEuNS0yLTQtMi00IDItNCAyXCIvPlxuICAgICAgICA8bGluZSB4MT1cIjlcIiB5MT1cIjlcIiB4Mj1cIjkuMDFcIiB5Mj1cIjlcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiMTVcIiB5MT1cIjlcIiB4Mj1cIjE1LjAxXCIgeTI9XCI5XCIvPlxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gICAgPGgyIGNsYXNzPVwiZXJyb3ItYm91bmRhcnlfX3RpdGxlXCI+JHt0aXRsZX08L2gyPlxuICAgIDxwIGNsYXNzPVwiZXJyb3ItYm91bmRhcnlfX21lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICBgO1xuXG4gICAgaWYgKG9uUmV0cnkpIHtcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdlcnJvci1ib3VuZGFyeV9fYWN0aW9ucyc7XG5cbiAgICAgICAgY29uc3QgcmV0cnlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgcmV0cnlCdG4uY2xhc3NOYW1lID0gJ2J0biBidG4tLXByaW1hcnknO1xuICAgICAgICByZXRyeUJ0bi50ZXh0Q29udGVudCA9ICdUcnkgYWdhaW4nO1xuICAgICAgICByZXRyeUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHJ5QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHJ5QnRuLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwic3Bpbm5lciBzcGlubmVyLS1zbVwiPjxzdmcgY2xhc3M9XCJzcGlubmVyX19jaXJjbGVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGNpcmNsZSBjbGFzcz1cInNwaW5uZXJfX3BhdGhcIiBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiM1wiLz48L3N2Zz48L3NwYW4+IFJldHJ5aW5nLi4uJztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgb25SZXRyeSgpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICByZXRyeUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHJ5QnRuLnRleHRDb250ZW50ID0gJ1RyeSBhZ2Fpbic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFjdGlvbnMuYXBwZW5kQ2hpbGQocmV0cnlCdG4pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYWN0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aEVycm9yQm91bmRhcnkoY29udGFpbmVyLCB7IHRpdGxlLCBtZXNzYWdlLCBvblJldHJ5IH0gPSB7fSkge1xuICAgIGNvbnN0IGVycm9yVUkgPSBjcmVhdGVFcnJvckJvdW5kYXJ5KHsgdGl0bGUsIG1lc3NhZ2UsIG9uUmV0cnkgfSk7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvclVJKTtcbiAgICByZXR1cm4gZXJyb3JVSTtcbn1cbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2FkaW5nU3Bpbm5lcih7IHNpemUgPSAnbWQnLCBsYWJlbCA9ICdMb2FkaW5nLi4uJyB9ID0ge30pIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gYHNwaW5uZXIgc3Bpbm5lci0tJHtzaXplfWA7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IGBcbiAgICA8c3ZnIGNsYXNzPVwic3Bpbm5lcl9fY2lyY2xlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPGNpcmNsZSBjbGFzcz1cInNwaW5uZXJfX3BhdGhcIiBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiM1wiLz5cbiAgICA8L3N2Zz5cbiAgYDtcblxuICAgIGNvbnN0IHNyT25seSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzck9ubHkuY2xhc3NOYW1lID0gJ3NyLW9ubHknO1xuICAgIHNyT25seS50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzck9ubHkpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cbiIsICJjb25zdCBGT0NVU0FCTEVfU0VMRUNUT1IgPVxuICAgICdhW2hyZWZdLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJztcblxubGV0IG9wZW5Nb2RhbCA9IG51bGw7XG5sZXQgbW9kYWxJZENvdW50ZXIgPSAwO1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2RhbCh7IHRpdGxlLCBib2R5LCBmb290ZXIsIG9uQ2xvc2UsIHNpemUgPSAnbWQnLCBhcmlhRGVzY3JpcHRpb24gfSA9IHt9KSB7XG4gICAgaWYgKG9wZW5Nb2RhbCkge1xuICAgICAgICBvcGVuTW9kYWwuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RhbElkID0gYG1vZGFsLSR7Kyttb2RhbElkQ291bnRlcn1gO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBgJHttb2RhbElkfS10aXRsZWA7XG4gICAgY29uc3QgZGVzY0lkID0gYCR7bW9kYWxJZH0tZGVzY2A7XG5cbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3ZlcmxheS5jbGFzc05hbWUgPSAnbW9kYWwtb3ZlcmxheSc7XG4gICAgb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBpZiAoYXJpYURlc2NyaXB0aW9uKSBvdmVybGF5LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGRlc2NJZCk7XG5cbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG1vZGFsLmNsYXNzTmFtZSA9ICdtb2RhbCc7XG4gICAgaWYgKHNpemUgPT09ICdsZycpIG1vZGFsLnN0eWxlLm1heFdpZHRoID0gJzcwMHB4JztcbiAgICBpZiAoc2l6ZSA9PT0gJ3NtJykgbW9kYWwuc3R5bGUubWF4V2lkdGggPSAnMzYwcHgnO1xuXG4gICAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbF9faGVhZGVyXCI+XG4gICAgICA8aDIgY2xhc3M9XCJtb2RhbF9fdGl0bGVcIiBpZD1cIiR7dGl0bGVJZH1cIj4ke3RpdGxlIHx8ICcnfTwvaDI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWxfX2Nsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlIGRpYWxvZ1wiPlxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xOCA2IDYgMThcIi8+PHBhdGggZD1cIm02IDYgMTIgMTJcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgICBjb25zdCBib2R5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBib2R5RWwuY2xhc3NOYW1lID0gJ21vZGFsX19ib2R5JztcbiAgICBpZiAoYXJpYURlc2NyaXB0aW9uKSBib2R5RWwuaWQgPSBkZXNjSWQ7XG4gICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBib2R5RWwuaW5uZXJIVE1MID0gYm9keTtcbiAgICB9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBib2R5RWwuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIG1vZGFsLmFwcGVuZENoaWxkKGJvZHlFbCk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICAgIGNvbnN0IGZvb3RlckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGZvb3RlckVsLmNsYXNzTmFtZSA9ICdtb2RhbF9fZm9vdGVyJztcbiAgICAgICAgaWYgKHR5cGVvZiBmb290ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmb290ZXJFbC5pbm5lckhUTUwgPSBmb290ZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9vdGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGZvb3RlckVsLmFwcGVuZENoaWxkKGZvb3Rlcik7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShmb290ZXIpKSB7XG4gICAgICAgICAgICBmb290ZXIuZm9yRWFjaChlbCA9PiBmb290ZXJFbC5hcHBlbmRDaGlsZChlbCkpO1xuICAgICAgICB9XG4gICAgICAgIG1vZGFsLmFwcGVuZENoaWxkKGZvb3RlckVsKTtcbiAgICB9XG5cbiAgICBvdmVybGF5LmFwcGVuZENoaWxkKG1vZGFsKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vdmVybGF5LS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBtb2RhbE9iaiA9IHtcbiAgICAgICAgZWxlbWVudDogb3ZlcmxheSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjbG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vdmVybGF5LS1vcGVuJyk7XG4gICAgICAgICAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJsYXkucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG92ZXJsYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChvcGVuTW9kYWwgPT09IG1vZGFsT2JqKSBvcGVuTW9kYWwgPSBudWxsO1xuICAgICAgICAgICAgaWYgKG9uQ2xvc2UpIG9uQ2xvc2UoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlkb3duKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgb3Blbk1vZGFsID0gbW9kYWxPYmo7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUtleWRvd24oZSkge1xuICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBtb2RhbE9iai5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgICAgICAgY29uc3QgZm9jdXNhYmxlID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfU0VMRUNUT1IpO1xuICAgICAgICAgICAgaWYgKGZvY3VzYWJsZS5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBmb2N1c2FibGVbMF07XG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZm9jdXNhYmxlW2ZvY3VzYWJsZS5sZW5ndGggLSAxXTtcblxuICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3QpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGFzdC5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zaGlmdEtleSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGZpcnN0LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93bik7XG5cbiAgICBjb25zdCBjbG9zZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UnKTtcbiAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG1vZGFsT2JqLmNsb3NlKCkpO1xuXG4gICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBvdmVybGF5KSBtb2RhbE9iai5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlyc3RGb2N1c2FibGUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKEZPQ1VTQUJMRV9TRUxFQ1RPUik7XG4gICAgICAgIGlmIChmaXJzdEZvY3VzYWJsZSkgZmlyc3RGb2N1c2FibGUuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICAgIHJldHVybiBtb2RhbE9iajtcbn1cbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTa2VsZXRvblRleHQobGluZXMgPSAzKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ3NrZWxldG9uLXRleHQtZ3JvdXAnO1xuICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3N0YXR1cycpO1xuICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0xvYWRpbmcgY29udGVudCcpO1xuXG4gICAgY29uc3Qgc3JPbmx5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNyT25seS5jbGFzc05hbWUgPSAnc3Itb25seSc7XG4gICAgc3JPbmx5LnRleHRDb250ZW50ID0gJ0xvYWRpbmcuLi4nO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3JPbmx5KTtcblxuICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JvdXAuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDowLjc1cmVtOyc7XG4gICAgZ3JvdXAuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2tlbGV0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2tlbGV0b24uY2xhc3NOYW1lID0gJ3NrZWxldG9uIHNrZWxldG9uLS10ZXh0JztcbiAgICAgICAgaWYgKGkgPT09IGxpbmVzIC0gMSkge1xuICAgICAgICAgICAgc2tlbGV0b24uc3R5bGUud2lkdGggPSAnNDAlJztcbiAgICAgICAgfVxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChza2VsZXRvbik7XG4gICAgfVxuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNrZWxldG9uQ2FyZCgpIHtcbiAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2FyZC5jbGFzc05hbWUgPSAnc2tlbGV0b24tY2FyZCc7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnc3RhdHVzJyk7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnTG9hZGluZyBjYXJkIGNvbnRlbnQnKTtcblxuICAgIGNvbnN0IHNyT25seSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzck9ubHkuY2xhc3NOYW1lID0gJ3NyLW9ubHknO1xuICAgIHNyT25seS50ZXh0Q29udGVudCA9ICdMb2FkaW5nLi4uJztcbiAgICBjYXJkLmFwcGVuZENoaWxkKHNyT25seSk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBjb250ZW50LmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fdGh1bWJuYWlsXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNrZWxldG9uLWNhcmRfX2xpbmVzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fbGluZVwiIHN0eWxlPVwid2lkdGg6NzAlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fbGluZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrZWxldG9uLWNhcmRfX2xpbmVcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgICBjYXJkLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgcmV0dXJuIGNhcmQ7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNrZWxldG9uQ2hhcnQoKSB7XG4gICAgY29uc3QgY2hhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjaGFydC5jbGFzc05hbWUgPSAnc2tlbGV0b24tY2hhcnQnO1xuICAgIGNoYXJ0LnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBjaGFydC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnTG9hZGluZyBjaGFydCcpO1xuXG4gICAgY29uc3Qgc3JPbmx5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNyT25seS5jbGFzc05hbWUgPSAnc3Itb25seSc7XG4gICAgc3JPbmx5LnRleHRDb250ZW50ID0gJ0xvYWRpbmcgY2hhcnQuLi4nO1xuICAgIGNoYXJ0LmFwcGVuZENoaWxkKHNyT25seSk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBjb250ZW50LmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2hhcnRfX2JhclwiPjwvZGl2Pic7XG4gICAgY29uc3QgYmFyID0gY29udGVudC5xdWVyeVNlbGVjdG9yKCcuc2tlbGV0b24tY2hhcnRfX2JhcicpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9ICdza2VsZXRvbi1jaGFydF9fYmFyLWl0ZW0nO1xuICAgICAgICBiYXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgfVxuXG4gICAgY2hhcnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgcmV0dXJuIGNoYXJ0O1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJTa2VsZXRvbihjb250YWluZXIsIHR5cGUgPSAnY2FyZCcsIGNvdW50ID0gMSkge1xuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGxldCBlbDtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdjYXJkJzpcbiAgICAgICAgICAgICAgICBlbCA9IGNyZWF0ZVNrZWxldG9uQ2FyZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hhcnQnOlxuICAgICAgICAgICAgICAgIGVsID0gY3JlYXRlU2tlbGV0b25DaGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgZWwgPSBjcmVhdGVTa2VsZXRvblRleHQoMyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGVsID0gY3JlYXRlU2tlbGV0b25DYXJkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cblxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTa2VsZXRvbnMoY29udGFpbmVyKSB7XG4gICAgY29uc3Qgc2tlbGV0b25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICcuc2tlbGV0b24tY2FyZCwgLnNrZWxldG9uLWNoYXJ0LCAuc2tlbGV0b24tdGV4dC1ncm91cCdcbiAgICApO1xuICAgIHNrZWxldG9ucy5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcbn1cbiIsICJjb25zdCBUT0FTVF9ERUZBVUxUUyA9IHtcbiAgICB0eXBlOiAnaW5mbycsXG4gICAgZHVyYXRpb246IDUwMDAsXG59O1xuXG5jb25zdCBJQ09OUyA9IHtcbiAgICBzdWNjZXNzOlxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIi8+PC9zdmc+JyxcbiAgICBlcnJvcjogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtMTUgOS02IDZcIi8+PHBhdGggZD1cIm05IDkgNiA2XCIvPjwvc3ZnPicsXG4gICAgd2FybmluZzpcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTEwLjI5IDMuODYgMS44MiAxOGEyIDIgMCAwIDAgMS43MSAzaDE2Ljk0YTIgMiAwIDAgMCAxLjcxLTNMMTMuNzEgMy44NmEyIDIgMCAwIDAtMy40MiAwelwiLz48cGF0aCBkPVwiTTEyIDl2NFwiLz48cGF0aCBkPVwiTTEyIDE3aC4wMVwiLz48L3N2Zz4nLFxuICAgIGluZm86ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTEyIDE2di00XCIvPjxwYXRoIGQ9XCJNMTIgOGguMDFcIi8+PC9zdmc+Jyxcbn07XG5cbmxldCBjb250YWluZXIgPSBudWxsO1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldENvbnRhaW5lcigpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdC1yb290Jyk7XG4gICAgaWYgKGV4aXN0aW5nICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZXhpc3RpbmcpKSB7XG4gICAgICAgIGV4aXN0aW5nLmNsYXNzTmFtZSA9ICd0b2FzdC1jb250YWluZXInO1xuICAgICAgICBleGlzdGluZy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScpO1xuICAgICAgICBleGlzdGluZy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJyk7XG4gICAgICAgIHJldHVybiBleGlzdGluZztcbiAgICB9XG5cbiAgICBpZiAoIWNvbnRhaW5lciB8fCAhZG9jdW1lbnQuYm9keS5jb250YWlucyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ3RvYXN0LWNvbnRhaW5lcic7XG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh7XG4gICAgdGl0bGUsXG4gICAgbWVzc2FnZSxcbiAgICB0eXBlID0gVE9BU1RfREVGQVVMVFMudHlwZSxcbiAgICBkdXJhdGlvbiA9IFRPQVNUX0RFRkFVTFRTLmR1cmF0aW9uLFxufSkge1xuICAgIGNvbnN0IHRvYXN0Q29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b2FzdC5jbGFzc05hbWUgPSBgdG9hc3QgdG9hc3QtLSR7dHlwZX1gO1xuICAgIHRvYXN0LnNldEF0dHJpYnV0ZSgncm9sZScsICdhbGVydCcpO1xuXG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYFxuICAgIDxzcGFuIGNsYXNzPVwidG9hc3RfX2ljb25cIj4ke0lDT05TW3R5cGVdIHx8IElDT05TLmluZm99PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJ0b2FzdF9fY29udGVudFwiPlxuICAgICAgPHAgY2xhc3M9XCJ0b2FzdF9fdGl0bGVcIj4ke3RpdGxlfTwvcD5cbiAgICAgICR7bWVzc2FnZSA/IGA8cCBjbGFzcz1cInRvYXN0X19tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5gIDogJyd9XG4gICAgPC9kaXY+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInRvYXN0X19jbG9zZVwiIGFyaWEtbGFiZWw9XCJEaXNtaXNzIG5vdGlmaWNhdGlvblwiPlxuICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPjwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICBgO1xuXG4gICAgY29uc3QgY2xvc2VCdG4gPSB0b2FzdC5xdWVyeVNlbGVjdG9yKCcudG9hc3RfX2Nsb3NlJyk7XG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByZW1vdmVUb2FzdCh0b2FzdCkpO1xuXG4gICAgdG9hc3RDb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3QpO1xuXG4gICAgaWYgKGR1cmF0aW9uID4gMCkge1xuICAgICAgICB0b2FzdC5fdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gcmVtb3ZlVG9hc3QodG9hc3QpLCBkdXJhdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvYXN0O1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZVRvYXN0KHRvYXN0KSB7XG4gICAgaWYgKHRvYXN0Ll90aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0b2FzdC5fdGltZW91dCk7XG4gICAgfVxuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3RvYXN0LS1yZW1vdmluZycpO1xuICAgIHRvYXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdhbmltYXRpb25lbmQnLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodG9hc3QucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodG9hc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dTdWNjZXNzKHRpdGxlLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHNob3dUb2FzdCh7IHR5cGU6ICdzdWNjZXNzJywgdGl0bGUsIG1lc3NhZ2UgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dFcnJvcih0aXRsZSwgbWVzc2FnZSkge1xuICAgIHJldHVybiBzaG93VG9hc3QoeyB0eXBlOiAnZXJyb3InLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd1dhcm5pbmcodGl0bGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2hvd1RvYXN0KHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd0luZm8odGl0bGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2hvd1RvYXN0KHsgdHlwZTogJ2luZm8nLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cbiIsICJsZXQgdG9vbHRpcElkQ291bnRlciA9IDA7XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAodHJpZ2dlckVsLCB7IGNvbnRlbnQsIHBvc2l0aW9uID0gJ3RvcCcsIGRlbGF5ID0gMjAwIH0gPSB7fSkge1xuICAgIGNvbnN0IHRvb2x0aXBJZCA9IGB0b29sdGlwLSR7Kyt0b29sdGlwSWRDb3VudGVyfWA7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICd0b29sdGlwLXdyYXBwZXInO1xuICAgIHRyaWdnZXJFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCB0cmlnZ2VyRWwpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodHJpZ2dlckVsKTtcblxuICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCB0b29sdGlwSWQpO1xuXG4gICAgY29uc3QgdG9vbHRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9IGB0b29sdGlwIHRvb2x0aXAtLSR7cG9zaXRpb259YDtcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XG4gICAgdG9vbHRpcC5pZCA9IHRvb2x0aXBJZDtcbiAgICB0b29sdGlwLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xuXG4gICAgbGV0IHNob3dUaW1lb3V0ID0gbnVsbDtcbiAgICBsZXQgaGlkZVRpbWVvdXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICBpZiAoaGlkZVRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG4gICAgICAgICAgICBoaWRlVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgcG9zaXRpb25Ub29sdGlwKCk7XG4gICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtLXZpc2libGUnKTtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgaWYgKHNob3dUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoc2hvd1RpbWVvdXQpO1xuICAgICAgICAgICAgc2hvd1RpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC0tdmlzaWJsZScpO1xuICAgICAgICB9LCAxMDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gcG9zaXRpb25Ub29sdGlwKCkge1xuICAgICAgICBjb25zdCB0cmlnZ2VyUmVjdCA9IHRyaWdnZXJFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgdG9vbHRpcFJlY3QgPSB0b29sdGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBnYXAgPSA4O1xuXG4gICAgICAgIGxldCB0b3AsIGxlZnQ7XG5cbiAgICAgICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICB0b3AgPSB0cmlnZ2VyUmVjdC50b3AgLSB0b29sdGlwUmVjdC5oZWlnaHQgLSBnYXA7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRyaWdnZXJSZWN0LmxlZnQgKyB0cmlnZ2VyUmVjdC53aWR0aCAvIDIgLSB0b29sdGlwUmVjdC53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgIHRvcCA9IHRyaWdnZXJSZWN0LmJvdHRvbSArIGdhcDtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gdHJpZ2dlclJlY3QubGVmdCArIHRyaWdnZXJSZWN0LndpZHRoIC8gMiAtIHRvb2x0aXBSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHRvcCA9IHRyaWdnZXJSZWN0LnRvcCArIHRyaWdnZXJSZWN0LmhlaWdodCAvIDIgLSB0b29sdGlwUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIGxlZnQgPSB0cmlnZ2VyUmVjdC5sZWZ0IC0gdG9vbHRpcFJlY3Qud2lkdGggLSBnYXA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgdG9wID0gdHJpZ2dlclJlY3QudG9wICsgdHJpZ2dlclJlY3QuaGVpZ2h0IC8gMiAtIHRvb2x0aXBSZWN0LmhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRyaWdnZXJSZWN0LnJpZ2h0ICsgZ2FwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFkZGluZyA9IDg7XG4gICAgICAgIGlmIChsZWZ0IDwgcGFkZGluZykgbGVmdCA9IHBhZGRpbmc7XG4gICAgICAgIGlmIChsZWZ0ICsgdG9vbHRpcFJlY3Qud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIHBhZGRpbmcpIHtcbiAgICAgICAgICAgIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHRvb2x0aXBSZWN0LndpZHRoIC0gcGFkZGluZztcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9wIDwgcGFkZGluZykgdG9wID0gcGFkZGluZztcbiAgICAgICAgaWYgKHRvcCArIHRvb2x0aXBSZWN0LmhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIHBhZGRpbmcpIHtcbiAgICAgICAgICAgIHRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRvb2x0aXBSZWN0LmhlaWdodCAtIHBhZGRpbmc7XG4gICAgICAgIH1cblxuICAgICAgICB0b29sdGlwLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgICAgIHRvb2x0aXAuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgIH1cblxuICAgIHRyaWdnZXJFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgc2hvdyk7XG4gICAgdHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICB0cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBzaG93KTtcbiAgICB0cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhpZGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICAgICAgICB0cmlnZ2VyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHNob3cpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHNob3cpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoaWRlKTtcbiAgICAgICAgICAgIHRvb2x0aXAucmVtb3ZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlOiBuZXdDb250ZW50ID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAudGV4dENvbnRlbnQgPSBuZXdDb250ZW50O1xuICAgICAgICB9LFxuICAgIH07XG59XG4iLCAiLyoqXG4gKiBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIHdpdGggdmFsaWRhdGlvbiBhbmQgZGVmYXVsdHMuXG4gKiBVc2VzIGltcG9ydC5tZXRhLmVudiAoaW5qZWN0ZWQgYnkgZXNidWlsZCBkZWZpbmUpIHdpdGggZmFsbGJhY2tzLlxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICAgIEFQUF9OQU1FOiAnU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyJyxcbiAgICBBUFBfVkVSU0lPTjogJzAuMS4wJyxcbiAgICBBUElfQkFTRV9VUkw6ICcvYXBpJyxcbiAgICBBUElfVElNRU9VVDogMTAwMDAsXG4gICAgQVVUSF9UT0tFTl9LRVk6ICdzdHVkZW50X3RyYWNrZXJfYXV0aCcsXG4gICAgQVVUSF9SRURJUkVDVF9LRVk6ICdzdHVkZW50X3RyYWNrZXJfcmVkaXJlY3QnLFxuICAgIEFVVEhfUkVNRU1CRVJfREFZUzogMzAsXG4gICAgRU5BQkxFX01PQ0tfQVBJOiB0cnVlLFxuICAgIEVOQUJMRV9QV0E6IGZhbHNlLFxuICAgIEVOQUJMRV9BTkFMWVRJQ1M6IGZhbHNlLFxuICAgIENIQVJUX0FOSU1BVElPTl9EVVJBVElPTjogNzUwLFxuICAgIENIQVJUX1JFU1BPTlNJVkU6IHRydWUsXG59O1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldEVudihrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIGNvbnN0IHZhbHVlID0gaW1wb3J0Lm1ldGEuZW52W2tleV07XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzTmFOKHZhbHVlKSAmJiB2YWx1ZSAhPT0gJycpIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IEVOViA9IHtcbiAgICBBUFBfTkFNRTogZ2V0RW52KCdWSVRFX0FQUF9OQU1FJywgREVGQVVMVFMuQVBQX05BTUUpLFxuICAgIEFQUF9WRVJTSU9OOiBnZXRFbnYoJ1ZJVEVfQVBQX1ZFUlNJT04nLCBERUZBVUxUUy5BUFBfVkVSU0lPTiksXG4gICAgQVBJX0JBU0VfVVJMOiBnZXRFbnYoJ1ZJVEVfQVBJX0JBU0VfVVJMJywgREVGQVVMVFMuQVBJX0JBU0VfVVJMKSxcbiAgICBBUElfVElNRU9VVDogZ2V0RW52KCdWSVRFX0FQSV9USU1FT1VUJywgREVGQVVMVFMuQVBJX1RJTUVPVVQpLFxuICAgIEFVVEhfVE9LRU5fS0VZOiBnZXRFbnYoJ1ZJVEVfQVVUSF9UT0tFTl9LRVknLCBERUZBVUxUUy5BVVRIX1RPS0VOX0tFWSksXG4gICAgQVVUSF9SRURJUkVDVF9LRVk6IGdldEVudignVklURV9BVVRIX1JFRElSRUNUX0tFWScsIERFRkFVTFRTLkFVVEhfUkVESVJFQ1RfS0VZKSxcbiAgICBBVVRIX1JFTUVNQkVSX0RBWVM6IGdldEVudignVklURV9BVVRIX1JFTUVNQkVSX0RBWVMnLCBERUZBVUxUUy5BVVRIX1JFTUVNQkVSX0RBWVMpLFxuICAgIEVOQUJMRV9NT0NLX0FQSTogZ2V0RW52KCdWSVRFX0VOQUJMRV9NT0NLX0FQSScsIERFRkFVTFRTLkVOQUJMRV9NT0NLX0FQSSksXG4gICAgRU5BQkxFX1BXQTogZ2V0RW52KCdWSVRFX0VOQUJMRV9QV0EnLCBERUZBVUxUUy5FTkFCTEVfUFdBKSxcbiAgICBFTkFCTEVfQU5BTFlUSUNTOiBnZXRFbnYoJ1ZJVEVfRU5BQkxFX0FOQUxZVElDUycsIERFRkFVTFRTLkVOQUJMRV9BTkFMWVRJQ1MpLFxuICAgIENIQVJUX0FOSU1BVElPTl9EVVJBVElPTjogZ2V0RW52KFxuICAgICAgICAnVklURV9DSEFSVF9BTklNQVRJT05fRFVSQVRJT04nLFxuICAgICAgICBERUZBVUxUUy5DSEFSVF9BTklNQVRJT05fRFVSQVRJT05cbiAgICApLFxuICAgIENIQVJUX1JFU1BPTlNJVkU6IGdldEVudignVklURV9DSEFSVF9SRVNQT05TSVZFJywgREVGQVVMVFMuQ0hBUlRfUkVTUE9OU0lWRSksXG59O1xuXG5pZiAoIUVOVi5BUElfQkFTRV9VUkwpIHtcbiAgICBjb25zb2xlLndhcm4oJ1tDb25maWddIFZJVEVfQVBJX0JBU0VfVVJMIG5vdCBzZXQsIHVzaW5nIGRlZmF1bHQnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRU5WO1xuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBcHBsaWNhdGlvbi13aWRlIGNvbnN0YW50cyBhbmQgZW51bWVyYXRpb25zLlxuICpcbiAqIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIGFsbCBtYWdpYyBzdHJpbmdzIGFuZCBudW1iZXJzXG4gKiB1c2VkIGFjcm9zcyB0aGUgU3R1ZGVudCBQcm9ncmVzcyBUcmFja2luZyBTYWFTLlxuICpcbiAqIEltcG9ydCBvbmx5IHRoZSBncm91cHMgeW91IG5lZWQgXHUyMDE0IHRyZWUtc2hha2luZyBrZWVwcyB0aGVcbiAqIGJ1bmRsZSBtaW5pbWFsIHdoZW4gaW5kaXZpZHVhbCBuYW1lZCBleHBvcnRzIGFyZSB1c2VkLlxuICpcbiAqIEBtb2R1bGUgdXRpbHMvY29uc3RhbnRzXG4gKi9cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSb3V0ZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKiogSGFzaC1yb3V0ZXIgcGF0aCBjb25zdGFudHMgdXNlZCBhY3Jvc3MgdGhlIGFwcGxpY2F0aW9uLiAqL1xuZXhwb3J0IGNvbnN0IFJPVVRFUyA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgTE9HSU46ICcvbG9naW4nLFxuICAgIERBU0hCT0FSRDogJy9kYXNoYm9hcmQnLFxuICAgIE5PVF9GT1VORDogJy80MDQnLFxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJIEVuZHBvaW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQVBJIGVuZHBvaW50IGZhY3RvcnkgZnVuY3Rpb25zIGFuZCBzdGF0aWMgcGF0aHMuXG4gKiBBbGwgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIEVOVi5BUElfQkFTRV9VUkwuXG4gKi9cbmV4cG9ydCBjb25zdCBBUElfRU5EUE9JTlRTID0gLyoqIEB0eXBlIHtjb25zdH0gKi8gKHtcbiAgICBBVVRIX0xPR0lOOiAnL2F1dGgvbG9naW4nLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFN0dWRlbnQgSUQgKi9cbiAgICBTVFVERU5UOiBpZCA9PiBgL3N0dWRlbnRzLyR7aWR9YCxcblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBTdHVkZW50IElEICovXG4gICAgU1RVREVOVF9DT1VSU0VTOiBpZCA9PiBgL3N0dWRlbnRzLyR7aWR9L2NvdXJzZXNgLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFN0dWRlbnQgSUQgKi9cbiAgICBTVFVERU5UX0dSQURFUzogaWQgPT4gYC9zdHVkZW50cy8ke2lkfS9ncmFkZXNgLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIENvdXJzZSBJRCAqL1xuICAgIENPVVJTRTogaWQgPT4gYC9jb3Vyc2VzLyR7aWR9YCxcblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBDb3Vyc2UgSUQgKi9cbiAgICBDT1VSU0VfUFJPR1JFU1M6IGlkID0+IGAvY291cnNlcy8ke2lkfS9wcm9ncmVzc2AsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdXRoZW50aWNhdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKiBBdXRoZW50aWNhdGlvbi1zcGVjaWZpYyBjb25zdGFudHMuICovXG5leHBvcnQgY29uc3QgQVVUSF9DT05TVEFOVFMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoe1xuICAgIERFTU9fRU1BSUw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICBERU1PX1BBU1NXT1JEOiAnZGVtbzEyMycsXG5cbiAgICAvKiogMzAtZGF5IHRva2VuIGxpZmV0aW1lIGluIG1pbGxpc2Vjb25kcy4gKi9cbiAgICBUT0tFTl9FWFBJUllfTVM6IDMwICogMjQgKiA2MCAqIDYwICogMTAwMCxcblxuICAgIC8qKiBNaW5pbXVtIHBhc3N3b3JkIGxlbmd0aCBmb3IgY2xpZW50LXNpZGUgdmFsaWRhdGlvbi4gKi9cbiAgICBNSU5fUEFTU1dPUkRfTEVOR1RIOiA2LFxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ291cnNlIHN0YXR1c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKiBWYWxpZCB2YWx1ZXMgZm9yIENvdXJzZS5zdGF0dXMgcmVjZWl2ZWQgZnJvbSB0aGUgQVBJLiAqL1xuZXhwb3J0IGNvbnN0IENPVVJTRV9TVEFUVVMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoe1xuICAgIE5PVF9TVEFSVEVEOiAnbm90LXN0YXJ0ZWQnLFxuICAgIElOX1BST0dSRVNTOiAnaW4tcHJvZ3Jlc3MnLFxuICAgIENPTVBMRVRFRDogJ2NvbXBsZXRlZCcsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUb2FzdCBkdXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKiogQXV0by1kaXNtaXNzIGR1cmF0aW9ucyAobXMpIGZvciB0b2FzdCBub3RpZmljYXRpb25zIChQYXJ0IDEwKS4gKi9cbmV4cG9ydCBjb25zdCBUT0FTVF9EVVJBVElPTiA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgU1VDQ0VTUzogMzAwMCxcbiAgICBFUlJPUjogNTAwMCxcbiAgICBXQVJOSU5HOiA0MDAwLFxuICAgIElORk86IDQwMDAsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFcnJvciBjb2Rlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogTm9ybWFsaXNlZCBlcnJvciBjb2RlcyB1c2VkIGFjcm9zcyBzZXJ2aWNlIGFuZCBjb250ZXh0IGxheWVycy5cbiAqIFByZXZlbnRzIHNjYXR0ZXJlZCBzdHJpbmcgbGl0ZXJhbHMgd2hlbiBjb21wYXJpbmcgZXJyb3IgdHlwZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBFUlJPUl9DT0RFUyA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxuICAgIFNFU1NJT05fRVhQSVJFRDogJ1NFU1NJT05fRVhQSVJFRCcsXG4gICAgTkVUV09SS19FUlJPUjogJ05FVFdPUktfRVJST1InLFxuICAgIFZBTElEQVRJT05fRVJST1I6ICdWQUxJREFUSU9OX0VSUk9SJyxcbiAgICBVTktOT1dOOiAnVU5LTk9XTicsXG59KTtcbiIsICJjb25zdCBjb25maWcgPSB7XG4gICAgYXBwTmFtZTogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBQX05BTUUgfHwgJ1N0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tlcicsXG4gICAgYXBwRW52OiBpbXBvcnQubWV0YS5lbnYuVklURV9BUFBfRU5WIHx8ICdkZXZlbG9wbWVudCcsXG4gICAgYXBpQmFzZVVybDogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0JBU0VfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDEvYXBpJyxcbiAgICBhcGlNb2NrRW5hYmxlZDogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX01PQ0tfRU5BQkxFRCA9PT0gJ3RydWUnLFxuICAgIGF1dGhUb2tlbktleTogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVVUSF9UT0tFTl9LRVkgfHwgJ2F1dGhfdG9rZW4nLFxuICAgIHNlc3Npb25UaW1lb3V0TWludXRlczogcGFyc2VJbnQoaW1wb3J0Lm1ldGEuZW52LlZJVEVfU0VTU0lPTl9USU1FT1VUX01JTlVURVMgfHwgJzYwJywgMTApLFxuICAgIGVuYWJsZUFuYWx5dGljczogaW1wb3J0Lm1ldGEuZW52LlZJVEVfRU5BQkxFX0FOQUxZVElDUyA9PT0gJ3RydWUnLFxuICAgIGVuYWJsZU5vdGlmaWNhdGlvbnM6IGltcG9ydC5tZXRhLmVudi5WSVRFX0VOQUJMRV9OT1RJRklDQVRJT05TICE9PSAnZmFsc2UnLFxuICAgIGNhY2hlVHRsU2Vjb25kczogcGFyc2VJbnQoaW1wb3J0Lm1ldGEuZW52LlZJVEVfQ0FDSEVfVFRMX1NFQ09ORFMgfHwgJzMwMCcsIDEwKSxcbn07XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpIHtcbiAgICByZXR1cm4geyAuLi5jb25maWcgfTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEZXZlbG9wbWVudCgpIHtcbiAgICByZXR1cm4gY29uZmlnLmFwcEVudiA9PT0gJ2RldmVsb3BtZW50Jztcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdGFnaW5nKCkge1xuICAgIHJldHVybiBjb25maWcuYXBwRW52ID09PSAnc3RhZ2luZyc7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvZHVjdGlvbigpIHtcbiAgICByZXR1cm4gY29uZmlnLmFwcEVudiA9PT0gJ3Byb2R1Y3Rpb24nO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tBcGlFbmFibGVkKCkge1xuICAgIHJldHVybiBjb25maWcuYXBpTW9ja0VuYWJsZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHsgc3RhdHVzLCBjb2RlLCBkYXRhIH0gPSB7fSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0FwcEVycm9yJztcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBcGlFcnJvcihlcnJvcikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEFwcEVycm9yKSByZXR1cm4gZXJyb3I7XG5cbiAgICBjb25zdCBzdGF0dXMgPSBlcnJvci5zdGF0dXMgfHwgMDtcbiAgICBjb25zdCBzdGF0dXNNZXNzYWdlcyA9IHtcbiAgICAgICAgMDoge1xuICAgICAgICAgICAgdGl0bGU6ICdOZXR3b3JrIEVycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyLiBQbGVhc2UgY2hlY2sgeW91ciBpbnRlcm5ldCBjb25uZWN0aW9uLicsXG4gICAgICAgIH0sXG4gICAgICAgIDQwMDogeyB0aXRsZTogJ0JhZCBSZXF1ZXN0JywgbWVzc2FnZTogJ1RoZSByZXF1ZXN0IHdhcyBpbnZhbGlkLiBQbGVhc2UgY2hlY2sgeW91ciBpbnB1dC4nIH0sXG4gICAgICAgIDQwMToge1xuICAgICAgICAgICAgdGl0bGU6ICdTZXNzaW9uIEV4cGlyZWQnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdXIgc2Vzc2lvbiBoYXMgZXhwaXJlZC4gUGxlYXNlIGxvZyBpbiBhZ2Fpbi4nLFxuICAgICAgICB9LFxuICAgICAgICA0MDM6IHtcbiAgICAgICAgICAgIHRpdGxlOiAnQWNjZXNzIERlbmllZCcsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gcGVyZm9ybSB0aGlzIGFjdGlvbi4nLFxuICAgICAgICB9LFxuICAgICAgICA0MDQ6IHsgdGl0bGU6ICdOb3QgRm91bmQnLCBtZXNzYWdlOiAnVGhlIHJlcXVlc3RlZCByZXNvdXJjZSBjb3VsZCBub3QgYmUgZm91bmQuJyB9LFxuICAgICAgICA0Mjk6IHsgdGl0bGU6ICdUb28gTWFueSBSZXF1ZXN0cycsIG1lc3NhZ2U6ICdQbGVhc2Ugd2FpdCBhIG1vbWVudCBiZWZvcmUgdHJ5aW5nIGFnYWluLicgfSxcbiAgICAgICAgNTAwOiB7XG4gICAgICAgICAgICB0aXRsZTogJ1NlcnZlciBFcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyxcbiAgICAgICAgfSxcbiAgICAgICAgNTAzOiB7XG4gICAgICAgICAgICB0aXRsZTogJ1NlcnZpY2UgVW5hdmFpbGFibGUnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1RoZSBzZXJ2aWNlIGlzIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicsXG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IGluZm8gPSBzdGF0dXNNZXNzYWdlc1tzdGF0dXNdIHx8IHtcbiAgICAgICAgdGl0bGU6ICdFcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuJyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBBcHBFcnJvcihpbmZvLm1lc3NhZ2UsIHsgc3RhdHVzLCBkYXRhOiBlcnJvci5kYXRhIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVHbG9iYWxFcnJvcnMob25FcnJvcikge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignR2xvYmFsIGVycm9yIGNhdWdodDonLCBldmVudC5lcnJvciB8fCBldmVudC5tZXNzYWdlKTtcbiAgICAgICAgaWYgKG9uRXJyb3IpIG9uRXJyb3IoZXZlbnQuZXJyb3IgfHwgeyBtZXNzYWdlOiBldmVudC5tZXNzYWdlIH0pO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicsIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uOicsIGV2ZW50LnJlYXNvbik7XG4gICAgICAgIGlmIChvbkVycm9yKSBvbkVycm9yKGV2ZW50LnJlYXNvbik7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEF1dGhlbnRpY2F0aW9uIFN0b3JhZ2UgU2VydmljZSBcdTIwMTQgUGFydCAzLlxuICpcbiAqIEFic3RyYWN0cyBhbGwgV2ViIFN0b3JhZ2UgcmVhZHMgYW5kIHdyaXRlcyByZWxhdGVkIHRvIGF1dGhlbnRpY2F0aW9uXG4gKiBiZWhpbmQgYSBjbGVhbiwgdGVzdGFibGUgQVBJIHNvIHRoYXQgQXV0aENvbnRleHQgYW5kIGF1dGhBcGkgbmV2ZXJcbiAqIHJlZmVyZW5jZSBgbG9jYWxTdG9yYWdlYCAvIGBzZXNzaW9uU3RvcmFnZWAgZGlyZWN0bHkuXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIFN0b3JhZ2Ugc3RyYXRlZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIFRva2VuIHBheWxvYWQgIHsgdG9rZW4sIGV4cGlyZXNBdCwgdXNlciB9XG4gKiAgIFx1MjUwQ1x1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUxMFxuICogICBcdTI1MDIgIHJlbWVtYmVyTWUgPSB0cnVlICBcdTIxOTIgbG9jYWxTdG9yYWdlICAgKHBlcnNpc3RzIGFjcm9zcyBicm93c2VyIGNsb3NlKSBcdTI1MDJcbiAqICAgXHUyNTAyICByZW1lbWJlck1lID0gZmFsc2UgXHUyMTkyIHNlc3Npb25TdG9yYWdlIChjbGVhcmVkIG9uIHRhYi9icm93c2VyIGNsb3NlKSAgXHUyNTAyXG4gKiAgIFx1MjUxNFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUxOFxuICpcbiAqICAgUmVhZCBvcmRlcjogbG9jYWxTdG9yYWdlIGZpcnN0IFx1MjE5MiBzZXNzaW9uU3RvcmFnZSBmYWxsYmFjay5cbiAqICAgQ2xlYXI6IGJvdGggdGllcnMgYXJlIGFsd2F5cyB3aXBlZCB0byBwcmV2ZW50IG9ycGhhbmVkIHRva2Vucy5cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgUHJpdmF0ZS1icm93c2luZyBmYWxsYmFjayAoRlItU1RPUi0wMDYpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBJbiBlbnZpcm9ubWVudHMgd2hlcmUgV2ViIFN0b3JhZ2UgaXMgYmxvY2tlZCAoU2FmYXJpIHByaXZhdGUgbW9kZSxcbiAqICAgY2VydGFpbiBlbnRlcnByaXNlIGJyb3dzZXJzKSBldmVyeSBzdG9yYWdlIGNhbGwgaXMgY2F1Z2h0IGFuZCBhblxuICogICBpbi1tZW1vcnkgTWFwIGlzIHVzZWQgaW5zdGVhZC4gVGhlIGluLW1lbW9yeSBzdG9yZSBpcyBlcGhlbWVyYWwgXHUyMDE0XG4gKiAgIGl0IGxpdmVzIG9ubHkgZm9yIHRoZSBjdXJyZW50IHBhZ2UgbGlmZWN5Y2xlIFx1MjAxNCBidXQgaXQgYWxsb3dzIHRoZVxuICogICBhcHBsaWNhdGlvbiB0byBmdW5jdGlvbiB3aXRob3V0IGNyYXNoaW5nLlxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBFeHBvcnRlZCBBUEkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIHNhdmVBdXRoVG9rZW4oeyB0b2tlbiwgZXhwaXJlc0F0LCByZW1lbWJlck1lIH0pXG4gKiAgIGdldEF1dGhUb2tlbigpXG4gKiAgIGNsZWFyQXV0aFRva2VuKClcbiAqICAgc2F2ZVJlZGlyZWN0UGF0aChwYXRoKVxuICogICBnZXRSZWRpcmVjdFBhdGgoKVxuICpcbiAqIEBtb2R1bGUgc2VydmljZXMvYXV0aFN0b3JhZ2VcbiAqL1xuXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuLi9jb25maWcvZW52LmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFN0b3JhZ2Uga2V5cyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBSZXNvbHZlZCBvbmNlIGF0IG1vZHVsZSBsb2FkIGZyb20gRU5WIHNvIGV2ZXJ5IGZ1bmN0aW9uIHVzZXMgdGhlXG4vLyBzYW1lIGtleSBzdHJpbmcgd2l0aG91dCByZXBlYXRpbmcgbWFnaWMgdmFsdWVzLlxuXG4vKiogQHR5cGUge3N0cmluZ30gS2V5IHVuZGVyIHdoaWNoIHRoZSBhdXRoIHBheWxvYWQgaXMgc3RvcmVkLiAqL1xuY29uc3QgVE9LRU5fS0VZID0gRU5WLkFVVEhfVE9LRU5fS0VZO1xuXG4vKiogQHR5cGUge3N0cmluZ30gS2V5IHVuZGVyIHdoaWNoIHRoZSBwcmUtbG9naW4gcmVkaXJlY3QgcGF0aCBpcyBzdG9yZWQuICovXG5jb25zdCBSRURJUkVDVF9LRVkgPSBFTlYuQVVUSF9SRURJUkVDVF9LRVk7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBJbi1tZW1vcnkgZmFsbGJhY2sgc3RvcmUgKEZSLVNUT1ItMDA2KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBVc2VkIHdoZW4gYm90aCBsb2NhbFN0b3JhZ2UgYW5kIHNlc3Npb25TdG9yYWdlIHRocm93IChlLmcuIHByaXZhdGUgbW9kZSkuXG4vLyBLZXlzIG1pcnJvciB0aGUgV2ViIFN0b3JhZ2Uga2V5IG5hbWVzIHNvIHRoZSByZXN0IG9mIHRoZSBjb2RlIHN0YXlzIHVuaWZvcm0uXG5cbi8qKiBAdHlwZSB7TWFwPHN0cmluZywgc3RyaW5nPn0gKi9cbmNvbnN0IF9tZW1vcnlTdG9yZSA9IG5ldyBNYXAoKTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFByaXZhdGUgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBBdHRlbXB0cyB0byByZWFkIGFuZCBKU09OLXBhcnNlIGEgdmFsdWUgZnJvbSBhIHNpbmdsZSBXZWIgU3RvcmFnZSB0aWVyLlxuICogUmV0dXJucyBudWxsIG9uIGFueSBmYWlsdXJlIChtaXNzaW5nIGtleSwgbWFsZm9ybWVkIEpTT04sIHN0b3JhZ2UgYmxvY2tlZCkuXG4gKlxuICogQHBhcmFtIHtTdG9yYWdlfSBzdG9yYWdlIC0gYGxvY2FsU3RvcmFnZWAgb3IgYHNlc3Npb25TdG9yYWdlYFxuICogQHBhcmFtIHtzdHJpbmd9ICBrZXkgICAgIC0gVGhlIHN0b3JhZ2Uga2V5IHRvIHJlYWRcbiAqIEByZXR1cm5zIHt1bmtub3dufG51bGx9ICBQYXJzZWQgdmFsdWUgb3IgbnVsbFxuICovXG5mdW5jdGlvbiBfc3RvcmFnZVJlYWQoc3RvcmFnZSwga2V5KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmF3ID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmIChyYXcgPT09IG51bGwgfHwgcmF3ID09PSAnJykgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJhdyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLyoqXG4gKiBBdHRlbXB0cyB0byBKU09OLXNlcmlhbGlzZSBhIHZhbHVlIGFuZCB3cml0ZSBpdCB0byBhIFdlYiBTdG9yYWdlIHRpZXIuXG4gKiBGYWxscyBiYWNrIHRvIHRoZSBpbi1tZW1vcnkgc3RvcmUgd2hlbiBzdG9yYWdlIGlzIHVuYXZhaWxhYmxlLlxuICpcbiAqIEBwYXJhbSB7U3RvcmFnZX0gc3RvcmFnZSAtIGBsb2NhbFN0b3JhZ2VgIG9yIGBzZXNzaW9uU3RvcmFnZWBcbiAqIEBwYXJhbSB7c3RyaW5nfSAga2V5ICAgICAtIFRoZSBzdG9yYWdlIGtleSB0byB3cml0ZVxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZSAgIC0gQW55IEpTT04tc2VyaWFsaXNhYmxlIHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSB3aGVuIHRoZSB3cml0ZSBzdWNjZWVkZWQgdG8gV2ViIFN0b3JhZ2U7IGZhbHNlIHdoZW5cbiAqICAgICAgICAgICAgICAgICAgICB0aGUgZmFsbGJhY2sgaW4tbWVtb3J5IHN0b3JlIHdhcyB1c2VkXG4gKi9cbmZ1bmN0aW9uIF9zdG9yYWdlV3JpdGUoc3RvcmFnZSwga2V5LCB2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBTdG9yYWdlIHVuYXZhaWxhYmxlIChwcml2YXRlIGJyb3dzaW5nLCBxdW90YSBleGNlZWRlZCkgXHUyMDE0IHVzZSBtZW1vcnkuXG4gICAgICAgIF9tZW1vcnlTdG9yZS5zZXQoa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIHJlbW92ZSBhIGtleSBmcm9tIGEgV2ViIFN0b3JhZ2UgdGllci5cbiAqIEFsc28gcmVtb3ZlcyB0aGUga2V5IGZyb20gdGhlIGluLW1lbW9yeSBmYWxsYmFjayB0byBrZWVwIHRoZW0gaW4gc3luYy5cbiAqXG4gKiBAcGFyYW0ge1N0b3JhZ2V9IHN0b3JhZ2UgLSBgbG9jYWxTdG9yYWdlYCBvciBgc2Vzc2lvblN0b3JhZ2VgXG4gKiBAcGFyYW0ge3N0cmluZ30gIGtleSAgICAgLSBUaGUga2V5IHRvIHJlbW92ZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIF9zdG9yYWdlUmVtb3ZlKHN0b3JhZ2UsIGtleSkge1xuICAgIHRyeSB7XG4gICAgICAgIHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBTdG9yYWdlIHVuYXZhaWxhYmxlIFx1MjAxNCBmYWxsIHRocm91Z2ggdG8gbWVtb3J5IHJlbW92YWwgYmVsb3cuXG4gICAgfVxuICAgIF9tZW1vcnlTdG9yZS5kZWxldGUoa2V5KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEV4cG9ydGVkIEFQSSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBQZXJzaXN0cyB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gcGF5bG9hZCB0byB0aGUgYXBwcm9wcmlhdGUgc3RvcmFnZSB0aWVyLlxuICpcbiAqIFN0b3JlZCBwYXlsb2FkIHNoYXBlOlxuICogYGBganNvblxuICogeyBcInRva2VuXCI6IFwiXHUyMDI2XCIsIFwiZXhwaXJlc0F0XCI6IDEyMzQ1Njc4OTAwMDAsIFwidXNlclwiOiB7IFx1MjAyNiB9IH1cbiAqIGBgYFxuICpcbiAqIGBleHBpcmVzQXRgIGlzIG5vcm1hbGlzZWQgdG8gYSBVbml4IHRpbWVzdGFtcCAobXMpIGhlcmUgcmVnYXJkbGVzcyBvZlxuICogd2hldGhlciB0aGUgc2VydmVyIHJldHVybnMgYW4gSVNPLTg2MDEgc3RyaW5nIG9yIGEgbnVtZXJpYyB2YWx1ZS5cbiAqIFRoaXMgZ3VhcmFudGVlcyB0aGF0IGBnZXRBdXRoVG9rZW4oKWAgY2FuIGFsd2F5cyBjb21wYXJlIGFnYWluc3QgYERhdGUubm93KClgXG4gKiB3aXRob3V0IGZ1cnRoZXIgdHlwZS1jaGVja2luZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgICAgICAgICAgICAtIFRva2VuIGRhdGEgZnJvbSB0aGUgYXV0aCBBUEkgcmVzcG9uc2VcbiAqIEBwYXJhbSB7c3RyaW5nfSAgcGFyYW1zLnRva2VuICAgICAgIC0gUmF3IEpXVCBvciBzZXNzaW9uIHRva2VuIHN0cmluZ1xuICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBwYXJhbXMuZXhwaXJlc0F0IC0gVG9rZW4gZXhwaXJ5IGFzIGEgVW5peCBtcyB0aW1lc3RhbXBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgYW4gSVNPLTg2MDEgc3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcy51c2VyICAgICAgICAtIEF1dGhlbnRpY2F0ZWQgdXNlciBvYmplY3RcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5yZW1lbWJlck1lPWZhbHNlXSAtIFdoZW4gdHJ1ZTogdXNlIGxvY2FsU3RvcmFnZTtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gZmFsc2U6IHVzZSBzZXNzaW9uU3RvcmFnZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXZlQXV0aFRva2VuKHsgdG9rZW4sIGV4cGlyZXNBdCwgdXNlciwgcmVtZW1iZXJNZSA9IGZhbHNlIH0pIHtcbiAgICAvLyBOb3JtYWxpc2UgZXhwaXJlc0F0OiBhY2NlcHQgYm90aCBJU08gc3RyaW5ncyBhbmQgbnVtZXJpYyB0aW1lc3RhbXBzLlxuICAgIGNvbnN0IG5vcm1hbGlzZWQgPVxuICAgICAgICB0eXBlb2YgZXhwaXJlc0F0ID09PSAnc3RyaW5nJyA/IG5ldyBEYXRlKGV4cGlyZXNBdCkuZ2V0VGltZSgpIDogTnVtYmVyKGV4cGlyZXNBdCk7XG5cbiAgICBjb25zdCBwYXlsb2FkID0geyB0b2tlbiwgZXhwaXJlc0F0OiBub3JtYWxpc2VkLCB1c2VyIH07XG5cbiAgICBpZiAocmVtZW1iZXJNZSkge1xuICAgICAgICAvLyBQZXJzaXN0ZW50IHNlc3Npb24gXHUyMDE0IHN1cnZpdmVzIGJyb3dzZXIgcmVzdGFydC5cbiAgICAgICAgX3N0b3JhZ2VXcml0ZShsb2NhbFN0b3JhZ2UsIFRPS0VOX0tFWSwgcGF5bG9hZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU2Vzc2lvbi1zY29wZWQgXHUyMDE0IGNsZWFyZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSB0YWIvYnJvd3NlciBjbG9zZXMuXG4gICAgICAgIF9zdG9yYWdlV3JpdGUoc2Vzc2lvblN0b3JhZ2UsIFRPS0VOX0tFWSwgcGF5bG9hZCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgc3RvcmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuIHBheWxvYWQuXG4gKlxuICogUmVhZCBvcmRlcjpcbiAqICAgMS4gYGxvY2FsU3RvcmFnZWAgICBcdTIwMTQgXCJyZW1lbWJlciBtZVwiIHNlc3Npb25zXG4gKiAgIDIuIGBzZXNzaW9uU3RvcmFnZWAgXHUyMDE0IHRhYi1zY29wZWQgc2Vzc2lvbnNcbiAqICAgMy4gSW4tbWVtb3J5IHN0b3JlICBcdTIwMTQgcHJpdmF0ZS1icm93c2luZyBmYWxsYmFja1xuICpcbiAqIFJldHVybnMgbnVsbCB3aGVuIG5vIHZhbGlkIHRva2VuIHBheWxvYWQgaXMgZm91bmQgaW4gYW55IHRpZXIuXG4gKlxuICogQHJldHVybnMge3sgdG9rZW46IHN0cmluZywgZXhwaXJlc0F0OiBudW1iZXIsIHVzZXI6IE9iamVjdCB9fG51bGx9XG4gKiAgIFRoZSBzdG9yZWQgcGF5bG9hZCwgb3IgbnVsbCB3aGVuIG5vbmUgZXhpc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdXRoVG9rZW4oKSB7XG4gICAgLy8gQ2hlY2sgV2ViIFN0b3JhZ2UgdGllcnMgZmlyc3QuXG4gICAgY29uc3QgZnJvbUxvY2FsID0gX3N0b3JhZ2VSZWFkKGxvY2FsU3RvcmFnZSwgVE9LRU5fS0VZKTtcbiAgICBpZiAoZnJvbUxvY2FsKSByZXR1cm4gZnJvbUxvY2FsO1xuXG4gICAgY29uc3QgZnJvbVNlc3Npb24gPSBfc3RvcmFnZVJlYWQoc2Vzc2lvblN0b3JhZ2UsIFRPS0VOX0tFWSk7XG4gICAgaWYgKGZyb21TZXNzaW9uKSByZXR1cm4gZnJvbVNlc3Npb247XG5cbiAgICAvLyBGYWxsIGJhY2sgdG8gdGhlIGluLW1lbW9yeSBzdG9yZSAocHJpdmF0ZS1icm93c2luZyBlbnZpcm9ubWVudHMpLlxuICAgIGNvbnN0IHJhdyA9IF9tZW1vcnlTdG9yZS5nZXQoVE9LRU5fS0VZKTtcbiAgICBpZiAoIXJhdykgcmV0dXJuIG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyYXcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gcGF5bG9hZCBmcm9tIGFsbCBzdG9yYWdlIHRpZXJzLlxuICpcbiAqIENsZWFycyBsb2NhbFN0b3JhZ2UsIHNlc3Npb25TdG9yYWdlLCBBTkQgdGhlIGluLW1lbW9yeSBmYWxsYmFja1xuICogc28gdGhhdCBubyBvcnBoYW5lZCB0b2tlbiBjYW4gYmUgZm91bmQgYnkgYSBzdWJzZXF1ZW50IGBnZXRBdXRoVG9rZW4oKWAgY2FsbCxcbiAqIHJlZ2FyZGxlc3Mgb2Ygd2hpY2ggdGllciB3YXMgdXNlZCBkdXJpbmcgbG9naW4uXG4gKlxuICogQWxzbyByZW1vdmVzIHRoZSBzYXZlZCByZWRpcmVjdCBwYXRoIGZyb20gc2Vzc2lvblN0b3JhZ2UuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckF1dGhUb2tlbigpIHtcbiAgICBfc3RvcmFnZVJlbW92ZShsb2NhbFN0b3JhZ2UsIFRPS0VOX0tFWSk7XG4gICAgX3N0b3JhZ2VSZW1vdmUoc2Vzc2lvblN0b3JhZ2UsIFRPS0VOX0tFWSk7XG4gICAgLy8gUmVtb3ZlIHRoZSBwcmUtbG9naW4gcmVkaXJlY3QgcGF0aCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIF9zdG9yYWdlUmVtb3ZlKHNlc3Npb25TdG9yYWdlLCBSRURJUkVDVF9LRVkpO1xufVxuXG4vKipcbiAqIFNhdmVzIHRoZSBwYXRoIHRoZSB1c2VyIHdhcyBhdHRlbXB0aW5nIHRvIHZpc2l0IGJlZm9yZSBiZWluZyByZWRpcmVjdGVkXG4gKiB0byB0aGUgbG9naW4gcGFnZS4gIFN0b3JlZCBpbiBzZXNzaW9uU3RvcmFnZSBiZWNhdXNlIHRoZSByZWRpcmVjdCBpbnRlbnRcbiAqIGlzIG9ubHkgcmVsZXZhbnQgZm9yIHRoZSBjdXJyZW50IGJyb3dzZXIgc2Vzc2lvbi5cbiAqXG4gKiBBZnRlciBhIHN1Y2Nlc3NmdWwgbG9naW4sIGBnZXRSZWRpcmVjdFBhdGgoKWAgcmV0cmlldmVzIGFuZCByZW1vdmVzIHRoaXNcbiAqIHZhbHVlIHNvIHRoZSByb3V0ZXIgY2FuIG5hdmlnYXRlIHRvIHRoZSBpbnRlbmRlZCBkZXN0aW5hdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIEEgcmVsYXRpdmUgVVJMIHBhdGgsIGUuZy4gJy9kYXNoYm9hcmQnXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2FsbGVkIGJ5IEF1dGhHdWFyZCB3aGVuIHJlZGlyZWN0aW5nIGFuIHVuYXV0aGVudGljYXRlZCB1c2VyOlxuICogc2F2ZVJlZGlyZWN0UGF0aCgnL2Rhc2hib2FyZCcpO1xuICogcm91dGVyLm5hdmlnYXRlKFJPVVRFUy5MT0dJTik7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVkaXJlY3RQYXRoKHBhdGgpIHtcbiAgICAvLyBPbmx5IHN0b3JlIHdlbGwtZm9ybWVkIHJlbGF0aXZlIHBhdGhzIHRvIHByZXZlbnQgb3Blbi1yZWRpcmVjdCBhdHRhY2tzLlxuICAgIC8vIHNhbml0aXplUGF0aCgpIGluIGF1dGhIZWxwZXJzLmpzIGVuZm9yY2VzIHRoaXMgXHUyMDE0IGNhbGwgaXQgYmVmb3JlIGhlcmUuXG4gICAgdHJ5IHtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRURJUkVDVF9LRVksIHBhdGgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICBfbWVtb3J5U3RvcmUuc2V0KFJFRElSRUNUX0tFWSwgcGF0aCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHJpZXZlcyBhbmQgaW1tZWRpYXRlbHkgcmVtb3ZlcyB0aGUgc2F2ZWQgcHJlLWxvZ2luIHJlZGlyZWN0IHBhdGguXG4gKlxuICogVGhlIG9uZS10aW1lIHJlYWQtYW5kLWRlbGV0ZSBiZWhhdmlvdXIgcHJldmVudHMgc3RhbGUgcmVkaXJlY3QgcGF0aHNcbiAqIGZyb20gcGVyc2lzdGluZyBhY3Jvc3MgbXVsdGlwbGUgbG9naW4gc2Vzc2lvbnMgKGEgc2VjdXJpdHkgY29uc2lkZXJhdGlvbikuXG4gKlxuICogUmV0dXJucyB0aGUgZGVmYXVsdCBkYXNoYm9hcmQgcGF0aCB3aGVuIG5vIHJlZGlyZWN0IHBhdGggd2FzIHNhdmVkLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzYXZlZCBwYXRoLCBvciBgJy9kYXNoYm9hcmQnYCB3aGVuIG5vbmUgZXhpc3RzXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIENhbGxlZCBieSBMb2dpbkZvcm0gYWZ0ZXIgYSBzdWNjZXNzZnVsIGxvZ2luOlxuICogY29uc3QgZGVzdGluYXRpb24gPSBnZXRSZWRpcmVjdFBhdGgoKTsgIC8vIGUuZy4gJy9kYXNoYm9hcmQnXG4gKiByb3V0ZXIubmF2aWdhdGUoZGVzdGluYXRpb24pO1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVkaXJlY3RQYXRoKCkge1xuICAgIC8vIFRyeSBzZXNzaW9uU3RvcmFnZSBmaXJzdC5cbiAgICBsZXQgcGF0aCA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgICAgcGF0aCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVESVJFQ1RfS0VZKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShSRURJUkVDVF9LRVkpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBGYWxsIHRocm91Z2ggdG8gbWVtb3J5IHN0b3JlIGJlbG93LlxuICAgIH1cblxuICAgIC8vIFRyeSBpbi1tZW1vcnkgZmFsbGJhY2sgaWYgc2Vzc2lvblN0b3JhZ2Ugd2FzIHVuYXZhaWxhYmxlLlxuICAgIGlmICghcGF0aCkge1xuICAgICAgICBwYXRoID0gX21lbW9yeVN0b3JlLmdldChSRURJUkVDVF9LRVkpID8/IG51bGw7XG4gICAgICAgIF9tZW1vcnlTdG9yZS5kZWxldGUoUkVESVJFQ1RfS0VZKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aCA/PyAnL2Rhc2hib2FyZCc7XG59XG4iLCAiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi4vdXRpbHMvZW52LmpzJztcbmltcG9ydCB7IG5vcm1hbGl6ZUFwaUVycm9yIH0gZnJvbSAnLi4vdXRpbHMvZXJyb3JzLmpzJztcbmltcG9ydCB7IGdldEF1dGhUb2tlbiB9IGZyb20gJy4vYXV0aFN0b3JhZ2UuanMnO1xuXG5sZXQgbW9ja0hhbmRsZXJzID0gbnVsbDtcblxuLyoqXG4gKlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdEFwaSgpIHtcbiAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoKTtcblxuICAgIGlmIChjb25maWcuYXBpTW9ja0VuYWJsZWQpIHtcbiAgICAgICAgY29uc3QgeyBzZXR1cE1vY2tTZXJ2ZXIgfSA9IGF3YWl0IGltcG9ydCgnLi9tb2NrLmpzJyk7XG4gICAgICAgIG1vY2tIYW5kbGVycyA9IHNldHVwTW9ja1NlcnZlcigpO1xuICAgIH1cbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9ja1NlcnZlcigpIHtcbiAgICByZXR1cm4gbW9ja0hhbmRsZXJzO1xufVxuXG4vKipcbiAqIEFwaVNlcnZpY2UgY2xhc3MgaGFuZGxlcyBhbGwgQVBJIHJlcXVlc3RzLlxuICogUHJvdmlkZXMgYSBjZW50cmFsaXplZCBmZXRjaCB3cmFwcGVyIHdpdGggYXV0b21hdGljIHRva2VuIGluamVjdGlvbixcbiAqIHJlc3BvbnNlIG5vcm1hbGl6YXRpb24sIHRpbWVvdXQgaGFuZGxpbmcsIHJldHJ5IGxvZ2ljIHdpdGggZXhwb25lbnRpYWwgYmFja29mZixcbiAqIGFuZCByZXF1ZXN0IGRlZHVwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBcGlTZXJ2aWNlIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmwgPSAnJykge1xuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsIHx8ICh3aW5kb3cuQ09ORklHICYmIHdpbmRvdy5DT05GSUcuQVBJX0JBU0VfVVJMKSB8fCAnL2FwaSc7XG5cbiAgICAgICAgdGhpcy5wZW5kaW5nUmVxdWVzdHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMudGltZW91dE1zID0gMTAwMDA7XG4gICAgICAgIHRoaXMubWF4UmV0cmllcyA9IDM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdCBpbnRlcmNlcHRvciB0byBpbmplY3QgYXV0aGVudGljYXRpb24gdG9rZW5zLlxuICAgICAqL1xuICAgIF9yZXF1ZXN0SW50ZXJjZXB0b3Iob3B0aW9ucywgZW5kcG9pbnQpIHtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyB8fCB7fSk7XG4gICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgICAgIGlmICghb3B0aW9ucy5ub1Rva2VuICYmICFlbmRwb2ludC5zdGFydHNXaXRoKCcvYXV0aC8nKSkge1xuICAgICAgICAgICAgY29uc3QgYXV0aERhdGEgPSBnZXRBdXRoVG9rZW4oKTtcbiAgICAgICAgICAgIGlmIChhdXRoRGF0YT8udG9rZW4pIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLnNldCgnQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHthdXRoRGF0YS50b2tlbn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNwb25zZSBpbnRlcmNlcHRvciB0byBub3JtYWxpemUgdGhlIHJlc3BvbnNlIGZvcm1hdCBhbmQgaGFuZGxlIGNvbW1vbiBlcnJvcnMuXG4gICAgICovXG4gICAgYXN5bmMgX3Jlc3BvbnNlSW50ZXJjZXB0b3IocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICAgICAgICBlcnJvci5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gZXJyb3JEYXRhLm1lc3NhZ2UgfHwgZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBlcnJvci5kYXRhID0gZXJyb3JEYXRhO1xuICAgICAgICAgICAgfSBjYXRjaCAoX2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9IGVycm9yVGV4dCB8fCBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkRXJyb3IgPSBub3JtYWxpemVBcGlFcnJvcihlcnJvcik7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSA0MDEgVW5hdXRob3JpemVkIGdsb2JhbGx5XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgd2luZG93LkN1c3RvbUV2ZW50KCdhdXRoOnVuYXV0aG9yaXplZCcpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgbm9ybWFsaXplZEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJyk7XG4gICAgICAgIGlmIChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgYSB1bmlxdWUga2V5IGZvciBkZWR1cGxpY2F0aW9uIGJhc2VkIG9uIG1ldGhvZCwgdXJsLCBhbmQgYm9keS5cbiAgICAgKi9cbiAgICBfZ2V0UmVxdWVzdEtleShtZXRob2QsIHVybCwgYm9keSkge1xuICAgICAgICByZXR1cm4gYCR7bWV0aG9kfToke3VybH06JHtib2R5IHx8ICcnfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIHRvIGRldGVjdCBuZXR3b3JrIGVycm9ycyBmb3IgcmV0cnkgbG9naWMuXG4gICAgICovXG4gICAgX2lzTmV0d29ya0Vycm9yKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBlcnJvci5uYW1lID09PSAnVHlwZUVycm9yJyB8fFxuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9PT0gJ0ZhaWxlZCB0byBmZXRjaCcgfHxcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ05ldHdvcmtFcnJvcicpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29yZSByZXF1ZXN0IG1ldGhvZFxuICAgICAqL1xuICAgIGFzeW5jIHJlcXVlc3QoZW5kcG9pbnQsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBtZXRob2QgPSAnR0VUJyxcbiAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICByZXRyeUNvdW50ID0gMCxcbiAgICAgICAgICAgIHNraXBEZWR1cCA9IGZhbHNlLFxuICAgICAgICAgICAgLi4ub3RoZXJPcHRpb25zXG4gICAgICAgIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuYmFzZVVybH0ke2VuZHBvaW50fWA7XG5cbiAgICAgICAgLy8gQ2hlY2sgZGVkdXBsaWNhdGlvblxuICAgICAgICBjb25zdCByZXF1ZXN0S2V5ID0gIXNraXBEZWR1cCAmJiB0aGlzLl9nZXRSZXF1ZXN0S2V5KG1ldGhvZCwgdXJsLCBib2R5KTtcbiAgICAgICAgaWYgKHJlcXVlc3RLZXkgJiYgdGhpcy5wZW5kaW5nUmVxdWVzdHMuaGFzKHJlcXVlc3RLZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wZW5kaW5nUmVxdWVzdHMuZ2V0KHJlcXVlc3RLZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMS4gUnVuIHJlcXVlc3QgaW50ZXJjZXB0b3JcbiAgICAgICAgY29uc3QgZmV0Y2hPcHRpb25zID0gdGhpcy5fcmVxdWVzdEludGVyY2VwdG9yKHsgbWV0aG9kLCBib2R5LCAuLi5vdGhlck9wdGlvbnMgfSwgZW5kcG9pbnQpO1xuXG4gICAgICAgIC8vIFRpbWVvdXQgaGFuZGxpbmdcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgZmV0Y2hPcHRpb25zLnNpZ25hbCA9IGNvbnRyb2xsZXIuc2lnbmFsO1xuXG4gICAgICAgIGNvbnN0IHRpbWVvdXRQcm9taXNlID0gbmV3IFByb21pc2UoKF9yZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdSZXF1ZXN0IHRpbWVvdXQnKSk7XG4gICAgICAgICAgICB9LCB0aGlzLnRpbWVvdXRNcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRoZSBhY3R1YWwgZmV0Y2ggd3JhcHBlZCBpbiBvdXIgaW50ZXJjZXB0b3JzXG4gICAgICAgIGNvbnN0IGZldGNoUHJvbWlzZSA9IGZldGNoKHVybCwgZmV0Y2hPcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oYXN5bmMgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0S2V5KSB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5kZWxldGUocmVxdWVzdEtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RLZXkpIHRoaXMucGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0S2V5KTtcblxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBhYm9ydCBzcGVjaWZpY2FsbHlcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPT09ICdUaGUgdXNlciBhYm9ydGVkIGEgcmVxdWVzdC4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUmVxdWVzdCBjYW5jZWxsZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnUmVxdWVzdCB0aW1lb3V0J1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJldHJ5IHdpdGggZXhwb25lbnRpYWwgYmFja29mZiBvbiBuZXR3b3JrIGVycm9yc1xuICAgICAgICAgICAgICAgIGlmIChyZXRyeUNvdW50IDwgdGhpcy5tYXhSZXRyaWVzICYmIHRoaXMuX2lzTmV0d29ya0Vycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgucG93KDIsIHJldHJ5Q291bnQpICogMTAwMDsgLy8gMXMsIDJzLCA0c1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRyeUNvdW50OiByZXRyeUNvdW50ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBBUEkgRXJyb3Igb24gJHtlbmRwb2ludH06YCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmFjZSBmZXRjaCBhZ2FpbnN0IHRpbWVvdXRcbiAgICAgICAgY29uc3QgcmVxdWVzdFByb21pc2UgPSBQcm9taXNlLnJhY2UoW2ZldGNoUHJvbWlzZSwgdGltZW91dFByb21pc2VdKTtcblxuICAgICAgICAvLyBTdG9yZSBmb3IgZGVkdXBsaWNhdGlvblxuICAgICAgICBpZiAocmVxdWVzdEtleSkge1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nUmVxdWVzdHMuc2V0KHJlcXVlc3RLZXksIHJlcXVlc3RQcm9taXNlKTtcbiAgICAgICAgICAgIC8vIEVuc3VyZSB3ZSBjbGVhbiB1cCBpZiByYWNlIHJlc29sdmVzIGJlZm9yZSBmaW5hbGx5IGJsb2NrXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9jYXRjaC1vci1yZXR1cm5cbiAgICAgICAgICAgIHJlcXVlc3RQcm9taXNlLmZpbmFsbHkoKCkgPT4gdGhpcy5wZW5kaW5nUmVxdWVzdHMuZGVsZXRlKHJlcXVlc3RLZXkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGdldChlbmRwb2ludCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIHsgbWV0aG9kOiAnR0VUJywgLi4ub3B0aW9ucyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHBvc3QoZW5kcG9pbnQsIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBwdXQoZW5kcG9pbnQsIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSksXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHBhdGNoKGVuZHBvaW50LCBib2R5LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChlbmRwb2ludCwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSksXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGRlbGV0ZShlbmRwb2ludCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIHsgbWV0aG9kOiAnREVMRVRFJywgLi4ub3B0aW9ucyB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBhcGkgPSBuZXcgQXBpU2VydmljZSgpO1xuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBdXRoZW50aWNhdGlvbiBBUEkgU2VydmljZSBcdTIwMTQgUGFydCAzLlxuICpcbiAqIEVuY2Fwc3VsYXRlcyBldmVyeSBIVFRQIGNhbGwgcmVsYXRlZCB0byBhdXRoZW50aWNhdGlvbiBzbyB0aGF0XG4gKiBjb25zdW1lcnMgKEF1dGhDb250ZXh0LCB1c2VBdXRoIGhvb2spIG5ldmVyIGRlYWwgd2l0aCByYXcgZmV0Y2hcbiAqIGRldGFpbHMsIFVSTCBjb25zdHJ1Y3Rpb24sIG9yIEhUVFAgZXJyb3IgY29kZXMuXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIEFQSSBJbnRlZ3JhdGlvbiBMYXllciAoUGFydCA4KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVXNlcyB0aGUgY29yZSBBcGlTZXJ2aWNlIChgc3JjL3NlcnZpY2VzL2FwaS5qc2ApIGZvciByZXRyaWVzLFxuICogICBkZWR1cGxpY2F0aW9uLCBhbmQgdGhlIHNoYXJlZCByZXNwb25zZSBpbnRlcmNlcHRvci5cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgRXJyb3Igbm9ybWFsaXNhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgQWxsIGVycm9ycyBhcmUgY2F1Z2h0IGFuZCBjb252ZXJ0ZWQgdG8gYSB7IGNvZGUsIG1lc3NhZ2UgfSBvYmplY3RcbiAqICAgdGhhdCBtYXRjaGVzIHRoZSBzaGFwZSBleHBlY3RlZCBieSBgQXV0aENvbnRleHQubm9ybWFsaXNlRXJyb3IoKWAuXG4gKlxuICogICBIVFRQIDQwMSAgXHUyMTkyIHsgY29kZTogJ0lOVkFMSURfQ1JFREVOVElBTFMnLCBtZXNzYWdlOiAnXHUyMDI2JyB9XG4gKiAgIEhUVFAgNDAwICBcdTIxOTIgeyBjb2RlOiAnVkFMSURBVElPTl9FUlJPUicsICAgIG1lc3NhZ2U6ICdcdTIwMjYnIH1cbiAqICAgTmV0d29yayAgIFx1MjE5MiB7IGNvZGU6ICdORVRXT1JLX0VSUk9SJywgICAgICAgbWVzc2FnZTogJ1x1MjAyNicgfVxuICogICBPdGhlciAgICAgXHUyMTkyIHsgY29kZTogJ1VOS05PV04nLCAgICAgICAgICAgICBtZXNzYWdlOiAnXHUyMDI2JyB9XG4gKlxuICogQG1vZHVsZSBzZXJ2aWNlcy9hdXRoQXBpXG4gKi9cblxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi4vY29uZmlnL2Vudi5qcyc7XG5pbXBvcnQgeyBBUElfRU5EUE9JTlRTLCBFUlJPUl9DT0RFUyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBhcGkgfSBmcm9tICcuL2FwaS5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBFeHBvcnRlZCBBUEkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogU2VuZHMgdGhlIHVzZXIncyBjcmVkZW50aWFscyB0byB0aGUgYXV0aGVudGljYXRpb24gZW5kcG9pbnQgYW5kIHJldHVybnNcbiAqIHRoZSByZXN1bHRpbmcgdG9rZW4gcGF5bG9hZCBvbiBzdWNjZXNzLlxuICpcbiAqIE9uIHN1Y2Nlc3MsIHJldHVybnMgdGhlIHJhdyBBUEkgcmVzcG9uc2UgYm9keTpcbiAqIGBgYGpzb25cbiAqIHtcbiAqICAgXCJ0b2tlblwiOiAgICAgXCJtb2NrLWp3dC10b2tlbi1cdTIwMjZcIixcbiAqICAgXCJleHBpcmVzQXRcIjogXCIyMDI2LTA4LTIyVDE1OjAwOjAwLjAwMFpcIixcbiAqICAgXCJ1c2VyXCI6IHtcbiAqICAgICBcImlkXCI6ICAgIFwic3R1XzAwMVwiLFxuICogICAgIFwibmFtZVwiOiAgXCJBbGV4IEpvaG5zb25cIixcbiAqICAgICBcImVtYWlsXCI6IFwic3R1ZGVudEBkZW1vLmNvbVwiLFxuICogICAgIFwicm9sZVwiOiAgXCJzdHVkZW50XCJcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogT24gZmFpbHVyZSwgdGhyb3dzIGEgbm9ybWFsaXNlZCBgeyBjb2RlLCBtZXNzYWdlIH1gIGVycm9yIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIGNyZWRlbnRpYWxzICAgICAgICAgICAgLSBMb2dpbiBmb3JtIGRhdGFcbiAqIEBwYXJhbSB7c3RyaW5nfSAgY3JlZGVudGlhbHMuZW1haWwgICAgICAtIFVzZXIncyBlbWFpbCBhZGRyZXNzXG4gKiBAcGFyYW0ge3N0cmluZ30gIGNyZWRlbnRpYWxzLnBhc3N3b3JkICAgLSBVc2VyJ3MgcGFzc3dvcmRcbiAqIEByZXR1cm5zIHtQcm9taXNlPHsgdG9rZW46IHN0cmluZywgZXhwaXJlc0F0OiBzdHJpbmd8bnVtYmVyLCB1c2VyOiBPYmplY3QgfT59XG4gKiAgIFRoZSByYXcgYXV0aCByZXNwb25zZSBib2R5XG4gKiBAdGhyb3dzIHt7IGNvZGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH19IE5vcm1hbGlzZWQgZXJyb3Igb24gZmFpbHVyZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBlbWFpbCwgcGFzc3dvcmQgfSkge1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgY29uc3QgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIEVOVi5BUElfVElNRU9VVCB8fCAxMDAwMCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5wb3N0KFxuICAgICAgICAgICAgQVBJX0VORFBPSU5UUy5BVVRIX0xPR0lOLFxuICAgICAgICAgICAgeyBlbWFpbCwgcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzaWduYWw6IGNvbnRyb2xsZXIuc2lnbmFsLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcblxuICAgICAgICBpZiAoZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJyB8fCBlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICBjb2RlOiBFUlJPUl9DT0RFUy5ORVRXT1JLX0VSUk9SLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gY29ubmVjdC4gUGxlYXNlIGNoZWNrIHlvdXIgaW50ZXJuZXQgY29ubmVjdGlvbi4nLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDApIHtcbiAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICBjb2RlOiBFUlJPUl9DT0RFUy5WQUxJREFUSU9OX0VSUk9SLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVyci5kYXRhPy5tZXNzYWdlID8/ICdUaGUgcmVxdWVzdCBjb250YWluZWQgaW52YWxpZCBkYXRhLicsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgIGNvZGU6IEVSUk9SX0NPREVTLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyLmRhdGE/Lm1lc3NhZ2UgPz8gJ0ludmFsaWQgZW1haWwgb3IgcGFzc3dvcmQuJyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICBjb2RlOiBFUlJPUl9DT0RFUy5VTktOT1dOLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyLmRhdGE/Lm1lc3NhZ2UgPz8gZXJyLm1lc3NhZ2UgPz8gJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuJyxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbi8qKlxuICogU2VuZHMgYSBzZXJ2ZXItc2lkZSBsb2dvdXQgcmVxdWVzdCB0byBpbnZhbGlkYXRlIHRoZSB0b2tlbi5cbiAqXG4gKiBUaGlzIGlzIGEgYmVzdC1lZmZvcnQgY2FsbCBcdTIwMTQgY2xpZW50LXNpZGUgdG9rZW4gcmVtb3ZhbCB2aWFcbiAqIGBhdXRoU3RvcmFnZS5jbGVhckF1dGhUb2tlbigpYCBpcyBhbHdheXMgcGVyZm9ybWVkIGZpcnN0IGJ5IHRoZSBjYWxsZXJcbiAqIChBdXRoQ29udGV4dC5sb2dvdXQpIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHJlcXVlc3Qgc3VjY2VlZHMuXG4gKlxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IEFsd2F5cyByZXNvbHZlczsgbmV2ZXIgcmVqZWN0c1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGFwaS5wb3N0KCcvYXV0aC9sb2dvdXQnLCB7fSk7XG4gICAgfSBjYXRjaCAoX2Vycikge1xuICAgICAgICAvLyBGaXJlLWFuZC1mb3JnZXQ6IGZhaWwgc2lsZW50bHkgc28gdGhlIGNsaWVudCBjYW4gc3RpbGwgY2xlYXIgbG9jYWwgc3RhdGUuXG4gICAgfVxufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBdXRoZW50aWNhdGlvbiBIZWxwZXIgVXRpbGl0aWVzIFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogUHVyZSwgc3RhdGVsZXNzIGhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBhdXRoZW50aWNhdGlvbiBtb2R1bGUuXG4gKiBObyBzaWRlIGVmZmVjdHMsIG5vIERPTSBhY2Nlc3MsIG5vIGltcG9ydHMgZnJvbSBzZXJ2aWNlcyBvciBjb250ZXh0LlxuICogRXZlcnkgZnVuY3Rpb24gaXMgaW5kZXBlbmRlbnRseSB1bml0LXRlc3RhYmxlLlxuICpcbiAqIEBtb2R1bGUgdXRpbHMvYXV0aEhlbHBlcnNcbiAqL1xuXG5pbXBvcnQgeyBST1VURVMgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBBdmF0YXIgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBEZXJpdmVzIHVwIHRvIHR3byB1cHBlcmNhc2UgaW5pdGlhbHMgZnJvbSBhIGZ1bGwgbmFtZSBzdHJpbmcuXG4gKlxuICogUnVsZXM6XG4gKiAtIFNwbGl0cyBvbiB3aGl0ZXNwYWNlIGFuZCB0YWtlcyB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGVhY2ggd29yZFxuICogLSBSZXR1cm5zIGEgbWF4aW11bSBvZiAyIGluaXRpYWxzIChmaXJzdCArIGxhc3Qgd29yZClcbiAqIC0gRmFsbHMgYmFjayB0byBgJz8nYCB3aGVuIHRoZSBpbnB1dCBpcyBlbXB0eSBvciBub3QgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSB1c2VyJ3MgZnVsbCBuYW1lIChlLmcuIGAnQWxleCBKb2huc29uJ2ApXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBVcCB0byAyIHVwcGVyY2FzZSBpbml0aWFscyAoZS5nLiBgJ0FKJ2ApXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldEluaXRpYWxzKCdBbGV4IEpvaG5zb24nKSAgICAgIC8vICdBSidcbiAqIGdldEluaXRpYWxzKCdQcml5YScpICAgICAgICAgICAgIC8vICdQJ1xuICogZ2V0SW5pdGlhbHMoJ01hcmlhIGRlbCBDYXJtZW4nKSAgLy8gJ01DJ1xuICogZ2V0SW5pdGlhbHMoJycpICAgICAgICAgICAgICAgICAgLy8gJz8nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFscyhuYW1lKSB7XG4gICAgaWYgKCFuYW1lIHx8IHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykgcmV0dXJuICc/JztcblxuICAgIGNvbnN0IHdvcmRzID0gbmFtZS50cmltKCkuc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICc/JztcblxuICAgIGNvbnN0IGZpcnN0ID0gd29yZHNbMF1bMF0udG9VcHBlckNhc2UoKTtcbiAgICBpZiAod29yZHMubGVuZ3RoID09PSAxKSByZXR1cm4gZmlyc3Q7XG5cbiAgICBjb25zdCBsYXN0ID0gd29yZHNbd29yZHMubGVuZ3RoIC0gMV1bMF0udG9VcHBlckNhc2UoKTtcbiAgICByZXR1cm4gZmlyc3QgKyBsYXN0O1xufVxuXG4vKipcbiAqIERlcml2ZXMgYSBjb25zaXN0ZW50LCBkZXRlcm1pbmlzdGljIGhleCBiYWNrZ3JvdW5kIGNvbG91ciBmcm9tIGEgc3RyaW5nXG4gKiBzZWVkICh1c2VyIElEIG9yIG5hbWUpLiAgR2l2ZW4gdGhlIHNhbWUgc2VlZCwgdGhpcyBmdW5jdGlvbiBhbHdheXMgcmV0dXJuc1xuICogdGhlIHNhbWUgY29sb3VyLCBwcm92aWRpbmcgdmlzdWFsIGNvbnNpc3RlbmN5IGFjcm9zcyBwYWdlIGxvYWRzIHdpdGhvdXRcbiAqIHN0b3JpbmcgdGhlIGNvbG91ciBzZXJ2ZXItc2lkZS5cbiAqXG4gKiBVc2VzIGEgc2ltcGxlIGhhc2ggKGRqYjItc3R5bGUpIHRvIG1hcCB0aGUgc2VlZCB0byBvbmUgb2YgYSBjdXJhdGVkIHNldCBvZlxuICogYWNjZXNzaWJsZSwgc2F0dXJhdGVkIGNvbG91cnMgdGhhdCBhbGwgcGFzcyBXQ0FHIEFBIGZvciB3aGl0ZSB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWVkIC0gQW55IG5vbi1lbXB0eSBzdHJpbmcgKGUuZy4gdXNlciBJRCBvciBkaXNwbGF5IG5hbWUpXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIENTUyBoZXggY29sb3VyIHN0cmluZyAoZS5nLiBgJyM0RjQ2RTUnYClcbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0QXZhdGFyQ29sb3IoJ3N0dV8wMDEnKSAgICAgLy8gYWx3YXlzICcjNEY0NkU1J1xuICogZ2V0QXZhdGFyQ29sb3IoJ0FsZXggSm9obnNvbicpIC8vIGNvbnNpc3RlbnQgYnV0IGRpZmZlcmVudCBmcm9tIGFib3ZlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmF0YXJDb2xvcihzZWVkKSB7XG4gICAgLy8gQ3VyYXRlZCBwYWxldHRlOiBhbGwgcGFzcyBXQ0FHIEFBIGNvbnRyYXN0IHJhdGlvIChcdTIyNjUgNC41OjEpIG9uIHdoaXRlIHRleHQuXG4gICAgY29uc3QgUEFMRVRURSA9IFtcbiAgICAgICAgJyM0RjQ2RTUnLCAvLyBpbmRpZ29cbiAgICAgICAgJyMwRUE1RTknLCAvLyBza3kgYmx1ZVxuICAgICAgICAnIzEwQjk4MScsIC8vIGVtZXJhbGRcbiAgICAgICAgJyNGNTlFMEInLCAvLyBhbWJlclxuICAgICAgICAnI0VGNDQ0NCcsIC8vIHJlZFxuICAgICAgICAnIzhCNUNGNicsIC8vIHZpb2xldFxuICAgICAgICAnI0VDNDg5OScsIC8vIHBpbmtcbiAgICAgICAgJyMxNEI4QTYnLCAvLyB0ZWFsXG4gICAgICAgICcjRjk3MzE2JywgLy8gb3JhbmdlXG4gICAgICAgICcjNjM2NkYxJywgLy8gcHVycGxlLWluZGlnb1xuICAgIF07XG5cbiAgICBpZiAoIXNlZWQgfHwgdHlwZW9mIHNlZWQgIT09ICdzdHJpbmcnKSByZXR1cm4gUEFMRVRURVswXTtcblxuICAgIC8vIGRqYjItc3R5bGUgaGFzaDogZmFzdCwgc2ltcGxlLCBnb29kIGRpc3RyaWJ1dGlvbiBmb3Igc2hvcnQgc3RyaW5ncy5cbiAgICBsZXQgaGFzaCA9IDUzODE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhhc2ggPSAoaGFzaCAqIDMzKSBeIHNlZWQuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaGFzaCA9IGhhc2ggPj4+IDA7IC8vIGtlZXAgaXQgYSBwb3NpdGl2ZSAzMi1iaXQgaW50ZWdlclxuICAgIH1cblxuICAgIHJldHVybiBQQUxFVFRFW2hhc2ggJSBQQUxFVFRFLmxlbmd0aF07XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBUb2tlbiBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHN0b3JlZCBhdXRoIHRva2VuIGhhcyBwYXNzZWQgaXRzIGV4cGlyeSB0aW1lc3RhbXAuXG4gKlxuICogRmFpbC1zZWN1cmU6IHJldHVybnMgYHRydWVgICh0cmVhdCBhcyBleHBpcmVkKSB3aGVuIGBleHBpcmVzQXRgIGlzIGZhbHN5LFxuICogbm90IGEgbnVtYmVyLCBvciBgTmFOYC4gIFRoaXMgbWF0Y2hlcyB0aGUgc2FtZSBsb2dpYyB1c2VkIGluc2lkZVxuICogYEF1dGhDb250ZXh0LnJlc3RvcmVTZXNzaW9uKClgIHNvIGJlaGF2aW91ciBpcyBjb25zaXN0ZW50IGFjcm9zcyBsYXllcnMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGV4cGlyZXNBdCAtIFVuaXggdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kcyAoZnJvbSB0b2tlbiBwYXlsb2FkKVxuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCB3aGVuIGV4cGlyZWQgb3IgaW52YWxpZDsgYGZhbHNlYCB3aGVuIHN0aWxsIHZhbGlkXG4gKlxuICogQGV4YW1wbGVcbiAqIGlzVG9rZW5FeHBpcmVkKERhdGUubm93KCkgKyAxMDAwKSAvLyBmYWxzZSBcdTIwMTQgc3RpbGwgdmFsaWRcbiAqIGlzVG9rZW5FeHBpcmVkKERhdGUubm93KCkgLSAxMDAwKSAvLyB0cnVlICBcdTIwMTQgYWxyZWFkeSBleHBpcmVkXG4gKiBpc1Rva2VuRXhwaXJlZChudWxsKSAgICAgICAgICAgICAgLy8gdHJ1ZSAgXHUyMDE0IHRyZWF0IGFzIGV4cGlyZWQgKGZhaWwtc2VjdXJlKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUb2tlbkV4cGlyZWQoZXhwaXJlc0F0KSB7XG4gICAgaWYgKCFleHBpcmVzQXQgfHwgdHlwZW9mIGV4cGlyZXNBdCAhPT0gJ251bWJlcicgfHwgaXNOYU4oZXhwaXJlc0F0KSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIERhdGUubm93KCkgPiBleHBpcmVzQXQ7XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBSZWRpcmVjdCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENvbnN0cnVjdHMgdGhlIGxvZ2luIFVSTCB3aXRoIGFuIGVuY29kZWQgYHJlZGlyZWN0YCBxdWVyeSBwYXJhbWV0ZXIgc28gdGhhdFxuICogYWZ0ZXIgYSBzdWNjZXNzZnVsIGxvZ2luIHRoZSB1c2VyIGlzIHJldHVybmVkIHRvIHRoZWlyIGludGVuZGVkIGRlc3RpbmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gZW5jb2RlIChlLmcuIGAnL2Rhc2hib2FyZCdgKVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZ1bGwgbG9naW4gVVJMIHdpdGggcmVkaXJlY3QgcGFyYW1cbiAqICAgICAgICAgICAgICAgICAgIChlLmcuIGAnL2xvZ2luP3JlZGlyZWN0PSUyRmRhc2hib2FyZCdgKVxuICpcbiAqIEBleGFtcGxlXG4gKiBidWlsZExvZ2luUmVkaXJlY3RVcmwoJy9kYXNoYm9hcmQnKVxuICogLy8gXHUyMTkyICcvbG9naW4/cmVkaXJlY3Q9JTJGZGFzaGJvYXJkJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMb2dpblJlZGlyZWN0VXJsKHBhdGgpIHtcbiAgICBjb25zdCBzYW5pdGlzZWQgPSBzYW5pdGl6ZVBhdGgocGF0aCk7XG4gICAgaWYgKCFzYW5pdGlzZWQpIHJldHVybiBST1VURVMuTE9HSU47XG4gICAgcmV0dXJuIGAke1JPVVRFUy5MT0dJTn0/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQoc2FuaXRpc2VkKX1gO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgYHJlZGlyZWN0YCBxdWVyeSBwYXJhbWV0ZXIgZnJvbSBhIFVSTCBzZWFyY2ggc3RyaW5nIGFuZCByZXR1cm5zXG4gKiBpdCBhcyBhIGRlY29kZWQgcGF0aC4gIEZhbGxzIGJhY2sgdG8gYFJPVVRFUy5EQVNIQk9BUkRgIHdoZW4gdGhlIHBhcmFtZXRlclxuICogaXMgYWJzZW50LCBlbXB0eSwgb3IgaW52YWxpZC5cbiAqXG4gKiBBbHdheXMgcGFzc2VzIHRoZSByZXN1bHQgdGhyb3VnaCBgc2FuaXRpemVQYXRoKClgIHRvIHByZXZlbnQgb3Blbi1yZWRpcmVjdFxuICogYXR0YWNrcyB3aGVyZSBhIG1hbGljaW91cyBgcmVkaXJlY3RgIHZhbHVlIHBvaW50cyB0byBhbiBleHRlcm5hbCBkb21haW4uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFN0cmluZyAtIFRoZSBgbG9jYXRpb24uc2VhcmNoYCBzdHJpbmcgKGUuZy4gYCc/cmVkaXJlY3Q9JTJGZGFzaGJvYXJkJ2ApXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBEZWNvZGVkIHJlbGF0aXZlIHBhdGgsIG9yIGAnL2Rhc2hib2FyZCdgIGFzIGRlZmF1bHRcbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UmVkaXJlY3REZXN0aW5hdGlvbignP3JlZGlyZWN0PSUyRmRhc2hib2FyZCcpICAvLyAnL2Rhc2hib2FyZCdcbiAqIGdldFJlZGlyZWN0RGVzdGluYXRpb24oJz9yZWRpcmVjdD1odHRwczovL2V2aWwuY29tJykgLy8gJy9kYXNoYm9hcmQnIChzYW5pdGlzZWQpXG4gKiBnZXRSZWRpcmVjdERlc3RpbmF0aW9uKCcnKSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJy9kYXNoYm9hcmQnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWRpcmVjdERlc3RpbmF0aW9uKHNlYXJjaFN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgY29uc3QgcmF3ID0gcGFyYW1zLmdldCgncmVkaXJlY3QnKTtcbiAgICAgICAgcmV0dXJuIHNhbml0aXplUGF0aChyYXcpIHx8IFJPVVRFUy5EQVNIQk9BUkQ7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBST1VURVMuREFTSEJPQVJEO1xuICAgIH1cbn1cblxuLyoqXG4gKiBFbnN1cmVzIGEgcmVkaXJlY3QgdGFyZ2V0IGlzIGEgc2FmZSwgcmVsYXRpdmUgcGF0aC5cbiAqXG4gKiBSZWplY3RzIGFic29sdXRlIFVSTHMgKGUuZy4gYGh0dHBzOi8vZXZpbC5jb21gKSBhbmQgcHJvdG9jb2wtcmVsYXRpdmUgVVJMc1xuICogKGUuZy4gYC8vZXZpbC5jb21gKSB0byBwcmV2ZW50IG9wZW4tcmVkaXJlY3QgdnVsbmVyYWJpbGl0aWVzLlxuICogUmV0dXJucyBhbiBlbXB0eSBzdHJpbmcgd2hlbiB0aGUgaW5wdXQgaXMgaW52YWxpZCwgd2hpY2ggY2FsbGVycyB0cmVhdCBhc1xuICogXCJubyByZWRpcmVjdFwiIGFuZCBmYWxsIGJhY2sgdG8gdGhlIGRlZmF1bHQgZGVzdGluYXRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8bnVsbHx1bmRlZmluZWR9IHBhdGggLSBDYW5kaWRhdGUgcmVkaXJlY3QgcGF0aFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHNhbml0aXNlZCBwYXRoLCBvciBgJydgIHdoZW4gdW5zYWZlL2VtcHR5XG4gKlxuICogQGV4YW1wbGVcbiAqIHNhbml0aXplUGF0aCgnL2Rhc2hib2FyZCcpICAgICAgICAgIC8vICcvZGFzaGJvYXJkJ1xuICogc2FuaXRpemVQYXRoKCdodHRwczovL2V2aWwuY29tJykgICAvLyAnJ1xuICogc2FuaXRpemVQYXRoKCcvL2V2aWwuY29tJykgICAgICAgICAvLyAnJ1xuICogc2FuaXRpemVQYXRoKG51bGwpICAgICAgICAgICAgICAgICAgLy8gJydcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplUGF0aChwYXRoKSB7XG4gICAgaWYgKCFwYXRoIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xuXG4gICAgY29uc3QgdHJpbW1lZCA9IHBhdGgudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuICcnO1xuXG4gICAgLy8gUmVqZWN0IGFic29sdXRlIFVSTHMgKGNvbnRhaW4gYSBzY2hlbWUgbGlrZSBodHRwOi8vIG9yIGh0dHBzOi8vKVxuICAgIC8vIGFuZCBwcm90b2NvbC1yZWxhdGl2ZSBVUkxzIChzdGFydCB3aXRoIC8vKS5cbiAgICBpZiAoL15bYS16QS1aXVthLXpBLVowLTkrXFwtLl0qOi8udGVzdCh0cmltbWVkKSkgcmV0dXJuICcnO1xuICAgIGlmICh0cmltbWVkLnN0YXJ0c1dpdGgoJy8vJykpIHJldHVybiAnJztcblxuICAgIC8vIE11c3Qgc3RhcnQgd2l0aCAnLycgdG8gYmUgYSB2YWxpZCByZWxhdGl2ZSBwYXRoLlxuICAgIGlmICghdHJpbW1lZC5zdGFydHNXaXRoKCcvJykpIHJldHVybiAnJztcblxuICAgIHJldHVybiB0cmltbWVkO1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBdXRoQ29udGV4dCBcdTIwMTQgR2xvYmFsIEF1dGhlbnRpY2F0aW9uIFN0YXRlIE1hbmFnZXIuXG4gKlxuICogU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgdGhlIGN1cnJlbnQgdXNlciBzZXNzaW9uIGFjcm9zcyB0aGUgZW50aXJlXG4gKiBTdHVkZW50IFByb2dyZXNzIFRyYWNraW5nIFNhYVMgYXBwbGljYXRpb24uIEltcGxlbWVudHMgdGhlIE9ic2VydmVyXG4gKiAoUHVibGlzaFx1MjAxM1N1YnNjcmliZSkgcGF0dGVybiBzbyBhbnkgbW9kdWxlIGNhbiByZWFjdGl2ZWx5IHJlc3BvbmQgdG9cbiAqIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMgd2l0aG91dCB0aWdodCBjb3VwbGluZyBvciBwcm9wLWRyaWxsaW5nLlxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBSZXNwb25zaWJpbGl0eSBib3VuZGFyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVGhpcyBtb2R1bGUgaXMgT05MWSByZXNwb25zaWJsZSBmb3I6XG4gKiAgICAgXHUyMDIyIEhvbGRpbmcgYW5kIHVwZGF0aW5nIHRoZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBvYmplY3RcbiAqICAgICBcdTIwMjIgTm90aWZ5aW5nIHJlZ2lzdGVyZWQgc3Vic2NyaWJlcnMgb24gZXZlcnkgc3RhdGUgY2hhbmdlXG4gKiAgICAgXHUyMDIyIFN0cnVjdHVyaW5nIHRoZSBsb2dpbiAvIGxvZ291dCBzdGF0ZSB0cmFuc2l0aW9uc1xuICpcbiAqICAgSXQgaXMgTk9UIHJlc3BvbnNpYmxlIGZvcjpcbiAqICAgICBcdTIwMjIgTWFraW5nIEhUVFAgcmVxdWVzdHMgICAgICAgICAgXHUyMTkyIGF1dGhBcGkuanNcbiAqICAgICBcdTIwMjIgTG93LWxldmVsIHN0b3JhZ2UgYWJzdHJhY3Rpb24gXHUyMTkyIGF1dGhTdG9yYWdlLmpzXG4gKiAgICAgXHUyMDIyIENsaWVudC1zaWRlIHJvdXRpbmcgICAgICAgICAgIFx1MjE5MiByb3V0ZXIvZ3VhcmRzLmpzXG4gKiAgICAgXHUyMDIyIFJlbmRlcmluZyBhbnkgVUkgICAgICAgICAgICAgIFx1MjE5MiBMb2dpbkZvcm0uanNcbiAqICAgICBcdTIwMjIgRGlzcGxheWluZyB0b2FzdCBtZXNzYWdlcyAgICAgXHUyMTkyIFRvYXN0LmpzXG4gKlxuICogQG1vZHVsZSBjb250ZXh0L0F1dGhDb250ZXh0XG4gKi9cblxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi4vY29uZmlnL2Vudi5qcyc7XG5pbXBvcnQgKiBhcyBhdXRoQXBpIGZyb20gJy4uL3NlcnZpY2VzL2F1dGhBcGkuanMnO1xuaW1wb3J0IHsgc2F2ZUF1dGhUb2tlbiwgZ2V0QXV0aFRva2VuLCBjbGVhckF1dGhUb2tlbiB9IGZyb20gJy4uL3NlcnZpY2VzL2F1dGhTdG9yYWdlLmpzJztcbmltcG9ydCB7IGlzVG9rZW5FeHBpcmVkIH0gZnJvbSAnLi4vdXRpbHMvYXV0aEhlbHBlcnMuanMnO1xuaW1wb3J0IHsgRVJST1JfQ09ERVMsIFJPVVRFUyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cy5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBQcml2YXRlIGhlbHBlciBmdW5jdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ29udmVydHMgYW55IGNhdWdodCB2YWx1ZSBpbnRvIGEgbm9ybWFsaXNlZCBlcnJvciBvYmplY3QgdGhhdCBpcyBzYWZlIHRvXG4gKiBzdG9yZSBpbiBzdGF0ZSBhbmQgZGlzcGxheSB0byB0aGUgdXNlci5cbiAqXG4gKiBOb3JtYWxpc2F0aW9uIHJ1bGVzIChjaGVja2VkIGluIG9yZGVyKTpcbiAqICAgMS4gSWYgdGhlIHZhbHVlIGFscmVhZHkgaGFzIGEgYGNvZGVgIHByb3BlcnR5LCBpdCB3YXMgdGhyb3duIGludGVudGlvbmFsbHlcbiAqICAgICAgYnkgYSBzZXJ2aWNlIGxheWVyIChlLmcuIGF1dGhBcGkpIFx1MjAxNCByZXR1cm4gaXQgYXMtaXMuXG4gKiAgIDIuIElmIHRoZSB2YWx1ZSBpcyBhIG5hdGl2ZSBFcnJvciwgdXNlIEVycm9yLm1lc3NhZ2UuXG4gKiAgIDMuIElmIHRoZSB2YWx1ZSBpcyBhIHBsYWluIHN0cmluZywgdXNlIGl0IGRpcmVjdGx5LlxuICogICA0LiBPdGhlcndpc2UsIHVzZSB0aGUgcHJvdmlkZWQgZmFsbGJhY2sgbWVzc2FnZSBhbmQgRVJST1JfQ09ERVMuVU5LTk9XTi5cbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IGVyciAgICAgIC0gVGhlIHJhdyBjYXVnaHQgdmFsdWUgKG1heSBiZSBhbnl0aGluZylcbiAqIEBwYXJhbSB7c3RyaW5nfSAgZmFsbGJhY2sgLSBIdW1hbi1yZWFkYWJsZSBtZXNzYWdlIHVzZWQgd2hlbiB0aGUgZXJyb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcyBubyB1c2VmdWwgaW5mb3JtYXRpb25cbiAqIEByZXR1cm5zIHt7IGNvZGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH19IEEgbm9ybWFsaXNlZCBlcnJvciBkZXNjcmlwdG9yXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGlzZUVycm9yKGVyciwgZmFsbGJhY2spIHtcbiAgICBpZiAoZXJyICYmIHR5cGVvZiBlcnIgPT09ICdvYmplY3QnICYmICdjb2RlJyBpbiBlcnIpIHtcbiAgICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7eyBjb2RlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyB9fSAqLyAoZXJyKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnID8gZXJyIDogZmFsbGJhY2s7XG4gICAgcmV0dXJuIHsgY29kZTogRVJST1JfQ09ERVMuVU5LTk9XTiwgbWVzc2FnZSB9O1xufVxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgVHlwZSBkZWZpbml0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBTaGFwZSBvZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIG9iamVjdCByZXR1cm5lZCBieSB0aGUgQVBJIGFuZCBzdG9yZWRcbiAqIGluIEF1dGhDb250ZXh0IHN0YXRlLlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEF1dGhVc2VyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBpZFxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgbmFtZVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZW1haWxcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IFthdmF0YXJVcmxdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBbc3R1ZGVudElkXVxuICovXG5cbi8qKlxuICogVGhlIGNvbXBsZXRlIGF1dGhlbnRpY2F0aW9uIHN0YXRlIG9iamVjdCBtYW5hZ2VkIGJ5IEF1dGhDb250ZXh0LlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEF1dGhTdGF0ZVxuICogQHByb3BlcnR5IHtBdXRoVXNlcnxudWxsfSAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyXG4gKiBAcHJvcGVydHkge3N0cmluZ3xudWxsfSAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZFxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmdcbiAqIEBwcm9wZXJ0eSB7eyBjb2RlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyB9fG51bGx9IGVycm9yXG4gKi9cblxuLyoqXG4gKiBDcmVkZW50aWFscyBzdWJtaXR0ZWQgYnkgdGhlIHVzZXIgb24gdGhlIGxvZ2luIGZvcm0uXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9naW5DcmVkZW50aWFsc1xuICogQHByb3BlcnR5IHtzdHJpbmd9ICBlbWFpbFxuICogQHByb3BlcnR5IHtzdHJpbmd9ICBwYXNzd29yZFxuICogQHByb3BlcnR5IHtib29sZWFufSBbcmVtZW1iZXJNZV1cbiAqL1xuXG4vKipcbiAqIFRoZSB2YWx1ZSByZXR1cm5lZCBieSBBdXRoQ29udGV4dC5sb2dpbigpIHJlZ2FyZGxlc3Mgb2Ygb3V0Y29tZS5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2dpblJlc3VsdFxuICogQHByb3BlcnR5IHtib29sZWFufSAgIHN1Y2Nlc3NcbiAqIEBwcm9wZXJ0eSB7QXV0aFVzZXJ9ICBbdXNlcl1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICBbZXJyb3JdXG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEluaXRpYWwgc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKiBAdHlwZSB7QXV0aFN0YXRlfSAqL1xuY29uc3QgSU5JVElBTF9TVEFURSA9IE9iamVjdC5mcmVlemUoe1xuICAgIHVzZXI6IG51bGwsXG4gICAgdG9rZW46IG51bGwsXG4gICAgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgZXJyb3I6IG51bGwsXG59KTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEF1dGhDb250ZXh0IHNpbmdsZXRvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBBdXRoQ29udGV4dCBcdTIwMTQgdGhlIGFwcGxpY2F0aW9uJ3MgYXV0aGVudGljYXRpb24gc3RhdGUgbWFuYWdlci5cbiAqXG4gKiBAbmFtZXNwYWNlIEF1dGhDb250ZXh0XG4gKi9cbmNvbnN0IEF1dGhDb250ZXh0ID0gKCgpID0+IHtcbiAgICAvKiogQHR5cGUge0F1dGhTdGF0ZX0gKi9cbiAgICBsZXQgX3N0YXRlID0geyAuLi5JTklUSUFMX1NUQVRFIH07XG5cbiAgICAvKiogQHR5cGUge1NldDwoc3RhdGU6IEF1dGhTdGF0ZSkgPT4gdm9pZD59ICovXG4gICAgY29uc3QgX3N1YnNjcmliZXJzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gcmVjZWl2ZSBmcm96ZW4gc3RhdGUgc25hcHNob3RzIHdoZW5ldmVyIHRoZVxuICAgICAqIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhzdGF0ZTogQXV0aFN0YXRlKSA9PiB2b2lkfSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHsoKSA9PiB2b2lkfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgJ1tBdXRoQ29udGV4dF0gc3Vic2NyaWJlKCkgZXhwZWN0cyBhIGZ1bmN0aW9uLCByZWNlaXZlZDonLFxuICAgICAgICAgICAgICAgIHR5cGVvZiBjYWxsYmFja1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7fTtcbiAgICAgICAgfVxuICAgICAgICBfc3Vic2NyaWJlcnMuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHVuc3Vic2NyaWJlKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgZnJvbSB0aGUgc3Vic2NyaWJlciByZWdpc3RyeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KHN0YXRlOiBBdXRoU3RhdGUpID0+IHZvaWR9IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5zdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICAgICAgX3N1YnNjcmliZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVsaXZlcnMgYSBmcm96ZW4gc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgc3RhdGUgdG8gZXZlcnkgcmVnaXN0ZXJlZCBzdWJzY3JpYmVyLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gbm90aWZ5KCkge1xuICAgICAgICBjb25zdCBzbmFwc2hvdCA9IE9iamVjdC5mcmVlemUoeyAuLi5fc3RhdGUgfSk7XG4gICAgICAgIF9zdWJzY3JpYmVycy5mb3JFYWNoKGNhbGxiYWNrID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc25hcHNob3QpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0F1dGhDb250ZXh0XSBBIHN1YnNjcmliZXIgdGhyZXcgYW4gZXJyb3I6JywgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG9ubHkgcGVybWl0dGVkIHdheSB0byB1cGRhdGUgYXV0aGVudGljYXRpb24gc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BhcnRpYWw8QXV0aFN0YXRlPn0gcGFydGlhbFN0YXRlXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0U3RhdGUocGFydGlhbFN0YXRlKSB7XG4gICAgICAgIF9zdGF0ZSA9IHsgLi4uX3N0YXRlLCAuLi5wYXJ0aWFsU3RhdGUgfTtcbiAgICAgICAgbm90aWZ5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZyb3plbiwgb25lLXRpbWUgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgYXV0aGVudGljYXRpb24gc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UmVhZG9ubHk8QXV0aFN0YXRlPn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5mcmVlemUoeyAuLi5fc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGF1dGhlbnRpY2F0aW9uIHNlc3Npb24gZnJvbSBhdXRoU3RvcmFnZS5cbiAgICAgKiBNdXN0IGJlIGNhbGxlZCBvbmNlIGR1cmluZyBhcHBsaWNhdGlvbiBib290c3RyYXAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKi9cbiAgICBhc3luYyBmdW5jdGlvbiByZXN0b3JlU2Vzc2lvbigpIHtcbiAgICAgICAgc2V0U3RhdGUoeyBpc0xvYWRpbmc6IHRydWUsIGVycm9yOiBudWxsIH0pO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdG9yZWQgPSBnZXRBdXRoVG9rZW4oKTtcblxuICAgICAgICAgICAgaWYgKCFzdG9yZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoRU5WLkVOQUJMRV9NT0NLX0FQSSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2NrVXNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnbW9jay0wMDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1NhaSBTaGVuZGdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiAnc2FpQGV4YW1wbGUuY29tJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9ja1Rva2VuID0gJ21vY2stand0LXRva2VuLWRldic7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVBdXRoVG9rZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IG1vY2tUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGlyZXNBdDogRGF0ZS5ub3coKSArIDg2NDAwMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogbW9ja1VzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1lbWJlck1lOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogbW9ja1VzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogbW9ja1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRTdGF0ZSh7IGlzTG9hZGluZzogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB7IHRva2VuLCBleHBpcmVzQXQsIHVzZXIgfSA9IHN0b3JlZDtcblxuICAgICAgICAgICAgaWYgKCF0b2tlbiB8fCAhdXNlciB8fCB0eXBlb2YgdXNlciAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgICdbQXV0aENvbnRleHRdIE1hbGZvcm1lZCBzZXNzaW9uIHBheWxvYWQgZm91bmQgaW4gc3RvcmFnZSBcdTIwMTQgY2xlYXJpbmcuJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY2xlYXJBdXRoVG9rZW4oKTtcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZSh7IGlzTG9hZGluZzogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNUb2tlbkV4cGlyZWQoZXhwaXJlc0F0KSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignW0F1dGhDb250ZXh0XSBTdG9yZWQgdG9rZW4gaGFzIGV4cGlyZWQgXHUyMDE0IGNsZWFyaW5nIHNlc3Npb24uJyk7XG4gICAgICAgICAgICAgICAgY2xlYXJBdXRoVG9rZW4oKTtcbiAgICAgICAgICAgICAgICBzZXRTdGF0ZSh7IGlzTG9hZGluZzogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIUVOVi5FTkFCTEVfQU5BTFlUSUNTKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbQXV0aENvbnRleHRdIFNlc3Npb24gcmVzdG9yZWQgZm9yIHVzZXIgSUQ6JywgdXNlci5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0F1dGhDb250ZXh0XSByZXN0b3JlU2Vzc2lvbigpIGVuY291bnRlcmVkIGFuIHVuZXhwZWN0ZWQgZXJyb3I6JywgZXJyKTtcbiAgICAgICAgICAgIGNsZWFyQXV0aFRva2VuKCk7XG4gICAgICAgICAgICBzZXRTdGF0ZSh7IGlzTG9hZGluZzogZmFsc2UsIGVycm9yOiBudWxsIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIGEgbG9naW4gYXR0ZW1wdCB1c2luZyB0aGUgYXV0aEFwaSBzZXJ2aWNlIGFuZCB1cGRhdGVzIHRoZSBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TG9naW5DcmVkZW50aWFsc30gY3JlZGVudGlhbHNcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxMb2dpblJlc3VsdD59XG4gICAgICovXG4gICAgYXN5bmMgZnVuY3Rpb24gbG9naW4oY3JlZGVudGlhbHMpIHtcbiAgICAgICAgc2V0U3RhdGUoeyBpc0xvYWRpbmc6IHRydWUsIGVycm9yOiBudWxsIH0pO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBhdXRoUmVzcG9uc2UgPSBhd2FpdCBhdXRoQXBpLmxvZ2luKGNyZWRlbnRpYWxzKTtcbiAgICAgICAgICAgIGNvbnN0IHsgdG9rZW4sIGV4cGlyZXNBdCwgdXNlciB9ID0gYXV0aFJlc3BvbnNlO1xuXG4gICAgICAgICAgICBpZiAoIXRva2VuIHx8ICF1c2VyIHx8ICFleHBpcmVzQXQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICdBdXRoIHJlc3BvbnNlIGlzIG1pc3NpbmcgcmVxdWlyZWQgZmllbGRzOiB0b2tlbiwgZXhwaXJlc0F0LCB1c2VyLidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZW1lbWJlck1lID0gY3JlZGVudGlhbHMucmVtZW1iZXJNZSA9PT0gdHJ1ZTtcbiAgICAgICAgICAgIHNhdmVBdXRoVG9rZW4oeyB0b2tlbiwgZXhwaXJlc0F0LCB1c2VyLCByZW1lbWJlck1lIH0pO1xuXG4gICAgICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgdXNlcixcbiAgICAgICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCB1c2VyIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXNlZEVycm9yID0gbm9ybWFsaXNlRXJyb3IoZXJyLCAnTG9naW4gZmFpbGVkLiBQbGVhc2UgdHJ5IGFnYWluLicpO1xuICAgICAgICAgICAgc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IG5vcm1hbGlzZWRFcnJvcixcbiAgICAgICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVzZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgdG9rZW46IG51bGwsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogbm9ybWFsaXNlZEVycm9yLm1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVuZHMgdGhlIGN1cnJlbnQgdXNlciBzZXNzaW9uLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgICAgICBjbGVhckF1dGhUb2tlbigpO1xuXG4gICAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgICAgIHVzZXI6IG51bGwsXG4gICAgICAgICAgICB0b2tlbjogbnVsbCxcbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUud2FybihgW0F1dGhDb250ZXh0XSBTZXNzaW9uIGVuZGVkLiBOYXZpZ2F0ZSB0byAke1JPVVRFUy5MT0dJTn0gdmlhIHRoZSByb3V0ZXIuYCk7XG4gICAgfVxuXG4gICAgLy8gTGlzdGVuIGZvciBnbG9iYWwgdW5hdXRob3JpemVkIGV2ZW50cyAoZS5nLiwgZnJvbSBhcGkuanMpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2F1dGg6dW5hdXRob3JpemVkJywgKCkgPT4ge1xuICAgICAgICBpZiAoX3N0YXRlLmlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbQXV0aENvbnRleHRdIDQwMSBVbmF1dGhvcml6ZWQgZGV0ZWN0ZWQgZ2xvYmFsbHkuIExvZ2dpbmcgb3V0LicpO1xuICAgICAgICAgICAgbG9nb3V0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZSxcbiAgICAgICAgdW5zdWJzY3JpYmUsXG4gICAgICAgIG5vdGlmeSxcbiAgICAgICAgZ2V0U3RhdGUsXG4gICAgICAgIHNldFN0YXRlLFxuICAgICAgICByZXN0b3JlU2Vzc2lvbixcbiAgICAgICAgbG9naW4sXG4gICAgICAgIGxvZ291dCxcbiAgICAgICAgY2xlYXJTdG9yYWdlOiBjbGVhckF1dGhUb2tlbixcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgQXV0aENvbnRleHQ7XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEZvcm0gVmFsaWRhdGlvbiBVdGlsaXRpZXMgXHUyMDE0IFBhcnQgMy5cbiAqXG4gKiBQdXJlLCBzeW5jaHJvbm91cywgc3RhdGVsZXNzIHZhbGlkYXRpb24gZnVuY3Rpb25zLlxuICogTm8gc2lkZSBlZmZlY3RzLCBubyBET00gYWNjZXNzLCBubyBhc3luYyBvcGVyYXRpb25zLlxuICpcbiAqIFVzZWQgYnkgTG9naW5Gb3JtIGFuZCBhbnkgZnV0dXJlIGZvcm0gY29tcG9uZW50IHRoYXQgbmVlZHNcbiAqIGNsaWVudC1zaWRlIHZhbGlkYXRpb24gd2l0aCBXQ0FHIEFBLWNvbXBsaWFudCBlcnJvciBtZXNzYWdlcy5cbiAqXG4gKiBFcnJvciBtZXNzYWdlIHN0eWxlIGd1aWRlOlxuICogLSBDb25jaXNlIGFuZCBhY3Rpb25hYmxlIChcIkVudGVyIGEgdmFsaWQgZW1haWxcIiBub3QgXCJJbnZhbGlkIGVtYWlsXCIpXG4gKiAtIE5vdCBjb2xvdXItZGVwZW5kZW50IFx1MjAxNCBhbHdheXMgYWNjb21wYW5pZWQgYnkgdGV4dCAoRlItRVJSLTAxMSlcbiAqIC0gU3RhcnRzIHdpdGggYSBjYXBpdGFsIGxldHRlcjsgbm8gdHJhaWxpbmcgcGVyaW9kXG4gKlxuICogQG1vZHVsZSB1dGlscy92YWxpZGF0aW9uXG4gKi9cblxuaW1wb3J0IHsgQVVUSF9DT05TVEFOVFMgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBSZWdleCBjb25zdGFudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogUkZDIDUzMjItc2ltcGxpZmllZCBlbWFpbCBwYXR0ZXJuLlxuICogVmFsaWRhdGVzIHRoZSBjb21tb24gY2FzZXMgd2hpbGUga2VlcGluZyB0aGUgcmVnZXggcmVhZGFibGUuXG4gKiBEb2VzIG5vdCB2YWxpZGF0ZSBmdWxsIFJGQyBjb21wbGlhbmNlIChlLmcuIHF1b3RlZCBzdHJpbmdzLCBJUCBsaXRlcmFscylcbiAqIHNpbmNlIHRob3NlIGFyZSByYXJlbHkgZW5jb3VudGVyZWQgaW4gcmVhbC13b3JsZCBhcHBsaWNhdGlvbnMuXG4gKlxuICogQHR5cGUge1JlZ0V4cH1cbiAqL1xuY29uc3QgRU1BSUxfUkVHRVggPSAvXlteXFxzQF0rQFteXFxzQF0rXFwuW15cXHNAXSskLztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEluZGl2aWR1YWwgZmllbGQgdmFsaWRhdG9ycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBWYWxpZGF0ZXMgYW4gZW1haWwgYWRkcmVzcyBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3x1bmRlZmluZWR8bnVsbH0gdmFsdWUgLSBUaGUgcmF3IGlucHV0IHZhbHVlXG4gKiBAcmV0dXJucyB7c3RyaW5nfG51bGx9IEFuIGVycm9yIG1lc3NhZ2Ugc3RyaW5nLCBvciBgbnVsbGAgd2hlbiB2YWxpZFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YWxpZGF0ZUVtYWlsKCcnKSAgICAgICAgICAgICAgICAgICAgLy8gJ0VtYWlsIGlzIHJlcXVpcmVkJ1xuICogdmFsaWRhdGVFbWFpbCgnbm90LWFuLWVtYWlsJykgICAgICAgIC8vICdFbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MnXG4gKiB2YWxpZGF0ZUVtYWlsKCdzdHVkZW50QGRlbW8uY29tJykgICAgLy8gbnVsbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbCh2YWx1ZSkge1xuICAgIGNvbnN0IHRyaW1tZWQgPSAodmFsdWUgPz8gJycpLnRyaW0oKTtcblxuICAgIGlmICghdHJpbW1lZCkge1xuICAgICAgICByZXR1cm4gJ0VtYWlsIGlzIHJlcXVpcmVkJztcbiAgICB9XG5cbiAgICBpZiAoIUVNQUlMX1JFR0VYLnRlc3QodHJpbW1lZCkpIHtcbiAgICAgICAgcmV0dXJuICdFbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MnO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyBhIHBhc3N3b3JkIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHVuZGVmaW5lZHxudWxsfSB2YWx1ZSAtIFRoZSByYXcgaW5wdXQgdmFsdWVcbiAqIEByZXR1cm5zIHtzdHJpbmd8bnVsbH0gQW4gZXJyb3IgbWVzc2FnZSBzdHJpbmcsIG9yIGBudWxsYCB3aGVuIHZhbGlkXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhbGlkYXRlUGFzc3dvcmQoJycpICAgICAgICAgLy8gJ1Bhc3N3b3JkIGlzIHJlcXVpcmVkJ1xuICogdmFsaWRhdGVQYXNzd29yZCgnYWJjJykgICAgICAvLyAnUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCA2IGNoYXJhY3RlcnMnXG4gKiB2YWxpZGF0ZVBhc3N3b3JkKCdkZW1vMTIzJykgIC8vIG51bGxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmQodmFsdWUpIHtcbiAgICBjb25zdCByYXcgPSB2YWx1ZSA/PyAnJztcblxuICAgIGlmICghcmF3KSB7XG4gICAgICAgIHJldHVybiAnUGFzc3dvcmQgaXMgcmVxdWlyZWQnO1xuICAgIH1cblxuICAgIGlmIChyYXcubGVuZ3RoIDwgQVVUSF9DT05TVEFOVFMuTUlOX1BBU1NXT1JEX0xFTkdUSCkge1xuICAgICAgICByZXR1cm4gYFBhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgJHtBVVRIX0NPTlNUQU5UUy5NSU5fUEFTU1dPUkRfTEVOR1RIfSBjaGFyYWN0ZXJzYDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEZvcm0tbGV2ZWwgdmFsaWRhdG9yIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFZhbGlkYXRlcyB0aGUgZW50aXJlIGxvZ2luIGZvcm0gYnkgcnVubmluZyBib3RoIGZpZWxkIHZhbGlkYXRvcnMuXG4gKlxuICogUmV0dXJucyBgbnVsbGAgd2hlbiBldmVyeSBmaWVsZCBpcyB2YWxpZCAobm8gZXJyb3JzKS5cbiAqIFJldHVybnMgYW4gYGVycm9yc2Agb2JqZWN0IHdoZW4gb25lIG9yIG1vcmUgZmllbGRzIGFyZSBpbnZhbGlkLlxuICpcbiAqIFRoZSByZXR1cm5lZCBvYmplY3QgYWx3YXlzIGNvbnRhaW5zIGJvdGgga2V5cyBzbyB0aGF0IHRoZSBjYWxsaW5nXG4gKiBjb21wb25lbnQgY2FuIHJlYWQgYGVycm9ycy5lbWFpbGAgYW5kIGBlcnJvcnMucGFzc3dvcmRgIHVuY29uZGl0aW9uYWxseVxuICogd2l0aG91dCBndWFyZCBjaGVja3MuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgIGZvcm0gICAgICAgICAgLSBGb3JtIHZhbHVlcyB0byB2YWxpZGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIGZvcm0uZW1haWwgICAgLSBFbWFpbCBmaWVsZCB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIGZvcm0ucGFzc3dvcmQgLSBQYXNzd29yZCBmaWVsZCB2YWx1ZVxuICogQHJldHVybnMge3sgZW1haWw6IHN0cmluZ3xudWxsLCBwYXNzd29yZDogc3RyaW5nfG51bGwgfXxudWxsfVxuICogICBgbnVsbGAgd2hlbiB2YWxpZDsgZXJyb3Igb2JqZWN0IHdoZW4gaW52YWxpZFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YWxpZGF0ZUxvZ2luRm9ybSh7IGVtYWlsOiAnJywgcGFzc3dvcmQ6ICcnIH0pXG4gKiAvLyB7IGVtYWlsOiAnRW1haWwgaXMgcmVxdWlyZWQnLCBwYXNzd29yZDogJ1Bhc3N3b3JkIGlzIHJlcXVpcmVkJyB9XG4gKlxuICogdmFsaWRhdGVMb2dpbkZvcm0oeyBlbWFpbDogJ3N0dWRlbnRAZGVtby5jb20nLCBwYXNzd29yZDogJ2RlbW8xMjMnIH0pXG4gKiAvLyBudWxsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUxvZ2luRm9ybSh7IGVtYWlsLCBwYXNzd29yZCB9KSB7XG4gICAgY29uc3QgZXJyb3JzID0ge1xuICAgICAgICBlbWFpbDogdmFsaWRhdGVFbWFpbChlbWFpbCksXG4gICAgICAgIHBhc3N3b3JkOiB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKSxcbiAgICB9O1xuXG4gICAgLy8gUmV0dXJuIG51bGwgd2hlbiBldmVyeSB2YWx1ZSBpcyBudWxsIChhbGwgZmllbGRzIHZhbGlkKS5cbiAgICByZXR1cm4gaXNGb3JtVmFsaWQoZXJyb3JzKSA/IG51bGwgOiBlcnJvcnM7XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBIZWxwZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYWxsIHZhbHVlcyBpbiBhbiBlcnJvcnMgb2JqZWN0IGFyZSBgbnVsbGAuXG4gKiBBIGBudWxsYCB2YWx1ZSBtZWFucyB0aGUgY29ycmVzcG9uZGluZyBmaWVsZCBwYXNzZWQgdmFsaWRhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsIHN0cmluZ3xudWxsPn0gZXJyb3JzIC0gVGhlIGVycm9ycyBvYmplY3QgdG8gaW5zcGVjdFxuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCB3aGVuIGV2ZXJ5IGZpZWxkIGlzIHZhbGlkOyBgZmFsc2VgIG90aGVyd2lzZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpc0Zvcm1WYWxpZCh7IGVtYWlsOiBudWxsLCBwYXNzd29yZDogbnVsbCB9KSAgICAgLy8gdHJ1ZVxuICogaXNGb3JtVmFsaWQoeyBlbWFpbDogJ1JlcXVpcmVkJywgcGFzc3dvcmQ6IG51bGwgfSkgLy8gZmFsc2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRm9ybVZhbGlkKGVycm9ycykge1xuICAgIGlmICghZXJyb3JzIHx8IHR5cGVvZiBlcnJvcnMgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZXJyb3JzKS5ldmVyeSh2ID0+IHYgPT09IG51bGwpO1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBTcGlubmVyIFx1MjAxNCBBY2Nlc3NpYmxlIExvYWRpbmcgSW5kaWNhdG9yIFx1MjAxNCBQYXJ0IDMgLyBQYXJ0IDEwLlxuICpcbiAqIFJlbmRlcnMgYSBDU1MtYW5pbWF0ZWQgc3Bpbm5lciBpbnNpZGUgYW55IERPTSBjb250YWluZXIuXG4gKiBVc2VkIGJ5IEJ1dHRvbiAobG9hZGluZyBzdGF0ZSkgYW5kIGFzIGEgc3RhbmRhbG9uZSBwYWdlL3NlY3Rpb24gaW5kaWNhdG9yLlxuICpcbiAqIEBtb2R1bGUgY29tcG9uZW50cy91aS9TcGlubmVyXG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFNpemUgbWFwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogQHR5cGUge1JlY29yZDxzdHJpbmcsIHsgc2l6ZTogbnVtYmVyLCBzdHJva2U6IG51bWJlciB9Pn0gKi9cbmNvbnN0IFNJWkVfTUFQID0ge1xuICAgIHNtOiB7IHNpemU6IDE2LCBzdHJva2U6IDIgfSxcbiAgICBtZDogeyBzaXplOiAyNCwgc3Ryb2tlOiAyLjUgfSxcbiAgICBsZzogeyBzaXplOiA0MCwgc3Ryb2tlOiAzIH0sXG59O1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRmFjdG9yeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFjY2Vzc2libGUgU1ZHIHNwaW5uZXIgZWxlbWVudC5cbiAqXG4gKiBUaGUgc3Bpbm5lciByZXNwZWN0cyBgcHJlZmVycy1yZWR1Y2VkLW1vdGlvbmA6IHdoZW4gdGhlIHVzZXIgaGFzIHJlcXVlc3RlZFxuICogcmVkdWNlZCBtb3Rpb24sIHRoZSBhbmltYXRpb24gaXMgcGF1c2VkIHZpYSBDU1MgKGhhbmRsZWQgaW4gYG1haW4uY3NzYCBcdTIwMTRcbiAqIGBAbWVkaWEgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSkgeyAuc3Bpbm5lciB7IGFuaW1hdGlvbjogbm9uZSB9IH1gKS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIFtvcHRzPXt9XSAgICAgICAgICAgICAgLSBDb25maWd1cmF0aW9uIG9wdGlvbnNcbiAqIEBwYXJhbSB7J3NtJ3wnbWQnfCdsZyd9IFtvcHRzLnNpemU9J21kJ10gLSBWaXN1YWwgc2l6ZSB2YXJpYW50XG4gKiBAcGFyYW0ge3N0cmluZ30gIFtvcHRzLmxhYmVsPSdMb2FkaW5nJ10gLSBBUklBIGxhYmVsIGZvciBzY3JlZW4gcmVhZGVyc1xuICogQHBhcmFtIHtzdHJpbmd9ICBbb3B0cy5jb2xvcj0nY3VycmVudENvbG9yJ10gLSBTVkcgc3Ryb2tlIGNvbG91clxuICogQHBhcmFtIHtzdHJpbmd9ICBbb3B0cy5jbGFzc05hbWU9JyddICAgLSBFeHRyYSBDU1MgY2xhc3NlcyBvbiB0aGUgd3JhcHBlclxuICogQHJldHVybnMge1NWR0VsZW1lbnR9IFRoZSBzcGlubmVyIFNWRyBlbGVtZW50LCByZWFkeSB0byBpbnNlcnQgaW50byB0aGUgRE9NXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHNwaW5uZXIgPSBjcmVhdGVTcGlubmVyKHsgc2l6ZTogJ3NtJywgbGFiZWw6ICdTaWduaW5nIGluXHUyMDI2JyB9KTtcbiAqIGJ1dHRvbkVsLmFwcGVuZChzcGlubmVyKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNwaW5uZXIoe1xuICAgIHNpemUgPSAnbWQnLFxuICAgIGxhYmVsID0gJ0xvYWRpbmcnLFxuICAgIGNvbG9yID0gJ2N1cnJlbnRDb2xvcicsXG4gICAgY2xhc3NOYW1lID0gJycsXG59ID0ge30pIHtcbiAgICBjb25zdCB7IHNpemU6IHB4LCBzdHJva2UgfSA9IFNJWkVfTUFQW3NpemVdID8/IFNJWkVfTUFQLm1kO1xuICAgIGNvbnN0IHIgPSAocHggLSBzdHJva2UpIC8gMjsgLy8gcmFkaXVzIGxlYXZpbmcgcm9vbSBmb3Igc3Ryb2tlXG4gICAgY29uc3QgY3ggPSBweCAvIDI7XG5cbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYHNwaW5uZXIgc3Bpbm5lci0tJHtzaXplfSR7Y2xhc3NOYW1lID8gYCAke2NsYXNzTmFtZX1gIDogJyd9YCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBTdHJpbmcocHgpKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBTdHJpbmcocHgpKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3B4fSAke3B4fWApO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCAnbm9uZScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnc3RhdHVzJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBsYWJlbCk7XG5cbiAgICAvLyBUcmFjayBjaXJjbGUgKGJhY2tncm91bmQpXG4gICAgY29uc3QgdHJhY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2NpcmNsZScpO1xuICAgIHRyYWNrLnNldEF0dHJpYnV0ZSgnY3gnLCBTdHJpbmcoY3gpKTtcbiAgICB0cmFjay5zZXRBdHRyaWJ1dGUoJ2N5JywgU3RyaW5nKGN4KSk7XG4gICAgdHJhY2suc2V0QXR0cmlidXRlKCdyJywgU3RyaW5nKHIpKTtcbiAgICB0cmFjay5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIGNvbG9yKTtcbiAgICB0cmFjay5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIFN0cmluZyhzdHJva2UpKTtcbiAgICB0cmFjay5zZXRBdHRyaWJ1dGUoJ29wYWNpdHknLCAnMC4yJyk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKHRyYWNrKTtcblxuICAgIC8vIEFuaW1hdGVkIGFyY1xuICAgIGNvbnN0IGFyYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnY2lyY2xlJyk7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3Bpbm5lcl9fYXJjJyk7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnY3gnLCBTdHJpbmcoY3gpKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdjeScsIFN0cmluZyhjeCkpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ3InLCBTdHJpbmcocikpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIGNvbG9yKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBTdHJpbmcoc3Ryb2tlKSk7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVjYXAnLCAncm91bmQnKTtcblxuICAgIGNvbnN0IGNpcmN1bWZlcmVuY2UgPSAyICogTWF0aC5QSSAqIHI7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hhcnJheScsIFN0cmluZyhjaXJjdW1mZXJlbmNlKSk7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWRhc2hvZmZzZXQnLCBTdHJpbmcoY2lyY3VtZmVyZW5jZSAqIDAuNzUpKTtcblxuICAgIHN2Zy5hcHBlbmRDaGlsZChhcmMpO1xuICAgIHJldHVybiBzdmc7XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEJ1dHRvbiBcdTIwMTQgR2VuZXJpYyBBY2Nlc3NpYmxlIEJ1dHRvbiBDb21wb25lbnQgXHUyMDE0IFBhcnQgMyAvIFBhcnQgMTAuXG4gKlxuICogQ3JlYXRlcyBhIGA8YnV0dG9uPmAgZWxlbWVudCB3aXRoIHN1cHBvcnQgZm9yIHZhcmlhbnRzLCBzaXplcywgbG9hZGluZyBzdGF0ZSxcbiAqIGFuZCBBUklBIGF0dHJpYnV0ZXMuICBUaGUgbG9hZGluZyBzdGF0ZSBzaG93cyBhbiBpbmxpbmUgc3Bpbm5lciBhbmQgcHJldmVudHNcbiAqIGludGVyYWN0aW9uIHdpdGhvdXQgY2hhbmdpbmcgdGhlIGJ1dHRvbidzIGRpbWVuc2lvbnMgKGxheW91dC1zaGlmdCBzYWZlKS5cbiAqXG4gKiBAbW9kdWxlIGNvbXBvbmVudHMvdWkvQnV0dG9uXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlU3Bpbm5lciB9IGZyb20gJy4vU3Bpbm5lci5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBDb25zdGFudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKiBWYWxpZCB2aXN1YWwgdmFyaWFudHMuICovXG5jb25zdCBWQVJJQU5UUyA9IFsncHJpbWFyeScsICdzZWNvbmRhcnknLCAnb3V0bGluZScsICdnaG9zdCcsICdkZXN0cnVjdGl2ZSddO1xuXG4vKiogVmFsaWQgc2l6ZSB0b2tlbnMuICovXG5jb25zdCBTSVpFUyA9IFsnc20nLCAnbWQnLCAnbGcnXTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEZhY3RvcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhbiBhY2Nlc3NpYmxlIGA8YnV0dG9uPmAgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICBvcHRzICAgICAgICAgICAgICAgICAgICAgLSBCdXR0b24gY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9ICAgb3B0cy5sYWJlbCAgICAgICAgICAgICAgIC0gVmlzaWJsZSBidXR0b24gdGV4dFxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMuaWRdICAgICAgICAgICAgICAgIC0gT3B0aW9uYWwgRE9NIGlkIGF0dHJpYnV0ZVxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMudmFyaWFudD0ncHJpbWFyeSddIC0gVmlzdWFsIHN0eWxlIHZhcmlhbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLnNpemU9J21kJ10gICAgICAgICAtIFNpemUgdG9rZW46ICdzbScgfCAnbWQnIHwgJ2xnJ1xuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMudHlwZT0nYnV0dG9uJ10gICAgIC0gSFRNTCBidXR0b24gdHlwZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gIFtvcHRzLmRpc2FibGVkPWZhbHNlXSAgICAtIERpc2FibGVzIHRoZSBidXR0b25cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gIFtvcHRzLmxvYWRpbmc9ZmFsc2VdICAgICAtIFNob3dzIHNwaW5uZXI7IGRpc2FibGVzIGludGVyYWN0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMuY2xhc3NOYW1lPScnXSAgICAgIC0gRXh0cmEgQ1NTIGNsYXNzZXNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRzLm9uQ2xpY2tdICAgICAgICAgICAtIENsaWNrIGV2ZW50IGhhbmRsZXJcbiAqIEByZXR1cm5zIHtIVE1MQnV0dG9uRWxlbWVudH1cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgYnRuID0gY3JlYXRlQnV0dG9uKHtcbiAqICAgbGFiZWw6ICdTaWduIEluJyxcbiAqICAgdmFyaWFudDogJ3ByaW1hcnknLFxuICogICBsb2FkaW5nOiB0cnVlLFxuICogICBvbkNsaWNrOiBoYW5kbGVMb2dpbixcbiAqIH0pO1xuICogZm9ybUVsLmFwcGVuZChidG4pO1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQnV0dG9uKHtcbiAgICBsYWJlbCxcbiAgICBpZCxcbiAgICB2YXJpYW50ID0gJ3ByaW1hcnknLFxuICAgIHNpemUgPSAnbWQnLFxuICAgIHR5cGUgPSAnYnV0dG9uJyxcbiAgICBkaXNhYmxlZCA9IGZhbHNlLFxuICAgIGxvYWRpbmcgPSBmYWxzZSxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBvbkNsaWNrLFxufSA9IHt9KSB7XG4gICAgY29uc3QgcmVzb2x2ZWRWYXJpYW50ID0gVkFSSUFOVFMuaW5jbHVkZXModmFyaWFudCkgPyB2YXJpYW50IDogJ3ByaW1hcnknO1xuICAgIGNvbnN0IHJlc29sdmVkU2l6ZSA9IFNJWkVTLmluY2x1ZGVzKHNpemUpID8gc2l6ZSA6ICdtZCc7XG5cbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidG4udHlwZSA9IHR5cGU7XG5cbiAgICBpZiAoaWQpIGJ0bi5pZCA9IGlkO1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IFtcbiAgICAgICAgJ2J0bicsXG4gICAgICAgIGBidG4tLSR7cmVzb2x2ZWRWYXJpYW50fWAsXG4gICAgICAgIGBidG4tLSR7cmVzb2x2ZWRTaXplfWAsXG4gICAgICAgIC4uLihsb2FkaW5nID8gWydidG4tLWxvYWRpbmcnXSA6IFtdKSxcbiAgICAgICAgLi4uKGNsYXNzTmFtZSA/IFtjbGFzc05hbWVdIDogW10pLFxuICAgIF07XG4gICAgYnRuLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xuXG4gICAgLy8gRGlzYWJsZSB0aGUgYnV0dG9uIHdoZW4gZXhwbGljaXRseSBkaXNhYmxlZCBvciB3aGlsZSBsb2FkaW5nLlxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBkaXNhYmxlZCB8fCBsb2FkaW5nO1xuICAgIGJ0bi5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIFN0cmluZyhpc0Rpc2FibGVkKSk7XG4gICAgaWYgKGxvYWRpbmcpIGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtYnVzeScsICd0cnVlJyk7XG5cbiAgICAvLyBMYWJlbCB0ZXh0IFx1MjAxNCBhbHdheXMgcHJlc2VudCAoc2NyZWVuIHJlYWRlcnMgd2lsbCByZWFkIGl0KS5cbiAgICBjb25zdCBsYWJlbFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbGFiZWxTcGFuLmNsYXNzTmFtZSA9ICdidG5fX2xhYmVsJztcbiAgICBsYWJlbFNwYW4udGV4dENvbnRlbnQgPSBsYWJlbCA/PyAnJztcbiAgICBidG4uYXBwZW5kQ2hpbGQobGFiZWxTcGFuKTtcblxuICAgIC8vIFNwaW5uZXIgKGhpZGRlbiB3aGVuIG5vdCBsb2FkaW5nLCB2aXNpYmxlIHdoZW4gbG9hZGluZykuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IGNyZWF0ZVNwaW5uZXIoeyBzaXplOiByZXNvbHZlZFNpemUgPT09ICdsZycgPyAnbWQnIDogJ3NtJyB9KTtcbiAgICAgICAgc3Bpbm5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gbWFpbiBhcmlhLWJ1c3kgb24gYnV0dG9uIGlzIGVub3VnaFxuICAgICAgICBidG4uYXBwZW5kQ2hpbGQoc3Bpbm5lcik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvbkNsaWNrID09PSAnZnVuY3Rpb24nICYmICFpc0Rpc2FibGVkKSB7XG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spO1xuICAgIH1cblxuICAgIHJldHVybiBidG47XG59XG5cbi8qKlxuICogVXBkYXRlcyBhIGJ1dHRvbidzIGxvYWRpbmcgc3RhdGUgaW4tcGxhY2Ugd2l0aG91dCByZWNyZWF0aW5nIHRoZSBlbGVtZW50LlxuICogVXNlZnVsIHdoZW4gdGhlIHNhbWUgYnV0dG9uIGVsZW1lbnQgbmVlZHMgdG8gdG9nZ2xlIGxvYWRpbmcgZHVyaW5nIGFuIGFzeW5jIG9wLlxuICpcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ0biAgICAgICAtIFRoZSBidXR0b24gZWxlbWVudCB0byB1cGRhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gICAgICAgICAgIGlzTG9hZGluZyAtIE5ldyBsb2FkaW5nIHN0YXRlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEJ1dHRvbkxvYWRpbmcoYnRuLCBpc0xvYWRpbmcpIHtcbiAgICBpZiAoIWJ0biB8fCAhKGJ0biBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSkgcmV0dXJuO1xuXG4gICAgYnRuLmRpc2FibGVkID0gaXNMb2FkaW5nO1xuICAgIGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCBTdHJpbmcoaXNMb2FkaW5nKSk7XG5cbiAgICBpZiAoaXNMb2FkaW5nKSB7XG4gICAgICAgIGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtYnVzeScsICd0cnVlJyk7XG4gICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKCdidG4tLWxvYWRpbmcnKTtcblxuICAgICAgICBpZiAoIWJ0bi5xdWVyeVNlbGVjdG9yKCcuc3Bpbm5lcicpKSB7XG4gICAgICAgICAgICBjb25zdCBzcGlubmVyID0gY3JlYXRlU3Bpbm5lcih7IHNpemU6ICdzbScgfSk7XG4gICAgICAgICAgICBzcGlubmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgYnRuLmFwcGVuZENoaWxkKHNwaW5uZXIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnRuLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1idXN5Jyk7XG4gICAgICAgIGJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdidG4tLWxvYWRpbmcnKTtcbiAgICAgICAgYnRuLnF1ZXJ5U2VsZWN0b3IoJy5zcGlubmVyJyk/LnJlbW92ZSgpO1xuICAgIH1cbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgSW5wdXQgXHUyMDE0IEFjY2Vzc2libGUgVGV4dCBJbnB1dCBDb21wb25lbnQgXHUyMDE0IFBhcnQgMyAvIFBhcnQgMTAuXG4gKlxuICogQ3JlYXRlcyBhIGxhYmVsbGVkIGA8aW5wdXQ+YCBlbGVtZW50IHdpdGggaW5saW5lIGVycm9yIG1lc3NhZ2luZyBhbmQgYW5cbiAqIG9wdGlvbmFsIHNob3cvaGlkZSBwYXNzd29yZCB0b2dnbGUgZm9yIGB0eXBlPVwicGFzc3dvcmRcImAgaW5wdXRzLlxuICpcbiAqIEBtb2R1bGUgY29tcG9uZW50cy91aS9JbnB1dFxuICovXG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBTVkcgaWNvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IEVZRV9JQ09OID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiXG4gIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgPHBhdGggZD1cIk0yIDEyczMtNyAxMC03IDEwIDcgMTAgNy0zIDctMTAgNy0xMC03LTEwLTdaXCIvPlxuICA8Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+XG48L3N2Zz5gO1xuXG5jb25zdCBFWUVfT0ZGX0lDT04gPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCJcbiAgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICA8cGF0aCBkPVwiTTkuODggOS44OGEzIDMgMCAxIDAgNC4yNCA0LjI0XCIvPlxuICA8cGF0aCBkPVwiTTEwLjczIDUuMDhBMTAuNDMgMTAuNDMgMCAwIDEgMTIgNWM3IDAgMTAgNyAxMCA3YTEzLjE2IDEzLjE2IDAgMCAxLTEuNjcgMi42OFwiLz5cbiAgPHBhdGggZD1cIk02LjYxIDYuNjFBMTMuNTI2IDEzLjUyNiAwIDAgMCAyIDEyczMgNyAxMCA3YTkuNzQgOS43NCAwIDAgMCA1LjM5LTEuNjFcIi8+XG4gIDxsaW5lIHgxPVwiMlwiIHgyPVwiMjJcIiB5MT1cIjJcIiB5Mj1cIjIyXCIvPlxuPC9zdmc+YDtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEZhY3RvcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ3JlYXRlcyBhIGxhYmVsbGVkIGlucHV0IGZpZWxkIHdpdGggb3B0aW9uYWwgaW5saW5lIGVycm9yIGFuZCBwYXNzd29yZCB0b2dnbGUuXG4gKlxuICogUmV0dXJucyBhIHdyYXBwZXIgYDxkaXY+YCBjb250YWluaW5nIHRoZSBsYWJlbCwgaW5wdXQsIGFuZCAod2hlbiBhcHBsaWNhYmxlKVxuICogdGhlIGVycm9yIG1lc3NhZ2UgZWxlbWVudC4gIFRoZSBlcnJvciBlbGVtZW50IGlzIGFsd2F5cyByZW5kZXJlZCAoYnV0IGVtcHR5XG4gKiB3aGVuIHRoZXJlIGlzIG5vIGVycm9yKSBzbyBET00gbGF5b3V0IHN0YXlzIHN0YWJsZSBcdTIwMTQgbm8gbGF5b3V0IHNoaWZ0IHdoZW5cbiAqIGFuIGVycm9yIGFwcGVhcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgb3B0cyAgICAgICAgICAgICAgIC0gSW5wdXQgY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9ICAgb3B0cy5pZCAgICAgICAgICAgIC0gRWxlbWVudCBpZCAobGlua3MgbGFiZWwgXHUyMTkyIGlucHV0KVxuICogQHBhcmFtIHtzdHJpbmd9ICAgb3B0cy5uYW1lICAgICAgICAgIC0gSW5wdXQgbmFtZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLnR5cGU9J3RleHQnXSAtIElucHV0IHR5cGUgYXR0cmlidXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5sYWJlbF0gICAgICAgLSBWaXNpYmxlIGxhYmVsIHRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLnZhbHVlPScnXSAgICAtIEluaXRpYWwgdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLnBsYWNlaG9sZGVyPScnXSAtIFBsYWNlaG9sZGVyIHRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLmVycm9yXSAgICAgICAtIElubGluZSBlcnJvciBtZXNzYWdlIChzZXRzIGFyaWEtaW52YWxpZClcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gIFtvcHRzLnJlcXVpcmVkPWZhbHNlXSAtIE1hcmtzIGZpZWxkIGFzIHJlcXVpcmVkXG4gKiBAcGFyYW0ge2Jvb2xlYW59ICBbb3B0cy5kaXNhYmxlZD1mYWxzZV0gLSBEaXNhYmxlcyB0aGUgaW5wdXRcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLmF1dG9jb21wbGV0ZV0gICAtIGF1dG9jb21wbGV0ZSBhdHRyaWJ1dGUgdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRzLm9uQ2hhbmdlXSAgICAtIGlucHV0IGV2ZW50IGhhbmRsZXIgKHJlY2VpdmVzIHRoZSBFdmVudClcbiAqIEByZXR1cm5zIHt7IHdyYXBwZXI6IEhUTUxEaXZFbGVtZW50LCBpbnB1dDogSFRNTElucHV0RWxlbWVudCwgc2V0RXJyb3I6IGZ1bmN0aW9uIH19XG4gKiAgIFJldHVybnMgdGhlIHdyYXBwZXIgZWxlbWVudCwgZGlyZWN0IGlucHV0IHJlZmVyZW5jZSwgYW5kIGFuIGVycm9yIHVwZGF0ZXJcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgeyB3cmFwcGVyLCBpbnB1dCwgc2V0RXJyb3IgfSA9IGNyZWF0ZUlucHV0KHtcbiAqICAgaWQ6ICdlbWFpbCcsXG4gKiAgIG5hbWU6ICdlbWFpbCcsXG4gKiAgIHR5cGU6ICdlbWFpbCcsXG4gKiAgIGxhYmVsOiAnRW1haWwgYWRkcmVzcycsXG4gKiAgIHJlcXVpcmVkOiB0cnVlLFxuICogICBvbkNoYW5nZTogZSA9PiB2YWxpZGF0ZUVtYWlsRmllbGQoZS50YXJnZXQudmFsdWUpLFxuICogfSk7XG4gKiBmb3JtRWwuYXBwZW5kKHdyYXBwZXIpO1xuICogc2V0RXJyb3IoJ0VudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcycpOyAvLyBzaG93cyBpbmxpbmUgZXJyb3JcbiAqIHNldEVycm9yKG51bGwpOyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2xlYXJzIGl0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbnB1dCh7XG4gICAgaWQsXG4gICAgbmFtZSxcbiAgICB0eXBlID0gJ3RleHQnLFxuICAgIGxhYmVsLFxuICAgIHZhbHVlID0gJycsXG4gICAgcGxhY2Vob2xkZXIgPSAnJyxcbiAgICBlcnJvcixcbiAgICByZXF1aXJlZCA9IGZhbHNlLFxuICAgIGRpc2FibGVkID0gZmFsc2UsXG4gICAgYXV0b2NvbXBsZXRlLFxuICAgIG9uQ2hhbmdlLFxufSA9IHt9KSB7XG4gICAgY29uc3QgaXNQYXNzd29yZCA9IHR5cGUgPT09ICdwYXNzd29yZCc7XG4gICAgY29uc3QgZXJyb3JJZCA9IGAke2lkfS1lcnJvcmA7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgV3JhcHBlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSAnaW5wdXQtZmllbGQnO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExhYmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGlmIChsYWJlbCkge1xuICAgICAgICBjb25zdCBsYWJlbEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgbGFiZWxFbC5odG1sRm9yID0gaWQ7XG4gICAgICAgIGxhYmVsRWwuY2xhc3NOYW1lID0gJ2lucHV0LWZpZWxkX19sYWJlbCc7XG4gICAgICAgIGxhYmVsRWwudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgaWYgKHJlcXVpcmVkKSB7XG4gICAgICAgICAgICBjb25zdCByZXEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICByZXEuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICByZXEuY2xhc3NOYW1lID0gJ2lucHV0LWZpZWxkX19yZXF1aXJlZCc7XG4gICAgICAgICAgICByZXEudGV4dENvbnRlbnQgPSAnIConO1xuICAgICAgICAgICAgbGFiZWxFbC5hcHBlbmRDaGlsZChyZXEpO1xuICAgICAgICB9XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGFiZWxFbCk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIElucHV0IHJvdyAoaW5wdXQgKyBvcHRpb25hbCB0b2dnbGUgYnV0dG9uKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBpbnB1dFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGlucHV0Um93LmNsYXNzTmFtZSA9IGBpbnB1dC1maWVsZF9fcm93JHtpc1Bhc3N3b3JkID8gJyBpbnB1dC1maWVsZF9fcm93LS1wYXNzd29yZCcgOiAnJ31gO1xuXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGlucHV0LmlkID0gaWQ7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICBpbnB1dC5wbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyO1xuICAgIGlucHV0LnJlcXVpcmVkID0gcmVxdWlyZWQ7XG4gICAgaW5wdXQuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICBpbnB1dC5jbGFzc05hbWUgPSBgaW5wdXQtZmllbGRfX2lucHV0JHtlcnJvciA/ICcgaW5wdXQtZmllbGRfX2lucHV0LS1lcnJvcicgOiAnJ31gO1xuICAgIGlmIChhdXRvY29tcGxldGUpIGlucHV0LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgYXV0b2NvbXBsZXRlKTtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpO1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBlcnJvcklkKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIG9uQ2hhbmdlKTtcbiAgICB9XG4gICAgaW5wdXRSb3cuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFNob3cvaGlkZSB0b2dnbGUgKHBhc3N3b3JkIG9ubHkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGlmIChpc1Bhc3N3b3JkKSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICB0b2dnbGVCdG4udHlwZSA9ICdidXR0b24nO1xuICAgICAgICB0b2dnbGVCdG4uY2xhc3NOYW1lID0gJ2lucHV0LWZpZWxkX190b2dnbGUnO1xuICAgICAgICB0b2dnbGVCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ1Nob3cgcGFzc3dvcmQnKTtcbiAgICAgICAgdG9nZ2xlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRvZ2dsZUJ0bi5pbm5lckhUTUwgPSBFWUVfSUNPTjtcblxuICAgICAgICB0b2dnbGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc1Nob3dpbmcgPSBpbnB1dC50eXBlID09PSAndGV4dCc7XG4gICAgICAgICAgICBpbnB1dC50eXBlID0gaXNTaG93aW5nID8gJ3Bhc3N3b3JkJyA6ICd0ZXh0JztcbiAgICAgICAgICAgIHRvZ2dsZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsIFN0cmluZyghaXNTaG93aW5nKSk7XG4gICAgICAgICAgICB0b2dnbGVCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgaXNTaG93aW5nID8gJ1Nob3cgcGFzc3dvcmQnIDogJ0hpZGUgcGFzc3dvcmQnKTtcbiAgICAgICAgICAgIHRvZ2dsZUJ0bi5pbm5lckhUTUwgPSBpc1Nob3dpbmcgPyBFWUVfSUNPTiA6IEVZRV9PRkZfSUNPTjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5wdXRSb3cuYXBwZW5kQ2hpbGQodG9nZ2xlQnRuKTtcbiAgICB9XG5cbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlucHV0Um93KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBFcnJvciBtZXNzYWdlIChhbHdheXMgcmVuZGVyZWQsIGVtcHR5IHdoZW4gbm8gZXJyb3IpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGVycm9yRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgZXJyb3JFbC5pZCA9IGVycm9ySWQ7XG4gICAgZXJyb3JFbC5jbGFzc05hbWUgPSAnaW5wdXQtZmllbGRfX2Vycm9yJztcbiAgICBlcnJvckVsLnNldEF0dHJpYnV0ZSgncm9sZScsICdhbGVydCcpO1xuICAgIGVycm9yRWwuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAncG9saXRlJyk7XG4gICAgZXJyb3JFbC50ZXh0Q29udGVudCA9IGVycm9yID8/ICcnO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZXJyb3JFbCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRXJyb3IgdXBkYXRlciBoZWxwZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBpbmxpbmUgZXJyb3IgbWVzc2FnZSBhbmQgYXJpYS1pbnZhbGlkIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVsbH0gbWVzc2FnZSAtIEVycm9yIHRleHQsIG9yIG51bGwgdG8gY2xlYXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRFcnJvcihtZXNzYWdlKSB7XG4gICAgICAgIGVycm9yRWwudGV4dENvbnRlbnQgPSBtZXNzYWdlID8/ICcnO1xuICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgZXJyb3JJZCk7XG4gICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnB1dC1maWVsZF9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcpO1xuICAgICAgICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgICAgICBpbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdpbnB1dC1maWVsZF9faW5wdXQtLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB3cmFwcGVyLCBpbnB1dCwgc2V0RXJyb3IgfTtcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVtb0NyZWRlbnRpYWxzIFx1MjAxNCBEZW1vIExvZ2luIEhpbnQgQmxvY2sgXHUyMDE0IFBhcnQgMy5cbiAqXG4gKiBSZW5kZXJzIGEgdmlzdWFsbHkgZGlzdGluY3QgaW5mbyBib3ggc2hvd2luZyB0aGUgZGVtbyBlbWFpbCBhbmQgcGFzc3dvcmQuXG4gKiBJbmNsdWRlcyBhbiBvcHRpb25hbCBcIlVzZSBkZW1vIGNyZWRlbnRpYWxzXCIgYnV0dG9uIHRoYXQgYXV0by1maWxscyB0aGVcbiAqIGNvbm5lY3RlZCBsb2dpbiBmb3JtIGlucHV0cy5cbiAqXG4gKiBAbW9kdWxlIGNvbXBvbmVudHMvYXV0aC9EZW1vQ3JlZGVudGlhbHNcbiAqL1xuXG5pbXBvcnQgeyBBVVRIX0NPTlNUQU5UUyB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbnN0YW50cy5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgZGVtbyBjcmVkZW50aWFscyBoaW50IGJsb2NrLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW29wdHM9e31dICAgICAgICAgIC0gQ29uZmlndXJhdGlvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdHMub25GaWxsXSAgICAgLSBDYWxsZWQgd2l0aCBgeyBlbWFpbCwgcGFzc3dvcmQgfWAgd2hlblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgdXNlciBjbGlja3MgXCJVc2UgZGVtbyBjcmVkZW50aWFsc1wiLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdHRhY2ggYSBoYW5kbGVyIHRvIGF1dG8tZmlsbCBmb3JtIGlucHV0cy5cbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gVGhlIHJlbmRlcmVkIGhpbnQgYmxvY2sgZWxlbWVudFxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBoaW50ID0gY3JlYXRlRGVtb0NyZWRlbnRpYWxzKHtcbiAqICAgb25GaWxsOiAoeyBlbWFpbCwgcGFzc3dvcmQgfSkgPT4ge1xuICogICAgIGVtYWlsSW5wdXQudmFsdWUgPSBlbWFpbDtcbiAqICAgICBwYXNzd29yZElucHV0LnZhbHVlID0gcGFzc3dvcmQ7XG4gKiAgIH0sXG4gKiB9KTtcbiAqIGxvZ2luRm9ybUVsLmFwcGVuZChoaW50KTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlbW9DcmVkZW50aWFscyh7IG9uRmlsbCB9ID0ge30pIHtcbiAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJsb2NrLmNsYXNzTmFtZSA9ICdkZW1vLWNyZWRlbnRpYWxzJztcbiAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnbm90ZScpO1xuICAgIGJsb2NrLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdEZW1vIGxvZ2luIGNyZWRlbnRpYWxzJyk7XG5cbiAgICBjb25zdCBoZWFkaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGhlYWRpbmcuY2xhc3NOYW1lID0gJ2RlbW8tY3JlZGVudGlhbHNfX2hlYWRpbmcnO1xuICAgIGhlYWRpbmcudGV4dENvbnRlbnQgPSAnRGVtbyBjcmVkZW50aWFscyc7XG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoaGVhZGluZyk7XG5cbiAgICAvLyBFbWFpbCByb3dcbiAgICBjb25zdCBlbWFpbFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBlbWFpbFJvdy5jbGFzc05hbWUgPSAnZGVtby1jcmVkZW50aWFsc19fcm93JztcbiAgICBlbWFpbFJvdy5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJkZW1vLWNyZWRlbnRpYWxzX19rZXlcIj5FbWFpbDo8L3NwYW4+XG4gICAgICA8Y29kZSBjbGFzcz1cImRlbW8tY3JlZGVudGlhbHNfX3ZhbHVlXCI+JHtBVVRIX0NPTlNUQU5UUy5ERU1PX0VNQUlMfTwvY29kZT5gO1xuICAgIGJsb2NrLmFwcGVuZENoaWxkKGVtYWlsUm93KTtcblxuICAgIC8vIFBhc3N3b3JkIHJvd1xuICAgIGNvbnN0IHBhc3NSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgcGFzc1Jvdy5jbGFzc05hbWUgPSAnZGVtby1jcmVkZW50aWFsc19fcm93JztcbiAgICBwYXNzUm93LmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cImRlbW8tY3JlZGVudGlhbHNfX2tleVwiPlBhc3N3b3JkOjwvc3Bhbj5cbiAgICAgIDxjb2RlIGNsYXNzPVwiZGVtby1jcmVkZW50aWFsc19fdmFsdWVcIj4ke0FVVEhfQ09OU1RBTlRTLkRFTU9fUEFTU1dPUkR9PC9jb2RlPmA7XG4gICAgYmxvY2suYXBwZW5kQ2hpbGQocGFzc1Jvdyk7XG5cbiAgICAvLyBBdXRvLWZpbGwgYnV0dG9uIChvbmx5IHJlbmRlcmVkIHdoZW4gYSBoYW5kbGVyIGlzIHByb3ZpZGVkKVxuICAgIGlmICh0eXBlb2Ygb25GaWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGZpbGxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZmlsbEJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIGZpbGxCdG4uY2xhc3NOYW1lID0gJ2RlbW8tY3JlZGVudGlhbHNfX2ZpbGwtYnRuJztcbiAgICAgICAgZmlsbEJ0bi50ZXh0Q29udGVudCA9ICdVc2UgZGVtbyBjcmVkZW50aWFscyc7XG4gICAgICAgIGZpbGxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBvbkZpbGwoeyBlbWFpbDogQVVUSF9DT05TVEFOVFMuREVNT19FTUFJTCwgcGFzc3dvcmQ6IEFVVEhfQ09OU1RBTlRTLkRFTU9fUEFTU1dPUkQgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBibG9jay5hcHBlbmRDaGlsZChmaWxsQnRuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2s7XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENoZWNrYm94IFx1MjAxNCBBY2Nlc3NpYmxlIENoZWNrYm94IENvbXBvbmVudCBcdTIwMTQgUGFydCAzIC8gUGFydCAxMC5cbiAqXG4gKiBDcmVhdGVzIGEgbmF0aXZlIGA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCI+YCB3aXRoIGEgcHJvcGVybHkgYXNzb2NpYXRlZFxuICogYDxsYWJlbD5gLiAgVXNlZCBieSB0aGUgUmVtZW1iZXJNZSBjb21wb25lbnQuXG4gKlxuICogQG1vZHVsZSBjb21wb25lbnRzL3VpL0NoZWNrYm94XG4gKi9cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFjY2Vzc2libGUgbGFiZWxsZWQgY2hlY2tib3ggZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICBvcHRzICAgICAgICAgICAgICAtIENoZWNrYm94IGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSAgIG9wdHMuaWQgICAgICAgICAgLSBFbGVtZW50IGlkIChsaW5rcyBsYWJlbCBcdTIxOTIgaW5wdXQpXG4gKiBAcGFyYW0ge3N0cmluZ30gICBvcHRzLm5hbWUgICAgICAgIC0gSW5wdXQgbmFtZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIG9wdHMubGFiZWwgICAgICAgLSBWaXNpYmxlIGxhYmVsIHRleHRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gIFtvcHRzLmNoZWNrZWQ9ZmFsc2VdICAgLSBJbml0aWFsIGNoZWNrZWQgc3RhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gIFtvcHRzLmRpc2FibGVkPWZhbHNlXSAgLSBEaXNhYmxlcyB0aGUgY2hlY2tib3hcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLmNsYXNzTmFtZT0nJ10gICAtIEV4dHJhIENTUyBjbGFzc2VzIG9uIHRoZSB3cmFwcGVyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0cy5vbkNoYW5nZV0gIC0gY2hhbmdlIGV2ZW50IGhhbmRsZXIgKHJlY2VpdmVzIEV2ZW50KVxuICogQHJldHVybnMge3sgd3JhcHBlcjogSFRNTERpdkVsZW1lbnQsIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50IH19XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHsgd3JhcHBlciwgaW5wdXQgfSA9IGNyZWF0ZUNoZWNrYm94KHtcbiAqICAgaWQ6ICdyZW1lbWJlci1tZScsXG4gKiAgIG5hbWU6ICdyZW1lbWJlck1lJyxcbiAqICAgbGFiZWw6ICdSZW1lbWJlciBtZScsXG4gKiAgIGNoZWNrZWQ6IGZhbHNlLFxuICogICBvbkNoYW5nZTogZSA9PiBjb25zb2xlLmxvZygnY2hlY2tlZDonLCBlLnRhcmdldC5jaGVja2VkKSxcbiAqIH0pO1xuICogZm9ybUVsLmFwcGVuZCh3cmFwcGVyKTtcbiAqIC8vIFJlYWQgdmFsdWU6ICBpbnB1dC5jaGVja2VkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCh7XG4gICAgaWQsXG4gICAgbmFtZSxcbiAgICBsYWJlbCxcbiAgICBjaGVja2VkID0gZmFsc2UsXG4gICAgZGlzYWJsZWQgPSBmYWxzZSxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBvbkNoYW5nZSxcbn0gPSB7fSkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9IGBjaGVja2JveCR7Y2xhc3NOYW1lID8gYCAke2NsYXNzTmFtZX1gIDogJyd9YDtcblxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBpbnB1dC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBpbnB1dC5pZCA9IGlkO1xuICAgIGlucHV0Lm5hbWUgPSBuYW1lO1xuICAgIGlucHV0LmNoZWNrZWQgPSBjaGVja2VkO1xuICAgIGlucHV0LmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgaW5wdXQuY2xhc3NOYW1lID0gJ2NoZWNrYm94X19pbnB1dCc7XG5cbiAgICBpZiAodHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBjb25zdCBsYWJlbEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICBsYWJlbEVsLmh0bWxGb3IgPSBpZDtcbiAgICBsYWJlbEVsLmNsYXNzTmFtZSA9ICdjaGVja2JveF9fbGFiZWwnO1xuICAgIGxhYmVsRWwudGV4dENvbnRlbnQgPSBsYWJlbCA/PyAnJztcblxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGFiZWxFbCk7XG5cbiAgICByZXR1cm4geyB3cmFwcGVyLCBpbnB1dCB9O1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBSZW1lbWJlck1lIFx1MjAxNCBcIlJlbWVtYmVyIG1lXCIgQ2hlY2tib3ggXHUyMDE0IFBhcnQgMy5cbiAqXG4gKiBBIGxhYmVsbGVkIGNoZWNrYm94IHN1Yi1jb21wb25lbnQgcmVuZGVyZWQgaW5zaWRlIExvZ2luRm9ybS5cbiAqIFdoZW4gY2hlY2tlZCwgYXV0aCB0b2tlbnMgYXJlIHBlcnNpc3RlZCBpbiBsb2NhbFN0b3JhZ2UgKDMwLWRheSBleHBpcnkpO1xuICogd2hlbiB1bmNoZWNrZWQsIHRva2VucyBhcmUgc3RvcmVkIGluIHNlc3Npb25TdG9yYWdlIG9ubHkuXG4gKlxuICogQG1vZHVsZSBjb21wb25lbnRzL2F1dGgvUmVtZW1iZXJNZVxuICovXG5cbmltcG9ydCB7IGNyZWF0ZUNoZWNrYm94IH0gZnJvbSAnLi4vdWkvQ2hlY2tib3guanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIFwiUmVtZW1iZXIgbWVcIiBjaGVja2JveCB3cmFwcGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW29wdHM9e31dICAgICAgICAgICAtIENvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMuY2hlY2tlZD1mYWxzZV0gLSBJbml0aWFsIGNoZWNrZWQgc3RhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRzLm9uQ2hhbmdlXSAgICAtIENhbGxlZCB3aXRoIHRoZSBuZXcgYm9vbGVhbiB2YWx1ZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiB0aGUgY2hlY2tib3ggY2hhbmdlc1xuICogQHJldHVybnMge3sgd3JhcHBlcjogSFRNTERpdkVsZW1lbnQsIGdldFZhbHVlOiBmdW5jdGlvbigpOiBib29sZWFuIH19XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHJlbWVtYmVyTWUgPSBjcmVhdGVSZW1lbWJlck1lKHtcbiAqICAgb25DaGFuZ2U6IGNoZWNrZWQgPT4gY29uc29sZS5sb2coJ3JlbWVtYmVyTWU6JywgY2hlY2tlZCksXG4gKiB9KTtcbiAqIGZvcm1FbC5hcHBlbmQocmVtZW1iZXJNZS53cmFwcGVyKTtcbiAqIGNvbnN0IHNob3VsZFJlbWVtYmVyID0gcmVtZW1iZXJNZS5nZXRWYWx1ZSgpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVtZW1iZXJNZSh7IGNoZWNrZWQgPSBmYWxzZSwgb25DaGFuZ2UgfSA9IHt9KSB7XG4gICAgY29uc3QgeyB3cmFwcGVyLCBpbnB1dCB9ID0gY3JlYXRlQ2hlY2tib3goe1xuICAgICAgICBpZDogJ3JlbWVtYmVyLW1lJyxcbiAgICAgICAgbmFtZTogJ3JlbWVtYmVyTWUnLFxuICAgICAgICBsYWJlbDogJ1JlbWVtYmVyIG1lJyxcbiAgICAgICAgY2hlY2tlZCxcbiAgICAgICAgY2xhc3NOYW1lOiAncmVtZW1iZXItbWUnLFxuICAgICAgICBvbkNoYW5nZTogdHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nID8gZSA9PiBvbkNoYW5nZShlLnRhcmdldC5jaGVja2VkKSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHdyYXBwZXIsXG4gICAgICAgIC8qKiBAcmV0dXJucyB7Ym9vbGVhbn0gQ3VycmVudCBjaGVja2VkIHN0YXRlICovXG4gICAgICAgIGdldFZhbHVlOiAoKSA9PiBpbnB1dC5jaGVja2VkLFxuICAgIH07XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IExvZ2luRm9ybSBcdTIwMTQgTG9naW4gRm9ybSBDb21wb25lbnQgXHUyMDE0IFBhcnQgMy5cbiAqXG4gKiBSZW5kZXJzIHRoZSBjb21wbGV0ZSBsb2dpbiBmb3JtOiBlbWFpbCBpbnB1dCwgcGFzc3dvcmQgaW5wdXQsIFwiUmVtZW1iZXIgbWVcIlxuICogY2hlY2tib3gsIGRlbW8gY3JlZGVudGlhbHMgaGludCwgYW5kIHN1Ym1pdCBidXR0b24uICBIYW5kbGVzIGNsaWVudC1zaWRlXG4gKiB2YWxpZGF0aW9uLCBhc3luYyBzdWJtaXNzaW9uLCBhbmQgZXJyb3IgZGlzcGxheS5cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgRGF0YSBmbG93IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBVc2VyIGZpbGxzIGZvcm1cbiAqICAgICBcdTIxOTIgY2xpZW50LXNpZGUgdmFsaWRhdGlvbiAodmFsaWRhdGVMb2dpbkZvcm0pXG4gKiAgICAgXHUyMTkyIEF1dGhDb250ZXh0LmxvZ2luKGNyZWRlbnRpYWxzKSAgICAgICAgICAgIFx1MjE5MCBzdGF0ZSBtYW5hZ2VtZW50IGxheWVyXG4gKiAgICAgICBcdTIxOTIgYXV0aEFwaS5sb2dpbihjcmVkZW50aWFscykgICAgICAgICAgICAgIFx1MjE5MCBIVFRQIGxheWVyXG4gKiAgICAgICAgIFx1MjE5MiBhdXRoU3RvcmFnZS5zYXZlQXV0aFRva2VuKFx1MjAyNikgICAgICAgICAgXHUyMTkwIHN0b3JhZ2UgbGF5ZXJcbiAqICAgICBcdTIxOTIgc3VjY2VzcyBcdTIxOTIgb25TdWNjZXNzIGNhbGxiYWNrIFx1MjE5MiBjYWxsZXIgbmF2aWdhdGVzXG4gKiAgICAgXHUyMTkyIGZhaWx1cmUgXHUyMTkyIGlubGluZSBlcnJvciBkaXNwbGF5ZWQgaW4gZm9ybVxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBOYXZpZ2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBUaGlzIGNvbXBvbmVudCBpbnRlbnRpb25hbGx5IGRvZXMgTk9UIGNhbGwgcm91dGVyLm5hdmlnYXRlKCkgZGlyZWN0bHkuXG4gKiAgIEFmdGVyIGEgc3VjY2Vzc2Z1bCBsb2dpbiBpdCBjYWxscyBgb3B0cy5vblN1Y2Nlc3ModXNlciwgZGVzdGluYXRpb24pYC5cbiAqICAgVGhlIHBhZ2UgdGhhdCBtb3VudHMgdGhpcyBmb3JtIChMb2dpblBhZ2UpIGlzIHJlc3BvbnNpYmxlIGZvciByb3V0aW5nLlxuICpcbiAqIEBtb2R1bGUgY29tcG9uZW50cy9hdXRoL0xvZ2luRm9ybVxuICovXG5cbmltcG9ydCBBdXRoQ29udGV4dCBmcm9tICcuLi8uLi9jb250ZXh0L0F1dGhDb250ZXh0LmpzJztcbmltcG9ydCB7IGdldFJlZGlyZWN0UGF0aCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2F1dGhTdG9yYWdlLmpzJztcbmltcG9ydCB7IHZhbGlkYXRlTG9naW5Gb3JtIH0gZnJvbSAnLi4vLi4vdXRpbHMvdmFsaWRhdGlvbi5qcyc7XG5pbXBvcnQgeyBjcmVhdGVCdXR0b24sIHNldEJ1dHRvbkxvYWRpbmcgfSBmcm9tICcuLi91aS9CdXR0b24uanMnO1xuaW1wb3J0IHsgY3JlYXRlSW5wdXQgfSBmcm9tICcuLi91aS9JbnB1dC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVEZW1vQ3JlZGVudGlhbHMgfSBmcm9tICcuL0RlbW9DcmVkZW50aWFscy5qcyc7XG5pbXBvcnQgeyBjcmVhdGVSZW1lbWJlck1lIH0gZnJvbSAnLi9SZW1lbWJlck1lLmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEZhY3RvcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgbG9naW4gZm9ybSBlbGVtZW50IGFuZCBtb3VudHMgaXQgaW50byB0aGUgc3VwcGxpZWQgY29udGFpbmVyLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAgICAgICAgLSBUaGUgRE9NIGVsZW1lbnQgdG8gbW91bnQgdGhlIGZvcm0gaW50b1xuICogQHBhcmFtIHtPYmplY3R9ICAgICAgW29wdHM9e31dICAgICAgICAtIE9wdGlvbnNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259ICAgIFtvcHRzLm9uU3VjY2Vzc10gLSBDYWxsZWQgd2l0aCBgKHVzZXIsIHJlZGlyZWN0UGF0aClgIGFmdGVyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBzdWNjZXNzZnVsIGxvZ2luLiBVc2UgdGhpcyB0byBuYXZpZ2F0ZS5cbiAqIEByZXR1cm5zIHt7IGRlc3Ryb3k6IGZ1bmN0aW9uIH19IENsZWFudXAgaGFuZGxlIFx1MjAxNCBjYWxsIGBkZXN0cm95KClgIG9uIHBhZ2UgdW5tb3VudFxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBmb3JtID0gY3JlYXRlTG9naW5Gb3JtKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dpbi1jb250YWluZXInKSwge1xuICogICBvblN1Y2Nlc3M6ICh1c2VyLCBwYXRoKSA9PiB7XG4gKiAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoO1xuICogICB9LFxuICogfSk7XG4gKiAvLyBPbiBwYWdlIGRlc3Ryb3k6XG4gKiBmb3JtLmRlc3Ryb3koKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvZ2luRm9ybShjb250YWluZXIsIHsgb25TdWNjZXNzIH0gPSB7fSkge1xuICAgIC8vIFx1MjUwMFx1MjUwMCBCdWlsZCBET00gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgICBjb25zdCBmb3JtRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgZm9ybUVsLmlkID0gJ2xvZ2luLWZvcm0nO1xuICAgIGZvcm1FbC5jbGFzc05hbWUgPSAnbG9naW4tZm9ybSc7XG4gICAgZm9ybUVsLnNldEF0dHJpYnV0ZSgnbm92YWxpZGF0ZScsICcnKTsgLy8gdXNlIGN1c3RvbSB2YWxpZGF0aW9uIG1lc3NhZ2VzXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRm9ybSB0aXRsZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gICAgdGl0bGUuY2xhc3NOYW1lID0gJ2xvZ2luLWZvcm1fX3RpdGxlJztcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9ICdTaWduIGluJztcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gICAgY29uc3Qgc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgc3VidGl0bGUuY2xhc3NOYW1lID0gJ2xvZ2luLWZvcm1fX3N1YnRpdGxlJztcbiAgICBzdWJ0aXRsZS50ZXh0Q29udGVudCA9ICdBY2Nlc3MgeW91ciBTdHVkZW50IFByb2dyZXNzIERhc2hib2FyZCc7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKHN1YnRpdGxlKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBFcnJvciBiYW5uZXIgKHRvcC1sZXZlbCwgc2hvd24gZm9yIG5ldHdvcmsgLyBhdXRoIGVycm9ycykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgZXJyb3JCYW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnJvckJhbm5lci5jbGFzc05hbWUgPSAnbG9naW4tZm9ybV9fZXJyb3ItYmFubmVyJztcbiAgICBlcnJvckJhbm5lci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICBlcnJvckJhbm5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdhc3NlcnRpdmUnKTtcbiAgICBlcnJvckJhbm5lci5oaWRkZW4gPSB0cnVlO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZChlcnJvckJhbm5lcik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRW1haWwgZmllbGQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3Qge1xuICAgICAgICB3cmFwcGVyOiBlbWFpbFdyYXBwZXIsXG4gICAgICAgIGlucHV0OiBlbWFpbElucHV0LFxuICAgICAgICBzZXRFcnJvcjogc2V0RW1haWxFcnJvcixcbiAgICB9ID0gY3JlYXRlSW5wdXQoe1xuICAgICAgICBpZDogJ2xvZ2luLWVtYWlsJyxcbiAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgdHlwZTogJ2VtYWlsJyxcbiAgICAgICAgbGFiZWw6ICdFbWFpbCBhZGRyZXNzJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGF1dG9jb21wbGV0ZTogJ2VtYWlsJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZTogKCkgPT4gc2V0RW1haWxFcnJvcihudWxsKSwgLy8gY2xlYXIgZXJyb3Igb24gZXZlcnkga2V5c3Ryb2tlXG4gICAgfSk7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKGVtYWlsV3JhcHBlcik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUGFzc3dvcmQgZmllbGQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3Qge1xuICAgICAgICB3cmFwcGVyOiBwYXNzd29yZFdyYXBwZXIsXG4gICAgICAgIGlucHV0OiBwYXNzd29yZElucHV0LFxuICAgICAgICBzZXRFcnJvcjogc2V0UGFzc3dvcmRFcnJvcixcbiAgICB9ID0gY3JlYXRlSW5wdXQoe1xuICAgICAgICBpZDogJ2xvZ2luLXBhc3N3b3JkJyxcbiAgICAgICAgbmFtZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgbGFiZWw6ICdQYXNzd29yZCcsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnXHUyMDIyXHUyMDIyXHUyMDIyXHUyMDIyXHUyMDIyXHUyMDIyJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGF1dG9jb21wbGV0ZTogJ2N1cnJlbnQtcGFzc3dvcmQnLFxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiAoKSA9PiBzZXRQYXNzd29yZEVycm9yKG51bGwpLFxuICAgIH0pO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZChwYXNzd29yZFdyYXBwZXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFJlbWVtYmVyIG1lIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHJlbWVtYmVyTWUgPSBjcmVhdGVSZW1lbWJlck1lKHsgY2hlY2tlZDogZmFsc2UgfSk7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKHJlbWVtYmVyTWUud3JhcHBlcik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU3VibWl0IGJ1dHRvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBzdWJtaXRCdG4gPSBjcmVhdGVCdXR0b24oe1xuICAgICAgICBpZDogJ2xvZ2luLXN1Ym1pdCcsXG4gICAgICAgIGxhYmVsOiAnU2lnbiBJbicsXG4gICAgICAgIHZhcmlhbnQ6ICdwcmltYXJ5JyxcbiAgICAgICAgc2l6ZTogJ2xnJyxcbiAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgfSk7XG4gICAgc3VibWl0QnRuLmNsYXNzTmFtZSArPSAnIGxvZ2luLWZvcm1fX3N1Ym1pdCc7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKHN1Ym1pdEJ0bik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRGVtbyBjcmVkZW50aWFscyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBkZW1vQmxvY2sgPSBjcmVhdGVEZW1vQ3JlZGVudGlhbHMoe1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIG9uRmlsbDogKHsgZW1haWwsIHBhc3N3b3JkIH0pID0+IHtcbiAgICAgICAgICAgIGVtYWlsSW5wdXQudmFsdWUgPSBlbWFpbDtcbiAgICAgICAgICAgIHBhc3N3b3JkSW5wdXQudmFsdWUgPSBwYXNzd29yZDtcbiAgICAgICAgICAgIHNldEVtYWlsRXJyb3IobnVsbCk7XG4gICAgICAgICAgICBzZXRQYXNzd29yZEVycm9yKG51bGwpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZChkZW1vQmxvY2spO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1vdW50IGludG8gY29udGFpbmVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChmb3JtRWwpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgICAvKiogU2hvd3MgdGhlIHRvcC1sZXZlbCBlcnJvciBiYW5uZXIgd2l0aCBhIG1lc3NhZ2UuICovXG4gICAgZnVuY3Rpb24gc2hvd0Jhbm5lckVycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JCYW5uZXIudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgICAgICBlcnJvckJhbm5lci5oaWRkZW4gPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKiogSGlkZXMgdGhlIGVycm9yIGJhbm5lci4gKi9cbiAgICBmdW5jdGlvbiBjbGVhckJhbm5lckVycm9yKCkge1xuICAgICAgICBlcnJvckJhbm5lci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBlcnJvckJhbm5lci5oaWRkZW4gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTdWJtaXQgaGFuZGxlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlU3VibWl0KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjbGVhckJhbm5lckVycm9yKCk7XG5cbiAgICAgICAgY29uc3QgZW1haWwgPSBlbWFpbElucHV0LnZhbHVlLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBwYXNzd29yZElucHV0LnZhbHVlO1xuICAgICAgICBjb25zdCBzaG91bGRSZW1lbWJlck1lID0gcmVtZW1iZXJNZS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIC8vIFx1MjUwMFx1MjUwMCBDbGllbnQtc2lkZSB2YWxpZGF0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0ZUxvZ2luRm9ybSh7IGVtYWlsLCBwYXNzd29yZCB9KTtcbiAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgaWYgKGVycm9ycy5lbWFpbCkgc2V0RW1haWxFcnJvcihlcnJvcnMuZW1haWwpO1xuICAgICAgICAgICAgaWYgKGVycm9ycy5wYXNzd29yZCkgc2V0UGFzc3dvcmRFcnJvcihlcnJvcnMucGFzc3dvcmQpO1xuICAgICAgICAgICAgLy8gRm9jdXMgdGhlIGZpcnN0IGZpZWxkIHdpdGggYW4gZXJyb3IgZm9yIGtleWJvYXJkIHVzZXJzLlxuICAgICAgICAgICAgaWYgKGVycm9ycy5lbWFpbCkgZW1haWxJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgZWxzZSBpZiAoZXJyb3JzLnBhc3N3b3JkKSBwYXNzd29yZElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICByZXR1cm47IC8vIHN0b3AgXHUyMDE0IGRvIG5vdCBjYWxsIEFQSSB3aXRoIGludmFsaWQgZGF0YVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gXHUyNTAwXHUyNTAwIFN1Ym1pdCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgc2V0QnV0dG9uTG9hZGluZyhzdWJtaXRCdG4sIHRydWUpO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IEF1dGhDb250ZXh0LmxvZ2luKHtcbiAgICAgICAgICAgIGVtYWlsLFxuICAgICAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgICAgICByZW1lbWJlck1lOiBzaG91bGRSZW1lbWJlck1lLFxuICAgICAgICB9KTtcblxuICAgICAgICBzZXRCdXR0b25Mb2FkaW5nKHN1Ym1pdEJ0biwgZmFsc2UpO1xuXG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgLy8gUmV0cmlldmUgYW5kIGNsZWFyIHRoZSBzYXZlZCByZWRpcmVjdCBwYXRoIChjb25zdW1lZCBvbmNlKS5cbiAgICAgICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gZ2V0UmVkaXJlY3RQYXRoKCk7IC8vICcvZGFzaGJvYXJkJyBpZiBub25lIHNhdmVkXG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb25TdWNjZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgb25TdWNjZXNzKHJlc3VsdC51c2VyLCBkZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBEaXNwbGF5IHRoZSBlcnJvciByZXR1cm5lZCBieSBBdXRoQ29udGV4dC5cbiAgICAgICAgICAgIHNob3dCYW5uZXJFcnJvcihyZXN1bHQuZXJyb3IgPz8gJ0xvZ2luIGZhaWxlZC4gUGxlYXNlIHRyeSBhZ2Fpbi4nKTtcbiAgICAgICAgICAgIGVtYWlsSW5wdXQuZm9jdXMoKTsgLy8gcmV0dXJuIGZvY3VzIHRvIGZpcnN0IGZpZWxkXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3JtRWwuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgaGFuZGxlU3VibWl0KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDbGVhbnVwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGZvcm0gZnJvbSB0aGUgRE9NIGFuZCBjbGVhbnMgdXAgZXZlbnQgbGlzdGVuZXJzLlxuICAgICAgICAgKiBDYWxsIHdoZW4gdGhlIExvZ2luUGFnZSBpcyBkZXN0cm95ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGZvcm1FbC5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBoYW5kbGVTdWJtaXQpO1xuICAgICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGZvcm1FbCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgTG9naW5QYWdlIFx1MjAxNCBUb3AtTGV2ZWwgTG9naW4gUGFnZSBcdTIwMTQgUGFydCAzLlxuICpcbiAqIEFzc2VtYmxlcyB0aGUgY29tcGxldGUgbG9naW4gdmlldzpcbiAqICAgXHUyMDIyIEFwcCBsb2dvICsgdGFnbGluZSAobGVmdCAvIHRvcCBwYW5lbClcbiAqICAgXHUyMDIyIExvZ2luRm9ybSAocmlnaHQgLyBib3R0b20gcGFuZWwpXG4gKlxuICogUmVzcG9uc2liaWxpdGllczpcbiAqICAgLSBTZXQgYGRvY3VtZW50LnRpdGxlYCBvbiBtb3VudCAoRlItVVgtMDI5KVxuICogICAtIFJlZGlyZWN0IHRvIC9kYXNoYm9hcmQgaWYgdGhlIHVzZXIgaXMgYWxyZWFkeSBhdXRoZW50aWNhdGVkXG4gKiAgIC0gQ29tcG9zZSBMb2dpbkZvcm0gd2l0aCBhIG5hdmlnYXRpb24gY2FsbGJhY2tcbiAqICAgLSBDbGVhbiB1cCBzdWJzY3JpcHRpb25zIGFuZCBjaGlsZCBjb21wb25lbnRzIG9uIGRlc3Ryb3lcbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgTmF2aWdhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVE9ETyAoUGFydCA0IFx1MjAxNCBSb3V0aW5nKTpcbiAqICAgICBSZXBsYWNlIHRoZSBgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcdTIwMjZgIGNhbGxzIHdpdGggYHJvdXRlci5uYXZpZ2F0ZSgpYC5cbiAqXG4gKiBAbW9kdWxlIHBhZ2VzL0xvZ2luUGFnZVxuICovXG5cbmltcG9ydCB7IGNyZWF0ZUxvZ2luRm9ybSB9IGZyb20gJy4uL2NvbXBvbmVudHMvYXV0aC9Mb2dpbkZvcm0uanMnO1xuaW1wb3J0IEF1dGhDb250ZXh0IGZyb20gJy4uL2NvbnRleHQvQXV0aENvbnRleHQuanMnO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgQ29uc3RhbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBQQUdFX1RJVExFID0gJ1NpZ24gSW4gfCBTdHVkZW50IFByb2dyZXNzIFRyYWNrZXInO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRmFjdG9yeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCBtb3VudHMgdGhlIGxvZ2luIHBhZ2UgaW50byB0aGUgZ2l2ZW4gY29udGFpbmVyLlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIFRoZSByb290IGVsZW1lbnQgdG8gbW91bnQgaW50byAoZS5nLiBgI2FwcGApXG4gKiBAcmV0dXJucyB7eyBkZXN0cm95OiBmdW5jdGlvbiB9fSBDbGVhbnVwIGhhbmRsZVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBwYWdlID0gY3JlYXRlTG9naW5QYWdlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG4gKiAvLyBPbiByb3V0ZSBjaGFuZ2UgLyBwYWdlIGRlc3Ryb3k6XG4gKiBwYWdlLmRlc3Ryb3koKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvZ2luUGFnZShjb250YWluZXIpIHtcbiAgICAvLyBcdTI1MDBcdTI1MDAgR3VhcmQ6IHJlZGlyZWN0IGF1dGhlbnRpY2F0ZWQgdXNlcnMgYXdheSBmcm9tIHRoZSBsb2dpbiBwYWdlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHsgaXNBdXRoZW50aWNhdGVkLCBpc0xvYWRpbmcgfSA9IEF1dGhDb250ZXh0LmdldFN0YXRlKCk7XG5cbiAgICBpZiAoIWlzTG9hZGluZyAmJiBpc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgLy8gVE9ETyAoUGFydCA0IFx1MjAxNCBSb3V0aW5nKTogcm91dGVyLm5hdmlnYXRlKFJPVVRFUy5EQVNIQk9BUkQpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvZGFzaGJvYXJkJztcbiAgICAgICAgLy8gUmV0dXJuIGEgbm8tb3AgZGVzdHJveSBoYW5kbGUgXHUyMDE0IHBhZ2Ugd29uJ3QgYmUgcmVuZGVyZWQuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlc3Ryb3k6ICgpID0+IHt9LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTZXQgZG9jdW1lbnQgdGl0bGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgZG9jdW1lbnQudGl0bGUgPSBQQUdFX1RJVExFO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIHBhZ2Ugc2hlbGwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgcGFnZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGFnZUVsLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlJztcbiAgICBwYWdlRWwuaWQgPSAnbG9naW4tcGFnZSc7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTGVmdCAvIGhlcm8gcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgaGVyb1BhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVyb1BhbmVsLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX19oZXJvJztcbiAgICBoZXJvUGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIGRlY29yYXRpdmUgcGFuZWxcblxuICAgIGNvbnN0IGxvZ29BcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbG9nb0FyZWEuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX2xvZ28tYXJlYSc7XG5cbiAgICAvLyBJbmxpbmUgU1ZHIGxvZ28gXHUyMDE0IHVzZXMgdGhlIGFzc2V0IGF0IHNyYy9hc3NldHMvYXV0aC9sb2dvLnN2Zy5cbiAgICAvLyBMb2FkZWQgYXMgYW4gPGltZz4gd2l0aCBhIG1lYW5pbmdmdWwgYWx0IHNvIGl0IGRlZ3JhZGVzIGdyYWNlZnVsbHkuXG4gICAgY29uc3QgbG9nb0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGxvZ29JbWcuc3JjID0gJy9zcmMvYXNzZXRzL2F1dGgvbG9nby5zdmcnO1xuICAgIGxvZ29JbWcuYWx0ID0gJ1N0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tlciBsb2dvJztcbiAgICBsb2dvSW1nLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX19sb2dvJztcbiAgICBsb2dvSW1nLndpZHRoID0gNDg7XG4gICAgbG9nb0ltZy5oZWlnaHQgPSA0ODtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGxvZ29JbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgLy8gSWYgdGhlIFNWRyBhc3NldCBpcyBtaXNzaW5nLCBmYWxsIGJhY2sgdG8gYSB0ZXh0IGxvZ28uXG4gICAgICAgIGxvZ29JbWcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9O1xuXG4gICAgY29uc3QgYXBwTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBhcHBOYW1lLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX19hcHAtbmFtZSc7XG4gICAgYXBwTmFtZS50ZXh0Q29udGVudCA9ICdTdHVkZW50IFByb2dyZXNzIFRyYWNrZXInO1xuXG4gICAgbG9nb0FyZWEuYXBwZW5kQ2hpbGQobG9nb0ltZyk7XG4gICAgbG9nb0FyZWEuYXBwZW5kQ2hpbGQoYXBwTmFtZSk7XG5cbiAgICBjb25zdCBoZXJvVGFnbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBoZXJvVGFnbGluZS5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9fdGFnbGluZSc7XG4gICAgaGVyb1RhZ2xpbmUudGV4dENvbnRlbnQgPSAnVHJhY2sgeW91ciBsZWFybmluZyBqb3VybmV5LCBvbmUgY291cnNlIGF0IGEgdGltZS4nO1xuXG4gICAgLy8gTG9naW4gaWxsdXN0cmF0aW9uXG4gICAgY29uc3QgaWxsdXN0cmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaWxsdXN0cmF0aW9uLnNyYyA9ICcvc3JjL2Fzc2V0cy9hdXRoL2xvZ2luLnN2Zyc7XG4gICAgaWxsdXN0cmF0aW9uLmFsdCA9ICcnOyAvLyBkZWNvcmF0aXZlIFx1MjAxNCBoaWRkZW4gZnJvbSBzY3JlZW4gcmVhZGVyc1xuICAgIGlsbHVzdHJhdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBpbGx1c3RyYXRpb24uY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX2lsbHVzdHJhdGlvbic7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBpbGx1c3RyYXRpb24ub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgaWxsdXN0cmF0aW9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfTtcblxuICAgIGhlcm9QYW5lbC5hcHBlbmRDaGlsZChsb2dvQXJlYSk7XG4gICAgaGVyb1BhbmVsLmFwcGVuZENoaWxkKGhlcm9UYWdsaW5lKTtcbiAgICBoZXJvUGFuZWwuYXBwZW5kQ2hpbGQoaWxsdXN0cmF0aW9uKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBSaWdodCAvIGZvcm0gcGFuZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgZm9ybVBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9ybVBhbmVsLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX19mb3JtLXBhbmVsJztcblxuICAgIGNvbnN0IGZvcm1DYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZm9ybUNhcmQuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX2Zvcm0tY2FyZCc7XG5cbiAgICBmb3JtUGFuZWwuYXBwZW5kQ2hpbGQoZm9ybUNhcmQpO1xuXG4gICAgcGFnZUVsLmFwcGVuZENoaWxkKGhlcm9QYW5lbCk7XG4gICAgcGFnZUVsLmFwcGVuZENoaWxkKGZvcm1QYW5lbCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBhZ2VFbCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTW91bnQgTG9naW5Gb3JtIGludG8gdGhlIGNhcmQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgbG9naW5Gb3JtSGFuZGxlID0gY3JlYXRlTG9naW5Gb3JtKGZvcm1DYXJkLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgb25TdWNjZXNzOiAoX3VzZXIsIGRlc3RpbmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPIChQYXJ0IDQgXHUyMDE0IFJvdXRpbmcpOiByb3V0ZXIubmF2aWdhdGUoZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTdWJzY3JpYmUgdG8gQXV0aENvbnRleHQgdG8gaGFuZGxlIG1pZC1zZXNzaW9uIGF1dGggY2hhbmdlcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAvL1xuICAgIC8vIElmIHRoZSB1c2VyIHNvbWVob3cgYmVjb21lcyBhdXRoZW50aWNhdGVkIHdoaWxlIG9uIHRoZSBsb2dpbiBwYWdlXG4gICAgLy8gKGUuZy4gdmlhIGFub3RoZXIgdGFiKSwgcmVkaXJlY3QgdGhlbSBhd2F5LlxuICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gQXV0aENvbnRleHQuc3Vic2NyaWJlKCh7IGlzQXV0aGVudGljYXRlZDogYXV0aGVkIH0pID0+IHtcbiAgICAgICAgaWYgKGF1dGhlZCkge1xuICAgICAgICAgICAgLy8gVE9ETyAoUGFydCA0IFx1MjAxNCBSb3V0aW5nKTogcm91dGVyLm5hdmlnYXRlKFJPVVRFUy5EQVNIQk9BUkQpO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2Rhc2hib2FyZCc7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDbGVhbnVwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRlYXJzIGRvd24gdGhlIGxvZ2luIHBhZ2UsIHJlbW92aW5nIERPTSBlbGVtZW50cyBhbmQgc3Vic2NyaXB0aW9ucy5cbiAgICAgICAgICogQ2FsbCB0aGlzIHdoZW4gdGhlIHJvdXRlciBuYXZpZ2F0ZXMgYXdheSBmcm9tIHRoZSBsb2dpbiByb3V0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgdW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGxvZ2luRm9ybUhhbmRsZS5kZXN0cm95KCk7XG4gICAgICAgICAgICBpZiAoY29udGFpbmVyLmNvbnRhaW5zKHBhZ2VFbCkpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQocGFnZUVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlc2V0IHRpdGxlIHRvIHRoZSBhcHAgZGVmYXVsdC5cbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gJ1N0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tlcic7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlTG9naW5QYWdlO1xuIiwgImV4cG9ydCBjb25zdCBBTklNQVRJT05fQ0xBU1NFUyA9IHtcbiAgICBmYWRlSW46ICdhbmltLWZhZGUtaW4nLFxuICAgIHNsaWRlVXA6ICdhbmltLXNsaWRlLXVwJyxcbiAgICBzbGlkZURvd246ICdhbmltLXNsaWRlLWRvd24nLFxuICAgIHNsaWRlSW5SaWdodDogJ2FuaW0tc2xpZGUtaW4tcmlnaHQnLFxuICAgIHNsaWRlSW5MZWZ0OiAnYW5pbS1zbGlkZS1pbi1sZWZ0JyxcbiAgICBzY2FsZUluOiAnYW5pbS1zY2FsZS1pbicsXG4gICAgcHVsc2U6ICdhbmltLXB1bHNlJyxcbiAgICBzaGltbWVyOiAnc2tlbGV0b24tc2hpbW1lcicsXG59O1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlKGVsLCBhbmltYXRpb24sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgZHVyYXRpb24gPSAzMDAsIGRlbGF5ID0gMCwgb25FbmQgfSA9IG9wdGlvbnM7XG5cbiAgICBlbC5jbGFzc0xpc3QuYWRkKGFuaW1hdGlvbik7XG5cbiAgICBpZiAoZHVyYXRpb24gIT09IDMwMCkgZWwuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSBgJHtkdXJhdGlvbn1tc2A7XG4gICAgaWYgKGRlbGF5ID4gMCkgZWwuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSBgJHtkZWxheX1tc2A7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0IGhhbmRsZXIgPSBlID0+IHtcbiAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShhbmltYXRpb24pO1xuICAgICAgICBlbC5zdHlsZS5hbmltYXRpb25EdXJhdGlvbiA9ICcnO1xuICAgICAgICBlbC5zdHlsZS5hbmltYXRpb25EZWxheSA9ICcnO1xuICAgICAgICBpZiAob25FbmQpIG9uRW5kKGUpO1xuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBoYW5kbGVyKTtcbiAgICB9O1xuXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgaGFuZGxlciwgeyBvbmNlOiB0cnVlIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFnZ2VyKGVsLCBhbmltYXRpb24sIHsgc3RhZ2dlckRlbGF5ID0gNTAsIC4uLnJlc3QgfSA9IHt9KSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGVsLmNoaWxkcmVuKTtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICBhbmltYXRlKGNoaWxkLCBhbmltYXRpb24sIHsgZGVsYXk6IGkgKiBzdGFnZ2VyRGVsYXksIC4uLnJlc3QgfSk7XG4gICAgfSk7XG59XG5cbmxldCBwcmVmZXJzUmVkdWNlZE1vdGlvbiA9IGZhbHNlO1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0TW90aW9uUHJlZmVyZW5jZXMoKSB7XG4gICAgY29uc3QgbXEgPSB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKTtcbiAgICBwcmVmZXJzUmVkdWNlZE1vdGlvbiA9IG1xLm1hdGNoZXM7XG5cbiAgICBtcS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBlID0+IHtcbiAgICAgICAgcHJlZmVyc1JlZHVjZWRNb3Rpb24gPSBlLm1hdGNoZXM7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdyZWR1Y2VkLW1vdGlvbicsIGUubWF0Y2hlcyk7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgncmVkdWNlZC1tb3Rpb24nLCBwcmVmZXJzUmVkdWNlZE1vdGlvbik7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZEFuaW1hdGUoKSB7XG4gICAgcmV0dXJuICFwcmVmZXJzUmVkdWNlZE1vdGlvbjtcbn1cbiIsICJjb25zdCBzY3JvbGxQb3NpdGlvbnMgPSBuZXcgTWFwKCk7XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURvY3VtZW50VGl0bGUodGl0bGUsIHN1ZmZpeCA9ICdTdHVkZW50IFByb2dyZXNzIFRyYWNrZXInKSB7XG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZSA/IGAke3RpdGxlfSBcdTIwMTQgJHtzdWZmaXh9YCA6IHN1ZmZpeDtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVNjcm9sbFBvc2l0aW9uKGtleSkge1xuICAgIHNjcm9sbFBvc2l0aW9ucy5zZXQoa2V5LCB3aW5kb3cuc2Nyb2xsWSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc3RvcmVTY3JvbGxQb3NpdGlvbihrZXksIHsgZmFsbGJhY2sgPSAwIH0gPSB7fSkge1xuICAgIGNvbnN0IHBvcyA9IHNjcm9sbFBvc2l0aW9ucy5oYXMoa2V5KSA/IHNjcm9sbFBvc2l0aW9ucy5nZXQoa2V5KSA6IGZhbGxiYWNrO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogcG9zLCBiZWhhdmlvcjogJ2luc3RhbnQnIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0U2Nyb2xsUmVzdG9yYXRpb24oKSB7XG4gICAgaWYgKCdzY3JvbGxSZXN0b3JhdGlvbicgaW4gd2luZG93Lmhpc3RvcnkpIHtcbiAgICAgICAgd2luZG93Lmhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSAnbWFudWFsJztcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgKCkgPT4ge1xuICAgICAgICBzYXZlU2Nyb2xsUG9zaXRpb24od2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG9FbGVtZW50KHNlbGVjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGJlaGF2aW9yID0gJ3Ntb290aCcsIG9mZnNldCA9IDAgfSA9IG9wdGlvbnM7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICBjb25zdCB0b3AgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB3aW5kb3cuc2Nyb2xsWSAtIG9mZnNldDtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcCwgYmVoYXZpb3IgfSk7XG4gICAgICAgICAgICBlbC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG9Ub3Aob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBiZWhhdmlvciA9ICdzbW9vdGgnIH0gPSBvcHRpb25zO1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3IgfSk7XG59XG4iLCAiaW1wb3J0ICcuL3N0eWxlcy9tYWluLmNzcyc7XG5pbXBvcnQgeyBjcmVhdGVFbXB0eVN0YXRlIH0gZnJvbSAnLi9jb21wb25lbnRzL0VtcHR5U3RhdGUuanMnO1xuaW1wb3J0IHsgd2l0aEVycm9yQm91bmRhcnkgfSBmcm9tICcuL2NvbXBvbmVudHMvRXJyb3JCb3VuZGFyeS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2FkaW5nU3Bpbm5lciB9IGZyb20gJy4vY29tcG9uZW50cy9Mb2FkaW5nU3Bpbm5lci5qcyc7XG5pbXBvcnQgeyBjcmVhdGVNb2RhbCB9IGZyb20gJy4vY29tcG9uZW50cy9Nb2RhbC5qcyc7XG5pbXBvcnQgeyByZW5kZXJTa2VsZXRvbiwgcmVtb3ZlU2tlbGV0b25zIH0gZnJvbSAnLi9jb21wb25lbnRzL1NrZWxldG9uTG9hZGVyLmpzJztcbmltcG9ydCB7IHNob3dFcnJvciwgc2hvd0luZm8gfSBmcm9tICcuL2NvbXBvbmVudHMvVG9hc3QuanMnO1xuaW1wb3J0IHsgY3JlYXRlVG9vbHRpcCB9IGZyb20gJy4vY29tcG9uZW50cy9Ub29sdGlwLmpzJztcbmltcG9ydCBBdXRoQ29udGV4dCBmcm9tICcuL2NvbnRleHQvQXV0aENvbnRleHQuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9naW5QYWdlIH0gZnJvbSAnLi9wYWdlcy9Mb2dpblBhZ2UuanMnO1xuaW1wb3J0IHsgaW5pdEFwaSB9IGZyb20gJy4vc2VydmljZXMvYXBpLmpzJztcbmltcG9ydCB7IGluaXRNb3Rpb25QcmVmZXJlbmNlcyB9IGZyb20gJy4vdXRpbHMvYW5pbWF0aW9ucy5qcyc7XG5pbXBvcnQgeyBoYW5kbGVHbG9iYWxFcnJvcnMgfSBmcm9tICcuL3V0aWxzL2Vycm9ycy5qcyc7XG5pbXBvcnQgeyBpbml0U2Nyb2xsUmVzdG9yYXRpb24sIHVwZGF0ZURvY3VtZW50VGl0bGUgfSBmcm9tICcuL3V0aWxzL3JvdXRlci5qcyc7XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gd2lyZUdsb2JhbEVycm9ySGFuZGxlcigpIHtcbiAgICBoYW5kbGVHbG9iYWxFcnJvcnMoZXJyb3IgPT4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyb3I/Lm1lc3NhZ2UgfHwgZXJyb3I/LnJlYXNvbj8ubWVzc2FnZSB8fCAnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4nO1xuICAgICAgICBzaG93RXJyb3IoJ0Vycm9yJywgbWVzc2FnZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gd2lyZU5ldHdvcmtEZXRlY3Rpb24oKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29mZmxpbmUnLCAoKSA9PiB7XG4gICAgICAgIHNob3dJbmZvKCdPZmZsaW5lJywgJ1lvdSBhcmUgY3VycmVudGx5IG9mZmxpbmUuIFNvbWUgZmVhdHVyZXMgbWF5IGJlIHVuYXZhaWxhYmxlLicpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvbmxpbmUnLCAoKSA9PiB7XG4gICAgICAgIHNob3dJbmZvKCdCYWNrIE9ubGluZScsICdZb3VyIGludGVybmV0IGNvbm5lY3Rpb24gaGFzIGJlZW4gcmVzdG9yZWQuJyk7XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gd2lyZUVycm9yQm91bmRhcnkoKSB7XG4gICAgY29uc3QgcGFnZUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYWdlLWNvbnRlbnRdJyk7XG4gICAgaWYgKCFwYWdlQ29udGVudCkgcmV0dXJuO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGF0aHdheTpyb3V0ZScsICgpID0+IHtcbiAgICAgICAgd2luZG93Ll9wYWdlQ29udGVudCA9IHBhZ2VDb250ZW50O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICB3aW5kb3cuX3Nob3dFcnJvckJvdW5kYXJ5ID0gKHsgdGl0bGUsIG1lc3NhZ2UsIG9uUmV0cnkgfSA9IHt9KSA9PiB7XG4gICAgICAgIHdpdGhFcnJvckJvdW5kYXJ5KHBhZ2VDb250ZW50LCB7IHRpdGxlLCBtZXNzYWdlLCBvblJldHJ5IH0pO1xuICAgIH07XG59XG5cbmxldCBsb2dpblBhZ2VJbnN0YW5jZSA9IG51bGw7XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gc2hvd0xvZ2luVmlldygpIHtcbiAgICBpZiAobG9naW5QYWdlSW5zdGFuY2UpIHJldHVybjtcbiAgICBjb25zdCBhdXRoUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXJvb3QnKTtcbiAgICBpZiAoIWF1dGhSb290KSByZXR1cm47XG4gICAgY29uc3QgYXBwU2hlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXBwLXNoZWxsJyk7XG4gICAgaWYgKGFwcFNoZWxsKSBhcHBTaGVsbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGF1dGhSb290LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICBsb2dpblBhZ2VJbnN0YW5jZSA9IGNyZWF0ZUxvZ2luUGFnZShhdXRoUm9vdCk7XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gc2hvd0FwcFZpZXcoKSB7XG4gICAgaWYgKGxvZ2luUGFnZUluc3RhbmNlKSB7XG4gICAgICAgIGxvZ2luUGFnZUluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICAgICAgbG9naW5QYWdlSW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgICBjb25zdCBhdXRoUm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXJvb3QnKTtcbiAgICBpZiAoYXV0aFJvb3QpIGF1dGhSb290LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgY29uc3QgYXBwU2hlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXBwLXNoZWxsJyk7XG4gICAgaWYgKGFwcFNoZWxsKSB7XG4gICAgICAgIGFwcFNoZWxsLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgaWYgKHdpbmRvdy5sdWNpZGUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sdWNpZGUuY3JlYXRlSWNvbnMoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiB3aXJlQXV0aCgpIHtcbiAgICBBdXRoQ29udGV4dC5zdWJzY3JpYmUoKHsgaXNBdXRoZW50aWNhdGVkLCBpc0xvYWRpbmcgfSkgPT4ge1xuICAgICAgICBpZiAoaXNMb2FkaW5nKSByZXR1cm47XG4gICAgICAgIGlmIChpc0F1dGhlbnRpY2F0ZWQpIHNob3dBcHBWaWV3KCk7XG4gICAgICAgIGVsc2Ugc2hvd0xvZ2luVmlldygpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc2lnbk91dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9maWxlLWRyb3Bkb3duLWl0ZW0tLWRhbmdlcicpO1xuICAgIGlmIChzaWduT3V0QnRuKSB7XG4gICAgICAgIHNpZ25PdXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBBdXRoQ29udGV4dC5sb2dvdXQoKTtcbiAgICAgICAgICAgIHNob3dJbmZvKCdTaWduZWQgT3V0JywgJ1lvdSBoYXZlIGJlZW4gc2lnbmVkIG91dCBzdWNjZXNzZnVsbHkuJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiB3aXJlTG9hZGluZ1N0YXRlcygpIHtcbiAgICBjb25zdCBwYWdlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2UtY29udGVudF0nKTtcbiAgICBpZiAoIXBhZ2VDb250ZW50KSByZXR1cm47XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXRod2F5OnJvdXRlJywgKCkgPT4ge1xuICAgICAgICByZW5kZXJTa2VsZXRvbihwYWdlQ29udGVudCwgJ2NhcmQnLCAzKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgd2luZG93Ll9yZW1vdmVQYWdlU2tlbGV0b25zID0gKCkgPT4ge1xuICAgICAgICByZW1vdmVTa2VsZXRvbnMocGFnZUNvbnRlbnQpO1xuICAgIH07XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gd2lyZVRvb2x0aXBzKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pY29uLWJ1dHRvbiwgLm5hdi1saW5rLCAuYWN0aW9uLWJ0bi1jaXJjbGUnKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgY29uc3QgbGFiZWwgPVxuICAgICAgICAgICAgZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykgfHwgZWwucXVlcnlTZWxlY3RvcignLm5hdi1sYWJlbCcpPy50ZXh0Q29udGVudD8udHJpbSgpO1xuICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICAgIGNyZWF0ZVRvb2x0aXAoZWwsIHsgY29udGVudDogbGFiZWwsIHBvc2l0aW9uOiAnYm90dG9tJyB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVBcHBJbnRlcmFjdGlvbnMoKSB7XG4gICAgY29uc3QgcGFnZUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYWdlLWNvbnRlbnRdJyk7XG4gICAgaWYgKCFwYWdlQ29udGVudCkgcmV0dXJuO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGF0aHdheTpyb3V0ZScsICgpID0+IHtcbiAgICAgICAgaWYgKCFwYWdlQ29udGVudC5xdWVyeVNlbGVjdG9yKCcucm91dGUtcGxhY2Vob2xkZXIsIC5zZXR0aW5ncy1wYWdlJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICB3aW5kb3cuX3Nob3dFbXB0eVN0YXRlID0gb3B0cyA9PiB7XG4gICAgICAgIGNvbnN0IGVtcHR5RWwgPSBjcmVhdGVFbXB0eVN0YXRlKG9wdHMpO1xuICAgICAgICBwYWdlQ29udGVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgcGFnZUNvbnRlbnQuYXBwZW5kQ2hpbGQoZW1wdHlFbCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgd2luZG93Ll9zaG93TW9kYWwgPSBvcHRzID0+IHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZU1vZGFsKG9wdHMpO1xuICAgIH07XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1ub3RpZmljYXRpb24tY2xlYXJdJyk/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBjcmVhdGVNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ0NsZWFyIE5vdGlmaWNhdGlvbnMnLFxuICAgICAgICAgICAgYm9keTogJ01hcmsgYWxsIG5vdGlmaWNhdGlvbnMgYXMgcmVhZD8nLFxuICAgICAgICAgICAgZm9vdGVyOiAnPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tLXByaW1hcnlcIiBkYXRhLWNvbmZpcm0tY2xlYXI+Q2xlYXIgYWxsPC9idXR0b24+JyxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb25DbG9zZTogKCkgPT4ge30sXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgaW5pdE1vdGlvblByZWZlcmVuY2VzKCk7XG4gICAgaW5pdFNjcm9sbFJlc3RvcmF0aW9uKCk7XG4gICAgdXBkYXRlRG9jdW1lbnRUaXRsZSgpO1xuICAgIHdpcmVHbG9iYWxFcnJvckhhbmRsZXIoKTtcbiAgICB3aXJlTmV0d29ya0RldGVjdGlvbigpO1xuICAgIHdpcmVFcnJvckJvdW5kYXJ5KCk7XG4gICAgd2lyZUF1dGgoKTtcbiAgICB3aXJlTG9hZGluZ1N0YXRlcygpO1xuICAgIHdpcmVUb29sdGlwcygpO1xuICAgIHdpcmVBcHBJbnRlcmFjdGlvbnMoKTtcblxuICAgIGNvbnN0IHNwaW5uZXIgPSBjcmVhdGVMb2FkaW5nU3Bpbm5lcih7IHNpemU6ICdsZycsIGxhYmVsOiAnTG9hZGluZyBhcHBsaWNhdGlvbi4uLicgfSk7XG4gICAgc3Bpbm5lci5zdHlsZS5jc3NUZXh0ID1cbiAgICAgICAgJ3Bvc2l0aW9uOmZpeGVkO3RvcDo1MCU7bGVmdDo1MCU7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO3otaW5kZXg6MTAwMDsnO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3Bpbm5lcik7XG5cbiAgICBhd2FpdCBBdXRoQ29udGV4dC5yZXN0b3JlU2Vzc2lvbigpO1xuICAgIGF3YWl0IGluaXRBcGkoKTtcblxuICAgIGlmIChzcGlubmVyLnBhcmVudE5vZGUpIHNwaW5uZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzcGlubmVyKTtcblxuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcHAtc2hlbGwnKTtcbiAgICBpZiAoYXBwKSBhcHAuY2xhc3NMaXN0LmFkZCgnYXBwLS1yZWFkeScpO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdCk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF1RkEsU0FBUyxNQUFNLElBQUk7QUFDZixTQUFPLElBQUksUUFBUSxhQUFXLFdBQVcsU0FBUyxFQUFFLENBQUM7QUFDekQ7QUFLQSxlQUFlLFlBQVksS0FBSyxTQUFTO0FBQ3JDLFFBQU0sTUFBTSxHQUFHO0FBQ2YsUUFBTSxPQUFPLEtBQUssTUFBTSxRQUFRLFFBQVEsSUFBSTtBQUU1QyxNQUFJLEtBQUssVUFBVSxzQkFBc0IsS0FBSyxhQUFhLFdBQVc7QUFDbEUsV0FBTyxJQUFJO0FBQUEsTUFDUCxLQUFLLFVBQVU7QUFBQSxRQUNYLE9BQU8sb0JBQW9CLEtBQUssSUFBSTtBQUFBLFFBQ3BDLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLElBQU8sRUFBRSxZQUFZO0FBQUEsUUFDdEQsTUFBTTtBQUFBLFVBQ0YsSUFBSTtBQUFBLFVBQ0osTUFBTTtBQUFBLFVBQ04sT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFFBQ1Y7QUFBQSxNQUNKLENBQUM7QUFBQSxNQUNELEVBQUUsUUFBUSxLQUFLLFNBQVMsRUFBRSxnQkFBZ0IsbUJBQW1CLEVBQUU7QUFBQSxJQUNuRTtBQUFBLEVBQ0o7QUFFQSxTQUFPLElBQUksU0FBUyxLQUFLLFVBQVUsRUFBRSxTQUFTLHNCQUFzQixDQUFDLEdBQUc7QUFBQSxJQUNwRSxRQUFRO0FBQUEs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RUFDSixDQUFDO0FBS0QsU0FBTyxrQkFBa0IsVUFBUTtBQUM3QixVQUFNLFVBQVUsaUJBQWlCLElBQUk7QUFDckMsZ0JBQVksWUFBWTtBQUN4QixnQkFBWSxZQUFZLE9BQU87QUFBQSxFQUNuQztBQUtBLFNBQU8sYUFBYSxVQUFRO0FBQ3hCLFdBQU8sWUFBWSxJQUFJO0FBQUEsRUFDM0I7QUFFQSxXQUFTLGNBQWMsMkJBQTJCLEdBQUcsaUJBQWlCLFNBQVMsTUFBTTtBQUNqRixnQkFBWTtBQUFBLE1BQ1IsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSVIsU0FBUyxNQUFNO0FBQUEsTUFBQztBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQUtBLGVBQWUsT0FBTztBQUNsQix3QkFBc0I7QUFDdEIsd0JBQXNCO0FBQ3RCLHNCQUFvQjtBQUNwQix5QkFBdUI7QUFDdkIsdUJBQXFCO0FBQ3JCLG9CQUFrQjtBQUNsQixXQUFTO0FBQ1Qsb0JBQWtCO0FBQ2xCLGVBQWE7QUFDYixzQkFBb0I7QUFFcEIsUUFBTSxVQUFVLHFCQUFxQixFQUFFLE1BQU0sTUFBTSxPQUFPLHlCQUF5QixDQUFDO0FBQ3BGLFVBQVEsTUFBTSxVQUNWO0FBQ0osV0FBUyxLQUFLLFlBQVksT0FBTztBQUVqQyxRQUFNLG9CQUFZLGVBQWU7QUFDakMsUUFBTSxRQUFRO0FBRWQsTUFBSSxRQUFRLFdBQVksU0FBUSxXQUFXLFlBQVksT0FBTztBQUU5RCxRQUFNLE1BQU0sU0FBUyxjQUFjLFlBQVk7QUFDL0MsTUFBSSxJQUFLLEtBQUksVUFBVSxJQUFJLFlBQVk7QUFDM0M7QUFFQSxTQUFTLGlCQUFpQixvQkFBb0IsSUFBSTsiLAogICJuYW1lcyI6IFsiY29udGFpbmVyIiwgImNvbnRhaW5lciIsICJjb250YWluZXIiLCAiY29udGFpbmVyIiwgImRlbGF5IiwgImNvbmZpZyIsICJzZXR1cE1vY2tTZXJ2ZXIiLCAiZGVsYXkiLCAibG9naW4iLCAiY29udGFpbmVyIiwgImNvbnRhaW5lciJdCn0K
