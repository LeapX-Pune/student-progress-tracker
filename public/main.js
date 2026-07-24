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
    if (appShell) appShell.style.display = '';
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NlcnZpY2VzL21vY2suanMiLCAiLi4vc3JjL2NvbXBvbmVudHMvRW1wdHlTdGF0ZS5qcyIsICIuLi9zcmMvY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL0xvYWRpbmdTcGlubmVyLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL01vZGFsLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1NrZWxldG9uTG9hZGVyLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1RvYXN0LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1Rvb2x0aXAuanMiLCAiLi4vc3JjL2NvbmZpZy9lbnYuanMiLCAiLi4vc3JjL3V0aWxzL2NvbnN0YW50cy5qcyIsICIuLi9zcmMvdXRpbHMvZW52LmpzIiwgIi4uL3NyYy91dGlscy9lcnJvcnMuanMiLCAiLi4vc3JjL3NlcnZpY2VzL2F1dGhTdG9yYWdlLmpzIiwgIi4uL3NyYy9zZXJ2aWNlcy9hcGkuanMiLCAiLi4vc3JjL3NlcnZpY2VzL2F1dGhBcGkuanMiLCAiLi4vc3JjL3V0aWxzL2F1dGhIZWxwZXJzLmpzIiwgIi4uL3NyYy9jb250ZXh0L0F1dGhDb250ZXh0LmpzIiwgIi4uL3NyYy91dGlscy92YWxpZGF0aW9uLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL1NwaW5uZXIuanMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdWkvQnV0dG9uLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL0lucHV0LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL2F1dGgvRGVtb0NyZWRlbnRpYWxzLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL0NoZWNrYm94LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL2F1dGgvUmVtZW1iZXJNZS5qcyIsICIuLi9zcmMvY29tcG9uZW50cy9hdXRoL0xvZ2luRm9ybS5qcyIsICIuLi9zcmMvcGFnZXMvTG9naW5QYWdlLmpzIiwgIi4uL3NyYy91dGlscy9hbmltYXRpb25zLmpzIiwgIi4uL3NyYy91dGlscy9yb3V0ZXIuanMiLCAiLi4vc3JjL21haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IG1vY2tTdHVkZW50ID0ge1xuICAgIGlkOiAnc3R1XzAwMScsXG4gICAgbmFtZTogJ0FsZXggSm9obnNvbicsXG4gICAgZW1haWw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICBhdmF0YXJVcmw6ICdodHRwczovL2kucHJhdmF0YXIuY2MvMTUwP3U9c3R1XzAwMScsXG4gICAgc3R1ZGVudElkOiAnU1RVLTIwMjQtMDAxJyxcbiAgICBlbnJvbGxlZEF0OiAnMjAyNC0wMS0xNVQwMDowMDowMC4wMDBaJyxcbiAgICBjdXJyZW50U3RyZWFrOiA1LFxuICAgIGxhc3RBY3RpdmVBdDogJzIwMjQtMDMtMjBUMTA6MzA6MDAuMDAwWicsXG59O1xuXG5jb25zdCBtb2NrQ291cnNlcyA9IFtcbiAgICB7XG4gICAgICAgIGlkOiAnY3JzXzAwMScsXG4gICAgICAgIHN0dWRlbnRJZDogJ3N0dV8wMDEnLFxuICAgICAgICB0aXRsZTogJ0FkdmFuY2VkIE1hdGhlbWF0aWNzJyxcbiAgICAgICAgaW5zdHJ1Y3RvcjogJ0RyLiBTbWl0aCcsXG4gICAgICAgIHRodW1ibmFpbFVybDogJ2h0dHBzOi8vcGljc3VtLnBob3Rvcy9zZWVkL21hdGgvNDAwLzIyNScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQWR2YW5jZWQgdG9waWNzIGluIGNhbGN1bHVzLCBsaW5lYXIgYWxnZWJyYSwgYW5kIHN0YXRpc3RpY3MnLFxuICAgICAgICB0b3RhbE1vZHVsZXM6IDEyLFxuICAgICAgICBjb21wbGV0ZWRNb2R1bGVzOiA4LFxuICAgICAgICBzdGF0dXM6ICdpbi1wcm9ncmVzcycsXG4gICAgICAgIGN1cnJlbnRHcmFkZTogODgsXG4gICAgICAgIHRlcm06ICdTcHJpbmcgMjAyNCcsXG4gICAgICAgIGxhc3RBY2Nlc3NlZEF0OiAnMjAyNC0wMy0xOVQxNDozMDowMC4wMDBaJyxcbiAgICAgICAgbmV4dE1vZHVsZTogJ01vZHVsZSA5OiBEaWZmZXJlbnRpYWwgRXF1YXRpb25zJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6ICdjcnNfMDAyJyxcbiAgICAgICAgc3R1ZGVudElkOiAnc3R1XzAwMScsXG4gICAgICAgIHRpdGxlOiAnQ29tcHV0ZXIgU2NpZW5jZSBGdW5kYW1lbnRhbHMnLFxuICAgICAgICBpbnN0cnVjdG9yOiAnUHJvZi4gRGF2aXMnLFxuICAgICAgICB0aHVtYm5haWxVcmw6ICdodHRwczovL3BpY3N1bS5waG90b3Mvc2VlZC9jcy80MDAvMjI1JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdEYXRhIHN0cnVjdHVyZXMsIGFsZ29yaXRobXMsIGFuZCBzb2Z0d2FyZSBkZXNpZ24gcGF0dGVybnMnLFxuICAgICAgICB0b3RhbE1vZHVsZXM6IDEwLFxuICAgICAgICBjb21wbGV0ZWRNb2R1bGVzOiAxMCxcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudEdyYWRlOiA5NCxcbiAgICAgICAgdGVybTogJ1NwcmluZyAyMDI0JyxcbiAgICAgICAgbGFzdEFjY2Vzc2VkQXQ6ICcyMDI0LTAzLTE4VDA5OjE1OjAwLjAwMFonLFxuICAgICAgICBuZXh0TW9kdWxlOiBudWxsLFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDogJ2Nyc18wMDMnLFxuICAgICAgICBzdHVkZW50SWQ6ICdzdHVfMDAxJyxcbiAgICAgICAgdGl0bGU6ICdQaHlzaWNzIElJOiBFbGVjdHJvbWFnbmV0aXNtJyxcbiAgICAgICAgaW5zdHJ1Y3RvcjogJ0RyLiBXaWxzb24nLFxuICAgICAgICB0aHVtYm5haWxVcmw6ICdodHRwczovL3BpY3N1bS5waG90b3Mvc2VlZC9waHlzaWNzLzQwMC8yMjUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0VsZWN0cm9tYWduZXRpYyB0aGVvcnksIGNpcmN1aXRzLCBhbmQgd2F2ZSBwcm9wYWdhdGlvbicsXG4gICAgICAgIHRvdGFsTW9kdWxlczogMTQsXG4gICAgICAgIGNvbXBsZXRlZE1vZHVsZXM6IDUsXG4gICAgICAgIHN0YXR1czogJ2luLXByb2dyZXNzJyxcbiAgICAgICAgY3VycmVudEdyYWRlOiA3NixcbiAgICAgICAgdGVybTogJ1NwcmluZyAyMDI0JyxcbiAgICAgICAgbGFzdEFjY2Vzc2VkQXQ6ICcyMDI0LTAzLTE3VDExOjAwOjAwLjAwMFonLFxuICAgICAgICBuZXh0TW9kdWxlOiAnTW9kdWxlIDY6IEVsZWN0cmljIFBvdGVudGlhbCcsXG4gICAgfSxcbl07XG5cbmNvbnN0IG1vY2tHcmFkZXMgPSB7XG4gICAgcXVpelNjb3JlczogW1xuICAgICAgICB7IGxhYmVsOiAnUXVpeiAxJywgc2NvcmU6IDg1LCBtYXhTY29yZTogMTAwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdRdWl6IDInLCBzY29yZTogOTIsIG1heFNjb3JlOiAxMDAgfSxcbiAgICAgICAgeyBsYWJlbDogJ1F1aXogMycsIHNjb3JlOiA3OCwgbWF4U2NvcmU6IDEwMCB9LFxuICAgICAgICB7IGxhYmVsOiAnUXVpeiA0Jywgc2NvcmU6IDk1LCBtYXhTY29yZTogMTAwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdRdWl6IDUnLCBzY29yZTogODgsIG1heFNjb3JlOiAxMDAgfSxcbiAgICBdLFxuICAgIGdyYWRlRGlzdHJpYnV0aW9uOiBbXG4gICAgICAgIHsgbGFiZWw6ICdBJywgcGVyY2VudGFnZTogMjUgfSxcbiAgICAgICAgeyBsYWJlbDogJ0InLCBwZXJjZW50YWdlOiA0MCB9LFxuICAgICAgICB7IGxhYmVsOiAnQycsIHBlcmNlbnRhZ2U6IDIwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdEJywgcGVyY2VudGFnZTogMTAgfSxcbiAgICAgICAgeyBsYWJlbDogJ0YnLCBwZXJjZW50YWdlOiA1IH0sXG4gICAgXSxcbiAgICB3ZWVrbHlQcm9ncmVzczogW1xuICAgICAgICB7IHdlZWs6ICdXZWVrIDEnLCBjb21wbGV0ZWQ6IDMsIHRvdGFsOiAzIH0sXG4gICAgICAgIHsgd2VlazogJ1dlZWsgMicsIGNvbXBsZXRlZDogMiwgdG90YWw6IDMgfSxcbiAgICAgICAgeyB3ZWVrOiAnV2VlayAzJywgY29tcGxldGVkOiAzLCB0b3RhbDogMyB9LFxuICAgICAgICB7IHdlZWs6ICdXZWVrIDQnLCBjb21wbGV0ZWQ6IDEsIHRvdGFsOiAzIH0sXG4gICAgICAgIHsgd2VlazogJ1dlZWsgNScsIGNvbXBsZXRlZDogMywgdG90YWw6IDMgfSxcbiAgICAgICAgeyB3ZWVrOiAnV2VlayA2JywgY29tcGxldGVkOiAyLCB0b3RhbDogMyB9LFxuICAgIF0sXG59O1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGRlbGF5KG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKHVybCwgb3B0aW9ucykge1xuICAgIGF3YWl0IGRlbGF5KDMwMCk7XG4gICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2Uob3B0aW9ucy5ib2R5IHx8ICd7fScpO1xuXG4gICAgaWYgKGJvZHkuZW1haWwgPT09ICdzdHVkZW50QGRlbW8uY29tJyAmJiBib2R5LnBhc3N3b3JkID09PSAnZGVtbzEyMycpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0b2tlbjogJ21vY2stand0LXRva2VuLScgKyBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGV4cGlyZXNBdDogbmV3IERhdGUoRGF0ZS5ub3coKSArIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3N0dV8wMDEnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWxleCBKb2huc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogJ3N0dWRlbnQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHsgc3RhdHVzOiAyMDAsIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0ludmFsaWQgY3JlZGVudGlhbHMnIH0pLCB7XG4gICAgICAgIHN0YXR1czogNDAxLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHZXRTdHVkZW50KHJlcXVlc3QpIHtcbiAgICBhd2FpdCBkZWxheSgyMDApO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGlkID0gdXJsLnBhdGhuYW1lLnNwbGl0KCcvJykucG9wKCk7XG5cbiAgICBpZiAoaWQgPT09ICdzdHVfMDAxJykge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KG1vY2tTdHVkZW50KSwge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdTdHVkZW50IG5vdCBmb3VuZCcgfSksIHtcbiAgICAgICAgc3RhdHVzOiA0MDQsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdldENvdXJzZXMocmVxdWVzdCkge1xuICAgIGF3YWl0IGRlbGF5KDI1MCk7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG4gICAgY29uc3QgaWQgPSB1cmwucGF0aG5hbWUuc3BsaXQoJy8nKVszXTtcblxuICAgIGlmIChpZCA9PT0gJ3N0dV8wMDEnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkobW9ja0NvdXJzZXMpLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0NvdXJzZXMgbm90IGZvdW5kJyB9KSwge1xuICAgICAgICBzdGF0dXM6IDQwNCxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2V0R3JhZGVzKHJlcXVlc3QpIHtcbiAgICBhd2FpdCBkZWxheSgyMDApO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGlkID0gdXJsLnBhdGhuYW1lLnNwbGl0KCcvJylbM107XG5cbiAgICBpZiAoaWQgPT09ICdzdHVfMDAxJykge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KG1vY2tHcmFkZXMpLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0dyYWRlcyBub3QgZm91bmQnIH0pLCB7XG4gICAgICAgIHN0YXR1czogNDA0LFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICB9KTtcbn1cblxuY29uc3Qgcm91dGVzID0ge1xuICAgICdQT1NUOi9hcGkvYXV0aC9sb2dpbic6IGhhbmRsZUxvZ2luLFxuICAgICdHRVQ6L2FwaS9zdHVkZW50cy86aWQnOiBoYW5kbGVHZXRTdHVkZW50LFxuICAgICdHRVQ6L2FwaS9zdHVkZW50cy86aWQvY291cnNlcyc6IGhhbmRsZUdldENvdXJzZXMsXG4gICAgJ0dFVDovYXBpL3N0dWRlbnRzLzppZC9ncmFkZXMnOiBoYW5kbGVHZXRHcmFkZXMsXG59O1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cE1vY2tTZXJ2ZXIoKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxGZXRjaCA9IHdpbmRvdy5mZXRjaDtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgd2luZG93LmZldGNoID0gYXN5bmMgKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/IGlucHV0IDogaW5wdXQudXJsO1xuICAgICAgICBjb25zdCBtZXRob2QgPSAob3B0aW9ucy5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke21ldGhvZH06JHtuZXcgVVJMKHVybCwgd2luZG93LmxvY2F0aW9uLm9yaWdpbikucGF0aG5hbWV9YDtcblxuICAgICAgICBsZXQgbWF0Y2hlZFJvdXRlID0gcm91dGVzW2tleV07XG5cbiAgICAgICAgaWYgKCFtYXRjaGVkUm91dGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhuYW1lID0gbmV3IFVSTCh1cmwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pLnBhdGhuYW1lO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbcm91dGVLZXksIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHJvdXRlcykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbcm91dGVNZXRob2QsIHJvdXRlUGF0dGVybl0gPSByb3V0ZUtleS5zcGxpdCgnOicpO1xuICAgICAgICAgICAgICAgIGlmIChyb3V0ZU1ldGhvZCAhPT0gbWV0aG9kKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlUGFydHMgPSByb3V0ZVBhdHRlcm4uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoUGFydHMgPSBwYXRobmFtZS5zcGxpdCgnLycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlUGFydHMubGVuZ3RoICE9PSBwYXRoUGFydHMubGVuZ3RoKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGxldCBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3V0ZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZVBhcnRzW2ldLnN0YXJ0c1dpdGgoJzonKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZVBhcnRzW2ldICE9PSBwYXRoUGFydHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUm91dGUgPSBoYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hlZFJvdXRlKSB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVkUm91dGUocmVxdWVzdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3JpZ2luYWxGZXRjaC5jYWxsKHdpbmRvdywgaW5wdXQsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICB3aW5kb3cuZmV0Y2ggPSBvcmlnaW5hbEZldGNoO1xuICAgIH07XG59XG4iLCAiLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlTdGF0ZSh7IHRpdGxlLCBkZXNjcmlwdGlvbiwgaWxsdXN0cmF0aW9uLCBhY3Rpb25zID0gW10gfSA9IHt9KSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdlbXB0eS1zdGF0ZSc7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcblxuICAgIGlmIChpbGx1c3RyYXRpb24pIHtcbiAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGltZy5jbGFzc05hbWUgPSAnZW1wdHktc3RhdGVfX2lsbHVzdHJhdGlvbic7XG4gICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgaW1nLmlubmVySFRNTCA9IGlsbHVzdHJhdGlvbjtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGltZyk7XG4gICAgfVxuXG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICB0aXRsZUVsLmNsYXNzTmFtZSA9ICdlbXB0eS1zdGF0ZV9fdGl0bGUnO1xuICAgICAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gdGl0bGU7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgZGVzY0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBkZXNjRWwuY2xhc3NOYW1lID0gJ2VtcHR5LXN0YXRlX19kZXNjcmlwdGlvbic7XG4gICAgICAgIGRlc2NFbC50ZXh0Q29udGVudCA9IGRlc2NyaXB0aW9uO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGVzY0VsKTtcbiAgICB9XG5cbiAgICBpZiAoYWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbnNFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhY3Rpb25zRWwuY2xhc3NOYW1lID0gJ2VtcHR5LXN0YXRlX19hY3Rpb25zJztcbiAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zRWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBhY3Rpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGFjdGlvbnNFbC5hcHBlbmRDaGlsZChhY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFjdGlvbnNFbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IGNvbnN0IEVNUFRZX0lMTFVTVFJBVElPTlMgPSB7XG4gICAgc2VhcmNoOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMjBcIiBoZWlnaHQ9XCIxMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI4XCIvPjxwYXRoIGQ9XCJtMjEgMjEtNC4zLTQuM1wiLz48L3N2Zz4nLFxuICAgIGRhdGE6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEyMFwiIGhlaWdodD1cIjEyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjFcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48L3N2Zz4nLFxuICAgIGNvdXJzZTogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTIwXCIgaGVpZ2h0PVwiMTIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNNCAxOS41di0xNUEyLjUgMi41IDAgMCAxIDYuNSAySDIwdjIwSDYuNWEyLjUgMi41IDAgMCAxIDAtNUgyMFwiLz48L3N2Zz4nLFxuICAgIGdyYWRlOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMjBcIiBoZWlnaHQ9XCIxMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMiAxMmgtNGwtMyA5TDkgM2wtMyA5SDJcIi8+PC9zdmc+JyxcbiAgICBlcnJvcjogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTIwXCIgaGVpZ2h0PVwiMTIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xNiAxNnMtMS41LTItNC0yLTQgMi00IDJcIi8+PGxpbmUgeDE9XCI5XCIgeTE9XCI5XCIgeDI9XCI5LjAxXCIgeTI9XCI5XCIvPjxsaW5lIHgxPVwiMTVcIiB5MT1cIjlcIiB4Mj1cIjE1LjAxXCIgeTI9XCI5XCIvPjwvc3ZnPicsXG59O1xuIiwgIi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVycm9yQm91bmRhcnkoe1xuICAgIHRpdGxlID0gJ1NvbWV0aGluZyB3ZW50IHdyb25nJyxcbiAgICBtZXNzYWdlID0gJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICBvblJldHJ5ID0gbnVsbCxcbn0gPSB7fSkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAnZXJyb3ItYm91bmRhcnknO1xuICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XG5cbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJlcnJvci1ib3VuZGFyeV9faWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCI2NFwiIGhlaWdodD1cIjY0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgMTZzLTEuNS0yLTQtMi00IDItNCAyXCIvPlxuICAgICAgICA8bGluZSB4MT1cIjlcIiB5MT1cIjlcIiB4Mj1cIjkuMDFcIiB5Mj1cIjlcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiMTVcIiB5MT1cIjlcIiB4Mj1cIjE1LjAxXCIgeTI9XCI5XCIvPlxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gICAgPGgyIGNsYXNzPVwiZXJyb3ItYm91bmRhcnlfX3RpdGxlXCI+JHt0aXRsZX08L2gyPlxuICAgIDxwIGNsYXNzPVwiZXJyb3ItYm91bmRhcnlfX21lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICBgO1xuXG4gICAgaWYgKG9uUmV0cnkpIHtcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdlcnJvci1ib3VuZGFyeV9fYWN0aW9ucyc7XG5cbiAgICAgICAgY29uc3QgcmV0cnlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgcmV0cnlCdG4uY2xhc3NOYW1lID0gJ2J0biBidG4tLXByaW1hcnknO1xuICAgICAgICByZXRyeUJ0bi50ZXh0Q29udGVudCA9ICdUcnkgYWdhaW4nO1xuICAgICAgICByZXRyeUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHJ5QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHJ5QnRuLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwic3Bpbm5lciBzcGlubmVyLS1zbVwiPjxzdmcgY2xhc3M9XCJzcGlubmVyX19jaXJjbGVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGNpcmNsZSBjbGFzcz1cInNwaW5uZXJfX3BhdGhcIiBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiM1wiLz48L3N2Zz48L3NwYW4+IFJldHJ5aW5nLi4uJztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgb25SZXRyeSgpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICByZXRyeUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHJ5QnRuLnRleHRDb250ZW50ID0gJ1RyeSBhZ2Fpbic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFjdGlvbnMuYXBwZW5kQ2hpbGQocmV0cnlCdG4pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYWN0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aEVycm9yQm91bmRhcnkoY29udGFpbmVyLCB7IHRpdGxlLCBtZXNzYWdlLCBvblJldHJ5IH0gPSB7fSkge1xuICAgIGNvbnN0IGVycm9yVUkgPSBjcmVhdGVFcnJvckJvdW5kYXJ5KHsgdGl0bGUsIG1lc3NhZ2UsIG9uUmV0cnkgfSk7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvclVJKTtcbiAgICByZXR1cm4gZXJyb3JVSTtcbn1cbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2FkaW5nU3Bpbm5lcih7IHNpemUgPSAnbWQnLCBsYWJlbCA9ICdMb2FkaW5nLi4uJyB9ID0ge30pIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gYHNwaW5uZXIgc3Bpbm5lci0tJHtzaXplfWA7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IGBcbiAgICA8c3ZnIGNsYXNzPVwic3Bpbm5lcl9fY2lyY2xlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPGNpcmNsZSBjbGFzcz1cInNwaW5uZXJfX3BhdGhcIiBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiM1wiLz5cbiAgICA8L3N2Zz5cbiAgYDtcblxuICAgIGNvbnN0IHNyT25seSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzck9ubHkuY2xhc3NOYW1lID0gJ3NyLW9ubHknO1xuICAgIHNyT25seS50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzck9ubHkpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cbiIsICJjb25zdCBGT0NVU0FCTEVfU0VMRUNUT1IgPVxuICAgICdhW2hyZWZdLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJztcblxubGV0IG9wZW5Nb2RhbCA9IG51bGw7XG5sZXQgbW9kYWxJZENvdW50ZXIgPSAwO1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2RhbCh7IHRpdGxlLCBib2R5LCBmb290ZXIsIG9uQ2xvc2UsIHNpemUgPSAnbWQnLCBhcmlhRGVzY3JpcHRpb24gfSA9IHt9KSB7XG4gICAgaWYgKG9wZW5Nb2RhbCkge1xuICAgICAgICBvcGVuTW9kYWwuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RhbElkID0gYG1vZGFsLSR7Kyttb2RhbElkQ291bnRlcn1gO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBgJHttb2RhbElkfS10aXRsZWA7XG4gICAgY29uc3QgZGVzY0lkID0gYCR7bW9kYWxJZH0tZGVzY2A7XG5cbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3ZlcmxheS5jbGFzc05hbWUgPSAnbW9kYWwtb3ZlcmxheSc7XG4gICAgb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBpZiAoYXJpYURlc2NyaXB0aW9uKSBvdmVybGF5LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGRlc2NJZCk7XG5cbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG1vZGFsLmNsYXNzTmFtZSA9ICdtb2RhbCc7XG4gICAgaWYgKHNpemUgPT09ICdsZycpIG1vZGFsLnN0eWxlLm1heFdpZHRoID0gJzcwMHB4JztcbiAgICBpZiAoc2l6ZSA9PT0gJ3NtJykgbW9kYWwuc3R5bGUubWF4V2lkdGggPSAnMzYwcHgnO1xuXG4gICAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbF9faGVhZGVyXCI+XG4gICAgICA8aDIgY2xhc3M9XCJtb2RhbF9fdGl0bGVcIiBpZD1cIiR7dGl0bGVJZH1cIj4ke3RpdGxlIHx8ICcnfTwvaDI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWxfX2Nsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlIGRpYWxvZ1wiPlxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xOCA2IDYgMThcIi8+PHBhdGggZD1cIm02IDYgMTIgMTJcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgICBjb25zdCBib2R5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBib2R5RWwuY2xhc3NOYW1lID0gJ21vZGFsX19ib2R5JztcbiAgICBpZiAoYXJpYURlc2NyaXB0aW9uKSBib2R5RWwuaWQgPSBkZXNjSWQ7XG4gICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBib2R5RWwuaW5uZXJIVE1MID0gYm9keTtcbiAgICB9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBib2R5RWwuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIG1vZGFsLmFwcGVuZENoaWxkKGJvZHlFbCk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICAgIGNvbnN0IGZvb3RlckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGZvb3RlckVsLmNsYXNzTmFtZSA9ICdtb2RhbF9fZm9vdGVyJztcbiAgICAgICAgaWYgKHR5cGVvZiBmb290ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmb290ZXJFbC5pbm5lckhUTUwgPSBmb290ZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9vdGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGZvb3RlckVsLmFwcGVuZENoaWxkKGZvb3Rlcik7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShmb290ZXIpKSB7XG4gICAgICAgICAgICBmb290ZXIuZm9yRWFjaChlbCA9PiBmb290ZXJFbC5hcHBlbmRDaGlsZChlbCkpO1xuICAgICAgICB9XG4gICAgICAgIG1vZGFsLmFwcGVuZENoaWxkKGZvb3RlckVsKTtcbiAgICB9XG5cbiAgICBvdmVybGF5LmFwcGVuZENoaWxkKG1vZGFsKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vdmVybGF5LS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBtb2RhbE9iaiA9IHtcbiAgICAgICAgZWxlbWVudDogb3ZlcmxheSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjbG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vdmVybGF5LS1vcGVuJyk7XG4gICAgICAgICAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJsYXkucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG92ZXJsYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChvcGVuTW9kYWwgPT09IG1vZGFsT2JqKSBvcGVuTW9kYWwgPSBudWxsO1xuICAgICAgICAgICAgaWYgKG9uQ2xvc2UpIG9uQ2xvc2UoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlkb3duKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgb3Blbk1vZGFsID0gbW9kYWxPYmo7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUtleWRvd24oZSkge1xuICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBtb2RhbE9iai5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgICAgICAgY29uc3QgZm9jdXNhYmxlID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfU0VMRUNUT1IpO1xuICAgICAgICAgICAgaWYgKGZvY3VzYWJsZS5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBmb2N1c2FibGVbMF07XG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZm9jdXNhYmxlW2ZvY3VzYWJsZS5sZW5ndGggLSAxXTtcblxuICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3QpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGFzdC5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zaGlmdEtleSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGZpcnN0LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93bik7XG5cbiAgICBjb25zdCBjbG9zZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UnKTtcbiAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG1vZGFsT2JqLmNsb3NlKCkpO1xuXG4gICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBvdmVybGF5KSBtb2RhbE9iai5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlyc3RGb2N1c2FibGUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKEZPQ1VTQUJMRV9TRUxFQ1RPUik7XG4gICAgICAgIGlmIChmaXJzdEZvY3VzYWJsZSkgZmlyc3RGb2N1c2FibGUuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICAgIHJldHVybiBtb2RhbE9iajtcbn1cbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTa2VsZXRvblRleHQobGluZXMgPSAzKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ3NrZWxldG9uLXRleHQtZ3JvdXAnO1xuICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3N0YXR1cycpO1xuICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0xvYWRpbmcgY29udGVudCcpO1xuXG4gICAgY29uc3Qgc3JPbmx5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNyT25seS5jbGFzc05hbWUgPSAnc3Itb25seSc7XG4gICAgc3JPbmx5LnRleHRDb250ZW50ID0gJ0xvYWRpbmcuLi4nO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3JPbmx5KTtcblxuICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JvdXAuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDowLjc1cmVtOyc7XG4gICAgZ3JvdXAuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2tlbGV0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2tlbGV0b24uY2xhc3NOYW1lID0gJ3NrZWxldG9uIHNrZWxldG9uLS10ZXh0JztcbiAgICAgICAgaWYgKGkgPT09IGxpbmVzIC0gMSkge1xuICAgICAgICAgICAgc2tlbGV0b24uc3R5bGUud2lkdGggPSAnNDAlJztcbiAgICAgICAgfVxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChza2VsZXRvbik7XG4gICAgfVxuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNrZWxldG9uQ2FyZCgpIHtcbiAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2FyZC5jbGFzc05hbWUgPSAnc2tlbGV0b24tY2FyZCc7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnc3RhdHVzJyk7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnTG9hZGluZyBjYXJkIGNvbnRlbnQnKTtcblxuICAgIGNvbnN0IHNyT25seSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzck9ubHkuY2xhc3NOYW1lID0gJ3NyLW9ubHknO1xuICAgIHNyT25seS50ZXh0Q29udGVudCA9ICdMb2FkaW5nLi4uJztcbiAgICBjYXJkLmFwcGVuZENoaWxkKHNyT25seSk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBjb250ZW50LmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fdGh1bWJuYWlsXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNrZWxldG9uLWNhcmRfX2xpbmVzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fbGluZVwiIHN0eWxlPVwid2lkdGg6NzAlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fbGluZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrZWxldG9uLWNhcmRfX2xpbmVcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgICBjYXJkLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgcmV0dXJuIGNhcmQ7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNrZWxldG9uQ2hhcnQoKSB7XG4gICAgY29uc3QgY2hhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjaGFydC5jbGFzc05hbWUgPSAnc2tlbGV0b24tY2hhcnQnO1xuICAgIGNoYXJ0LnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBjaGFydC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnTG9hZGluZyBjaGFydCcpO1xuXG4gICAgY29uc3Qgc3JPbmx5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNyT25seS5jbGFzc05hbWUgPSAnc3Itb25seSc7XG4gICAgc3JPbmx5LnRleHRDb250ZW50ID0gJ0xvYWRpbmcgY2hhcnQuLi4nO1xuICAgIGNoYXJ0LmFwcGVuZENoaWxkKHNyT25seSk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBjb250ZW50LmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2hhcnRfX2JhclwiPjwvZGl2Pic7XG4gICAgY29uc3QgYmFyID0gY29udGVudC5xdWVyeVNlbGVjdG9yKCcuc2tlbGV0b24tY2hhcnRfX2JhcicpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9ICdza2VsZXRvbi1jaGFydF9fYmFyLWl0ZW0nO1xuICAgICAgICBiYXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgfVxuXG4gICAgY2hhcnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgcmV0dXJuIGNoYXJ0O1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJTa2VsZXRvbihjb250YWluZXIsIHR5cGUgPSAnY2FyZCcsIGNvdW50ID0gMSkge1xuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGxldCBlbDtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdjYXJkJzpcbiAgICAgICAgICAgICAgICBlbCA9IGNyZWF0ZVNrZWxldG9uQ2FyZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hhcnQnOlxuICAgICAgICAgICAgICAgIGVsID0gY3JlYXRlU2tlbGV0b25DaGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgZWwgPSBjcmVhdGVTa2VsZXRvblRleHQoMyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGVsID0gY3JlYXRlU2tlbGV0b25DYXJkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cblxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTa2VsZXRvbnMoY29udGFpbmVyKSB7XG4gICAgY29uc3Qgc2tlbGV0b25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICcuc2tlbGV0b24tY2FyZCwgLnNrZWxldG9uLWNoYXJ0LCAuc2tlbGV0b24tdGV4dC1ncm91cCdcbiAgICApO1xuICAgIHNrZWxldG9ucy5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcbn1cbiIsICJjb25zdCBUT0FTVF9ERUZBVUxUUyA9IHtcbiAgICB0eXBlOiAnaW5mbycsXG4gICAgZHVyYXRpb246IDUwMDAsXG59O1xuXG5jb25zdCBJQ09OUyA9IHtcbiAgICBzdWNjZXNzOlxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIi8+PC9zdmc+JyxcbiAgICBlcnJvcjogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtMTUgOS02IDZcIi8+PHBhdGggZD1cIm05IDkgNiA2XCIvPjwvc3ZnPicsXG4gICAgd2FybmluZzpcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTEwLjI5IDMuODYgMS44MiAxOGEyIDIgMCAwIDAgMS43MSAzaDE2Ljk0YTIgMiAwIDAgMCAxLjcxLTNMMTMuNzEgMy44NmEyIDIgMCAwIDAtMy40MiAwelwiLz48cGF0aCBkPVwiTTEyIDl2NFwiLz48cGF0aCBkPVwiTTEyIDE3aC4wMVwiLz48L3N2Zz4nLFxuICAgIGluZm86ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTEyIDE2di00XCIvPjxwYXRoIGQ9XCJNMTIgOGguMDFcIi8+PC9zdmc+Jyxcbn07XG5cbmxldCBjb250YWluZXIgPSBudWxsO1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldENvbnRhaW5lcigpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdC1yb290Jyk7XG4gICAgaWYgKGV4aXN0aW5nICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZXhpc3RpbmcpKSB7XG4gICAgICAgIGV4aXN0aW5nLmNsYXNzTmFtZSA9ICd0b2FzdC1jb250YWluZXInO1xuICAgICAgICBleGlzdGluZy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScpO1xuICAgICAgICBleGlzdGluZy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJyk7XG4gICAgICAgIHJldHVybiBleGlzdGluZztcbiAgICB9XG5cbiAgICBpZiAoIWNvbnRhaW5lciB8fCAhZG9jdW1lbnQuYm9keS5jb250YWlucyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ3RvYXN0LWNvbnRhaW5lcic7XG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh7XG4gICAgdGl0bGUsXG4gICAgbWVzc2FnZSxcbiAgICB0eXBlID0gVE9BU1RfREVGQVVMVFMudHlwZSxcbiAgICBkdXJhdGlvbiA9IFRPQVNUX0RFRkFVTFRTLmR1cmF0aW9uLFxufSkge1xuICAgIGNvbnN0IHRvYXN0Q29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b2FzdC5jbGFzc05hbWUgPSBgdG9hc3QgdG9hc3QtLSR7dHlwZX1gO1xuICAgIHRvYXN0LnNldEF0dHJpYnV0ZSgncm9sZScsICdhbGVydCcpO1xuXG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYFxuICAgIDxzcGFuIGNsYXNzPVwidG9hc3RfX2ljb25cIj4ke0lDT05TW3R5cGVdIHx8IElDT05TLmluZm99PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJ0b2FzdF9fY29udGVudFwiPlxuICAgICAgPHAgY2xhc3M9XCJ0b2FzdF9fdGl0bGVcIj4ke3RpdGxlfTwvcD5cbiAgICAgICR7bWVzc2FnZSA/IGA8cCBjbGFzcz1cInRvYXN0X19tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5gIDogJyd9XG4gICAgPC9kaXY+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInRvYXN0X19jbG9zZVwiIGFyaWEtbGFiZWw9XCJEaXNtaXNzIG5vdGlmaWNhdGlvblwiPlxuICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPjwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICBgO1xuXG4gICAgY29uc3QgY2xvc2VCdG4gPSB0b2FzdC5xdWVyeVNlbGVjdG9yKCcudG9hc3RfX2Nsb3NlJyk7XG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByZW1vdmVUb2FzdCh0b2FzdCkpO1xuXG4gICAgdG9hc3RDb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3QpO1xuXG4gICAgaWYgKGR1cmF0aW9uID4gMCkge1xuICAgICAgICB0b2FzdC5fdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gcmVtb3ZlVG9hc3QodG9hc3QpLCBkdXJhdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvYXN0O1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZVRvYXN0KHRvYXN0KSB7XG4gICAgaWYgKHRvYXN0Ll90aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0b2FzdC5fdGltZW91dCk7XG4gICAgfVxuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3RvYXN0LS1yZW1vdmluZycpO1xuICAgIHRvYXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdhbmltYXRpb25lbmQnLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodG9hc3QucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodG9hc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dTdWNjZXNzKHRpdGxlLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHNob3dUb2FzdCh7IHR5cGU6ICdzdWNjZXNzJywgdGl0bGUsIG1lc3NhZ2UgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dFcnJvcih0aXRsZSwgbWVzc2FnZSkge1xuICAgIHJldHVybiBzaG93VG9hc3QoeyB0eXBlOiAnZXJyb3InLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd1dhcm5pbmcodGl0bGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2hvd1RvYXN0KHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd0luZm8odGl0bGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2hvd1RvYXN0KHsgdHlwZTogJ2luZm8nLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cbiIsICJsZXQgdG9vbHRpcElkQ291bnRlciA9IDA7XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAodHJpZ2dlckVsLCB7IGNvbnRlbnQsIHBvc2l0aW9uID0gJ3RvcCcsIGRlbGF5ID0gMjAwIH0gPSB7fSkge1xuICAgIGNvbnN0IHRvb2x0aXBJZCA9IGB0b29sdGlwLSR7Kyt0b29sdGlwSWRDb3VudGVyfWA7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICd0b29sdGlwLXdyYXBwZXInO1xuICAgIHRyaWdnZXJFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCB0cmlnZ2VyRWwpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodHJpZ2dlckVsKTtcblxuICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCB0b29sdGlwSWQpO1xuXG4gICAgY29uc3QgdG9vbHRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9IGB0b29sdGlwIHRvb2x0aXAtLSR7cG9zaXRpb259YDtcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XG4gICAgdG9vbHRpcC5pZCA9IHRvb2x0aXBJZDtcbiAgICB0b29sdGlwLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xuXG4gICAgbGV0IHNob3dUaW1lb3V0ID0gbnVsbDtcbiAgICBsZXQgaGlkZVRpbWVvdXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICBpZiAoaGlkZVRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG4gICAgICAgICAgICBoaWRlVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgcG9zaXRpb25Ub29sdGlwKCk7XG4gICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtLXZpc2libGUnKTtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgaWYgKHNob3dUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoc2hvd1RpbWVvdXQpO1xuICAgICAgICAgICAgc2hvd1RpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC0tdmlzaWJsZScpO1xuICAgICAgICB9LCAxMDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gcG9zaXRpb25Ub29sdGlwKCkge1xuICAgICAgICBjb25zdCB0cmlnZ2VyUmVjdCA9IHRyaWdnZXJFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgdG9vbHRpcFJlY3QgPSB0b29sdGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBnYXAgPSA4O1xuXG4gICAgICAgIGxldCB0b3AsIGxlZnQ7XG5cbiAgICAgICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICB0b3AgPSB0cmlnZ2VyUmVjdC50b3AgLSB0b29sdGlwUmVjdC5oZWlnaHQgLSBnYXA7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRyaWdnZXJSZWN0LmxlZnQgKyB0cmlnZ2VyUmVjdC53aWR0aCAvIDIgLSB0b29sdGlwUmVjdC53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgIHRvcCA9IHRyaWdnZXJSZWN0LmJvdHRvbSArIGdhcDtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gdHJpZ2dlclJlY3QubGVmdCArIHRyaWdnZXJSZWN0LndpZHRoIC8gMiAtIHRvb2x0aXBSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHRvcCA9IHRyaWdnZXJSZWN0LnRvcCArIHRyaWdnZXJSZWN0LmhlaWdodCAvIDIgLSB0b29sdGlwUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIGxlZnQgPSB0cmlnZ2VyUmVjdC5sZWZ0IC0gdG9vbHRpcFJlY3Qud2lkdGggLSBnYXA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgdG9wID0gdHJpZ2dlclJlY3QudG9wICsgdHJpZ2dlclJlY3QuaGVpZ2h0IC8gMiAtIHRvb2x0aXBSZWN0LmhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRyaWdnZXJSZWN0LnJpZ2h0ICsgZ2FwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFkZGluZyA9IDg7XG4gICAgICAgIGlmIChsZWZ0IDwgcGFkZGluZykgbGVmdCA9IHBhZGRpbmc7XG4gICAgICAgIGlmIChsZWZ0ICsgdG9vbHRpcFJlY3Qud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIHBhZGRpbmcpIHtcbiAgICAgICAgICAgIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHRvb2x0aXBSZWN0LndpZHRoIC0gcGFkZGluZztcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9wIDwgcGFkZGluZykgdG9wID0gcGFkZGluZztcbiAgICAgICAgaWYgKHRvcCArIHRvb2x0aXBSZWN0LmhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIHBhZGRpbmcpIHtcbiAgICAgICAgICAgIHRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRvb2x0aXBSZWN0LmhlaWdodCAtIHBhZGRpbmc7XG4gICAgICAgIH1cblxuICAgICAgICB0b29sdGlwLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgICAgIHRvb2x0aXAuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgIH1cblxuICAgIHRyaWdnZXJFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgc2hvdyk7XG4gICAgdHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICB0cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBzaG93KTtcbiAgICB0cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhpZGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICAgICAgICB0cmlnZ2VyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHNob3cpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHNob3cpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoaWRlKTtcbiAgICAgICAgICAgIHRvb2x0aXAucmVtb3ZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlOiBuZXdDb250ZW50ID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAudGV4dENvbnRlbnQgPSBuZXdDb250ZW50O1xuICAgICAgICB9LFxuICAgIH07XG59XG4iLCAiLyoqXG4gKiBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIHdpdGggdmFsaWRhdGlvbiBhbmQgZGVmYXVsdHMuXG4gKiBVc2VzIGltcG9ydC5tZXRhLmVudiAoaW5qZWN0ZWQgYnkgZXNidWlsZCBkZWZpbmUpIHdpdGggZmFsbGJhY2tzLlxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICAgIEFQUF9OQU1FOiAnU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyJyxcbiAgICBBUFBfVkVSU0lPTjogJzAuMS4wJyxcbiAgICBBUElfQkFTRV9VUkw6ICcvYXBpJyxcbiAgICBBUElfVElNRU9VVDogMTAwMDAsXG4gICAgQVVUSF9UT0tFTl9LRVk6ICdzdHVkZW50X3RyYWNrZXJfYXV0aCcsXG4gICAgQVVUSF9SRURJUkVDVF9LRVk6ICdzdHVkZW50X3RyYWNrZXJfcmVkaXJlY3QnLFxuICAgIEFVVEhfUkVNRU1CRVJfREFZUzogMzAsXG4gICAgRU5BQkxFX01PQ0tfQVBJOiB0cnVlLFxuICAgIEVOQUJMRV9QV0E6IGZhbHNlLFxuICAgIEVOQUJMRV9BTkFMWVRJQ1M6IGZhbHNlLFxuICAgIENIQVJUX0FOSU1BVElPTl9EVVJBVElPTjogNzUwLFxuICAgIENIQVJUX1JFU1BPTlNJVkU6IHRydWUsXG59O1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldEVudihrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIGNvbnN0IHZhbHVlID0gaW1wb3J0Lm1ldGEuZW52W2tleV07XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzTmFOKHZhbHVlKSAmJiB2YWx1ZSAhPT0gJycpIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IEVOViA9IHtcbiAgICBBUFBfTkFNRTogZ2V0RW52KCdWSVRFX0FQUF9OQU1FJywgREVGQVVMVFMuQVBQX05BTUUpLFxuICAgIEFQUF9WRVJTSU9OOiBnZXRFbnYoJ1ZJVEVfQVBQX1ZFUlNJT04nLCBERUZBVUxUUy5BUFBfVkVSU0lPTiksXG4gICAgQVBJX0JBU0VfVVJMOiBnZXRFbnYoJ1ZJVEVfQVBJX0JBU0VfVVJMJywgREVGQVVMVFMuQVBJX0JBU0VfVVJMKSxcbiAgICBBUElfVElNRU9VVDogZ2V0RW52KCdWSVRFX0FQSV9USU1FT1VUJywgREVGQVVMVFMuQVBJX1RJTUVPVVQpLFxuICAgIEFVVEhfVE9LRU5fS0VZOiBnZXRFbnYoJ1ZJVEVfQVVUSF9UT0tFTl9LRVknLCBERUZBVUxUUy5BVVRIX1RPS0VOX0tFWSksXG4gICAgQVVUSF9SRURJUkVDVF9LRVk6IGdldEVudignVklURV9BVVRIX1JFRElSRUNUX0tFWScsIERFRkFVTFRTLkFVVEhfUkVESVJFQ1RfS0VZKSxcbiAgICBBVVRIX1JFTUVNQkVSX0RBWVM6IGdldEVudignVklURV9BVVRIX1JFTUVNQkVSX0RBWVMnLCBERUZBVUxUUy5BVVRIX1JFTUVNQkVSX0RBWVMpLFxuICAgIEVOQUJMRV9NT0NLX0FQSTogZ2V0RW52KCdWSVRFX0VOQUJMRV9NT0NLX0FQSScsIERFRkFVTFRTLkVOQUJMRV9NT0NLX0FQSSksXG4gICAgRU5BQkxFX1BXQTogZ2V0RW52KCdWSVRFX0VOQUJMRV9QV0EnLCBERUZBVUxUUy5FTkFCTEVfUFdBKSxcbiAgICBFTkFCTEVfQU5BTFlUSUNTOiBnZXRFbnYoJ1ZJVEVfRU5BQkxFX0FOQUxZVElDUycsIERFRkFVTFRTLkVOQUJMRV9BTkFMWVRJQ1MpLFxuICAgIENIQVJUX0FOSU1BVElPTl9EVVJBVElPTjogZ2V0RW52KFxuICAgICAgICAnVklURV9DSEFSVF9BTklNQVRJT05fRFVSQVRJT04nLFxuICAgICAgICBERUZBVUxUUy5DSEFSVF9BTklNQVRJT05fRFVSQVRJT05cbiAgICApLFxuICAgIENIQVJUX1JFU1BPTlNJVkU6IGdldEVudignVklURV9DSEFSVF9SRVNQT05TSVZFJywgREVGQVVMVFMuQ0hBUlRfUkVTUE9OU0lWRSksXG59O1xuXG5pZiAoIUVOVi5BUElfQkFTRV9VUkwpIHtcbiAgICBjb25zb2xlLndhcm4oJ1tDb25maWddIFZJVEVfQVBJX0JBU0VfVVJMIG5vdCBzZXQsIHVzaW5nIGRlZmF1bHQnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRU5WO1xuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBcHBsaWNhdGlvbi13aWRlIGNvbnN0YW50cyBhbmQgZW51bWVyYXRpb25zLlxuICpcbiAqIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIGFsbCBtYWdpYyBzdHJpbmdzIGFuZCBudW1iZXJzXG4gKiB1c2VkIGFjcm9zcyB0aGUgU3R1ZGVudCBQcm9ncmVzcyBUcmFja2luZyBTYWFTLlxuICpcbiAqIEltcG9ydCBvbmx5IHRoZSBncm91cHMgeW91IG5lZWQgXHUyMDE0IHRyZWUtc2hha2luZyBrZWVwcyB0aGVcbiAqIGJ1bmRsZSBtaW5pbWFsIHdoZW4gaW5kaXZpZHVhbCBuYW1lZCBleHBvcnRzIGFyZSB1c2VkLlxuICpcbiAqIEBtb2R1bGUgdXRpbHMvY29uc3RhbnRzXG4gKi9cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSb3V0ZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKiogSGFzaC1yb3V0ZXIgcGF0aCBjb25zdGFudHMgdXNlZCBhY3Jvc3MgdGhlIGFwcGxpY2F0aW9uLiAqL1xuZXhwb3J0IGNvbnN0IFJPVVRFUyA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgTE9HSU46ICcvbG9naW4nLFxuICAgIERBU0hCT0FSRDogJy9kYXNoYm9hcmQnLFxuICAgIE5PVF9GT1VORDogJy80MDQnLFxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJIEVuZHBvaW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQVBJIGVuZHBvaW50IGZhY3RvcnkgZnVuY3Rpb25zIGFuZCBzdGF0aWMgcGF0aHMuXG4gKiBBbGwgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIEVOVi5BUElfQkFTRV9VUkwuXG4gKi9cbmV4cG9ydCBjb25zdCBBUElfRU5EUE9JTlRTID0gLyoqIEB0eXBlIHtjb25zdH0gKi8gKHtcbiAgICBBVVRIX0xPR0lOOiAnL2F1dGgvbG9naW4nLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFN0dWRlbnQgSUQgKi9cbiAgICBTVFVERU5UOiBpZCA9PiBgL3N0dWRlbnRzLyR7aWR9YCxcblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBTdHVkZW50IElEICovXG4gICAgU1RVREVOVF9DT1VSU0VTOiBpZCA9PiBgL3N0dWRlbnRzLyR7aWR9L2NvdXJzZXNgLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFN0dWRlbnQgSUQgKi9cbiAgICBTVFVERU5UX0dSQURFUzogaWQgPT4gYC9zdHVkZW50cy8ke2lkfS9ncmFkZXNgLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIENvdXJzZSBJRCAqL1xuICAgIENPVVJTRTogaWQgPT4gYC9jb3Vyc2VzLyR7aWR9YCxcblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBDb3Vyc2UgSUQgKi9cbiAgICBDT1VSU0VfUFJPR1JFU1M6IGlkID0+IGAvY291cnNlcy8ke2lkfS9wcm9ncmVzc2AsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdXRoZW50aWNhdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKiBBdXRoZW50aWNhdGlvbi1zcGVjaWZpYyBjb25zdGFudHMuICovXG5leHBvcnQgY29uc3QgQVVUSF9DT05TVEFOVFMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoe1xuICAgIERFTU9fRU1BSUw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICBERU1PX1BBU1NXT1JEOiAnZGVtbzEyMycsXG5cbiAgICAvKiogMzAtZGF5IHRva2VuIGxpZmV0aW1lIGluIG1pbGxpc2Vjb25kcy4gKi9cbiAgICBUT0tFTl9FWFBJUllfTVM6IDMwICogMjQgKiA2MCAqIDYwICogMTAwMCxcblxuICAgIC8qKiBNaW5pbXVtIHBhc3N3b3JkIGxlbmd0aCBmb3IgY2xpZW50LXNpZGUgdmFsaWRhdGlvbi4gKi9cbiAgICBNSU5fUEFTU1dPUkRfTEVOR1RIOiA2LFxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ291cnNlIHN0YXR1c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKiBWYWxpZCB2YWx1ZXMgZm9yIENvdXJzZS5zdGF0dXMgcmVjZWl2ZWQgZnJvbSB0aGUgQVBJLiAqL1xuZXhwb3J0IGNvbnN0IENPVVJTRV9TVEFUVVMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoe1xuICAgIE5PVF9TVEFSVEVEOiAnbm90LXN0YXJ0ZWQnLFxuICAgIElOX1BST0dSRVNTOiAnaW4tcHJvZ3Jlc3MnLFxuICAgIENPTVBMRVRFRDogJ2NvbXBsZXRlZCcsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUb2FzdCBkdXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKiogQXV0by1kaXNtaXNzIGR1cmF0aW9ucyAobXMpIGZvciB0b2FzdCBub3RpZmljYXRpb25zIChQYXJ0IDEwKS4gKi9cbmV4cG9ydCBjb25zdCBUT0FTVF9EVVJBVElPTiA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgU1VDQ0VTUzogMzAwMCxcbiAgICBFUlJPUjogNTAwMCxcbiAgICBXQVJOSU5HOiA0MDAwLFxuICAgIElORk86IDQwMDAsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFcnJvciBjb2Rlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogTm9ybWFsaXNlZCBlcnJvciBjb2RlcyB1c2VkIGFjcm9zcyBzZXJ2aWNlIGFuZCBjb250ZXh0IGxheWVycy5cbiAqIFByZXZlbnRzIHNjYXR0ZXJlZCBzdHJpbmcgbGl0ZXJhbHMgd2hlbiBjb21wYXJpbmcgZXJyb3IgdHlwZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBFUlJPUl9DT0RFUyA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxuICAgIFNFU1NJT05fRVhQSVJFRDogJ1NFU1NJT05fRVhQSVJFRCcsXG4gICAgTkVUV09SS19FUlJPUjogJ05FVFdPUktfRVJST1InLFxuICAgIFZBTElEQVRJT05fRVJST1I6ICdWQUxJREFUSU9OX0VSUk9SJyxcbiAgICBVTktOT1dOOiAnVU5LTk9XTicsXG59KTtcbiIsICJjb25zdCBjb25maWcgPSB7XG4gICAgYXBwTmFtZTogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBQX05BTUUgfHwgJ1N0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tlcicsXG4gICAgYXBwRW52OiBpbXBvcnQubWV0YS5lbnYuVklURV9BUFBfRU5WIHx8ICdkZXZlbG9wbWVudCcsXG4gICAgYXBpQmFzZVVybDogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX0JBU0VfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDEvYXBpJyxcbiAgICBhcGlNb2NrRW5hYmxlZDogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX01PQ0tfRU5BQkxFRCA9PT0gJ3RydWUnLFxuICAgIGF1dGhUb2tlbktleTogaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVVUSF9UT0tFTl9LRVkgfHwgJ2F1dGhfdG9rZW4nLFxuICAgIHNlc3Npb25UaW1lb3V0TWludXRlczogcGFyc2VJbnQoaW1wb3J0Lm1ldGEuZW52LlZJVEVfU0VTU0lPTl9USU1FT1VUX01JTlVURVMgfHwgJzYwJywgMTApLFxuICAgIGVuYWJsZUFuYWx5dGljczogaW1wb3J0Lm1ldGEuZW52LlZJVEVfRU5BQkxFX0FOQUxZVElDUyA9PT0gJ3RydWUnLFxuICAgIGVuYWJsZU5vdGlmaWNhdGlvbnM6IGltcG9ydC5tZXRhLmVudi5WSVRFX0VOQUJMRV9OT1RJRklDQVRJT05TICE9PSAnZmFsc2UnLFxuICAgIGNhY2hlVHRsU2Vjb25kczogcGFyc2VJbnQoaW1wb3J0Lm1ldGEuZW52LlZJVEVfQ0FDSEVfVFRMX1NFQ09ORFMgfHwgJzMwMCcsIDEwKSxcbn07XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpIHtcbiAgICByZXR1cm4geyAuLi5jb25maWcgfTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNEZXZlbG9wbWVudCgpIHtcbiAgICByZXR1cm4gY29uZmlnLmFwcEVudiA9PT0gJ2RldmVsb3BtZW50Jztcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdGFnaW5nKCkge1xuICAgIHJldHVybiBjb25maWcuYXBwRW52ID09PSAnc3RhZ2luZyc7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvZHVjdGlvbigpIHtcbiAgICByZXR1cm4gY29uZmlnLmFwcEVudiA9PT0gJ3Byb2R1Y3Rpb24nO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc01vY2tBcGlFbmFibGVkKCkge1xuICAgIHJldHVybiBjb25maWcuYXBpTW9ja0VuYWJsZWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIHsgc3RhdHVzLCBjb2RlLCBkYXRhIH0gPSB7fSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0FwcEVycm9yJztcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBcGlFcnJvcihlcnJvcikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEFwcEVycm9yKSByZXR1cm4gZXJyb3I7XG5cbiAgICBjb25zdCBzdGF0dXMgPSBlcnJvci5zdGF0dXMgfHwgMDtcbiAgICBjb25zdCBzdGF0dXNNZXNzYWdlcyA9IHtcbiAgICAgICAgMDoge1xuICAgICAgICAgICAgdGl0bGU6ICdOZXR3b3JrIEVycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gY29ubmVjdCB0byB0aGUgc2VydmVyLiBQbGVhc2UgY2hlY2sgeW91ciBpbnRlcm5ldCBjb25uZWN0aW9uLicsXG4gICAgICAgIH0sXG4gICAgICAgIDQwMDogeyB0aXRsZTogJ0JhZCBSZXF1ZXN0JywgbWVzc2FnZTogJ1RoZSByZXF1ZXN0IHdhcyBpbnZhbGlkLiBQbGVhc2UgY2hlY2sgeW91ciBpbnB1dC4nIH0sXG4gICAgICAgIDQwMToge1xuICAgICAgICAgICAgdGl0bGU6ICdTZXNzaW9uIEV4cGlyZWQnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdXIgc2Vzc2lvbiBoYXMgZXhwaXJlZC4gUGxlYXNlIGxvZyBpbiBhZ2Fpbi4nLFxuICAgICAgICB9LFxuICAgICAgICA0MDM6IHtcbiAgICAgICAgICAgIHRpdGxlOiAnQWNjZXNzIERlbmllZCcsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gcGVyZm9ybSB0aGlzIGFjdGlvbi4nLFxuICAgICAgICB9LFxuICAgICAgICA0MDQ6IHsgdGl0bGU6ICdOb3QgRm91bmQnLCBtZXNzYWdlOiAnVGhlIHJlcXVlc3RlZCByZXNvdXJjZSBjb3VsZCBub3QgYmUgZm91bmQuJyB9LFxuICAgICAgICA0Mjk6IHsgdGl0bGU6ICdUb28gTWFueSBSZXF1ZXN0cycsIG1lc3NhZ2U6ICdQbGVhc2Ugd2FpdCBhIG1vbWVudCBiZWZvcmUgdHJ5aW5nIGFnYWluLicgfSxcbiAgICAgICAgNTAwOiB7XG4gICAgICAgICAgICB0aXRsZTogJ1NlcnZlciBFcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnQW4gdW5leHBlY3RlZCBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyxcbiAgICAgICAgfSxcbiAgICAgICAgNTAzOiB7XG4gICAgICAgICAgICB0aXRsZTogJ1NlcnZpY2UgVW5hdmFpbGFibGUnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1RoZSBzZXJ2aWNlIGlzIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicsXG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IGluZm8gPSBzdGF0dXNNZXNzYWdlc1tzdGF0dXNdIHx8IHtcbiAgICAgICAgdGl0bGU6ICdFcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfHwgJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuJyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBBcHBFcnJvcihpbmZvLm1lc3NhZ2UsIHsgc3RhdHVzLCBkYXRhOiBlcnJvci5kYXRhIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVHbG9iYWxFcnJvcnMob25FcnJvcikge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignR2xvYmFsIGVycm9yIGNhdWdodDonLCBldmVudC5lcnJvciB8fCBldmVudC5tZXNzYWdlKTtcbiAgICAgICAgaWYgKG9uRXJyb3IpIG9uRXJyb3IoZXZlbnQuZXJyb3IgfHwgeyBtZXNzYWdlOiBldmVudC5tZXNzYWdlIH0pO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicsIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uOicsIGV2ZW50LnJlYXNvbik7XG4gICAgICAgIGlmIChvbkVycm9yKSBvbkVycm9yKGV2ZW50LnJlYXNvbik7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEF1dGhlbnRpY2F0aW9uIFN0b3JhZ2UgU2VydmljZSBcdTIwMTQgUGFydCAzLlxuICpcbiAqIEFic3RyYWN0cyBhbGwgV2ViIFN0b3JhZ2UgcmVhZHMgYW5kIHdyaXRlcyByZWxhdGVkIHRvIGF1dGhlbnRpY2F0aW9uXG4gKiBiZWhpbmQgYSBjbGVhbiwgdGVzdGFibGUgQVBJIHNvIHRoYXQgQXV0aENvbnRleHQgYW5kIGF1dGhBcGkgbmV2ZXJcbiAqIHJlZmVyZW5jZSBgbG9jYWxTdG9yYWdlYCAvIGBzZXNzaW9uU3RvcmFnZWAgZGlyZWN0bHkuXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIFN0b3JhZ2Ugc3RyYXRlZ3kgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIFRva2VuIHBheWxvYWQgIHsgdG9rZW4sIGV4cGlyZXNBdCwgdXNlciB9XG4gKiAgIFx1MjUwQ1x1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUxMFxuICogICBcdTI1MDIgIHJlbWVtYmVyTWUgPSB0cnVlICBcdTIxOTIgbG9jYWxTdG9yYWdlICAgKHBlcnNpc3RzIGFjcm9zcyBicm93c2VyIGNsb3NlKSBcdTI1MDJcbiAqICAgXHUyNTAyICByZW1lbWJlck1lID0gZmFsc2UgXHUyMTkyIHNlc3Npb25TdG9yYWdlIChjbGVhcmVkIG9uIHRhYi9icm93c2VyIGNsb3NlKSAgXHUyNTAyXG4gKiAgIFx1MjUxNFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUxOFxuICpcbiAqICAgUmVhZCBvcmRlcjogbG9jYWxTdG9yYWdlIGZpcnN0IFx1MjE5MiBzZXNzaW9uU3RvcmFnZSBmYWxsYmFjay5cbiAqICAgQ2xlYXI6IGJvdGggdGllcnMgYXJlIGFsd2F5cyB3aXBlZCB0byBwcmV2ZW50IG9ycGhhbmVkIHRva2Vucy5cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgUHJpdmF0ZS1icm93c2luZyBmYWxsYmFjayAoRlItU1RPUi0wMDYpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBJbiBlbnZpcm9ubWVudHMgd2hlcmUgV2ViIFN0b3JhZ2UgaXMgYmxvY2tlZCAoU2FmYXJpIHByaXZhdGUgbW9kZSxcbiAqICAgY2VydGFpbiBlbnRlcnByaXNlIGJyb3dzZXJzKSBldmVyeSBzdG9yYWdlIGNhbGwgaXMgY2F1Z2h0IGFuZCBhblxuICogICBpbi1tZW1vcnkgTWFwIGlzIHVzZWQgaW5zdGVhZC4gVGhlIGluLW1lbW9yeSBzdG9yZSBpcyBlcGhlbWVyYWwgXHUyMDE0XG4gKiAgIGl0IGxpdmVzIG9ubHkgZm9yIHRoZSBjdXJyZW50IHBhZ2UgbGlmZWN5Y2xlIFx1MjAxNCBidXQgaXQgYWxsb3dzIHRoZVxuICogICBhcHBsaWNhdGlvbiB0byBmdW5jdGlvbiB3aXRob3V0IGNyYXNoaW5nLlxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBFeHBvcnRlZCBBUEkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIHNhdmVBdXRoVG9rZW4oeyB0b2tlbiwgZXhwaXJlc0F0LCByZW1lbWJlck1lIH0pXG4gKiAgIGdldEF1dGhUb2tlbigpXG4gKiAgIGNsZWFyQXV0aFRva2VuKClcbiAqICAgc2F2ZVJlZGlyZWN0UGF0aChwYXRoKVxuICogICBnZXRSZWRpcmVjdFBhdGgoKVxuICpcbiAqIEBtb2R1bGUgc2VydmljZXMvYXV0aFN0b3JhZ2VcbiAqL1xuXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuLi9jb25maWcvZW52LmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFN0b3JhZ2Uga2V5cyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBSZXNvbHZlZCBvbmNlIGF0IG1vZHVsZSBsb2FkIGZyb20gRU5WIHNvIGV2ZXJ5IGZ1bmN0aW9uIHVzZXMgdGhlXG4vLyBzYW1lIGtleSBzdHJpbmcgd2l0aG91dCByZXBlYXRpbmcgbWFnaWMgdmFsdWVzLlxuXG4vKiogQHR5cGUge3N0cmluZ30gS2V5IHVuZGVyIHdoaWNoIHRoZSBhdXRoIHBheWxvYWQgaXMgc3RvcmVkLiAqL1xuY29uc3QgVE9LRU5fS0VZID0gRU5WLkFVVEhfVE9LRU5fS0VZO1xuXG4vKiogQHR5cGUge3N0cmluZ30gS2V5IHVuZGVyIHdoaWNoIHRoZSBwcmUtbG9naW4gcmVkaXJlY3QgcGF0aCBpcyBzdG9yZWQuICovXG5jb25zdCBSRURJUkVDVF9LRVkgPSBFTlYuQVVUSF9SRURJUkVDVF9LRVk7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBJbi1tZW1vcnkgZmFsbGJhY2sgc3RvcmUgKEZSLVNUT1ItMDA2KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vXG4vLyBVc2VkIHdoZW4gYm90aCBsb2NhbFN0b3JhZ2UgYW5kIHNlc3Npb25TdG9yYWdlIHRocm93IChlLmcuIHByaXZhdGUgbW9kZSkuXG4vLyBLZXlzIG1pcnJvciB0aGUgV2ViIFN0b3JhZ2Uga2V5IG5hbWVzIHNvIHRoZSByZXN0IG9mIHRoZSBjb2RlIHN0YXlzIHVuaWZvcm0uXG5cbi8qKiBAdHlwZSB7TWFwPHN0cmluZywgc3RyaW5nPn0gKi9cbmNvbnN0IF9tZW1vcnlTdG9yZSA9IG5ldyBNYXAoKTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFByaXZhdGUgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBBdHRlbXB0cyB0byByZWFkIGFuZCBKU09OLXBhcnNlIGEgdmFsdWUgZnJvbSBhIHNpbmdsZSBXZWIgU3RvcmFnZSB0aWVyLlxuICogUmV0dXJucyBudWxsIG9uIGFueSBmYWlsdXJlIChtaXNzaW5nIGtleSwgbWFsZm9ybWVkIEpTT04sIHN0b3JhZ2UgYmxvY2tlZCkuXG4gKlxuICogQHBhcmFtIHtTdG9yYWdlfSBzdG9yYWdlIC0gYGxvY2FsU3RvcmFnZWAgb3IgYHNlc3Npb25TdG9yYWdlYFxuICogQHBhcmFtIHtzdHJpbmd9ICBrZXkgICAgIC0gVGhlIHN0b3JhZ2Uga2V5IHRvIHJlYWRcbiAqIEByZXR1cm5zIHt1bmtub3dufG51bGx9ICBQYXJzZWQgdmFsdWUgb3IgbnVsbFxuICovXG5mdW5jdGlvbiBfc3RvcmFnZVJlYWQoc3RvcmFnZSwga2V5KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmF3ID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgIGlmIChyYXcgPT09IG51bGwgfHwgcmF3ID09PSAnJykgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJhdyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLyoqXG4gKiBBdHRlbXB0cyB0byBKU09OLXNlcmlhbGlzZSBhIHZhbHVlIGFuZCB3cml0ZSBpdCB0byBhIFdlYiBTdG9yYWdlIHRpZXIuXG4gKiBGYWxscyBiYWNrIHRvIHRoZSBpbi1tZW1vcnkgc3RvcmUgd2hlbiBzdG9yYWdlIGlzIHVuYXZhaWxhYmxlLlxuICpcbiAqIEBwYXJhbSB7U3RvcmFnZX0gc3RvcmFnZSAtIGBsb2NhbFN0b3JhZ2VgIG9yIGBzZXNzaW9uU3RvcmFnZWBcbiAqIEBwYXJhbSB7c3RyaW5nfSAga2V5ICAgICAtIFRoZSBzdG9yYWdlIGtleSB0byB3cml0ZVxuICogQHBhcmFtIHt1bmtub3dufSB2YWx1ZSAgIC0gQW55IEpTT04tc2VyaWFsaXNhYmxlIHZhbHVlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSB3aGVuIHRoZSB3cml0ZSBzdWNjZWVkZWQgdG8gV2ViIFN0b3JhZ2U7IGZhbHNlIHdoZW5cbiAqICAgICAgICAgICAgICAgICAgICB0aGUgZmFsbGJhY2sgaW4tbWVtb3J5IHN0b3JlIHdhcyB1c2VkXG4gKi9cbmZ1bmN0aW9uIF9zdG9yYWdlV3JpdGUoc3RvcmFnZSwga2V5LCB2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBTdG9yYWdlIHVuYXZhaWxhYmxlIChwcml2YXRlIGJyb3dzaW5nLCBxdW90YSBleGNlZWRlZCkgXHUyMDE0IHVzZSBtZW1vcnkuXG4gICAgICAgIF9tZW1vcnlTdG9yZS5zZXQoa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIHJlbW92ZSBhIGtleSBmcm9tIGEgV2ViIFN0b3JhZ2UgdGllci5cbiAqIEFsc28gcmVtb3ZlcyB0aGUga2V5IGZyb20gdGhlIGluLW1lbW9yeSBmYWxsYmFjayB0byBrZWVwIHRoZW0gaW4gc3luYy5cbiAqXG4gKiBAcGFyYW0ge1N0b3JhZ2V9IHN0b3JhZ2UgLSBgbG9jYWxTdG9yYWdlYCBvciBgc2Vzc2lvblN0b3JhZ2VgXG4gKiBAcGFyYW0ge3N0cmluZ30gIGtleSAgICAgLSBUaGUga2V5IHRvIHJlbW92ZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIF9zdG9yYWdlUmVtb3ZlKHN0b3JhZ2UsIGtleSkge1xuICAgIHRyeSB7XG4gICAgICAgIHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBTdG9yYWdlIHVuYXZhaWxhYmxlIFx1MjAxNCBmYWxsIHRocm91Z2ggdG8gbWVtb3J5IHJlbW92YWwgYmVsb3cuXG4gICAgfVxuICAgIF9tZW1vcnlTdG9yZS5kZWxldGUoa2V5KTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEV4cG9ydGVkIEFQSSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBQZXJzaXN0cyB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gcGF5bG9hZCB0byB0aGUgYXBwcm9wcmlhdGUgc3RvcmFnZSB0aWVyLlxuICpcbiAqIFN0b3JlZCBwYXlsb2FkIHNoYXBlOlxuICogYGBganNvblxuICogeyBcInRva2VuXCI6IFwiXHUyMDI2XCIsIFwiZXhwaXJlc0F0XCI6IDEyMzQ1Njc4OTAwMDAsIFwidXNlclwiOiB7IFx1MjAyNiB9IH1cbiAqIGBgYFxuICpcbiAqIGBleHBpcmVzQXRgIGlzIG5vcm1hbGlzZWQgdG8gYSBVbml4IHRpbWVzdGFtcCAobXMpIGhlcmUgcmVnYXJkbGVzcyBvZlxuICogd2hldGhlciB0aGUgc2VydmVyIHJldHVybnMgYW4gSVNPLTg2MDEgc3RyaW5nIG9yIGEgbnVtZXJpYyB2YWx1ZS5cbiAqIFRoaXMgZ3VhcmFudGVlcyB0aGF0IGBnZXRBdXRoVG9rZW4oKWAgY2FuIGFsd2F5cyBjb21wYXJlIGFnYWluc3QgYERhdGUubm93KClgXG4gKiB3aXRob3V0IGZ1cnRoZXIgdHlwZS1jaGVja2luZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcyAgICAgICAgICAgICAtIFRva2VuIGRhdGEgZnJvbSB0aGUgYXV0aCBBUEkgcmVzcG9uc2VcbiAqIEBwYXJhbSB7c3RyaW5nfSAgcGFyYW1zLnRva2VuICAgICAgIC0gUmF3IEpXVCBvciBzZXNzaW9uIHRva2VuIHN0cmluZ1xuICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBwYXJhbXMuZXhwaXJlc0F0IC0gVG9rZW4gZXhwaXJ5IGFzIGEgVW5peCBtcyB0aW1lc3RhbXBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgYW4gSVNPLTg2MDEgc3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtcy51c2VyICAgICAgICAtIEF1dGhlbnRpY2F0ZWQgdXNlciBvYmplY3RcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3BhcmFtcy5yZW1lbWJlck1lPWZhbHNlXSAtIFdoZW4gdHJ1ZTogdXNlIGxvY2FsU3RvcmFnZTtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gZmFsc2U6IHVzZSBzZXNzaW9uU3RvcmFnZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXZlQXV0aFRva2VuKHsgdG9rZW4sIGV4cGlyZXNBdCwgdXNlciwgcmVtZW1iZXJNZSA9IGZhbHNlIH0pIHtcbiAgICAvLyBOb3JtYWxpc2UgZXhwaXJlc0F0OiBhY2NlcHQgYm90aCBJU08gc3RyaW5ncyBhbmQgbnVtZXJpYyB0aW1lc3RhbXBzLlxuICAgIGNvbnN0IG5vcm1hbGlzZWQgPVxuICAgICAgICB0eXBlb2YgZXhwaXJlc0F0ID09PSAnc3RyaW5nJyA/IG5ldyBEYXRlKGV4cGlyZXNBdCkuZ2V0VGltZSgpIDogTnVtYmVyKGV4cGlyZXNBdCk7XG5cbiAgICBjb25zdCBwYXlsb2FkID0geyB0b2tlbiwgZXhwaXJlc0F0OiBub3JtYWxpc2VkLCB1c2VyIH07XG5cbiAgICBpZiAocmVtZW1iZXJNZSkge1xuICAgICAgICAvLyBQZXJzaXN0ZW50IHNlc3Npb24gXHUyMDE0IHN1cnZpdmVzIGJyb3dzZXIgcmVzdGFydC5cbiAgICAgICAgX3N0b3JhZ2VXcml0ZShsb2NhbFN0b3JhZ2UsIFRPS0VOX0tFWSwgcGF5bG9hZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU2Vzc2lvbi1zY29wZWQgXHUyMDE0IGNsZWFyZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSB0YWIvYnJvd3NlciBjbG9zZXMuXG4gICAgICAgIF9zdG9yYWdlV3JpdGUoc2Vzc2lvblN0b3JhZ2UsIFRPS0VOX0tFWSwgcGF5bG9hZCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgc3RvcmVkIGF1dGhlbnRpY2F0aW9uIHRva2VuIHBheWxvYWQuXG4gKlxuICogUmVhZCBvcmRlcjpcbiAqICAgMS4gYGxvY2FsU3RvcmFnZWAgICBcdTIwMTQgXCJyZW1lbWJlciBtZVwiIHNlc3Npb25zXG4gKiAgIDIuIGBzZXNzaW9uU3RvcmFnZWAgXHUyMDE0IHRhYi1zY29wZWQgc2Vzc2lvbnNcbiAqICAgMy4gSW4tbWVtb3J5IHN0b3JlICBcdTIwMTQgcHJpdmF0ZS1icm93c2luZyBmYWxsYmFja1xuICpcbiAqIFJldHVybnMgbnVsbCB3aGVuIG5vIHZhbGlkIHRva2VuIHBheWxvYWQgaXMgZm91bmQgaW4gYW55IHRpZXIuXG4gKlxuICogQHJldHVybnMge3sgdG9rZW46IHN0cmluZywgZXhwaXJlc0F0OiBudW1iZXIsIHVzZXI6IE9iamVjdCB9fG51bGx9XG4gKiAgIFRoZSBzdG9yZWQgcGF5bG9hZCwgb3IgbnVsbCB3aGVuIG5vbmUgZXhpc3RzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdXRoVG9rZW4oKSB7XG4gICAgLy8gQ2hlY2sgV2ViIFN0b3JhZ2UgdGllcnMgZmlyc3QuXG4gICAgY29uc3QgZnJvbUxvY2FsID0gX3N0b3JhZ2VSZWFkKGxvY2FsU3RvcmFnZSwgVE9LRU5fS0VZKTtcbiAgICBpZiAoZnJvbUxvY2FsKSByZXR1cm4gZnJvbUxvY2FsO1xuXG4gICAgY29uc3QgZnJvbVNlc3Npb24gPSBfc3RvcmFnZVJlYWQoc2Vzc2lvblN0b3JhZ2UsIFRPS0VOX0tFWSk7XG4gICAgaWYgKGZyb21TZXNzaW9uKSByZXR1cm4gZnJvbVNlc3Npb247XG5cbiAgICAvLyBGYWxsIGJhY2sgdG8gdGhlIGluLW1lbW9yeSBzdG9yZSAocHJpdmF0ZS1icm93c2luZyBlbnZpcm9ubWVudHMpLlxuICAgIGNvbnN0IHJhdyA9IF9tZW1vcnlTdG9yZS5nZXQoVE9LRU5fS0VZKTtcbiAgICBpZiAoIXJhdykgcmV0dXJuIG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyYXcpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gcGF5bG9hZCBmcm9tIGFsbCBzdG9yYWdlIHRpZXJzLlxuICpcbiAqIENsZWFycyBsb2NhbFN0b3JhZ2UsIHNlc3Npb25TdG9yYWdlLCBBTkQgdGhlIGluLW1lbW9yeSBmYWxsYmFja1xuICogc28gdGhhdCBubyBvcnBoYW5lZCB0b2tlbiBjYW4gYmUgZm91bmQgYnkgYSBzdWJzZXF1ZW50IGBnZXRBdXRoVG9rZW4oKWAgY2FsbCxcbiAqIHJlZ2FyZGxlc3Mgb2Ygd2hpY2ggdGllciB3YXMgdXNlZCBkdXJpbmcgbG9naW4uXG4gKlxuICogQWxzbyByZW1vdmVzIHRoZSBzYXZlZCByZWRpcmVjdCBwYXRoIGZyb20gc2Vzc2lvblN0b3JhZ2UuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckF1dGhUb2tlbigpIHtcbiAgICBfc3RvcmFnZVJlbW92ZShsb2NhbFN0b3JhZ2UsIFRPS0VOX0tFWSk7XG4gICAgX3N0b3JhZ2VSZW1vdmUoc2Vzc2lvblN0b3JhZ2UsIFRPS0VOX0tFWSk7XG4gICAgLy8gUmVtb3ZlIHRoZSBwcmUtbG9naW4gcmVkaXJlY3QgcGF0aCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgIF9zdG9yYWdlUmVtb3ZlKHNlc3Npb25TdG9yYWdlLCBSRURJUkVDVF9LRVkpO1xufVxuXG4vKipcbiAqIFNhdmVzIHRoZSBwYXRoIHRoZSB1c2VyIHdhcyBhdHRlbXB0aW5nIHRvIHZpc2l0IGJlZm9yZSBiZWluZyByZWRpcmVjdGVkXG4gKiB0byB0aGUgbG9naW4gcGFnZS4gIFN0b3JlZCBpbiBzZXNzaW9uU3RvcmFnZSBiZWNhdXNlIHRoZSByZWRpcmVjdCBpbnRlbnRcbiAqIGlzIG9ubHkgcmVsZXZhbnQgZm9yIHRoZSBjdXJyZW50IGJyb3dzZXIgc2Vzc2lvbi5cbiAqXG4gKiBBZnRlciBhIHN1Y2Nlc3NmdWwgbG9naW4sIGBnZXRSZWRpcmVjdFBhdGgoKWAgcmV0cmlldmVzIGFuZCByZW1vdmVzIHRoaXNcbiAqIHZhbHVlIHNvIHRoZSByb3V0ZXIgY2FuIG5hdmlnYXRlIHRvIHRoZSBpbnRlbmRlZCBkZXN0aW5hdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIEEgcmVsYXRpdmUgVVJMIHBhdGgsIGUuZy4gJy9kYXNoYm9hcmQnXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2FsbGVkIGJ5IEF1dGhHdWFyZCB3aGVuIHJlZGlyZWN0aW5nIGFuIHVuYXV0aGVudGljYXRlZCB1c2VyOlxuICogc2F2ZVJlZGlyZWN0UGF0aCgnL2Rhc2hib2FyZCcpO1xuICogcm91dGVyLm5hdmlnYXRlKFJPVVRFUy5MT0dJTik7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUmVkaXJlY3RQYXRoKHBhdGgpIHtcbiAgICAvLyBPbmx5IHN0b3JlIHdlbGwtZm9ybWVkIHJlbGF0aXZlIHBhdGhzIHRvIHByZXZlbnQgb3Blbi1yZWRpcmVjdCBhdHRhY2tzLlxuICAgIC8vIHNhbml0aXplUGF0aCgpIGluIGF1dGhIZWxwZXJzLmpzIGVuZm9yY2VzIHRoaXMgXHUyMDE0IGNhbGwgaXQgYmVmb3JlIGhlcmUuXG4gICAgdHJ5IHtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRURJUkVDVF9LRVksIHBhdGgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICBfbWVtb3J5U3RvcmUuc2V0KFJFRElSRUNUX0tFWSwgcGF0aCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHJpZXZlcyBhbmQgaW1tZWRpYXRlbHkgcmVtb3ZlcyB0aGUgc2F2ZWQgcHJlLWxvZ2luIHJlZGlyZWN0IHBhdGguXG4gKlxuICogVGhlIG9uZS10aW1lIHJlYWQtYW5kLWRlbGV0ZSBiZWhhdmlvdXIgcHJldmVudHMgc3RhbGUgcmVkaXJlY3QgcGF0aHNcbiAqIGZyb20gcGVyc2lzdGluZyBhY3Jvc3MgbXVsdGlwbGUgbG9naW4gc2Vzc2lvbnMgKGEgc2VjdXJpdHkgY29uc2lkZXJhdGlvbikuXG4gKlxuICogUmV0dXJucyB0aGUgZGVmYXVsdCBkYXNoYm9hcmQgcGF0aCB3aGVuIG5vIHJlZGlyZWN0IHBhdGggd2FzIHNhdmVkLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBzYXZlZCBwYXRoLCBvciBgJy9kYXNoYm9hcmQnYCB3aGVuIG5vbmUgZXhpc3RzXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIENhbGxlZCBieSBMb2dpbkZvcm0gYWZ0ZXIgYSBzdWNjZXNzZnVsIGxvZ2luOlxuICogY29uc3QgZGVzdGluYXRpb24gPSBnZXRSZWRpcmVjdFBhdGgoKTsgIC8vIGUuZy4gJy9kYXNoYm9hcmQnXG4gKiByb3V0ZXIubmF2aWdhdGUoZGVzdGluYXRpb24pO1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVkaXJlY3RQYXRoKCkge1xuICAgIC8vIFRyeSBzZXNzaW9uU3RvcmFnZSBmaXJzdC5cbiAgICBsZXQgcGF0aCA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgICAgcGF0aCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVESVJFQ1RfS0VZKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShSRURJUkVDVF9LRVkpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgICAvLyBGYWxsIHRocm91Z2ggdG8gbWVtb3J5IHN0b3JlIGJlbG93LlxuICAgIH1cblxuICAgIC8vIFRyeSBpbi1tZW1vcnkgZmFsbGJhY2sgaWYgc2Vzc2lvblN0b3JhZ2Ugd2FzIHVuYXZhaWxhYmxlLlxuICAgIGlmICghcGF0aCkge1xuICAgICAgICBwYXRoID0gX21lbW9yeVN0b3JlLmdldChSRURJUkVDVF9LRVkpID8/IG51bGw7XG4gICAgICAgIF9tZW1vcnlTdG9yZS5kZWxldGUoUkVESVJFQ1RfS0VZKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGF0aCA/PyAnL2Rhc2hib2FyZCc7XG59XG4iLCAiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi4vdXRpbHMvZW52LmpzJztcbmltcG9ydCB7IG5vcm1hbGl6ZUFwaUVycm9yIH0gZnJvbSAnLi4vdXRpbHMvZXJyb3JzLmpzJztcbmltcG9ydCB7IGdldEF1dGhUb2tlbiB9IGZyb20gJy4vYXV0aFN0b3JhZ2UuanMnO1xuXG5sZXQgbW9ja0hhbmRsZXJzID0gbnVsbDtcblxuLyoqXG4gKlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5pdEFwaSgpIHtcbiAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcoKTtcblxuICAgIGlmIChjb25maWcuYXBpTW9ja0VuYWJsZWQpIHtcbiAgICAgICAgY29uc3QgeyBzZXR1cE1vY2tTZXJ2ZXIgfSA9IGF3YWl0IGltcG9ydCgnLi9tb2NrLmpzJyk7XG4gICAgICAgIG1vY2tIYW5kbGVycyA9IHNldHVwTW9ja1NlcnZlcigpO1xuICAgIH1cbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9ja1NlcnZlcigpIHtcbiAgICByZXR1cm4gbW9ja0hhbmRsZXJzO1xufVxuXG4vKipcbiAqIEFwaVNlcnZpY2UgY2xhc3MgaGFuZGxlcyBhbGwgQVBJIHJlcXVlc3RzLlxuICogUHJvdmlkZXMgYSBjZW50cmFsaXplZCBmZXRjaCB3cmFwcGVyIHdpdGggYXV0b21hdGljIHRva2VuIGluamVjdGlvbixcbiAqIHJlc3BvbnNlIG5vcm1hbGl6YXRpb24sIHRpbWVvdXQgaGFuZGxpbmcsIHJldHJ5IGxvZ2ljIHdpdGggZXhwb25lbnRpYWwgYmFja29mZixcbiAqIGFuZCByZXF1ZXN0IGRlZHVwbGljYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBBcGlTZXJ2aWNlIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGJhc2VVcmwgPSAnJykge1xuICAgICAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsIHx8ICh3aW5kb3cuQ09ORklHICYmIHdpbmRvdy5DT05GSUcuQVBJX0JBU0VfVVJMKSB8fCAnL2FwaSc7XG5cbiAgICAgICAgdGhpcy5wZW5kaW5nUmVxdWVzdHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMudGltZW91dE1zID0gMTAwMDA7XG4gICAgICAgIHRoaXMubWF4UmV0cmllcyA9IDM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVxdWVzdCBpbnRlcmNlcHRvciB0byBpbmplY3QgYXV0aGVudGljYXRpb24gdG9rZW5zLlxuICAgICAqL1xuICAgIF9yZXF1ZXN0SW50ZXJjZXB0b3Iob3B0aW9ucywgZW5kcG9pbnQpIHtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyB8fCB7fSk7XG4gICAgICAgIGhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuXG4gICAgICAgIGlmICghb3B0aW9ucy5ub1Rva2VuICYmICFlbmRwb2ludC5zdGFydHNXaXRoKCcvYXV0aC8nKSkge1xuICAgICAgICAgICAgY29uc3QgYXV0aERhdGEgPSBnZXRBdXRoVG9rZW4oKTtcbiAgICAgICAgICAgIGlmIChhdXRoRGF0YT8udG9rZW4pIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLnNldCgnQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHthdXRoRGF0YS50b2tlbn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNwb25zZSBpbnRlcmNlcHRvciB0byBub3JtYWxpemUgdGhlIHJlc3BvbnNlIGZvcm1hdCBhbmQgaGFuZGxlIGNvbW1vbiBlcnJvcnMuXG4gICAgICovXG4gICAgYXN5bmMgX3Jlc3BvbnNlSW50ZXJjZXB0b3IocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYEhUVFAgJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICAgICAgICBlcnJvci5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gZXJyb3JEYXRhLm1lc3NhZ2UgfHwgZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBlcnJvci5kYXRhID0gZXJyb3JEYXRhO1xuICAgICAgICAgICAgfSBjYXRjaCAoX2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvclRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9IGVycm9yVGV4dCB8fCBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkRXJyb3IgPSBub3JtYWxpemVBcGlFcnJvcihlcnJvcik7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSA0MDEgVW5hdXRob3JpemVkIGdsb2JhbGx5XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgd2luZG93LkN1c3RvbUV2ZW50KCdhdXRoOnVuYXV0aG9yaXplZCcpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgbm9ybWFsaXplZEVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGVudFR5cGUgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJyk7XG4gICAgICAgIGlmIChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgYSB1bmlxdWUga2V5IGZvciBkZWR1cGxpY2F0aW9uIGJhc2VkIG9uIG1ldGhvZCwgdXJsLCBhbmQgYm9keS5cbiAgICAgKi9cbiAgICBfZ2V0UmVxdWVzdEtleShtZXRob2QsIHVybCwgYm9keSkge1xuICAgICAgICByZXR1cm4gYCR7bWV0aG9kfToke3VybH06JHtib2R5IHx8ICcnfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIHRvIGRldGVjdCBuZXR3b3JrIGVycm9ycyBmb3IgcmV0cnkgbG9naWMuXG4gICAgICovXG4gICAgX2lzTmV0d29ya0Vycm9yKGVycm9yKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBlcnJvci5uYW1lID09PSAnVHlwZUVycm9yJyB8fFxuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9PT0gJ0ZhaWxlZCB0byBmZXRjaCcgfHxcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UuaW5jbHVkZXMoJ05ldHdvcmtFcnJvcicpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29yZSByZXF1ZXN0IG1ldGhvZFxuICAgICAqL1xuICAgIGFzeW5jIHJlcXVlc3QoZW5kcG9pbnQsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBtZXRob2QgPSAnR0VUJyxcbiAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICByZXRyeUNvdW50ID0gMCxcbiAgICAgICAgICAgIHNraXBEZWR1cCA9IGZhbHNlLFxuICAgICAgICAgICAgLi4ub3RoZXJPcHRpb25zXG4gICAgICAgIH0gPSBvcHRpb25zO1xuXG4gICAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuYmFzZVVybH0ke2VuZHBvaW50fWA7XG5cbiAgICAgICAgLy8gQ2hlY2sgZGVkdXBsaWNhdGlvblxuICAgICAgICBjb25zdCByZXF1ZXN0S2V5ID0gIXNraXBEZWR1cCAmJiB0aGlzLl9nZXRSZXF1ZXN0S2V5KG1ldGhvZCwgdXJsLCBib2R5KTtcbiAgICAgICAgaWYgKHJlcXVlc3RLZXkgJiYgdGhpcy5wZW5kaW5nUmVxdWVzdHMuaGFzKHJlcXVlc3RLZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wZW5kaW5nUmVxdWVzdHMuZ2V0KHJlcXVlc3RLZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMS4gUnVuIHJlcXVlc3QgaW50ZXJjZXB0b3JcbiAgICAgICAgY29uc3QgZmV0Y2hPcHRpb25zID0gdGhpcy5fcmVxdWVzdEludGVyY2VwdG9yKHsgbWV0aG9kLCBib2R5LCAuLi5vdGhlck9wdGlvbnMgfSwgZW5kcG9pbnQpO1xuXG4gICAgICAgIC8vIFRpbWVvdXQgaGFuZGxpbmdcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgZmV0Y2hPcHRpb25zLnNpZ25hbCA9IGNvbnRyb2xsZXIuc2lnbmFsO1xuXG4gICAgICAgIGNvbnN0IHRpbWVvdXRQcm9taXNlID0gbmV3IFByb21pc2UoKF9yZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdSZXF1ZXN0IHRpbWVvdXQnKSk7XG4gICAgICAgICAgICB9LCB0aGlzLnRpbWVvdXRNcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRoZSBhY3R1YWwgZmV0Y2ggd3JhcHBlZCBpbiBvdXIgaW50ZXJjZXB0b3JzXG4gICAgICAgIGNvbnN0IGZldGNoUHJvbWlzZSA9IGZldGNoKHVybCwgZmV0Y2hPcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oYXN5bmMgcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0S2V5KSB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5kZWxldGUocmVxdWVzdEtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX3Jlc3BvbnNlSW50ZXJjZXB0b3IocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RLZXkpIHRoaXMucGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0S2V5KTtcblxuICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBhYm9ydCBzcGVjaWZpY2FsbHlcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IubmFtZSA9PT0gJ0Fib3J0RXJyb3InKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPT09ICdUaGUgdXNlciBhYm9ydGVkIGEgcmVxdWVzdC4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnUmVxdWVzdCBjYW5jZWxsZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnUmVxdWVzdCB0aW1lb3V0J1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJldHJ5IHdpdGggZXhwb25lbnRpYWwgYmFja29mZiBvbiBuZXR3b3JrIGVycm9yc1xuICAgICAgICAgICAgICAgIGlmIChyZXRyeUNvdW50IDwgdGhpcy5tYXhSZXRyaWVzICYmIHRoaXMuX2lzTmV0d29ya0Vycm9yKGVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxheSA9IE1hdGgucG93KDIsIHJldHJ5Q291bnQpICogMTAwMDsgLy8gMXMsIDJzLCA0c1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRyeUNvdW50OiByZXRyeUNvdW50ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBBUEkgRXJyb3Igb24gJHtlbmRwb2ludH06YCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmFjZSBmZXRjaCBhZ2FpbnN0IHRpbWVvdXRcbiAgICAgICAgY29uc3QgcmVxdWVzdFByb21pc2UgPSBQcm9taXNlLnJhY2UoW2ZldGNoUHJvbWlzZSwgdGltZW91dFByb21pc2VdKTtcblxuICAgICAgICAvLyBTdG9yZSBmb3IgZGVkdXBsaWNhdGlvblxuICAgICAgICBpZiAocmVxdWVzdEtleSkge1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nUmVxdWVzdHMuc2V0KHJlcXVlc3RLZXksIHJlcXVlc3RQcm9taXNlKTtcbiAgICAgICAgICAgIC8vIEVuc3VyZSB3ZSBjbGVhbiB1cCBpZiByYWNlIHJlc29sdmVzIGJlZm9yZSBmaW5hbGx5IGJsb2NrXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9jYXRjaC1vci1yZXR1cm5cbiAgICAgICAgICAgIHJlcXVlc3RQcm9taXNlLmZpbmFsbHkoKCkgPT4gdGhpcy5wZW5kaW5nUmVxdWVzdHMuZGVsZXRlKHJlcXVlc3RLZXkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGdldChlbmRwb2ludCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIHsgbWV0aG9kOiAnR0VUJywgLi4ub3B0aW9ucyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHBvc3QoZW5kcG9pbnQsIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpLFxuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBwdXQoZW5kcG9pbnQsIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSksXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHBhdGNoKGVuZHBvaW50LCBib2R5LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChlbmRwb2ludCwge1xuICAgICAgICAgICAgbWV0aG9kOiAnUEFUQ0gnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSksXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGRlbGV0ZShlbmRwb2ludCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIHsgbWV0aG9kOiAnREVMRVRFJywgLi4ub3B0aW9ucyB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBhcGkgPSBuZXcgQXBpU2VydmljZSgpO1xuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBdXRoZW50aWNhdGlvbiBBUEkgU2VydmljZSBcdTIwMTQgUGFydCAzLlxuICpcbiAqIEVuY2Fwc3VsYXRlcyBldmVyeSBIVFRQIGNhbGwgcmVsYXRlZCB0byBhdXRoZW50aWNhdGlvbiBzbyB0aGF0XG4gKiBjb25zdW1lcnMgKEF1dGhDb250ZXh0LCB1c2VBdXRoIGhvb2spIG5ldmVyIGRlYWwgd2l0aCByYXcgZmV0Y2hcbiAqIGRldGFpbHMsIFVSTCBjb25zdHJ1Y3Rpb24sIG9yIEhUVFAgZXJyb3IgY29kZXMuXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIEFQSSBJbnRlZ3JhdGlvbiBMYXllciAoUGFydCA4KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVXNlcyB0aGUgY29yZSBBcGlTZXJ2aWNlIChgc3JjL3NlcnZpY2VzL2FwaS5qc2ApIGZvciByZXRyaWVzLFxuICogICBkZWR1cGxpY2F0aW9uLCBhbmQgdGhlIHNoYXJlZCByZXNwb25zZSBpbnRlcmNlcHRvci5cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgRXJyb3Igbm9ybWFsaXNhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgQWxsIGVycm9ycyBhcmUgY2F1Z2h0IGFuZCBjb252ZXJ0ZWQgdG8gYSB7IGNvZGUsIG1lc3NhZ2UgfSBvYmplY3RcbiAqICAgdGhhdCBtYXRjaGVzIHRoZSBzaGFwZSBleHBlY3RlZCBieSBgQXV0aENvbnRleHQubm9ybWFsaXNlRXJyb3IoKWAuXG4gKlxuICogICBIVFRQIDQwMSAgXHUyMTkyIHsgY29kZTogJ0lOVkFMSURfQ1JFREVOVElBTFMnLCBtZXNzYWdlOiAnXHUyMDI2JyB9XG4gKiAgIEhUVFAgNDAwICBcdTIxOTIgeyBjb2RlOiAnVkFMSURBVElPTl9FUlJPUicsICAgIG1lc3NhZ2U6ICdcdTIwMjYnIH1cbiAqICAgTmV0d29yayAgIFx1MjE5MiB7IGNvZGU6ICdORVRXT1JLX0VSUk9SJywgICAgICAgbWVzc2FnZTogJ1x1MjAyNicgfVxuICogICBPdGhlciAgICAgXHUyMTkyIHsgY29kZTogJ1VOS05PV04nLCAgICAgICAgICAgICBtZXNzYWdlOiAnXHUyMDI2JyB9XG4gKlxuICogQG1vZHVsZSBzZXJ2aWNlcy9hdXRoQXBpXG4gKi9cblxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi4vY29uZmlnL2Vudi5qcyc7XG5pbXBvcnQgeyBBUElfRU5EUE9JTlRTLCBFUlJPUl9DT0RFUyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBhcGkgfSBmcm9tICcuL2FwaS5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBFeHBvcnRlZCBBUEkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogU2VuZHMgdGhlIHVzZXIncyBjcmVkZW50aWFscyB0byB0aGUgYXV0aGVudGljYXRpb24gZW5kcG9pbnQgYW5kIHJldHVybnNcbiAqIHRoZSByZXN1bHRpbmcgdG9rZW4gcGF5bG9hZCBvbiBzdWNjZXNzLlxuICpcbiAqIE9uIHN1Y2Nlc3MsIHJldHVybnMgdGhlIHJhdyBBUEkgcmVzcG9uc2UgYm9keTpcbiAqIGBgYGpzb25cbiAqIHtcbiAqICAgXCJ0b2tlblwiOiAgICAgXCJtb2NrLWp3dC10b2tlbi1cdTIwMjZcIixcbiAqICAgXCJleHBpcmVzQXRcIjogXCIyMDI2LTA4LTIyVDE1OjAwOjAwLjAwMFpcIixcbiAqICAgXCJ1c2VyXCI6IHtcbiAqICAgICBcImlkXCI6ICAgIFwic3R1XzAwMVwiLFxuICogICAgIFwibmFtZVwiOiAgXCJBbGV4IEpvaG5zb25cIixcbiAqICAgICBcImVtYWlsXCI6IFwic3R1ZGVudEBkZW1vLmNvbVwiLFxuICogICAgIFwicm9sZVwiOiAgXCJzdHVkZW50XCJcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogT24gZmFpbHVyZSwgdGhyb3dzIGEgbm9ybWFsaXNlZCBgeyBjb2RlLCBtZXNzYWdlIH1gIGVycm9yIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIGNyZWRlbnRpYWxzICAgICAgICAgICAgLSBMb2dpbiBmb3JtIGRhdGFcbiAqIEBwYXJhbSB7c3RyaW5nfSAgY3JlZGVudGlhbHMuZW1haWwgICAgICAtIFVzZXIncyBlbWFpbCBhZGRyZXNzXG4gKiBAcGFyYW0ge3N0cmluZ30gIGNyZWRlbnRpYWxzLnBhc3N3b3JkICAgLSBVc2VyJ3MgcGFzc3dvcmRcbiAqIEByZXR1cm5zIHtQcm9taXNlPHsgdG9rZW46IHN0cmluZywgZXhwaXJlc0F0OiBzdHJpbmd8bnVtYmVyLCB1c2VyOiBPYmplY3QgfT59XG4gKiAgIFRoZSByYXcgYXV0aCByZXNwb25zZSBib2R5XG4gKiBAdGhyb3dzIHt7IGNvZGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH19IE5vcm1hbGlzZWQgZXJyb3Igb24gZmFpbHVyZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oeyBlbWFpbCwgcGFzc3dvcmQgfSkge1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgY29uc3QgdGltZW91dElkID0gc2V0VGltZW91dCgoKSA9PiBjb250cm9sbGVyLmFib3J0KCksIEVOVi5BUElfVElNRU9VVCB8fCAxMDAwMCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGFwaS5wb3N0KFxuICAgICAgICAgICAgQVBJX0VORFBPSU5UUy5BVVRIX0xPR0lOLFxuICAgICAgICAgICAgeyBlbWFpbCwgcGFzc3dvcmQgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzaWduYWw6IGNvbnRyb2xsZXIuc2lnbmFsLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcblxuICAgICAgICBpZiAoZXJyLm5hbWUgPT09ICdBYm9ydEVycm9yJyB8fCBlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICBjb2RlOiBFUlJPUl9DT0RFUy5ORVRXT1JLX0VSUk9SLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmFibGUgdG8gY29ubmVjdC4gUGxlYXNlIGNoZWNrIHlvdXIgaW50ZXJuZXQgY29ubmVjdGlvbi4nLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnIuc3RhdHVzID09PSA0MDApIHtcbiAgICAgICAgICAgIHRocm93IHtcbiAgICAgICAgICAgICAgICBjb2RlOiBFUlJPUl9DT0RFUy5WQUxJREFUSU9OX0VSUk9SLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVyci5kYXRhPy5tZXNzYWdlID8/ICdUaGUgcmVxdWVzdCBjb250YWluZWQgaW52YWxpZCBkYXRhLicsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgIGNvZGU6IEVSUk9SX0NPREVTLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyLmRhdGE/Lm1lc3NhZ2UgPz8gJ0ludmFsaWQgZW1haWwgb3IgcGFzc3dvcmQuJyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICBjb2RlOiBFUlJPUl9DT0RFUy5VTktOT1dOLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyLmRhdGE/Lm1lc3NhZ2UgPz8gZXJyLm1lc3NhZ2UgPz8gJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuJyxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbi8qKlxuICogU2VuZHMgYSBzZXJ2ZXItc2lkZSBsb2dvdXQgcmVxdWVzdCB0byBpbnZhbGlkYXRlIHRoZSB0b2tlbi5cbiAqXG4gKiBUaGlzIGlzIGEgYmVzdC1lZmZvcnQgY2FsbCBcdTIwMTQgY2xpZW50LXNpZGUgdG9rZW4gcmVtb3ZhbCB2aWFcbiAqIGBhdXRoU3RvcmFnZS5jbGVhckF1dGhUb2tlbigpYCBpcyBhbHdheXMgcGVyZm9ybWVkIGZpcnN0IGJ5IHRoZSBjYWxsZXJcbiAqIChBdXRoQ29udGV4dC5sb2dvdXQpIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHJlcXVlc3Qgc3VjY2VlZHMuXG4gKlxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59IEFsd2F5cyByZXNvbHZlczsgbmV2ZXIgcmVqZWN0c1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGFwaS5wb3N0KCcvYXV0aC9sb2dvdXQnLCB7fSk7XG4gICAgfSBjYXRjaCAoX2Vycikge1xuICAgICAgICAvLyBGaXJlLWFuZC1mb3JnZXQ6IGZhaWwgc2lsZW50bHkgc28gdGhlIGNsaWVudCBjYW4gc3RpbGwgY2xlYXIgbG9jYWwgc3RhdGUuXG4gICAgfVxufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBdXRoZW50aWNhdGlvbiBIZWxwZXIgVXRpbGl0aWVzIFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogUHVyZSwgc3RhdGVsZXNzIGhlbHBlciBmdW5jdGlvbnMgZm9yIHRoZSBhdXRoZW50aWNhdGlvbiBtb2R1bGUuXG4gKiBObyBzaWRlIGVmZmVjdHMsIG5vIERPTSBhY2Nlc3MsIG5vIGltcG9ydHMgZnJvbSBzZXJ2aWNlcyBvciBjb250ZXh0LlxuICogRXZlcnkgZnVuY3Rpb24gaXMgaW5kZXBlbmRlbnRseSB1bml0LXRlc3RhYmxlLlxuICpcbiAqIEBtb2R1bGUgdXRpbHMvYXV0aEhlbHBlcnNcbiAqL1xuXG5pbXBvcnQgeyBST1VURVMgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBBdmF0YXIgaGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBEZXJpdmVzIHVwIHRvIHR3byB1cHBlcmNhc2UgaW5pdGlhbHMgZnJvbSBhIGZ1bGwgbmFtZSBzdHJpbmcuXG4gKlxuICogUnVsZXM6XG4gKiAtIFNwbGl0cyBvbiB3aGl0ZXNwYWNlIGFuZCB0YWtlcyB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGVhY2ggd29yZFxuICogLSBSZXR1cm5zIGEgbWF4aW11bSBvZiAyIGluaXRpYWxzIChmaXJzdCArIGxhc3Qgd29yZClcbiAqIC0gRmFsbHMgYmFjayB0byBgJz8nYCB3aGVuIHRoZSBpbnB1dCBpcyBlbXB0eSBvciBub3QgYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIFRoZSB1c2VyJ3MgZnVsbCBuYW1lIChlLmcuIGAnQWxleCBKb2huc29uJ2ApXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBVcCB0byAyIHVwcGVyY2FzZSBpbml0aWFscyAoZS5nLiBgJ0FKJ2ApXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldEluaXRpYWxzKCdBbGV4IEpvaG5zb24nKSAgICAgIC8vICdBSidcbiAqIGdldEluaXRpYWxzKCdQcml5YScpICAgICAgICAgICAgIC8vICdQJ1xuICogZ2V0SW5pdGlhbHMoJ01hcmlhIGRlbCBDYXJtZW4nKSAgLy8gJ01DJ1xuICogZ2V0SW5pdGlhbHMoJycpICAgICAgICAgICAgICAgICAgLy8gJz8nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbml0aWFscyhuYW1lKSB7XG4gICAgaWYgKCFuYW1lIHx8IHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykgcmV0dXJuICc/JztcblxuICAgIGNvbnN0IHdvcmRzID0gbmFtZS50cmltKCkuc3BsaXQoL1xccysvKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgaWYgKHdvcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICc/JztcblxuICAgIGNvbnN0IGZpcnN0ID0gd29yZHNbMF1bMF0udG9VcHBlckNhc2UoKTtcbiAgICBpZiAod29yZHMubGVuZ3RoID09PSAxKSByZXR1cm4gZmlyc3Q7XG5cbiAgICBjb25zdCBsYXN0ID0gd29yZHNbd29yZHMubGVuZ3RoIC0gMV1bMF0udG9VcHBlckNhc2UoKTtcbiAgICByZXR1cm4gZmlyc3QgKyBsYXN0O1xufVxuXG4vKipcbiAqIERlcml2ZXMgYSBjb25zaXN0ZW50LCBkZXRlcm1pbmlzdGljIGhleCBiYWNrZ3JvdW5kIGNvbG91ciBmcm9tIGEgc3RyaW5nXG4gKiBzZWVkICh1c2VyIElEIG9yIG5hbWUpLiAgR2l2ZW4gdGhlIHNhbWUgc2VlZCwgdGhpcyBmdW5jdGlvbiBhbHdheXMgcmV0dXJuc1xuICogdGhlIHNhbWUgY29sb3VyLCBwcm92aWRpbmcgdmlzdWFsIGNvbnNpc3RlbmN5IGFjcm9zcyBwYWdlIGxvYWRzIHdpdGhvdXRcbiAqIHN0b3JpbmcgdGhlIGNvbG91ciBzZXJ2ZXItc2lkZS5cbiAqXG4gKiBVc2VzIGEgc2ltcGxlIGhhc2ggKGRqYjItc3R5bGUpIHRvIG1hcCB0aGUgc2VlZCB0byBvbmUgb2YgYSBjdXJhdGVkIHNldCBvZlxuICogYWNjZXNzaWJsZSwgc2F0dXJhdGVkIGNvbG91cnMgdGhhdCBhbGwgcGFzcyBXQ0FHIEFBIGZvciB3aGl0ZSB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWVkIC0gQW55IG5vbi1lbXB0eSBzdHJpbmcgKGUuZy4gdXNlciBJRCBvciBkaXNwbGF5IG5hbWUpXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIENTUyBoZXggY29sb3VyIHN0cmluZyAoZS5nLiBgJyM0RjQ2RTUnYClcbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0QXZhdGFyQ29sb3IoJ3N0dV8wMDEnKSAgICAgLy8gYWx3YXlzICcjNEY0NkU1J1xuICogZ2V0QXZhdGFyQ29sb3IoJ0FsZXggSm9obnNvbicpIC8vIGNvbnNpc3RlbnQgYnV0IGRpZmZlcmVudCBmcm9tIGFib3ZlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdmF0YXJDb2xvcihzZWVkKSB7XG4gICAgLy8gQ3VyYXRlZCBwYWxldHRlOiBhbGwgcGFzcyBXQ0FHIEFBIGNvbnRyYXN0IHJhdGlvIChcdTIyNjUgNC41OjEpIG9uIHdoaXRlIHRleHQuXG4gICAgY29uc3QgUEFMRVRURSA9IFtcbiAgICAgICAgJyM0RjQ2RTUnLCAvLyBpbmRpZ29cbiAgICAgICAgJyMwRUE1RTknLCAvLyBza3kgYmx1ZVxuICAgICAgICAnIzEwQjk4MScsIC8vIGVtZXJhbGRcbiAgICAgICAgJyNGNTlFMEInLCAvLyBhbWJlclxuICAgICAgICAnI0VGNDQ0NCcsIC8vIHJlZFxuICAgICAgICAnIzhCNUNGNicsIC8vIHZpb2xldFxuICAgICAgICAnI0VDNDg5OScsIC8vIHBpbmtcbiAgICAgICAgJyMxNEI4QTYnLCAvLyB0ZWFsXG4gICAgICAgICcjRjk3MzE2JywgLy8gb3JhbmdlXG4gICAgICAgICcjNjM2NkYxJywgLy8gcHVycGxlLWluZGlnb1xuICAgIF07XG5cbiAgICBpZiAoIXNlZWQgfHwgdHlwZW9mIHNlZWQgIT09ICdzdHJpbmcnKSByZXR1cm4gUEFMRVRURVswXTtcblxuICAgIC8vIGRqYjItc3R5bGUgaGFzaDogZmFzdCwgc2ltcGxlLCBnb29kIGRpc3RyaWJ1dGlvbiBmb3Igc2hvcnQgc3RyaW5ncy5cbiAgICBsZXQgaGFzaCA9IDUzODE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhhc2ggPSAoaGFzaCAqIDMzKSBeIHNlZWQuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaGFzaCA9IGhhc2ggPj4+IDA7IC8vIGtlZXAgaXQgYSBwb3NpdGl2ZSAzMi1iaXQgaW50ZWdlclxuICAgIH1cblxuICAgIHJldHVybiBQQUxFVFRFW2hhc2ggJSBQQUxFVFRFLmxlbmd0aF07XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBUb2tlbiBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHN0b3JlZCBhdXRoIHRva2VuIGhhcyBwYXNzZWQgaXRzIGV4cGlyeSB0aW1lc3RhbXAuXG4gKlxuICogRmFpbC1zZWN1cmU6IHJldHVybnMgYHRydWVgICh0cmVhdCBhcyBleHBpcmVkKSB3aGVuIGBleHBpcmVzQXRgIGlzIGZhbHN5LFxuICogbm90IGEgbnVtYmVyLCBvciBgTmFOYC4gIFRoaXMgbWF0Y2hlcyB0aGUgc2FtZSBsb2dpYyB1c2VkIGluc2lkZVxuICogYEF1dGhDb250ZXh0LnJlc3RvcmVTZXNzaW9uKClgIHNvIGJlaGF2aW91ciBpcyBjb25zaXN0ZW50IGFjcm9zcyBsYXllcnMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGV4cGlyZXNBdCAtIFVuaXggdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kcyAoZnJvbSB0b2tlbiBwYXlsb2FkKVxuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCB3aGVuIGV4cGlyZWQgb3IgaW52YWxpZDsgYGZhbHNlYCB3aGVuIHN0aWxsIHZhbGlkXG4gKlxuICogQGV4YW1wbGVcbiAqIGlzVG9rZW5FeHBpcmVkKERhdGUubm93KCkgKyAxMDAwKSAvLyBmYWxzZSBcdTIwMTQgc3RpbGwgdmFsaWRcbiAqIGlzVG9rZW5FeHBpcmVkKERhdGUubm93KCkgLSAxMDAwKSAvLyB0cnVlICBcdTIwMTQgYWxyZWFkeSBleHBpcmVkXG4gKiBpc1Rva2VuRXhwaXJlZChudWxsKSAgICAgICAgICAgICAgLy8gdHJ1ZSAgXHUyMDE0IHRyZWF0IGFzIGV4cGlyZWQgKGZhaWwtc2VjdXJlKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUb2tlbkV4cGlyZWQoZXhwaXJlc0F0KSB7XG4gICAgaWYgKCFleHBpcmVzQXQgfHwgdHlwZW9mIGV4cGlyZXNBdCAhPT0gJ251bWJlcicgfHwgaXNOYU4oZXhwaXJlc0F0KSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIERhdGUubm93KCkgPiBleHBpcmVzQXQ7XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBSZWRpcmVjdCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENvbnN0cnVjdHMgdGhlIGxvZ2luIFVSTCB3aXRoIGFuIGVuY29kZWQgYHJlZGlyZWN0YCBxdWVyeSBwYXJhbWV0ZXIgc28gdGhhdFxuICogYWZ0ZXIgYSBzdWNjZXNzZnVsIGxvZ2luIHRoZSB1c2VyIGlzIHJldHVybmVkIHRvIHRoZWlyIGludGVuZGVkIGRlc3RpbmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIHJlbGF0aXZlIHBhdGggdG8gZW5jb2RlIChlLmcuIGAnL2Rhc2hib2FyZCdgKVxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGZ1bGwgbG9naW4gVVJMIHdpdGggcmVkaXJlY3QgcGFyYW1cbiAqICAgICAgICAgICAgICAgICAgIChlLmcuIGAnL2xvZ2luP3JlZGlyZWN0PSUyRmRhc2hib2FyZCdgKVxuICpcbiAqIEBleGFtcGxlXG4gKiBidWlsZExvZ2luUmVkaXJlY3RVcmwoJy9kYXNoYm9hcmQnKVxuICogLy8gXHUyMTkyICcvbG9naW4/cmVkaXJlY3Q9JTJGZGFzaGJvYXJkJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRMb2dpblJlZGlyZWN0VXJsKHBhdGgpIHtcbiAgICBjb25zdCBzYW5pdGlzZWQgPSBzYW5pdGl6ZVBhdGgocGF0aCk7XG4gICAgaWYgKCFzYW5pdGlzZWQpIHJldHVybiBST1VURVMuTE9HSU47XG4gICAgcmV0dXJuIGAke1JPVVRFUy5MT0dJTn0/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQoc2FuaXRpc2VkKX1gO1xufVxuXG4vKipcbiAqIFBhcnNlcyB0aGUgYHJlZGlyZWN0YCBxdWVyeSBwYXJhbWV0ZXIgZnJvbSBhIFVSTCBzZWFyY2ggc3RyaW5nIGFuZCByZXR1cm5zXG4gKiBpdCBhcyBhIGRlY29kZWQgcGF0aC4gIEZhbGxzIGJhY2sgdG8gYFJPVVRFUy5EQVNIQk9BUkRgIHdoZW4gdGhlIHBhcmFtZXRlclxuICogaXMgYWJzZW50LCBlbXB0eSwgb3IgaW52YWxpZC5cbiAqXG4gKiBBbHdheXMgcGFzc2VzIHRoZSByZXN1bHQgdGhyb3VnaCBgc2FuaXRpemVQYXRoKClgIHRvIHByZXZlbnQgb3Blbi1yZWRpcmVjdFxuICogYXR0YWNrcyB3aGVyZSBhIG1hbGljaW91cyBgcmVkaXJlY3RgIHZhbHVlIHBvaW50cyB0byBhbiBleHRlcm5hbCBkb21haW4uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFN0cmluZyAtIFRoZSBgbG9jYXRpb24uc2VhcmNoYCBzdHJpbmcgKGUuZy4gYCc/cmVkaXJlY3Q9JTJGZGFzaGJvYXJkJ2ApXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBEZWNvZGVkIHJlbGF0aXZlIHBhdGgsIG9yIGAnL2Rhc2hib2FyZCdgIGFzIGRlZmF1bHRcbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UmVkaXJlY3REZXN0aW5hdGlvbignP3JlZGlyZWN0PSUyRmRhc2hib2FyZCcpICAvLyAnL2Rhc2hib2FyZCdcbiAqIGdldFJlZGlyZWN0RGVzdGluYXRpb24oJz9yZWRpcmVjdD1odHRwczovL2V2aWwuY29tJykgLy8gJy9kYXNoYm9hcmQnIChzYW5pdGlzZWQpXG4gKiBnZXRSZWRpcmVjdERlc3RpbmF0aW9uKCcnKSAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJy9kYXNoYm9hcmQnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWRpcmVjdERlc3RpbmF0aW9uKHNlYXJjaFN0cmluZykge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoc2VhcmNoU3RyaW5nKTtcbiAgICAgICAgY29uc3QgcmF3ID0gcGFyYW1zLmdldCgncmVkaXJlY3QnKTtcbiAgICAgICAgcmV0dXJuIHNhbml0aXplUGF0aChyYXcpIHx8IFJPVVRFUy5EQVNIQk9BUkQ7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBST1VURVMuREFTSEJPQVJEO1xuICAgIH1cbn1cblxuLyoqXG4gKiBFbnN1cmVzIGEgcmVkaXJlY3QgdGFyZ2V0IGlzIGEgc2FmZSwgcmVsYXRpdmUgcGF0aC5cbiAqXG4gKiBSZWplY3RzIGFic29sdXRlIFVSTHMgKGUuZy4gYGh0dHBzOi8vZXZpbC5jb21gKSBhbmQgcHJvdG9jb2wtcmVsYXRpdmUgVVJMc1xuICogKGUuZy4gYC8vZXZpbC5jb21gKSB0byBwcmV2ZW50IG9wZW4tcmVkaXJlY3QgdnVsbmVyYWJpbGl0aWVzLlxuICogUmV0dXJucyBhbiBlbXB0eSBzdHJpbmcgd2hlbiB0aGUgaW5wdXQgaXMgaW52YWxpZCwgd2hpY2ggY2FsbGVycyB0cmVhdCBhc1xuICogXCJubyByZWRpcmVjdFwiIGFuZCBmYWxsIGJhY2sgdG8gdGhlIGRlZmF1bHQgZGVzdGluYXRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8bnVsbHx1bmRlZmluZWR9IHBhdGggLSBDYW5kaWRhdGUgcmVkaXJlY3QgcGF0aFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHNhbml0aXNlZCBwYXRoLCBvciBgJydgIHdoZW4gdW5zYWZlL2VtcHR5XG4gKlxuICogQGV4YW1wbGVcbiAqIHNhbml0aXplUGF0aCgnL2Rhc2hib2FyZCcpICAgICAgICAgIC8vICcvZGFzaGJvYXJkJ1xuICogc2FuaXRpemVQYXRoKCdodHRwczovL2V2aWwuY29tJykgICAvLyAnJ1xuICogc2FuaXRpemVQYXRoKCcvL2V2aWwuY29tJykgICAgICAgICAvLyAnJ1xuICogc2FuaXRpemVQYXRoKG51bGwpICAgICAgICAgICAgICAgICAgLy8gJydcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplUGF0aChwYXRoKSB7XG4gICAgaWYgKCFwYXRoIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykgcmV0dXJuICcnO1xuXG4gICAgY29uc3QgdHJpbW1lZCA9IHBhdGgudHJpbSgpO1xuICAgIGlmICghdHJpbW1lZCkgcmV0dXJuICcnO1xuXG4gICAgLy8gUmVqZWN0IGFic29sdXRlIFVSTHMgKGNvbnRhaW4gYSBzY2hlbWUgbGlrZSBodHRwOi8vIG9yIGh0dHBzOi8vKVxuICAgIC8vIGFuZCBwcm90b2NvbC1yZWxhdGl2ZSBVUkxzIChzdGFydCB3aXRoIC8vKS5cbiAgICBpZiAoL15bYS16QS1aXVthLXpBLVowLTkrXFwtLl0qOi8udGVzdCh0cmltbWVkKSkgcmV0dXJuICcnO1xuICAgIGlmICh0cmltbWVkLnN0YXJ0c1dpdGgoJy8vJykpIHJldHVybiAnJztcblxuICAgIC8vIE11c3Qgc3RhcnQgd2l0aCAnLycgdG8gYmUgYSB2YWxpZCByZWxhdGl2ZSBwYXRoLlxuICAgIGlmICghdHJpbW1lZC5zdGFydHNXaXRoKCcvJykpIHJldHVybiAnJztcblxuICAgIHJldHVybiB0cmltbWVkO1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBdXRoQ29udGV4dCBcdTIwMTQgR2xvYmFsIEF1dGhlbnRpY2F0aW9uIFN0YXRlIE1hbmFnZXIuXG4gKlxuICogU2luZ2xlIHNvdXJjZSBvZiB0cnV0aCBmb3IgdGhlIGN1cnJlbnQgdXNlciBzZXNzaW9uIGFjcm9zcyB0aGUgZW50aXJlXG4gKiBTdHVkZW50IFByb2dyZXNzIFRyYWNraW5nIFNhYVMgYXBwbGljYXRpb24uIEltcGxlbWVudHMgdGhlIE9ic2VydmVyXG4gKiAoUHVibGlzaFx1MjAxM1N1YnNjcmliZSkgcGF0dGVybiBzbyBhbnkgbW9kdWxlIGNhbiByZWFjdGl2ZWx5IHJlc3BvbmQgdG9cbiAqIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMgd2l0aG91dCB0aWdodCBjb3VwbGluZyBvciBwcm9wLWRyaWxsaW5nLlxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBSZXNwb25zaWJpbGl0eSBib3VuZGFyeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVGhpcyBtb2R1bGUgaXMgT05MWSByZXNwb25zaWJsZSBmb3I6XG4gKiAgICAgXHUyMDIyIEhvbGRpbmcgYW5kIHVwZGF0aW5nIHRoZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBvYmplY3RcbiAqICAgICBcdTIwMjIgTm90aWZ5aW5nIHJlZ2lzdGVyZWQgc3Vic2NyaWJlcnMgb24gZXZlcnkgc3RhdGUgY2hhbmdlXG4gKiAgICAgXHUyMDIyIFN0cnVjdHVyaW5nIHRoZSBsb2dpbiAvIGxvZ291dCBzdGF0ZSB0cmFuc2l0aW9uc1xuICpcbiAqICAgSXQgaXMgTk9UIHJlc3BvbnNpYmxlIGZvcjpcbiAqICAgICBcdTIwMjIgTWFraW5nIEhUVFAgcmVxdWVzdHMgICAgICAgICAgXHUyMTkyIGF1dGhBcGkuanNcbiAqICAgICBcdTIwMjIgTG93LWxldmVsIHN0b3JhZ2UgYWJzdHJhY3Rpb24gXHUyMTkyIGF1dGhTdG9yYWdlLmpzXG4gKiAgICAgXHUyMDIyIENsaWVudC1zaWRlIHJvdXRpbmcgICAgICAgICAgIFx1MjE5MiByb3V0ZXIvZ3VhcmRzLmpzXG4gKiAgICAgXHUyMDIyIFJlbmRlcmluZyBhbnkgVUkgICAgICAgICAgICAgIFx1MjE5MiBMb2dpbkZvcm0uanNcbiAqICAgICBcdTIwMjIgRGlzcGxheWluZyB0b2FzdCBtZXNzYWdlcyAgICAgXHUyMTkyIFRvYXN0LmpzXG4gKlxuICogQG1vZHVsZSBjb250ZXh0L0F1dGhDb250ZXh0XG4gKi9cblxuaW1wb3J0IHsgRU5WIH0gZnJvbSAnLi4vY29uZmlnL2Vudi5qcyc7XG5pbXBvcnQgKiBhcyBhdXRoQXBpIGZyb20gJy4uL3NlcnZpY2VzL2F1dGhBcGkuanMnO1xuaW1wb3J0IHsgc2F2ZUF1dGhUb2tlbiwgZ2V0QXV0aFRva2VuLCBjbGVhckF1dGhUb2tlbiB9IGZyb20gJy4uL3NlcnZpY2VzL2F1dGhTdG9yYWdlLmpzJztcbmltcG9ydCB7IGlzVG9rZW5FeHBpcmVkIH0gZnJvbSAnLi4vdXRpbHMvYXV0aEhlbHBlcnMuanMnO1xuaW1wb3J0IHsgRVJST1JfQ09ERVMsIFJPVVRFUyB9IGZyb20gJy4uL3V0aWxzL2NvbnN0YW50cy5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBQcml2YXRlIGhlbHBlciBmdW5jdGlvbnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ29udmVydHMgYW55IGNhdWdodCB2YWx1ZSBpbnRvIGEgbm9ybWFsaXNlZCBlcnJvciBvYmplY3QgdGhhdCBpcyBzYWZlIHRvXG4gKiBzdG9yZSBpbiBzdGF0ZSBhbmQgZGlzcGxheSB0byB0aGUgdXNlci5cbiAqXG4gKiBOb3JtYWxpc2F0aW9uIHJ1bGVzIChjaGVja2VkIGluIG9yZGVyKTpcbiAqICAgMS4gSWYgdGhlIHZhbHVlIGFscmVhZHkgaGFzIGEgYGNvZGVgIHByb3BlcnR5LCBpdCB3YXMgdGhyb3duIGludGVudGlvbmFsbHlcbiAqICAgICAgYnkgYSBzZXJ2aWNlIGxheWVyIChlLmcuIGF1dGhBcGkpIFx1MjAxNCByZXR1cm4gaXQgYXMtaXMuXG4gKiAgIDIuIElmIHRoZSB2YWx1ZSBpcyBhIG5hdGl2ZSBFcnJvciwgdXNlIEVycm9yLm1lc3NhZ2UuXG4gKiAgIDMuIElmIHRoZSB2YWx1ZSBpcyBhIHBsYWluIHN0cmluZywgdXNlIGl0IGRpcmVjdGx5LlxuICogICA0LiBPdGhlcndpc2UsIHVzZSB0aGUgcHJvdmlkZWQgZmFsbGJhY2sgbWVzc2FnZSBhbmQgRVJST1JfQ09ERVMuVU5LTk9XTi5cbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IGVyciAgICAgIC0gVGhlIHJhdyBjYXVnaHQgdmFsdWUgKG1heSBiZSBhbnl0aGluZylcbiAqIEBwYXJhbSB7c3RyaW5nfSAgZmFsbGJhY2sgLSBIdW1hbi1yZWFkYWJsZSBtZXNzYWdlIHVzZWQgd2hlbiB0aGUgZXJyb3JcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlcyBubyB1c2VmdWwgaW5mb3JtYXRpb25cbiAqIEByZXR1cm5zIHt7IGNvZGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH19IEEgbm9ybWFsaXNlZCBlcnJvciBkZXNjcmlwdG9yXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGlzZUVycm9yKGVyciwgZmFsbGJhY2spIHtcbiAgICBpZiAoZXJyICYmIHR5cGVvZiBlcnIgPT09ICdvYmplY3QnICYmICdjb2RlJyBpbiBlcnIpIHtcbiAgICAgICAgcmV0dXJuIC8qKiBAdHlwZSB7eyBjb2RlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyB9fSAqLyAoZXJyKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0gZXJyIGluc3RhbmNlb2YgRXJyb3IgPyBlcnIubWVzc2FnZSA6IHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnID8gZXJyIDogZmFsbGJhY2s7XG4gICAgcmV0dXJuIHsgY29kZTogRVJST1JfQ09ERVMuVU5LTk9XTiwgbWVzc2FnZSB9O1xufVxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgVHlwZSBkZWZpbml0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBTaGFwZSBvZiB0aGUgYXV0aGVudGljYXRlZCB1c2VyIG9iamVjdCByZXR1cm5lZCBieSB0aGUgQVBJIGFuZCBzdG9yZWRcbiAqIGluIEF1dGhDb250ZXh0IHN0YXRlLlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEF1dGhVc2VyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBpZFxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgbmFtZVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZW1haWxcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IFthdmF0YXJVcmxdXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBbc3R1ZGVudElkXVxuICovXG5cbi8qKlxuICogVGhlIGNvbXBsZXRlIGF1dGhlbnRpY2F0aW9uIHN0YXRlIG9iamVjdCBtYW5hZ2VkIGJ5IEF1dGhDb250ZXh0LlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEF1dGhTdGF0ZVxuICogQHByb3BlcnR5IHtBdXRoVXNlcnxudWxsfSAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyXG4gKiBAcHJvcGVydHkge3N0cmluZ3xudWxsfSAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZFxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmdcbiAqIEBwcm9wZXJ0eSB7eyBjb2RlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyB9fG51bGx9IGVycm9yXG4gKi9cblxuLyoqXG4gKiBDcmVkZW50aWFscyBzdWJtaXR0ZWQgYnkgdGhlIHVzZXIgb24gdGhlIGxvZ2luIGZvcm0uXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9naW5DcmVkZW50aWFsc1xuICogQHByb3BlcnR5IHtzdHJpbmd9ICBlbWFpbFxuICogQHByb3BlcnR5IHtzdHJpbmd9ICBwYXNzd29yZFxuICogQHByb3BlcnR5IHtib29sZWFufSBbcmVtZW1iZXJNZV1cbiAqL1xuXG4vKipcbiAqIFRoZSB2YWx1ZSByZXR1cm5lZCBieSBBdXRoQ29udGV4dC5sb2dpbigpIHJlZ2FyZGxlc3Mgb2Ygb3V0Y29tZS5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2dpblJlc3VsdFxuICogQHByb3BlcnR5IHtib29sZWFufSAgIHN1Y2Nlc3NcbiAqIEBwcm9wZXJ0eSB7QXV0aFVzZXJ9ICBbdXNlcl1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICBbZXJyb3JdXG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEluaXRpYWwgc3RhdGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKiBAdHlwZSB7QXV0aFN0YXRlfSAqL1xuY29uc3QgSU5JVElBTF9TVEFURSA9IE9iamVjdC5mcmVlemUoe1xuICAgIHVzZXI6IG51bGwsXG4gICAgdG9rZW46IG51bGwsXG4gICAgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgZXJyb3I6IG51bGwsXG59KTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEF1dGhDb250ZXh0IHNpbmdsZXRvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBBdXRoQ29udGV4dCBcdTIwMTQgdGhlIGFwcGxpY2F0aW9uJ3MgYXV0aGVudGljYXRpb24gc3RhdGUgbWFuYWdlci5cbiAqXG4gKiBAbmFtZXNwYWNlIEF1dGhDb250ZXh0XG4gKi9cbmNvbnN0IEF1dGhDb250ZXh0ID0gKCgpID0+IHtcbiAgICAvKiogQHR5cGUge0F1dGhTdGF0ZX0gKi9cbiAgICBsZXQgX3N0YXRlID0geyAuLi5JTklUSUFMX1NUQVRFIH07XG5cbiAgICAvKiogQHR5cGUge1NldDwoc3RhdGU6IEF1dGhTdGF0ZSkgPT4gdm9pZD59ICovXG4gICAgY29uc3QgX3N1YnNjcmliZXJzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gcmVjZWl2ZSBmcm96ZW4gc3RhdGUgc25hcHNob3RzIHdoZW5ldmVyIHRoZVxuICAgICAqIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhzdGF0ZTogQXV0aFN0YXRlKSA9PiB2b2lkfSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHsoKSA9PiB2b2lkfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgJ1tBdXRoQ29udGV4dF0gc3Vic2NyaWJlKCkgZXhwZWN0cyBhIGZ1bmN0aW9uLCByZWNlaXZlZDonLFxuICAgICAgICAgICAgICAgIHR5cGVvZiBjYWxsYmFja1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7fTtcbiAgICAgICAgfVxuICAgICAgICBfc3Vic2NyaWJlcnMuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHVuc3Vic2NyaWJlKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgZnJvbSB0aGUgc3Vic2NyaWJlciByZWdpc3RyeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KHN0YXRlOiBBdXRoU3RhdGUpID0+IHZvaWR9IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5zdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICAgICAgX3N1YnNjcmliZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVsaXZlcnMgYSBmcm96ZW4gc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgc3RhdGUgdG8gZXZlcnkgcmVnaXN0ZXJlZCBzdWJzY3JpYmVyLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gbm90aWZ5KCkge1xuICAgICAgICBjb25zdCBzbmFwc2hvdCA9IE9iamVjdC5mcmVlemUoeyAuLi5fc3RhdGUgfSk7XG4gICAgICAgIF9zdWJzY3JpYmVycy5mb3JFYWNoKGNhbGxiYWNrID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc25hcHNob3QpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0F1dGhDb250ZXh0XSBBIHN1YnNjcmliZXIgdGhyZXcgYW4gZXJyb3I6JywgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG9ubHkgcGVybWl0dGVkIHdheSB0byB1cGRhdGUgYXV0aGVudGljYXRpb24gc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BhcnRpYWw8QXV0aFN0YXRlPn0gcGFydGlhbFN0YXRlXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0U3RhdGUocGFydGlhbFN0YXRlKSB7XG4gICAgICAgIF9zdGF0ZSA9IHsgLi4uX3N0YXRlLCAuLi5wYXJ0aWFsU3RhdGUgfTtcbiAgICAgICAgbm90aWZ5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZyb3plbiwgb25lLXRpbWUgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgYXV0aGVudGljYXRpb24gc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UmVhZG9ubHk8QXV0aFN0YXRlPn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5mcmVlemUoeyAuLi5fc3RhdGUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGF1dGhlbnRpY2F0aW9uIHNlc3Npb24gZnJvbSBhdXRoU3RvcmFnZS5cbiAgICAgKiBNdXN0IGJlIGNhbGxlZCBvbmNlIGR1cmluZyBhcHBsaWNhdGlvbiBib290c3RyYXAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn1cbiAgICAgKi9cbiAgICBhc3luYyBmdW5jdGlvbiByZXN0b3JlU2Vzc2lvbigpIHtcbiAgICAgICAgc2V0U3RhdGUoeyBpc0xvYWRpbmc6IHRydWUsIGVycm9yOiBudWxsIH0pO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdG9yZWQgPSBnZXRBdXRoVG9rZW4oKTtcblxuICAgICAgICAgICAgaWYgKCFzdG9yZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoRU5WLkVOQUJMRV9NT0NLX0FQSSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2NrVXNlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnbW9jay0wMDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ1NhaSBTaGVuZGdlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiAnc2FpQGV4YW1wbGUuY29tJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9ja1Rva2VuID0gJ21vY2stand0LXRva2VuLWRldic7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVBdXRoVG9rZW4oeyB0b2tlbjogbW9ja1Rva2VuLCBleHBpcmVzQXQ6IERhdGUubm93KCkgKyA4NjQwMDAwMCwgdXNlcjogbW9ja1VzZXIsIHJlbWVtYmVyTWU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IG1vY2tVc2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IG1vY2tUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0U3RhdGUoeyBpc0xvYWRpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeyB0b2tlbiwgZXhwaXJlc0F0LCB1c2VyIH0gPSBzdG9yZWQ7XG5cbiAgICAgICAgICAgIGlmICghdG9rZW4gfHwgIXVzZXIgfHwgdHlwZW9mIHVzZXIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICAnW0F1dGhDb250ZXh0XSBNYWxmb3JtZWQgc2Vzc2lvbiBwYXlsb2FkIGZvdW5kIGluIHN0b3JhZ2UgXHUyMDE0IGNsZWFyaW5nLidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNsZWFyQXV0aFRva2VuKCk7XG4gICAgICAgICAgICAgICAgc2V0U3RhdGUoeyBpc0xvYWRpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzVG9rZW5FeHBpcmVkKGV4cGlyZXNBdCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tBdXRoQ29udGV4dF0gU3RvcmVkIHRva2VuIGhhcyBleHBpcmVkIFx1MjAxNCBjbGVhcmluZyBzZXNzaW9uLicpO1xuICAgICAgICAgICAgICAgIGNsZWFyQXV0aFRva2VuKCk7XG4gICAgICAgICAgICAgICAgc2V0U3RhdGUoeyBpc0xvYWRpbmc6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCFFTlYuRU5BQkxFX0FOQUxZVElDUykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignW0F1dGhDb250ZXh0XSBTZXNzaW9uIHJlc3RvcmVkIGZvciB1c2VyIElEOicsIHVzZXIuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tBdXRoQ29udGV4dF0gcmVzdG9yZVNlc3Npb24oKSBlbmNvdW50ZXJlZCBhbiB1bmV4cGVjdGVkIGVycm9yOicsIGVycik7XG4gICAgICAgICAgICBjbGVhckF1dGhUb2tlbigpO1xuICAgICAgICAgICAgc2V0U3RhdGUoeyBpc0xvYWRpbmc6IGZhbHNlLCBlcnJvcjogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyBhIGxvZ2luIGF0dGVtcHQgdXNpbmcgdGhlIGF1dGhBcGkgc2VydmljZSBhbmQgdXBkYXRlcyB0aGUgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0xvZ2luQ3JlZGVudGlhbHN9IGNyZWRlbnRpYWxzXG4gICAgICogQHJldHVybnMge1Byb21pc2U8TG9naW5SZXN1bHQ+fVxuICAgICAqL1xuICAgIGFzeW5jIGZ1bmN0aW9uIGxvZ2luKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIHNldFN0YXRlKHsgaXNMb2FkaW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9KTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYXV0aFJlc3BvbnNlID0gYXdhaXQgYXV0aEFwaS5sb2dpbihjcmVkZW50aWFscyk7XG4gICAgICAgICAgICBjb25zdCB7IHRva2VuLCBleHBpcmVzQXQsIHVzZXIgfSA9IGF1dGhSZXNwb25zZTtcblxuICAgICAgICAgICAgaWYgKCF0b2tlbiB8fCAhdXNlciB8fCAhZXhwaXJlc0F0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAnQXV0aCByZXNwb25zZSBpcyBtaXNzaW5nIHJlcXVpcmVkIGZpZWxkczogdG9rZW4sIGV4cGlyZXNBdCwgdXNlci4nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcmVtZW1iZXJNZSA9IGNyZWRlbnRpYWxzLnJlbWVtYmVyTWUgPT09IHRydWU7XG4gICAgICAgICAgICBzYXZlQXV0aFRva2VuKHsgdG9rZW4sIGV4cGlyZXNBdCwgdXNlciwgcmVtZW1iZXJNZSB9KTtcblxuICAgICAgICAgICAgc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIHVzZXIsXG4gICAgICAgICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgdXNlciB9O1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGlzZWRFcnJvciA9IG5vcm1hbGlzZUVycm9yKGVyciwgJ0xvZ2luIGZhaWxlZC4gUGxlYXNlIHRyeSBhZ2Fpbi4nKTtcbiAgICAgICAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBub3JtYWxpc2VkRXJyb3IsXG4gICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB1c2VyOiBudWxsLFxuICAgICAgICAgICAgICAgIHRva2VuOiBudWxsLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IG5vcm1hbGlzZWRFcnJvci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbmRzIHRoZSBjdXJyZW50IHVzZXIgc2Vzc2lvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgICAgY2xlYXJBdXRoVG9rZW4oKTtcblxuICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICB1c2VyOiBudWxsLFxuICAgICAgICAgICAgdG9rZW46IG51bGwsXG4gICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLndhcm4oYFtBdXRoQ29udGV4dF0gU2Vzc2lvbiBlbmRlZC4gTmF2aWdhdGUgdG8gJHtST1VURVMuTE9HSU59IHZpYSB0aGUgcm91dGVyLmApO1xuICAgIH1cblxuICAgIC8vIExpc3RlbiBmb3IgZ2xvYmFsIHVuYXV0aG9yaXplZCBldmVudHMgKGUuZy4sIGZyb20gYXBpLmpzKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdhdXRoOnVuYXV0aG9yaXplZCcsICgpID0+IHtcbiAgICAgICAgaWYgKF9zdGF0ZS5pc0F1dGhlbnRpY2F0ZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignW0F1dGhDb250ZXh0XSA0MDEgVW5hdXRob3JpemVkIGRldGVjdGVkIGdsb2JhbGx5LiBMb2dnaW5nIG91dC4nKTtcbiAgICAgICAgICAgIGxvZ291dCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdWJzY3JpYmUsXG4gICAgICAgIHVuc3Vic2NyaWJlLFxuICAgICAgICBub3RpZnksXG4gICAgICAgIGdldFN0YXRlLFxuICAgICAgICBzZXRTdGF0ZSxcbiAgICAgICAgcmVzdG9yZVNlc3Npb24sXG4gICAgICAgIGxvZ2luLFxuICAgICAgICBsb2dvdXQsXG4gICAgICAgIGNsZWFyU3RvcmFnZTogY2xlYXJBdXRoVG9rZW4sXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IEF1dGhDb250ZXh0O1xuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBGb3JtIFZhbGlkYXRpb24gVXRpbGl0aWVzIFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogUHVyZSwgc3luY2hyb25vdXMsIHN0YXRlbGVzcyB2YWxpZGF0aW9uIGZ1bmN0aW9ucy5cbiAqIE5vIHNpZGUgZWZmZWN0cywgbm8gRE9NIGFjY2Vzcywgbm8gYXN5bmMgb3BlcmF0aW9ucy5cbiAqXG4gKiBVc2VkIGJ5IExvZ2luRm9ybSBhbmQgYW55IGZ1dHVyZSBmb3JtIGNvbXBvbmVudCB0aGF0IG5lZWRzXG4gKiBjbGllbnQtc2lkZSB2YWxpZGF0aW9uIHdpdGggV0NBRyBBQS1jb21wbGlhbnQgZXJyb3IgbWVzc2FnZXMuXG4gKlxuICogRXJyb3IgbWVzc2FnZSBzdHlsZSBndWlkZTpcbiAqIC0gQ29uY2lzZSBhbmQgYWN0aW9uYWJsZSAoXCJFbnRlciBhIHZhbGlkIGVtYWlsXCIgbm90IFwiSW52YWxpZCBlbWFpbFwiKVxuICogLSBOb3QgY29sb3VyLWRlcGVuZGVudCBcdTIwMTQgYWx3YXlzIGFjY29tcGFuaWVkIGJ5IHRleHQgKEZSLUVSUi0wMTEpXG4gKiAtIFN0YXJ0cyB3aXRoIGEgY2FwaXRhbCBsZXR0ZXI7IG5vIHRyYWlsaW5nIHBlcmlvZFxuICpcbiAqIEBtb2R1bGUgdXRpbHMvdmFsaWRhdGlvblxuICovXG5cbmltcG9ydCB7IEFVVEhfQ09OU1RBTlRTIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgUmVnZXggY29uc3RhbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFJGQyA1MzIyLXNpbXBsaWZpZWQgZW1haWwgcGF0dGVybi5cbiAqIFZhbGlkYXRlcyB0aGUgY29tbW9uIGNhc2VzIHdoaWxlIGtlZXBpbmcgdGhlIHJlZ2V4IHJlYWRhYmxlLlxuICogRG9lcyBub3QgdmFsaWRhdGUgZnVsbCBSRkMgY29tcGxpYW5jZSAoZS5nLiBxdW90ZWQgc3RyaW5ncywgSVAgbGl0ZXJhbHMpXG4gKiBzaW5jZSB0aG9zZSBhcmUgcmFyZWx5IGVuY291bnRlcmVkIGluIHJlYWwtd29ybGQgYXBwbGljYXRpb25zLlxuICpcbiAqIEB0eXBlIHtSZWdFeHB9XG4gKi9cbmNvbnN0IEVNQUlMX1JFR0VYID0gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC87XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBJbmRpdmlkdWFsIGZpZWxkIHZhbGlkYXRvcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogVmFsaWRhdGVzIGFuIGVtYWlsIGFkZHJlc3MgZmllbGQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8dW5kZWZpbmVkfG51bGx9IHZhbHVlIC0gVGhlIHJhdyBpbnB1dCB2YWx1ZVxuICogQHJldHVybnMge3N0cmluZ3xudWxsfSBBbiBlcnJvciBtZXNzYWdlIHN0cmluZywgb3IgYG51bGxgIHdoZW4gdmFsaWRcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFsaWRhdGVFbWFpbCgnJykgICAgICAgICAgICAgICAgICAgIC8vICdFbWFpbCBpcyByZXF1aXJlZCdcbiAqIHZhbGlkYXRlRW1haWwoJ25vdC1hbi1lbWFpbCcpICAgICAgICAvLyAnRW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzJ1xuICogdmFsaWRhdGVFbWFpbCgnc3R1ZGVudEBkZW1vLmNvbScpICAgIC8vIG51bGxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWwodmFsdWUpIHtcbiAgICBjb25zdCB0cmltbWVkID0gKHZhbHVlID8/ICcnKS50cmltKCk7XG5cbiAgICBpZiAoIXRyaW1tZWQpIHtcbiAgICAgICAgcmV0dXJuICdFbWFpbCBpcyByZXF1aXJlZCc7XG4gICAgfVxuXG4gICAgaWYgKCFFTUFJTF9SRUdFWC50ZXN0KHRyaW1tZWQpKSB7XG4gICAgICAgIHJldHVybiAnRW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzJztcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZXMgYSBwYXNzd29yZCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3x1bmRlZmluZWR8bnVsbH0gdmFsdWUgLSBUaGUgcmF3IGlucHV0IHZhbHVlXG4gKiBAcmV0dXJucyB7c3RyaW5nfG51bGx9IEFuIGVycm9yIG1lc3NhZ2Ugc3RyaW5nLCBvciBgbnVsbGAgd2hlbiB2YWxpZFxuICpcbiAqIEBleGFtcGxlXG4gKiB2YWxpZGF0ZVBhc3N3b3JkKCcnKSAgICAgICAgIC8vICdQYXNzd29yZCBpcyByZXF1aXJlZCdcbiAqIHZhbGlkYXRlUGFzc3dvcmQoJ2FiYycpICAgICAgLy8gJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzJ1xuICogdmFsaWRhdGVQYXNzd29yZCgnZGVtbzEyMycpICAvLyBudWxsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkKHZhbHVlKSB7XG4gICAgY29uc3QgcmF3ID0gdmFsdWUgPz8gJyc7XG5cbiAgICBpZiAoIXJhdykge1xuICAgICAgICByZXR1cm4gJ1Bhc3N3b3JkIGlzIHJlcXVpcmVkJztcbiAgICB9XG5cbiAgICBpZiAocmF3Lmxlbmd0aCA8IEFVVEhfQ09OU1RBTlRTLk1JTl9QQVNTV09SRF9MRU5HVEgpIHtcbiAgICAgICAgcmV0dXJuIGBQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0ICR7QVVUSF9DT05TVEFOVFMuTUlOX1BBU1NXT1JEX0xFTkdUSH0gY2hhcmFjdGVyc2A7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBGb3JtLWxldmVsIHZhbGlkYXRvciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBWYWxpZGF0ZXMgdGhlIGVudGlyZSBsb2dpbiBmb3JtIGJ5IHJ1bm5pbmcgYm90aCBmaWVsZCB2YWxpZGF0b3JzLlxuICpcbiAqIFJldHVybnMgYG51bGxgIHdoZW4gZXZlcnkgZmllbGQgaXMgdmFsaWQgKG5vIGVycm9ycykuXG4gKiBSZXR1cm5zIGFuIGBlcnJvcnNgIG9iamVjdCB3aGVuIG9uZSBvciBtb3JlIGZpZWxkcyBhcmUgaW52YWxpZC5cbiAqXG4gKiBUaGUgcmV0dXJuZWQgb2JqZWN0IGFsd2F5cyBjb250YWlucyBib3RoIGtleXMgc28gdGhhdCB0aGUgY2FsbGluZ1xuICogY29tcG9uZW50IGNhbiByZWFkIGBlcnJvcnMuZW1haWxgIGFuZCBgZXJyb3JzLnBhc3N3b3JkYCB1bmNvbmRpdGlvbmFsbHlcbiAqIHdpdGhvdXQgZ3VhcmQgY2hlY2tzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICBmb3JtICAgICAgICAgIC0gRm9ybSB2YWx1ZXMgdG8gdmFsaWRhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICBmb3JtLmVtYWlsICAgIC0gRW1haWwgZmllbGQgdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICBmb3JtLnBhc3N3b3JkIC0gUGFzc3dvcmQgZmllbGQgdmFsdWVcbiAqIEByZXR1cm5zIHt7IGVtYWlsOiBzdHJpbmd8bnVsbCwgcGFzc3dvcmQ6IHN0cmluZ3xudWxsIH18bnVsbH1cbiAqICAgYG51bGxgIHdoZW4gdmFsaWQ7IGVycm9yIG9iamVjdCB3aGVuIGludmFsaWRcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFsaWRhdGVMb2dpbkZvcm0oeyBlbWFpbDogJycsIHBhc3N3b3JkOiAnJyB9KVxuICogLy8geyBlbWFpbDogJ0VtYWlsIGlzIHJlcXVpcmVkJywgcGFzc3dvcmQ6ICdQYXNzd29yZCBpcyByZXF1aXJlZCcgfVxuICpcbiAqIHZhbGlkYXRlTG9naW5Gb3JtKHsgZW1haWw6ICdzdHVkZW50QGRlbW8uY29tJywgcGFzc3dvcmQ6ICdkZW1vMTIzJyB9KVxuICogLy8gbnVsbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVMb2dpbkZvcm0oeyBlbWFpbCwgcGFzc3dvcmQgfSkge1xuICAgIGNvbnN0IGVycm9ycyA9IHtcbiAgICAgICAgZW1haWw6IHZhbGlkYXRlRW1haWwoZW1haWwpLFxuICAgICAgICBwYXNzd29yZDogdmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCksXG4gICAgfTtcblxuICAgIC8vIFJldHVybiBudWxsIHdoZW4gZXZlcnkgdmFsdWUgaXMgbnVsbCAoYWxsIGZpZWxkcyB2YWxpZCkuXG4gICAgcmV0dXJuIGlzRm9ybVZhbGlkKGVycm9ycykgPyBudWxsIDogZXJyb3JzO1xufVxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgSGVscGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIGFsbCB2YWx1ZXMgaW4gYW4gZXJyb3JzIG9iamVjdCBhcmUgYG51bGxgLlxuICogQSBgbnVsbGAgdmFsdWUgbWVhbnMgdGhlIGNvcnJlc3BvbmRpbmcgZmllbGQgcGFzc2VkIHZhbGlkYXRpb24uXG4gKlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBzdHJpbmd8bnVsbD59IGVycm9ycyAtIFRoZSBlcnJvcnMgb2JqZWN0IHRvIGluc3BlY3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgd2hlbiBldmVyeSBmaWVsZCBpcyB2YWxpZDsgYGZhbHNlYCBvdGhlcndpc2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaXNGb3JtVmFsaWQoeyBlbWFpbDogbnVsbCwgcGFzc3dvcmQ6IG51bGwgfSkgICAgIC8vIHRydWVcbiAqIGlzRm9ybVZhbGlkKHsgZW1haWw6ICdSZXF1aXJlZCcsIHBhc3N3b3JkOiBudWxsIH0pIC8vIGZhbHNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zvcm1WYWxpZChlcnJvcnMpIHtcbiAgICBpZiAoIWVycm9ycyB8fCB0eXBlb2YgZXJyb3JzICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGVycm9ycykuZXZlcnkodiA9PiB2ID09PSBudWxsKTtcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgU3Bpbm5lciBcdTIwMTQgQWNjZXNzaWJsZSBMb2FkaW5nIEluZGljYXRvciBcdTIwMTQgUGFydCAzIC8gUGFydCAxMC5cbiAqXG4gKiBSZW5kZXJzIGEgQ1NTLWFuaW1hdGVkIHNwaW5uZXIgaW5zaWRlIGFueSBET00gY29udGFpbmVyLlxuICogVXNlZCBieSBCdXR0b24gKGxvYWRpbmcgc3RhdGUpIGFuZCBhcyBhIHN0YW5kYWxvbmUgcGFnZS9zZWN0aW9uIGluZGljYXRvci5cbiAqXG4gKiBAbW9kdWxlIGNvbXBvbmVudHMvdWkvU3Bpbm5lclxuICovXG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBTaXplIG1hcCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIEB0eXBlIHtSZWNvcmQ8c3RyaW5nLCB7IHNpemU6IG51bWJlciwgc3Ryb2tlOiBudW1iZXIgfT59ICovXG5jb25zdCBTSVpFX01BUCA9IHtcbiAgICBzbTogeyBzaXplOiAxNiwgc3Ryb2tlOiAyIH0sXG4gICAgbWQ6IHsgc2l6ZTogMjQsIHN0cm9rZTogMi41IH0sXG4gICAgbGc6IHsgc2l6ZTogNDAsIHN0cm9rZTogMyB9LFxufTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEZhY3RvcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhY2Nlc3NpYmxlIFNWRyBzcGlubmVyIGVsZW1lbnQuXG4gKlxuICogVGhlIHNwaW5uZXIgcmVzcGVjdHMgYHByZWZlcnMtcmVkdWNlZC1tb3Rpb25gOiB3aGVuIHRoZSB1c2VyIGhhcyByZXF1ZXN0ZWRcbiAqIHJlZHVjZWQgbW90aW9uLCB0aGUgYW5pbWF0aW9uIGlzIHBhdXNlZCB2aWEgQ1NTIChoYW5kbGVkIGluIGBtYWluLmNzc2AgXHUyMDE0XG4gKiBgQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIHsgLnNwaW5uZXIgeyBhbmltYXRpb246IG5vbmUgfSB9YCkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICBbb3B0cz17fV0gICAgICAgICAgICAgIC0gQ29uZmlndXJhdGlvbiBvcHRpb25zXG4gKiBAcGFyYW0geydzbSd8J21kJ3wnbGcnfSBbb3B0cy5zaXplPSdtZCddIC0gVmlzdWFsIHNpemUgdmFyaWFudFxuICogQHBhcmFtIHtzdHJpbmd9ICBbb3B0cy5sYWJlbD0nTG9hZGluZyddIC0gQVJJQSBsYWJlbCBmb3Igc2NyZWVuIHJlYWRlcnNcbiAqIEBwYXJhbSB7c3RyaW5nfSAgW29wdHMuY29sb3I9J2N1cnJlbnRDb2xvciddIC0gU1ZHIHN0cm9rZSBjb2xvdXJcbiAqIEBwYXJhbSB7c3RyaW5nfSAgW29wdHMuY2xhc3NOYW1lPScnXSAgIC0gRXh0cmEgQ1NTIGNsYXNzZXMgb24gdGhlIHdyYXBwZXJcbiAqIEByZXR1cm5zIHtTVkdFbGVtZW50fSBUaGUgc3Bpbm5lciBTVkcgZWxlbWVudCwgcmVhZHkgdG8gaW5zZXJ0IGludG8gdGhlIERPTVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBzcGlubmVyID0gY3JlYXRlU3Bpbm5lcih7IHNpemU6ICdzbScsIGxhYmVsOiAnU2lnbmluZyBpblx1MjAyNicgfSk7XG4gKiBidXR0b25FbC5hcHBlbmQoc3Bpbm5lcik7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcGlubmVyKHtcbiAgICBzaXplID0gJ21kJyxcbiAgICBsYWJlbCA9ICdMb2FkaW5nJyxcbiAgICBjb2xvciA9ICdjdXJyZW50Q29sb3InLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxufSA9IHt9KSB7XG4gICAgY29uc3QgeyBzaXplOiBweCwgc3Ryb2tlIH0gPSBTSVpFX01BUFtzaXplXSA/PyBTSVpFX01BUC5tZDtcbiAgICBjb25zdCByID0gKHB4IC0gc3Ryb2tlKSAvIDI7IC8vIHJhZGl1cyBsZWF2aW5nIHJvb20gZm9yIHN0cm9rZVxuICAgIGNvbnN0IGN4ID0gcHggLyAyO1xuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdjbGFzcycsIGBzcGlubmVyIHNwaW5uZXItLSR7c2l6ZX0ke2NsYXNzTmFtZSA/IGAgJHtjbGFzc05hbWV9YCA6ICcnfWApO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgU3RyaW5nKHB4KSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgU3RyaW5nKHB4KSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtweH0gJHtweH1gKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdmaWxsJywgJ25vbmUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3N0YXR1cycpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuXG4gICAgLy8gVHJhY2sgY2lyY2xlIChiYWNrZ3JvdW5kKVxuICAgIGNvbnN0IHRyYWNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdjaXJjbGUnKTtcbiAgICB0cmFjay5zZXRBdHRyaWJ1dGUoJ2N4JywgU3RyaW5nKGN4KSk7XG4gICAgdHJhY2suc2V0QXR0cmlidXRlKCdjeScsIFN0cmluZyhjeCkpO1xuICAgIHRyYWNrLnNldEF0dHJpYnV0ZSgncicsIFN0cmluZyhyKSk7XG4gICAgdHJhY2suc2V0QXR0cmlidXRlKCdzdHJva2UnLCBjb2xvcik7XG4gICAgdHJhY2suc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCBTdHJpbmcoc3Ryb2tlKSk7XG4gICAgdHJhY2suc2V0QXR0cmlidXRlKCdvcGFjaXR5JywgJzAuMicpO1xuICAgIHN2Zy5hcHBlbmRDaGlsZCh0cmFjayk7XG5cbiAgICAvLyBBbmltYXRlZCBhcmNcbiAgICBjb25zdCBhcmMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ2NpcmNsZScpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NwaW5uZXJfX2FyYycpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ2N4JywgU3RyaW5nKGN4KSk7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnY3knLCBTdHJpbmcoY3gpKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdyJywgU3RyaW5nKHIpKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdzdHJva2UnLCBjb2xvcik7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgU3RyaW5nKHN0cm9rZSkpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1saW5lY2FwJywgJ3JvdW5kJyk7XG5cbiAgICBjb25zdCBjaXJjdW1mZXJlbmNlID0gMiAqIE1hdGguUEkgKiByO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNoYXJyYXknLCBTdHJpbmcoY2lyY3VtZmVyZW5jZSkpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1kYXNob2Zmc2V0JywgU3RyaW5nKGNpcmN1bWZlcmVuY2UgKiAwLjc1KSk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoYXJjKTtcbiAgICByZXR1cm4gc3ZnO1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBCdXR0b24gXHUyMDE0IEdlbmVyaWMgQWNjZXNzaWJsZSBCdXR0b24gQ29tcG9uZW50IFx1MjAxNCBQYXJ0IDMgLyBQYXJ0IDEwLlxuICpcbiAqIENyZWF0ZXMgYSBgPGJ1dHRvbj5gIGVsZW1lbnQgd2l0aCBzdXBwb3J0IGZvciB2YXJpYW50cywgc2l6ZXMsIGxvYWRpbmcgc3RhdGUsXG4gKiBhbmQgQVJJQSBhdHRyaWJ1dGVzLiAgVGhlIGxvYWRpbmcgc3RhdGUgc2hvd3MgYW4gaW5saW5lIHNwaW5uZXIgYW5kIHByZXZlbnRzXG4gKiBpbnRlcmFjdGlvbiB3aXRob3V0IGNoYW5naW5nIHRoZSBidXR0b24ncyBkaW1lbnNpb25zIChsYXlvdXQtc2hpZnQgc2FmZSkuXG4gKlxuICogQG1vZHVsZSBjb21wb25lbnRzL3VpL0J1dHRvblxuICovXG5cbmltcG9ydCB7IGNyZWF0ZVNwaW5uZXIgfSBmcm9tICcuL1NwaW5uZXIuanMnO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgQ29uc3RhbnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKiogVmFsaWQgdmlzdWFsIHZhcmlhbnRzLiAqL1xuY29uc3QgVkFSSUFOVFMgPSBbJ3ByaW1hcnknLCAnc2Vjb25kYXJ5JywgJ291dGxpbmUnLCAnZ2hvc3QnLCAnZGVzdHJ1Y3RpdmUnXTtcblxuLyoqIFZhbGlkIHNpemUgdG9rZW5zLiAqL1xuY29uc3QgU0laRVMgPSBbJ3NtJywgJ21kJywgJ2xnJ107XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBGYWN0b3J5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENyZWF0ZXMgYW5kIHJldHVybnMgYW4gYWNjZXNzaWJsZSBgPGJ1dHRvbj5gIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgb3B0cyAgICAgICAgICAgICAgICAgICAgIC0gQnV0dG9uIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSAgIG9wdHMubGFiZWwgICAgICAgICAgICAgICAtIFZpc2libGUgYnV0dG9uIHRleHRcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLmlkXSAgICAgICAgICAgICAgICAtIE9wdGlvbmFsIERPTSBpZCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLnZhcmlhbnQ9J3ByaW1hcnknXSAtIFZpc3VhbCBzdHlsZSB2YXJpYW50XG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5zaXplPSdtZCddICAgICAgICAgLSBTaXplIHRva2VuOiAnc20nIHwgJ21kJyB8ICdsZydcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLnR5cGU9J2J1dHRvbiddICAgICAtIEhUTUwgYnV0dG9uIHR5cGUgYXR0cmlidXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59ICBbb3B0cy5kaXNhYmxlZD1mYWxzZV0gICAgLSBEaXNhYmxlcyB0aGUgYnV0dG9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59ICBbb3B0cy5sb2FkaW5nPWZhbHNlXSAgICAgLSBTaG93cyBzcGlubmVyOyBkaXNhYmxlcyBpbnRlcmFjdGlvbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLmNsYXNzTmFtZT0nJ10gICAgICAtIEV4dHJhIENTUyBjbGFzc2VzXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0cy5vbkNsaWNrXSAgICAgICAgICAgLSBDbGljayBldmVudCBoYW5kbGVyXG4gKiBAcmV0dXJucyB7SFRNTEJ1dHRvbkVsZW1lbnR9XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGJ0biA9IGNyZWF0ZUJ1dHRvbih7XG4gKiAgIGxhYmVsOiAnU2lnbiBJbicsXG4gKiAgIHZhcmlhbnQ6ICdwcmltYXJ5JyxcbiAqICAgbG9hZGluZzogdHJ1ZSxcbiAqICAgb25DbGljazogaGFuZGxlTG9naW4sXG4gKiB9KTtcbiAqIGZvcm1FbC5hcHBlbmQoYnRuKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbih7XG4gICAgbGFiZWwsXG4gICAgaWQsXG4gICAgdmFyaWFudCA9ICdwcmltYXJ5JyxcbiAgICBzaXplID0gJ21kJyxcbiAgICB0eXBlID0gJ2J1dHRvbicsXG4gICAgZGlzYWJsZWQgPSBmYWxzZSxcbiAgICBsb2FkaW5nID0gZmFsc2UsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgb25DbGljayxcbn0gPSB7fSkge1xuICAgIGNvbnN0IHJlc29sdmVkVmFyaWFudCA9IFZBUklBTlRTLmluY2x1ZGVzKHZhcmlhbnQpID8gdmFyaWFudCA6ICdwcmltYXJ5JztcbiAgICBjb25zdCByZXNvbHZlZFNpemUgPSBTSVpFUy5pbmNsdWRlcyhzaXplKSA/IHNpemUgOiAnbWQnO1xuXG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnRuLnR5cGUgPSB0eXBlO1xuXG4gICAgaWYgKGlkKSBidG4uaWQgPSBpZDtcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBbXG4gICAgICAgICdidG4nLFxuICAgICAgICBgYnRuLS0ke3Jlc29sdmVkVmFyaWFudH1gLFxuICAgICAgICBgYnRuLS0ke3Jlc29sdmVkU2l6ZX1gLFxuICAgICAgICAuLi4obG9hZGluZyA/IFsnYnRuLS1sb2FkaW5nJ10gOiBbXSksXG4gICAgICAgIC4uLihjbGFzc05hbWUgPyBbY2xhc3NOYW1lXSA6IFtdKSxcbiAgICBdO1xuICAgIGJ0bi5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oJyAnKTtcblxuICAgIC8vIERpc2FibGUgdGhlIGJ1dHRvbiB3aGVuIGV4cGxpY2l0bHkgZGlzYWJsZWQgb3Igd2hpbGUgbG9hZGluZy5cbiAgICBjb25zdCBpc0Rpc2FibGVkID0gZGlzYWJsZWQgfHwgbG9hZGluZztcbiAgICBidG4uZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCBTdHJpbmcoaXNEaXNhYmxlZCkpO1xuICAgIGlmIChsb2FkaW5nKSBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWJ1c3knLCAndHJ1ZScpO1xuXG4gICAgLy8gTGFiZWwgdGV4dCBcdTIwMTQgYWx3YXlzIHByZXNlbnQgKHNjcmVlbiByZWFkZXJzIHdpbGwgcmVhZCBpdCkuXG4gICAgY29uc3QgbGFiZWxTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGxhYmVsU3Bhbi5jbGFzc05hbWUgPSAnYnRuX19sYWJlbCc7XG4gICAgbGFiZWxTcGFuLnRleHRDb250ZW50ID0gbGFiZWwgPz8gJyc7XG4gICAgYnRuLmFwcGVuZENoaWxkKGxhYmVsU3Bhbik7XG5cbiAgICAvLyBTcGlubmVyIChoaWRkZW4gd2hlbiBub3QgbG9hZGluZywgdmlzaWJsZSB3aGVuIGxvYWRpbmcpLlxuICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBjcmVhdGVTcGlubmVyKHsgc2l6ZTogcmVzb2x2ZWRTaXplID09PSAnbGcnID8gJ21kJyA6ICdzbScgfSk7XG4gICAgICAgIHNwaW5uZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7IC8vIG1haW4gYXJpYS1idXN5IG9uIGJ1dHRvbiBpcyBlbm91Z2hcbiAgICAgICAgYnRuLmFwcGVuZENoaWxkKHNwaW5uZXIpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb25DbGljayA9PT0gJ2Z1bmN0aW9uJyAmJiAhaXNEaXNhYmxlZCkge1xuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnRuO1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgYSBidXR0b24ncyBsb2FkaW5nIHN0YXRlIGluLXBsYWNlIHdpdGhvdXQgcmVjcmVhdGluZyB0aGUgZWxlbWVudC5cbiAqIFVzZWZ1bCB3aGVuIHRoZSBzYW1lIGJ1dHRvbiBlbGVtZW50IG5lZWRzIHRvIHRvZ2dsZSBsb2FkaW5nIGR1cmluZyBhbiBhc3luYyBvcC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidG4gICAgICAgLSBUaGUgYnV0dG9uIGVsZW1lbnQgdG8gdXBkYXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59ICAgICAgICAgICBpc0xvYWRpbmcgLSBOZXcgbG9hZGluZyBzdGF0ZVxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRCdXR0b25Mb2FkaW5nKGJ0biwgaXNMb2FkaW5nKSB7XG4gICAgaWYgKCFidG4gfHwgIShidG4gaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkpIHJldHVybjtcblxuICAgIGJ0bi5kaXNhYmxlZCA9IGlzTG9hZGluZztcbiAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgU3RyaW5nKGlzTG9hZGluZykpO1xuXG4gICAgaWYgKGlzTG9hZGluZykge1xuICAgICAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWJ1c3knLCAndHJ1ZScpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnYnRuLS1sb2FkaW5nJyk7XG5cbiAgICAgICAgaWYgKCFidG4ucXVlcnlTZWxlY3RvcignLnNwaW5uZXInKSkge1xuICAgICAgICAgICAgY29uc3Qgc3Bpbm5lciA9IGNyZWF0ZVNwaW5uZXIoeyBzaXplOiAnc20nIH0pO1xuICAgICAgICAgICAgc3Bpbm5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIGJ0bi5hcHBlbmRDaGlsZChzcGlubmVyKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtYnVzeScpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnYnRuLS1sb2FkaW5nJyk7XG4gICAgICAgIGJ0bi5xdWVyeVNlbGVjdG9yKCcuc3Bpbm5lcicpPy5yZW1vdmUoKTtcbiAgICB9XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IElucHV0IFx1MjAxNCBBY2Nlc3NpYmxlIFRleHQgSW5wdXQgQ29tcG9uZW50IFx1MjAxNCBQYXJ0IDMgLyBQYXJ0IDEwLlxuICpcbiAqIENyZWF0ZXMgYSBsYWJlbGxlZCBgPGlucHV0PmAgZWxlbWVudCB3aXRoIGlubGluZSBlcnJvciBtZXNzYWdpbmcgYW5kIGFuXG4gKiBvcHRpb25hbCBzaG93L2hpZGUgcGFzc3dvcmQgdG9nZ2xlIGZvciBgdHlwZT1cInBhc3N3b3JkXCJgIGlucHV0cy5cbiAqXG4gKiBAbW9kdWxlIGNvbXBvbmVudHMvdWkvSW5wdXRcbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgU1ZHIGljb25zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBFWUVfSUNPTiA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIlxuICB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gIDxwYXRoIGQ9XCJNMiAxMnMzLTcgMTAtNyAxMCA3IDEwIDctMyA3LTEwIDctMTAtNy0xMC03WlwiLz5cbiAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIzXCIvPlxuPC9zdmc+YDtcblxuY29uc3QgRVlFX09GRl9JQ09OID0gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiXG4gIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgPHBhdGggZD1cIk05Ljg4IDkuODhhMyAzIDAgMSAwIDQuMjQgNC4yNFwiLz5cbiAgPHBhdGggZD1cIk0xMC43MyA1LjA4QTEwLjQzIDEwLjQzIDAgMCAxIDEyIDVjNyAwIDEwIDcgMTAgN2ExMy4xNiAxMy4xNiAwIDAgMS0xLjY3IDIuNjhcIi8+XG4gIDxwYXRoIGQ9XCJNNi42MSA2LjYxQTEzLjUyNiAxMy41MjYgMCAwIDAgMiAxMnMzIDcgMTAgN2E5Ljc0IDkuNzQgMCAwIDAgNS4zOS0xLjYxXCIvPlxuICA8bGluZSB4MT1cIjJcIiB4Mj1cIjIyXCIgeTE9XCIyXCIgeTI9XCIyMlwiLz5cbjwvc3ZnPmA7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBGYWN0b3J5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENyZWF0ZXMgYSBsYWJlbGxlZCBpbnB1dCBmaWVsZCB3aXRoIG9wdGlvbmFsIGlubGluZSBlcnJvciBhbmQgcGFzc3dvcmQgdG9nZ2xlLlxuICpcbiAqIFJldHVybnMgYSB3cmFwcGVyIGA8ZGl2PmAgY29udGFpbmluZyB0aGUgbGFiZWwsIGlucHV0LCBhbmQgKHdoZW4gYXBwbGljYWJsZSlcbiAqIHRoZSBlcnJvciBtZXNzYWdlIGVsZW1lbnQuICBUaGUgZXJyb3IgZWxlbWVudCBpcyBhbHdheXMgcmVuZGVyZWQgKGJ1dCBlbXB0eVxuICogd2hlbiB0aGVyZSBpcyBubyBlcnJvcikgc28gRE9NIGxheW91dCBzdGF5cyBzdGFibGUgXHUyMDE0IG5vIGxheW91dCBzaGlmdCB3aGVuXG4gKiBhbiBlcnJvciBhcHBlYXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgIG9wdHMgICAgICAgICAgICAgICAtIElucHV0IGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSAgIG9wdHMuaWQgICAgICAgICAgICAtIEVsZW1lbnQgaWQgKGxpbmtzIGxhYmVsIFx1MjE5MiBpbnB1dClcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIG9wdHMubmFtZSAgICAgICAgICAtIElucHV0IG5hbWUgYXR0cmlidXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy50eXBlPSd0ZXh0J10gLSBJbnB1dCB0eXBlIGF0dHJpYnV0ZVxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMubGFiZWxdICAgICAgIC0gVmlzaWJsZSBsYWJlbCB0ZXh0XG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy52YWx1ZT0nJ10gICAgLSBJbml0aWFsIHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5wbGFjZWhvbGRlcj0nJ10gLSBQbGFjZWhvbGRlciB0ZXh0XG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5lcnJvcl0gICAgICAgLSBJbmxpbmUgZXJyb3IgbWVzc2FnZSAoc2V0cyBhcmlhLWludmFsaWQpXG4gKiBAcGFyYW0ge2Jvb2xlYW59ICBbb3B0cy5yZXF1aXJlZD1mYWxzZV0gLSBNYXJrcyBmaWVsZCBhcyByZXF1aXJlZFxuICogQHBhcmFtIHtib29sZWFufSAgW29wdHMuZGlzYWJsZWQ9ZmFsc2VdIC0gRGlzYWJsZXMgdGhlIGlucHV0XG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5hdXRvY29tcGxldGVdICAgLSBhdXRvY29tcGxldGUgYXR0cmlidXRlIHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0cy5vbkNoYW5nZV0gICAgLSBpbnB1dCBldmVudCBoYW5kbGVyIChyZWNlaXZlcyB0aGUgRXZlbnQpXG4gKiBAcmV0dXJucyB7eyB3cmFwcGVyOiBIVE1MRGl2RWxlbWVudCwgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQsIHNldEVycm9yOiBmdW5jdGlvbiB9fVxuICogICBSZXR1cm5zIHRoZSB3cmFwcGVyIGVsZW1lbnQsIGRpcmVjdCBpbnB1dCByZWZlcmVuY2UsIGFuZCBhbiBlcnJvciB1cGRhdGVyXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHsgd3JhcHBlciwgaW5wdXQsIHNldEVycm9yIH0gPSBjcmVhdGVJbnB1dCh7XG4gKiAgIGlkOiAnZW1haWwnLFxuICogICBuYW1lOiAnZW1haWwnLFxuICogICB0eXBlOiAnZW1haWwnLFxuICogICBsYWJlbDogJ0VtYWlsIGFkZHJlc3MnLFxuICogICByZXF1aXJlZDogdHJ1ZSxcbiAqICAgb25DaGFuZ2U6IGUgPT4gdmFsaWRhdGVFbWFpbEZpZWxkKGUudGFyZ2V0LnZhbHVlKSxcbiAqIH0pO1xuICogZm9ybUVsLmFwcGVuZCh3cmFwcGVyKTtcbiAqIHNldEVycm9yKCdFbnRlciBhIHZhbGlkIGVtYWlsIGFkZHJlc3MnKTsgLy8gc2hvd3MgaW5saW5lIGVycm9yXG4gKiBzZXRFcnJvcihudWxsKTsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNsZWFycyBpdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW5wdXQoe1xuICAgIGlkLFxuICAgIG5hbWUsXG4gICAgdHlwZSA9ICd0ZXh0JyxcbiAgICBsYWJlbCxcbiAgICB2YWx1ZSA9ICcnLFxuICAgIHBsYWNlaG9sZGVyID0gJycsXG4gICAgZXJyb3IsXG4gICAgcmVxdWlyZWQgPSBmYWxzZSxcbiAgICBkaXNhYmxlZCA9IGZhbHNlLFxuICAgIGF1dG9jb21wbGV0ZSxcbiAgICBvbkNoYW5nZSxcbn0gPSB7fSkge1xuICAgIGNvbnN0IGlzUGFzc3dvcmQgPSB0eXBlID09PSAncGFzc3dvcmQnO1xuICAgIGNvbnN0IGVycm9ySWQgPSBgJHtpZH0tZXJyb3JgO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFdyYXBwZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ2lucHV0LWZpZWxkJztcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBMYWJlbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgY29uc3QgbGFiZWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIGxhYmVsRWwuaHRtbEZvciA9IGlkO1xuICAgICAgICBsYWJlbEVsLmNsYXNzTmFtZSA9ICdpbnB1dC1maWVsZF9fbGFiZWwnO1xuICAgICAgICBsYWJlbEVsLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgICAgICAgY29uc3QgcmVxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgcmVxLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgcmVxLmNsYXNzTmFtZSA9ICdpbnB1dC1maWVsZF9fcmVxdWlyZWQnO1xuICAgICAgICAgICAgcmVxLnRleHRDb250ZW50ID0gJyAqJztcbiAgICAgICAgICAgIGxhYmVsRWwuYXBwZW5kQ2hpbGQocmVxKTtcbiAgICAgICAgfVxuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxhYmVsRWwpO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBJbnB1dCByb3cgKGlucHV0ICsgb3B0aW9uYWwgdG9nZ2xlIGJ1dHRvbikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgaW5wdXRSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBpbnB1dFJvdy5jbGFzc05hbWUgPSBgaW5wdXQtZmllbGRfX3JvdyR7aXNQYXNzd29yZCA/ICcgaW5wdXQtZmllbGRfX3Jvdy0tcGFzc3dvcmQnIDogJyd9YDtcblxuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBpbnB1dC5pZCA9IGlkO1xuICAgIGlucHV0Lm5hbWUgPSBuYW1lO1xuICAgIGlucHV0LnR5cGUgPSB0eXBlO1xuICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgaW5wdXQucGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcjtcbiAgICBpbnB1dC5yZXF1aXJlZCA9IHJlcXVpcmVkO1xuICAgIGlucHV0LmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgaW5wdXQuY2xhc3NOYW1lID0gYGlucHV0LWZpZWxkX19pbnB1dCR7ZXJyb3IgPyAnIGlucHV0LWZpZWxkX19pbnB1dC0tZXJyb3InIDogJyd9YDtcbiAgICBpZiAoYXV0b2NvbXBsZXRlKSBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScsIGF1dG9jb21wbGV0ZSk7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgZXJyb3JJZCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBvbkNoYW5nZSk7XG4gICAgfVxuICAgIGlucHV0Um93LmFwcGVuZENoaWxkKGlucHV0KTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTaG93L2hpZGUgdG9nZ2xlIChwYXNzd29yZCBvbmx5KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBpZiAoaXNQYXNzd29yZCkge1xuICAgICAgICBjb25zdCB0b2dnbGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgdG9nZ2xlQnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgdG9nZ2xlQnRuLmNsYXNzTmFtZSA9ICdpbnB1dC1maWVsZF9fdG9nZ2xlJztcbiAgICAgICAgdG9nZ2xlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdTaG93IHBhc3N3b3JkJyk7XG4gICAgICAgIHRvZ2dsZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsICdmYWxzZScpO1xuICAgICAgICB0b2dnbGVCdG4uaW5uZXJIVE1MID0gRVlFX0lDT047XG5cbiAgICAgICAgdG9nZ2xlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNTaG93aW5nID0gaW5wdXQudHlwZSA9PT0gJ3RleHQnO1xuICAgICAgICAgICAgaW5wdXQudHlwZSA9IGlzU2hvd2luZyA/ICdwYXNzd29yZCcgOiAndGV4dCc7XG4gICAgICAgICAgICB0b2dnbGVCdG4uc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCBTdHJpbmcoIWlzU2hvd2luZykpO1xuICAgICAgICAgICAgdG9nZ2xlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGlzU2hvd2luZyA/ICdTaG93IHBhc3N3b3JkJyA6ICdIaWRlIHBhc3N3b3JkJyk7XG4gICAgICAgICAgICB0b2dnbGVCdG4uaW5uZXJIVE1MID0gaXNTaG93aW5nID8gRVlFX0lDT04gOiBFWUVfT0ZGX0lDT047XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlucHV0Um93LmFwcGVuZENoaWxkKHRvZ2dsZUJ0bik7XG4gICAgfVxuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChpbnB1dFJvdyk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRXJyb3IgbWVzc2FnZSAoYWx3YXlzIHJlbmRlcmVkLCBlbXB0eSB3aGVuIG5vIGVycm9yKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBlcnJvckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGVycm9yRWwuaWQgPSBlcnJvcklkO1xuICAgIGVycm9yRWwuY2xhc3NOYW1lID0gJ2lucHV0LWZpZWxkX19lcnJvcic7XG4gICAgZXJyb3JFbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICBlcnJvckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgIGVycm9yRWwudGV4dENvbnRlbnQgPSBlcnJvciA/PyAnJztcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGVycm9yRWwpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEVycm9yIHVwZGF0ZXIgaGVscGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgaW5saW5lIGVycm9yIG1lc3NhZ2UgYW5kIGFyaWEtaW52YWxpZCBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IG1lc3NhZ2UgLSBFcnJvciB0ZXh0LCBvciBudWxsIHRvIGNsZWFyXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0RXJyb3IobWVzc2FnZSkge1xuICAgICAgICBlcnJvckVsLnRleHRDb250ZW50ID0gbWVzc2FnZSA/PyAnJztcbiAgICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJywgJ3RydWUnKTtcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGVycm9ySWQpO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LmFkZCgnaW5wdXQtZmllbGRfX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWludmFsaWQnKTtcbiAgICAgICAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW5wdXQtZmllbGRfX2lucHV0LS1lcnJvcicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgd3JhcHBlciwgaW5wdXQsIHNldEVycm9yIH07XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IERlbW9DcmVkZW50aWFscyBcdTIwMTQgRGVtbyBMb2dpbiBIaW50IEJsb2NrIFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogUmVuZGVycyBhIHZpc3VhbGx5IGRpc3RpbmN0IGluZm8gYm94IHNob3dpbmcgdGhlIGRlbW8gZW1haWwgYW5kIHBhc3N3b3JkLlxuICogSW5jbHVkZXMgYW4gb3B0aW9uYWwgXCJVc2UgZGVtbyBjcmVkZW50aWFsc1wiIGJ1dHRvbiB0aGF0IGF1dG8tZmlsbHMgdGhlXG4gKiBjb25uZWN0ZWQgbG9naW4gZm9ybSBpbnB1dHMuXG4gKlxuICogQG1vZHVsZSBjb21wb25lbnRzL2F1dGgvRGVtb0NyZWRlbnRpYWxzXG4gKi9cblxuaW1wb3J0IHsgQVVUSF9DT05TVEFOVFMgfSBmcm9tICcuLi8uLi91dGlscy9jb25zdGFudHMuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGRlbW8gY3JlZGVudGlhbHMgaGludCBibG9jay5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIFtvcHRzPXt9XSAgICAgICAgICAtIENvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRzLm9uRmlsbF0gICAgIC0gQ2FsbGVkIHdpdGggYHsgZW1haWwsIHBhc3N3b3JkIH1gIHdoZW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHVzZXIgY2xpY2tzIFwiVXNlIGRlbW8gY3JlZGVudGlhbHNcIi5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXR0YWNoIGEgaGFuZGxlciB0byBhdXRvLWZpbGwgZm9ybSBpbnB1dHMuXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IFRoZSByZW5kZXJlZCBoaW50IGJsb2NrIGVsZW1lbnRcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgaGludCA9IGNyZWF0ZURlbW9DcmVkZW50aWFscyh7XG4gKiAgIG9uRmlsbDogKHsgZW1haWwsIHBhc3N3b3JkIH0pID0+IHtcbiAqICAgICBlbWFpbElucHV0LnZhbHVlID0gZW1haWw7XG4gKiAgICAgcGFzc3dvcmRJbnB1dC52YWx1ZSA9IHBhc3N3b3JkO1xuICogICB9LFxuICogfSk7XG4gKiBsb2dpbkZvcm1FbC5hcHBlbmQoaGludCk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEZW1vQ3JlZGVudGlhbHMoeyBvbkZpbGwgfSA9IHt9KSB7XG4gICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBibG9jay5jbGFzc05hbWUgPSAnZGVtby1jcmVkZW50aWFscyc7XG4gICAgYmxvY2suc2V0QXR0cmlidXRlKCdyb2xlJywgJ25vdGUnKTtcbiAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnRGVtbyBsb2dpbiBjcmVkZW50aWFscycpO1xuXG4gICAgY29uc3QgaGVhZGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBoZWFkaW5nLmNsYXNzTmFtZSA9ICdkZW1vLWNyZWRlbnRpYWxzX19oZWFkaW5nJztcbiAgICBoZWFkaW5nLnRleHRDb250ZW50ID0gJ0RlbW8gY3JlZGVudGlhbHMnO1xuICAgIGJsb2NrLmFwcGVuZENoaWxkKGhlYWRpbmcpO1xuXG4gICAgLy8gRW1haWwgcm93XG4gICAgY29uc3QgZW1haWxSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgZW1haWxSb3cuY2xhc3NOYW1lID0gJ2RlbW8tY3JlZGVudGlhbHNfX3Jvdyc7XG4gICAgZW1haWxSb3cuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiZGVtby1jcmVkZW50aWFsc19fa2V5XCI+RW1haWw6PC9zcGFuPlxuICAgICAgPGNvZGUgY2xhc3M9XCJkZW1vLWNyZWRlbnRpYWxzX192YWx1ZVwiPiR7QVVUSF9DT05TVEFOVFMuREVNT19FTUFJTH08L2NvZGU+YDtcbiAgICBibG9jay5hcHBlbmRDaGlsZChlbWFpbFJvdyk7XG5cbiAgICAvLyBQYXNzd29yZCByb3dcbiAgICBjb25zdCBwYXNzUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHBhc3NSb3cuY2xhc3NOYW1lID0gJ2RlbW8tY3JlZGVudGlhbHNfX3Jvdyc7XG4gICAgcGFzc1Jvdy5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCJkZW1vLWNyZWRlbnRpYWxzX19rZXlcIj5QYXNzd29yZDo8L3NwYW4+XG4gICAgICA8Y29kZSBjbGFzcz1cImRlbW8tY3JlZGVudGlhbHNfX3ZhbHVlXCI+JHtBVVRIX0NPTlNUQU5UUy5ERU1PX1BBU1NXT1JEfTwvY29kZT5gO1xuICAgIGJsb2NrLmFwcGVuZENoaWxkKHBhc3NSb3cpO1xuXG4gICAgLy8gQXV0by1maWxsIGJ1dHRvbiAob25seSByZW5kZXJlZCB3aGVuIGEgaGFuZGxlciBpcyBwcm92aWRlZClcbiAgICBpZiAodHlwZW9mIG9uRmlsbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBmaWxsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGZpbGxCdG4udHlwZSA9ICdidXR0b24nO1xuICAgICAgICBmaWxsQnRuLmNsYXNzTmFtZSA9ICdkZW1vLWNyZWRlbnRpYWxzX19maWxsLWJ0bic7XG4gICAgICAgIGZpbGxCdG4udGV4dENvbnRlbnQgPSAnVXNlIGRlbW8gY3JlZGVudGlhbHMnO1xuICAgICAgICBmaWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgb25GaWxsKHsgZW1haWw6IEFVVEhfQ09OU1RBTlRTLkRFTU9fRU1BSUwsIHBhc3N3b3JkOiBBVVRIX0NPTlNUQU5UUy5ERU1PX1BBU1NXT1JEIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2suYXBwZW5kQ2hpbGQoZmlsbEJ0bik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJsb2NrO1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBDaGVja2JveCBcdTIwMTQgQWNjZXNzaWJsZSBDaGVja2JveCBDb21wb25lbnQgXHUyMDE0IFBhcnQgMyAvIFBhcnQgMTAuXG4gKlxuICogQ3JlYXRlcyBhIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPmAgd2l0aCBhIHByb3Blcmx5IGFzc29jaWF0ZWRcbiAqIGA8bGFiZWw+YC4gIFVzZWQgYnkgdGhlIFJlbWVtYmVyTWUgY29tcG9uZW50LlxuICpcbiAqIEBtb2R1bGUgY29tcG9uZW50cy91aS9DaGVja2JveFxuICovXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhY2Nlc3NpYmxlIGxhYmVsbGVkIGNoZWNrYm94IGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgb3B0cyAgICAgICAgICAgICAgLSBDaGVja2JveCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gICBvcHRzLmlkICAgICAgICAgIC0gRWxlbWVudCBpZCAobGlua3MgbGFiZWwgXHUyMTkyIGlucHV0KVxuICogQHBhcmFtIHtzdHJpbmd9ICAgb3B0cy5uYW1lICAgICAgICAtIElucHV0IG5hbWUgYXR0cmlidXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gICBvcHRzLmxhYmVsICAgICAgIC0gVmlzaWJsZSBsYWJlbCB0ZXh0XG4gKiBAcGFyYW0ge2Jvb2xlYW59ICBbb3B0cy5jaGVja2VkPWZhbHNlXSAgIC0gSW5pdGlhbCBjaGVja2VkIHN0YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59ICBbb3B0cy5kaXNhYmxlZD1mYWxzZV0gIC0gRGlzYWJsZXMgdGhlIGNoZWNrYm94XG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5jbGFzc05hbWU9JyddICAgLSBFeHRyYSBDU1MgY2xhc3NlcyBvbiB0aGUgd3JhcHBlclxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdHMub25DaGFuZ2VdICAtIGNoYW5nZSBldmVudCBoYW5kbGVyIChyZWNlaXZlcyBFdmVudClcbiAqIEByZXR1cm5zIHt7IHdyYXBwZXI6IEhUTUxEaXZFbGVtZW50LCBpbnB1dDogSFRNTElucHV0RWxlbWVudCB9fVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7IHdyYXBwZXIsIGlucHV0IH0gPSBjcmVhdGVDaGVja2JveCh7XG4gKiAgIGlkOiAncmVtZW1iZXItbWUnLFxuICogICBuYW1lOiAncmVtZW1iZXJNZScsXG4gKiAgIGxhYmVsOiAnUmVtZW1iZXIgbWUnLFxuICogICBjaGVja2VkOiBmYWxzZSxcbiAqICAgb25DaGFuZ2U6IGUgPT4gY29uc29sZS5sb2coJ2NoZWNrZWQ6JywgZS50YXJnZXQuY2hlY2tlZCksXG4gKiB9KTtcbiAqIGZvcm1FbC5hcHBlbmQod3JhcHBlcik7XG4gKiAvLyBSZWFkIHZhbHVlOiAgaW5wdXQuY2hlY2tlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2hlY2tib3goe1xuICAgIGlkLFxuICAgIG5hbWUsXG4gICAgbGFiZWwsXG4gICAgY2hlY2tlZCA9IGZhbHNlLFxuICAgIGRpc2FibGVkID0gZmFsc2UsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgb25DaGFuZ2UsXG59ID0ge30pIHtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd3JhcHBlci5jbGFzc05hbWUgPSBgY2hlY2tib3gke2NsYXNzTmFtZSA/IGAgJHtjbGFzc05hbWV9YCA6ICcnfWA7XG5cbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgaW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgaW5wdXQuaWQgPSBpZDtcbiAgICBpbnB1dC5uYW1lID0gbmFtZTtcbiAgICBpbnB1dC5jaGVja2VkID0gY2hlY2tlZDtcbiAgICBpbnB1dC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIGlucHV0LmNsYXNzTmFtZSA9ICdjaGVja2JveF9faW5wdXQnO1xuXG4gICAgaWYgKHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBvbkNoYW5nZSk7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgbGFiZWxFbC5odG1sRm9yID0gaWQ7XG4gICAgbGFiZWxFbC5jbGFzc05hbWUgPSAnY2hlY2tib3hfX2xhYmVsJztcbiAgICBsYWJlbEVsLnRleHRDb250ZW50ID0gbGFiZWwgPz8gJyc7XG5cbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxhYmVsRWwpO1xuXG4gICAgcmV0dXJuIHsgd3JhcHBlciwgaW5wdXQgfTtcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUmVtZW1iZXJNZSBcdTIwMTQgXCJSZW1lbWJlciBtZVwiIENoZWNrYm94IFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogQSBsYWJlbGxlZCBjaGVja2JveCBzdWItY29tcG9uZW50IHJlbmRlcmVkIGluc2lkZSBMb2dpbkZvcm0uXG4gKiBXaGVuIGNoZWNrZWQsIGF1dGggdG9rZW5zIGFyZSBwZXJzaXN0ZWQgaW4gbG9jYWxTdG9yYWdlICgzMC1kYXkgZXhwaXJ5KTtcbiAqIHdoZW4gdW5jaGVja2VkLCB0b2tlbnMgYXJlIHN0b3JlZCBpbiBzZXNzaW9uU3RvcmFnZSBvbmx5LlxuICpcbiAqIEBtb2R1bGUgY29tcG9uZW50cy9hdXRoL1JlbWVtYmVyTWVcbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVDaGVja2JveCB9IGZyb20gJy4uL3VpL0NoZWNrYm94LmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBcIlJlbWVtYmVyIG1lXCIgY2hlY2tib3ggd3JhcHBlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gIFtvcHRzPXt9XSAgICAgICAgICAgLSBDb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmNoZWNrZWQ9ZmFsc2VdIC0gSW5pdGlhbCBjaGVja2VkIHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0cy5vbkNoYW5nZV0gICAgLSBDYWxsZWQgd2l0aCB0aGUgbmV3IGJvb2xlYW4gdmFsdWVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW4gdGhlIGNoZWNrYm94IGNoYW5nZXNcbiAqIEByZXR1cm5zIHt7IHdyYXBwZXI6IEhUTUxEaXZFbGVtZW50LCBnZXRWYWx1ZTogZnVuY3Rpb24oKTogYm9vbGVhbiB9fVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCByZW1lbWJlck1lID0gY3JlYXRlUmVtZW1iZXJNZSh7XG4gKiAgIG9uQ2hhbmdlOiBjaGVja2VkID0+IGNvbnNvbGUubG9nKCdyZW1lbWJlck1lOicsIGNoZWNrZWQpLFxuICogfSk7XG4gKiBmb3JtRWwuYXBwZW5kKHJlbWVtYmVyTWUud3JhcHBlcik7XG4gKiBjb25zdCBzaG91bGRSZW1lbWJlciA9IHJlbWVtYmVyTWUuZ2V0VmFsdWUoKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlbWVtYmVyTWUoeyBjaGVja2VkID0gZmFsc2UsIG9uQ2hhbmdlIH0gPSB7fSkge1xuICAgIGNvbnN0IHsgd3JhcHBlciwgaW5wdXQgfSA9IGNyZWF0ZUNoZWNrYm94KHtcbiAgICAgICAgaWQ6ICdyZW1lbWJlci1tZScsXG4gICAgICAgIG5hbWU6ICdyZW1lbWJlck1lJyxcbiAgICAgICAgbGFiZWw6ICdSZW1lbWJlciBtZScsXG4gICAgICAgIGNoZWNrZWQsXG4gICAgICAgIGNsYXNzTmFtZTogJ3JlbWVtYmVyLW1lJyxcbiAgICAgICAgb25DaGFuZ2U6IHR5cGVvZiBvbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJyA/IGUgPT4gb25DaGFuZ2UoZS50YXJnZXQuY2hlY2tlZCkgOiB1bmRlZmluZWQsXG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB3cmFwcGVyLFxuICAgICAgICAvKiogQHJldHVybnMge2Jvb2xlYW59IEN1cnJlbnQgY2hlY2tlZCBzdGF0ZSAqL1xuICAgICAgICBnZXRWYWx1ZTogKCkgPT4gaW5wdXQuY2hlY2tlZCxcbiAgICB9O1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBMb2dpbkZvcm0gXHUyMDE0IExvZ2luIEZvcm0gQ29tcG9uZW50IFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogUmVuZGVycyB0aGUgY29tcGxldGUgbG9naW4gZm9ybTogZW1haWwgaW5wdXQsIHBhc3N3b3JkIGlucHV0LCBcIlJlbWVtYmVyIG1lXCJcbiAqIGNoZWNrYm94LCBkZW1vIGNyZWRlbnRpYWxzIGhpbnQsIGFuZCBzdWJtaXQgYnV0dG9uLiAgSGFuZGxlcyBjbGllbnQtc2lkZVxuICogdmFsaWRhdGlvbiwgYXN5bmMgc3VibWlzc2lvbiwgYW5kIGVycm9yIGRpc3BsYXkuXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIERhdGEgZmxvdyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVXNlciBmaWxscyBmb3JtXG4gKiAgICAgXHUyMTkyIGNsaWVudC1zaWRlIHZhbGlkYXRpb24gKHZhbGlkYXRlTG9naW5Gb3JtKVxuICogICAgIFx1MjE5MiBBdXRoQ29udGV4dC5sb2dpbihjcmVkZW50aWFscykgICAgICAgICAgICBcdTIxOTAgc3RhdGUgbWFuYWdlbWVudCBsYXllclxuICogICAgICAgXHUyMTkyIGF1dGhBcGkubG9naW4oY3JlZGVudGlhbHMpICAgICAgICAgICAgICBcdTIxOTAgSFRUUCBsYXllclxuICogICAgICAgICBcdTIxOTIgYXV0aFN0b3JhZ2Uuc2F2ZUF1dGhUb2tlbihcdTIwMjYpICAgICAgICAgIFx1MjE5MCBzdG9yYWdlIGxheWVyXG4gKiAgICAgXHUyMTkyIHN1Y2Nlc3MgXHUyMTkyIG9uU3VjY2VzcyBjYWxsYmFjayBcdTIxOTIgY2FsbGVyIG5hdmlnYXRlc1xuICogICAgIFx1MjE5MiBmYWlsdXJlIFx1MjE5MiBpbmxpbmUgZXJyb3IgZGlzcGxheWVkIGluIGZvcm1cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgTmF2aWdhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVGhpcyBjb21wb25lbnQgaW50ZW50aW9uYWxseSBkb2VzIE5PVCBjYWxsIHJvdXRlci5uYXZpZ2F0ZSgpIGRpcmVjdGx5LlxuICogICBBZnRlciBhIHN1Y2Nlc3NmdWwgbG9naW4gaXQgY2FsbHMgYG9wdHMub25TdWNjZXNzKHVzZXIsIGRlc3RpbmF0aW9uKWAuXG4gKiAgIFRoZSBwYWdlIHRoYXQgbW91bnRzIHRoaXMgZm9ybSAoTG9naW5QYWdlKSBpcyByZXNwb25zaWJsZSBmb3Igcm91dGluZy5cbiAqXG4gKiBAbW9kdWxlIGNvbXBvbmVudHMvYXV0aC9Mb2dpbkZvcm1cbiAqL1xuXG5pbXBvcnQgQXV0aENvbnRleHQgZnJvbSAnLi4vLi4vY29udGV4dC9BdXRoQ29udGV4dC5qcyc7XG5pbXBvcnQgeyBnZXRSZWRpcmVjdFBhdGggfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hdXRoU3RvcmFnZS5qcyc7XG5pbXBvcnQgeyB2YWxpZGF0ZUxvZ2luRm9ybSB9IGZyb20gJy4uLy4uL3V0aWxzL3ZhbGlkYXRpb24uanMnO1xuaW1wb3J0IHsgY3JlYXRlQnV0dG9uLCBzZXRCdXR0b25Mb2FkaW5nIH0gZnJvbSAnLi4vdWkvQnV0dG9uLmpzJztcbmltcG9ydCB7IGNyZWF0ZUlucHV0IH0gZnJvbSAnLi4vdWkvSW5wdXQuanMnO1xuaW1wb3J0IHsgY3JlYXRlRGVtb0NyZWRlbnRpYWxzIH0gZnJvbSAnLi9EZW1vQ3JlZGVudGlhbHMuanMnO1xuaW1wb3J0IHsgY3JlYXRlUmVtZW1iZXJNZSB9IGZyb20gJy4vUmVtZW1iZXJNZS5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBGYWN0b3J5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGxvZ2luIGZvcm0gZWxlbWVudCBhbmQgbW91bnRzIGl0IGludG8gdGhlIHN1cHBsaWVkIGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgICAgICAgIC0gVGhlIERPTSBlbGVtZW50IHRvIG1vdW50IHRoZSBmb3JtIGludG9cbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtvcHRzPXt9XSAgICAgICAgLSBPcHRpb25zXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSAgICBbb3B0cy5vblN1Y2Nlc3NdIC0gQ2FsbGVkIHdpdGggYCh1c2VyLCByZWRpcmVjdFBhdGgpYCBhZnRlclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgc3VjY2Vzc2Z1bCBsb2dpbi4gVXNlIHRoaXMgdG8gbmF2aWdhdGUuXG4gKiBAcmV0dXJucyB7eyBkZXN0cm95OiBmdW5jdGlvbiB9fSBDbGVhbnVwIGhhbmRsZSBcdTIwMTQgY2FsbCBgZGVzdHJveSgpYCBvbiBwYWdlIHVubW91bnRcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgZm9ybSA9IGNyZWF0ZUxvZ2luRm9ybShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9naW4tY29udGFpbmVyJyksIHtcbiAqICAgb25TdWNjZXNzOiAodXNlciwgcGF0aCkgPT4ge1xuICogICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcGF0aDtcbiAqICAgfSxcbiAqIH0pO1xuICogLy8gT24gcGFnZSBkZXN0cm95OlxuICogZm9ybS5kZXN0cm95KCk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2dpbkZvcm0oY29udGFpbmVyLCB7IG9uU3VjY2VzcyB9ID0ge30pIHtcbiAgICAvLyBcdTI1MDBcdTI1MDAgQnVpbGQgRE9NIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gICAgY29uc3QgZm9ybUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIGZvcm1FbC5pZCA9ICdsb2dpbi1mb3JtJztcbiAgICBmb3JtRWwuY2xhc3NOYW1lID0gJ2xvZ2luLWZvcm0nO1xuICAgIGZvcm1FbC5zZXRBdHRyaWJ1dGUoJ25vdmFsaWRhdGUnLCAnJyk7IC8vIHVzZSBjdXN0b20gdmFsaWRhdGlvbiBtZXNzYWdlc1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEZvcm0gdGl0bGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlLmNsYXNzTmFtZSA9ICdsb2dpbi1mb3JtX190aXRsZSc7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSAnU2lnbiBpbic7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGNvbnN0IHN1YnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHN1YnRpdGxlLmNsYXNzTmFtZSA9ICdsb2dpbi1mb3JtX19zdWJ0aXRsZSc7XG4gICAgc3VidGl0bGUudGV4dENvbnRlbnQgPSAnQWNjZXNzIHlvdXIgU3R1ZGVudCBQcm9ncmVzcyBEYXNoYm9hcmQnO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZChzdWJ0aXRsZSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgRXJyb3IgYmFubmVyICh0b3AtbGV2ZWwsIHNob3duIGZvciBuZXR3b3JrIC8gYXV0aCBlcnJvcnMpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGVycm9yQmFubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZXJyb3JCYW5uZXIuY2xhc3NOYW1lID0gJ2xvZ2luLWZvcm1fX2Vycm9yLWJhbm5lcic7XG4gICAgZXJyb3JCYW5uZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgZXJyb3JCYW5uZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XG4gICAgZXJyb3JCYW5uZXIuaGlkZGVuID0gdHJ1ZTtcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQoZXJyb3JCYW5uZXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEVtYWlsIGZpZWxkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHtcbiAgICAgICAgd3JhcHBlcjogZW1haWxXcmFwcGVyLFxuICAgICAgICBpbnB1dDogZW1haWxJbnB1dCxcbiAgICAgICAgc2V0RXJyb3I6IHNldEVtYWlsRXJyb3IsXG4gICAgfSA9IGNyZWF0ZUlucHV0KHtcbiAgICAgICAgaWQ6ICdsb2dpbi1lbWFpbCcsXG4gICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgIHR5cGU6ICdlbWFpbCcsXG4gICAgICAgIGxhYmVsOiAnRW1haWwgYWRkcmVzcycsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnc3R1ZGVudEBkZW1vLmNvbScsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBhdXRvY29tcGxldGU6ICdlbWFpbCcsXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgb25DaGFuZ2U6ICgpID0+IHNldEVtYWlsRXJyb3IobnVsbCksIC8vIGNsZWFyIGVycm9yIG9uIGV2ZXJ5IGtleXN0cm9rZVxuICAgIH0pO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZChlbWFpbFdyYXBwZXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFBhc3N3b3JkIGZpZWxkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHtcbiAgICAgICAgd3JhcHBlcjogcGFzc3dvcmRXcmFwcGVyLFxuICAgICAgICBpbnB1dDogcGFzc3dvcmRJbnB1dCxcbiAgICAgICAgc2V0RXJyb3I6IHNldFBhc3N3b3JkRXJyb3IsXG4gICAgfSA9IGNyZWF0ZUlucHV0KHtcbiAgICAgICAgaWQ6ICdsb2dpbi1wYXNzd29yZCcsXG4gICAgICAgIG5hbWU6ICdwYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIGxhYmVsOiAnUGFzc3dvcmQnLFxuICAgICAgICBwbGFjZWhvbGRlcjogJ1x1MjAyMlx1MjAyMlx1MjAyMlx1MjAyMlx1MjAyMlx1MjAyMicsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBhdXRvY29tcGxldGU6ICdjdXJyZW50LXBhc3N3b3JkJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBvbkNoYW5nZTogKCkgPT4gc2V0UGFzc3dvcmRFcnJvcihudWxsKSxcbiAgICB9KTtcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQocGFzc3dvcmRXcmFwcGVyKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBSZW1lbWJlciBtZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCByZW1lbWJlck1lID0gY3JlYXRlUmVtZW1iZXJNZSh7IGNoZWNrZWQ6IGZhbHNlIH0pO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZChyZW1lbWJlck1lLndyYXBwZXIpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFN1Ym1pdCBidXR0b24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3Qgc3VibWl0QnRuID0gY3JlYXRlQnV0dG9uKHtcbiAgICAgICAgaWQ6ICdsb2dpbi1zdWJtaXQnLFxuICAgICAgICBsYWJlbDogJ1NpZ24gSW4nLFxuICAgICAgICB2YXJpYW50OiAncHJpbWFyeScsXG4gICAgICAgIHNpemU6ICdsZycsXG4gICAgICAgIHR5cGU6ICdzdWJtaXQnLFxuICAgIH0pO1xuICAgIHN1Ym1pdEJ0bi5jbGFzc05hbWUgKz0gJyBsb2dpbi1mb3JtX19zdWJtaXQnO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZChzdWJtaXRCdG4pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIERlbW8gY3JlZGVudGlhbHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgZGVtb0Jsb2NrID0gY3JlYXRlRGVtb0NyZWRlbnRpYWxzKHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBvbkZpbGw6ICh7IGVtYWlsLCBwYXNzd29yZCB9KSA9PiB7XG4gICAgICAgICAgICBlbWFpbElucHV0LnZhbHVlID0gZW1haWw7XG4gICAgICAgICAgICBwYXNzd29yZElucHV0LnZhbHVlID0gcGFzc3dvcmQ7XG4gICAgICAgICAgICBzZXRFbWFpbEVycm9yKG51bGwpO1xuICAgICAgICAgICAgc2V0UGFzc3dvcmRFcnJvcihudWxsKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQoZGVtb0Jsb2NrKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBNb3VudCBpbnRvIGNvbnRhaW5lciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZm9ybUVsKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBIZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gICAgLyoqIFNob3dzIHRoZSB0b3AtbGV2ZWwgZXJyb3IgYmFubmVyIHdpdGggYSBtZXNzYWdlLiAqL1xuICAgIGZ1bmN0aW9uIHNob3dCYW5uZXJFcnJvcihtZXNzYWdlKSB7XG4gICAgICAgIGVycm9yQmFubmVyLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICAgICAgZXJyb3JCYW5uZXIuaGlkZGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqIEhpZGVzIHRoZSBlcnJvciBiYW5uZXIuICovXG4gICAgZnVuY3Rpb24gY2xlYXJCYW5uZXJFcnJvcigpIHtcbiAgICAgICAgZXJyb3JCYW5uZXIudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgZXJyb3JCYW5uZXIuaGlkZGVuID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU3VibWl0IGhhbmRsZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2xlYXJCYW5uZXJFcnJvcigpO1xuXG4gICAgICAgIGNvbnN0IGVtYWlsID0gZW1haWxJbnB1dC52YWx1ZS50cmltKCk7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkID0gcGFzc3dvcmRJbnB1dC52YWx1ZTtcbiAgICAgICAgY29uc3Qgc2hvdWxkUmVtZW1iZXJNZSA9IHJlbWVtYmVyTWUuZ2V0VmFsdWUoKTtcblxuICAgICAgICAvLyBcdTI1MDBcdTI1MDAgQ2xpZW50LXNpZGUgdmFsaWRhdGlvbiBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICAgICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGVMb2dpbkZvcm0oeyBlbWFpbCwgcGFzc3dvcmQgfSk7XG4gICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcnMuZW1haWwpIHNldEVtYWlsRXJyb3IoZXJyb3JzLmVtYWlsKTtcbiAgICAgICAgICAgIGlmIChlcnJvcnMucGFzc3dvcmQpIHNldFBhc3N3b3JkRXJyb3IoZXJyb3JzLnBhc3N3b3JkKTtcbiAgICAgICAgICAgIC8vIEZvY3VzIHRoZSBmaXJzdCBmaWVsZCB3aXRoIGFuIGVycm9yIGZvciBrZXlib2FyZCB1c2Vycy5cbiAgICAgICAgICAgIGlmIChlcnJvcnMuZW1haWwpIGVtYWlsSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGVycm9ycy5wYXNzd29yZCkgcGFzc3dvcmRJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBzdG9wIFx1MjAxNCBkbyBub3QgY2FsbCBBUEkgd2l0aCBpbnZhbGlkIGRhdGFcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFx1MjUwMFx1MjUwMCBTdWJtaXQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgIHNldEJ1dHRvbkxvYWRpbmcoc3VibWl0QnRuLCB0cnVlKTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBBdXRoQ29udGV4dC5sb2dpbih7XG4gICAgICAgICAgICBlbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkLFxuICAgICAgICAgICAgcmVtZW1iZXJNZTogc2hvdWxkUmVtZW1iZXJNZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2V0QnV0dG9uTG9hZGluZyhzdWJtaXRCdG4sIGZhbHNlKTtcblxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIC8vIFJldHJpZXZlIGFuZCBjbGVhciB0aGUgc2F2ZWQgcmVkaXJlY3QgcGF0aCAoY29uc3VtZWQgb25jZSkuXG4gICAgICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IGdldFJlZGlyZWN0UGF0aCgpOyAvLyAnL2Rhc2hib2FyZCcgaWYgbm9uZSBzYXZlZFxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9uU3VjY2VzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIG9uU3VjY2VzcyhyZXN1bHQudXNlciwgZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRGlzcGxheSB0aGUgZXJyb3IgcmV0dXJuZWQgYnkgQXV0aENvbnRleHQuXG4gICAgICAgICAgICBzaG93QmFubmVyRXJyb3IocmVzdWx0LmVycm9yID8/ICdMb2dpbiBmYWlsZWQuIFBsZWFzZSB0cnkgYWdhaW4uJyk7XG4gICAgICAgICAgICBlbWFpbElucHV0LmZvY3VzKCk7IC8vIHJldHVybiBmb2N1cyB0byBmaXJzdCBmaWVsZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9ybUVsLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGhhbmRsZVN1Ym1pdCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ2xlYW51cCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBmb3JtIGZyb20gdGhlIERPTSBhbmQgY2xlYW5zIHVwIGV2ZW50IGxpc3RlbmVycy5cbiAgICAgICAgICogQ2FsbCB3aGVuIHRoZSBMb2dpblBhZ2UgaXMgZGVzdHJveWVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICBmb3JtRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VibWl0JywgaGFuZGxlU3VibWl0KTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChmb3JtRWwpO1xuICAgICAgICB9LFxuICAgIH07XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IExvZ2luUGFnZSBcdTIwMTQgVG9wLUxldmVsIExvZ2luIFBhZ2UgXHUyMDE0IFBhcnQgMy5cbiAqXG4gKiBBc3NlbWJsZXMgdGhlIGNvbXBsZXRlIGxvZ2luIHZpZXc6XG4gKiAgIFx1MjAyMiBBcHAgbG9nbyArIHRhZ2xpbmUgKGxlZnQgLyB0b3AgcGFuZWwpXG4gKiAgIFx1MjAyMiBMb2dpbkZvcm0gKHJpZ2h0IC8gYm90dG9tIHBhbmVsKVxuICpcbiAqIFJlc3BvbnNpYmlsaXRpZXM6XG4gKiAgIC0gU2V0IGBkb2N1bWVudC50aXRsZWAgb24gbW91bnQgKEZSLVVYLTAyOSlcbiAqICAgLSBSZWRpcmVjdCB0byAvZGFzaGJvYXJkIGlmIHRoZSB1c2VyIGlzIGFscmVhZHkgYXV0aGVudGljYXRlZFxuICogICAtIENvbXBvc2UgTG9naW5Gb3JtIHdpdGggYSBuYXZpZ2F0aW9uIGNhbGxiYWNrXG4gKiAgIC0gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgY2hpbGQgY29tcG9uZW50cyBvbiBkZXN0cm95XG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIE5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIFRPRE8gKFBhcnQgNCBcdTIwMTQgUm91dGluZyk6XG4gKiAgICAgUmVwbGFjZSB0aGUgYHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXHUyMDI2YCBjYWxscyB3aXRoIGByb3V0ZXIubmF2aWdhdGUoKWAuXG4gKlxuICogQG1vZHVsZSBwYWdlcy9Mb2dpblBhZ2VcbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVMb2dpbkZvcm0gfSBmcm9tICcuLi9jb21wb25lbnRzL2F1dGgvTG9naW5Gb3JtLmpzJztcbmltcG9ydCBBdXRoQ29udGV4dCBmcm9tICcuLi9jb250ZXh0L0F1dGhDb250ZXh0LmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIENvbnN0YW50cyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgUEFHRV9USVRMRSA9ICdTaWduIEluIHwgU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEZhY3RvcnkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ3JlYXRlcyBhbmQgbW91bnRzIHRoZSBsb2dpbiBwYWdlIGludG8gdGhlIGdpdmVuIGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBUaGUgcm9vdCBlbGVtZW50IHRvIG1vdW50IGludG8gKGUuZy4gYCNhcHBgKVxuICogQHJldHVybnMge3sgZGVzdHJveTogZnVuY3Rpb24gfX0gQ2xlYW51cCBoYW5kbGVcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcGFnZSA9IGNyZWF0ZUxvZ2luUGFnZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xuICogLy8gT24gcm91dGUgY2hhbmdlIC8gcGFnZSBkZXN0cm95OlxuICogcGFnZS5kZXN0cm95KCk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2dpblBhZ2UoY29udGFpbmVyKSB7XG4gICAgLy8gXHUyNTAwXHUyNTAwIEd1YXJkOiByZWRpcmVjdCBhdXRoZW50aWNhdGVkIHVzZXJzIGF3YXkgZnJvbSB0aGUgbG9naW4gcGFnZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB7IGlzQXV0aGVudGljYXRlZCwgaXNMb2FkaW5nIH0gPSBBdXRoQ29udGV4dC5nZXRTdGF0ZSgpO1xuXG4gICAgaWYgKCFpc0xvYWRpbmcgJiYgaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgIC8vIFRPRE8gKFBhcnQgNCBcdTIwMTQgUm91dGluZyk6IHJvdXRlci5uYXZpZ2F0ZShST1VURVMuREFTSEJPQVJEKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2Rhc2hib2FyZCc7XG4gICAgICAgIC8vIFJldHVybiBhIG5vLW9wIGRlc3Ryb3kgaGFuZGxlIFx1MjAxNCBwYWdlIHdvbid0IGJlIHJlbmRlcmVkLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZXN0cm95OiAoKSA9PiB7fSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU2V0IGRvY3VtZW50IHRpdGxlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGRvY3VtZW50LnRpdGxlID0gUEFHRV9USVRMRTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBCdWlsZCBwYWdlIHNoZWxsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHBhZ2VFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBhZ2VFbC5jbGFzc05hbWUgPSAnbG9naW4tcGFnZSc7XG4gICAgcGFnZUVsLmlkID0gJ2xvZ2luLXBhZ2UnO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIExlZnQgLyBoZXJvIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGhlcm9QYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhlcm9QYW5lbC5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9faGVybyc7XG4gICAgaGVyb1BhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBkZWNvcmF0aXZlIHBhbmVsXG5cbiAgICBjb25zdCBsb2dvQXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxvZ29BcmVhLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX19sb2dvLWFyZWEnO1xuXG4gICAgLy8gSW5saW5lIFNWRyBsb2dvIFx1MjAxNCB1c2VzIHRoZSBhc3NldCBhdCBzcmMvYXNzZXRzL2F1dGgvbG9nby5zdmcuXG4gICAgLy8gTG9hZGVkIGFzIGFuIDxpbWc+IHdpdGggYSBtZWFuaW5nZnVsIGFsdCBzbyBpdCBkZWdyYWRlcyBncmFjZWZ1bGx5LlxuICAgIGNvbnN0IGxvZ29JbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBsb2dvSW1nLnNyYyA9ICcvc3JjL2Fzc2V0cy9hdXRoL2xvZ28uc3ZnJztcbiAgICBsb2dvSW1nLmFsdCA9ICdTdHVkZW50IFByb2dyZXNzIFRyYWNrZXIgbG9nbyc7XG4gICAgbG9nb0ltZy5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9fbG9nbyc7XG4gICAgbG9nb0ltZy53aWR0aCA9IDQ4O1xuICAgIGxvZ29JbWcuaGVpZ2h0ID0gNDg7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBsb2dvSW1nLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIC8vIElmIHRoZSBTVkcgYXNzZXQgaXMgbWlzc2luZywgZmFsbCBiYWNrIHRvIGEgdGV4dCBsb2dvLlxuICAgICAgICBsb2dvSW1nLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfTtcblxuICAgIGNvbnN0IGFwcE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgYXBwTmFtZS5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9fYXBwLW5hbWUnO1xuICAgIGFwcE5hbWUudGV4dENvbnRlbnQgPSAnU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyJztcblxuICAgIGxvZ29BcmVhLmFwcGVuZENoaWxkKGxvZ29JbWcpO1xuICAgIGxvZ29BcmVhLmFwcGVuZENoaWxkKGFwcE5hbWUpO1xuXG4gICAgY29uc3QgaGVyb1RhZ2xpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgaGVyb1RhZ2xpbmUuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX3RhZ2xpbmUnO1xuICAgIGhlcm9UYWdsaW5lLnRleHRDb250ZW50ID0gJ1RyYWNrIHlvdXIgbGVhcm5pbmcgam91cm5leSwgb25lIGNvdXJzZSBhdCBhIHRpbWUuJztcblxuICAgIC8vIExvZ2luIGlsbHVzdHJhdGlvblxuICAgIGNvbnN0IGlsbHVzdHJhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGlsbHVzdHJhdGlvbi5zcmMgPSAnL3NyYy9hc3NldHMvYXV0aC9sb2dpbi5zdmcnO1xuICAgIGlsbHVzdHJhdGlvbi5hbHQgPSAnJzsgLy8gZGVjb3JhdGl2ZSBcdTIwMTQgaGlkZGVuIGZyb20gc2NyZWVuIHJlYWRlcnNcbiAgICBpbGx1c3RyYXRpb24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaWxsdXN0cmF0aW9uLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX19pbGx1c3RyYXRpb24nO1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgaWxsdXN0cmF0aW9uLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIGlsbHVzdHJhdGlvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH07XG5cbiAgICBoZXJvUGFuZWwuYXBwZW5kQ2hpbGQobG9nb0FyZWEpO1xuICAgIGhlcm9QYW5lbC5hcHBlbmRDaGlsZChoZXJvVGFnbGluZSk7XG4gICAgaGVyb1BhbmVsLmFwcGVuZENoaWxkKGlsbHVzdHJhdGlvbik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUmlnaHQgLyBmb3JtIHBhbmVsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGZvcm1QYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGZvcm1QYW5lbC5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9fZm9ybS1wYW5lbCc7XG5cbiAgICBjb25zdCBmb3JtQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGZvcm1DYXJkLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX19mb3JtLWNhcmQnO1xuXG4gICAgZm9ybVBhbmVsLmFwcGVuZENoaWxkKGZvcm1DYXJkKTtcblxuICAgIHBhZ2VFbC5hcHBlbmRDaGlsZChoZXJvUGFuZWwpO1xuICAgIHBhZ2VFbC5hcHBlbmRDaGlsZChmb3JtUGFuZWwpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYWdlRWwpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1vdW50IExvZ2luRm9ybSBpbnRvIHRoZSBjYXJkIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGxvZ2luRm9ybUhhbmRsZSA9IGNyZWF0ZUxvZ2luRm9ybShmb3JtQ2FyZCwge1xuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIG9uU3VjY2VzczogKF91c2VyLCBkZXN0aW5hdGlvbikgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETyAoUGFydCA0IFx1MjAxNCBSb3V0aW5nKTogcm91dGVyLm5hdmlnYXRlKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gZGVzdGluYXRpb247XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU3Vic2NyaWJlIHRvIEF1dGhDb250ZXh0IHRvIGhhbmRsZSBtaWQtc2Vzc2lvbiBhdXRoIGNoYW5nZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgLy9cbiAgICAvLyBJZiB0aGUgdXNlciBzb21laG93IGJlY29tZXMgYXV0aGVudGljYXRlZCB3aGlsZSBvbiB0aGUgbG9naW4gcGFnZVxuICAgIC8vIChlLmcuIHZpYSBhbm90aGVyIHRhYiksIHJlZGlyZWN0IHRoZW0gYXdheS5cbiAgICBjb25zdCB1bnN1YnNjcmliZSA9IEF1dGhDb250ZXh0LnN1YnNjcmliZSgoeyBpc0F1dGhlbnRpY2F0ZWQ6IGF1dGhlZCB9KSA9PiB7XG4gICAgICAgIGlmIChhdXRoZWQpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gKFBhcnQgNCBcdTIwMTQgUm91dGluZyk6IHJvdXRlci5uYXZpZ2F0ZShST1VURVMuREFTSEJPQVJEKTtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9kYXNoYm9hcmQnO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ2xlYW51cCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUZWFycyBkb3duIHRoZSBsb2dpbiBwYWdlLCByZW1vdmluZyBET00gZWxlbWVudHMgYW5kIHN1YnNjcmlwdGlvbnMuXG4gICAgICAgICAqIENhbGwgdGhpcyB3aGVuIHRoZSByb3V0ZXIgbmF2aWdhdGVzIGF3YXkgZnJvbSB0aGUgbG9naW4gcm91dGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAgICAgKi9cbiAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBsb2dpbkZvcm1IYW5kbGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5jb250YWlucyhwYWdlRWwpKSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKHBhZ2VFbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZXNldCB0aXRsZSB0byB0aGUgYXBwIGRlZmF1bHQuXG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9ICdTdHVkZW50IFByb2dyZXNzIFRyYWNrZXInO1xuICAgICAgICB9LFxuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUxvZ2luUGFnZTtcbiIsICJleHBvcnQgY29uc3QgQU5JTUFUSU9OX0NMQVNTRVMgPSB7XG4gICAgZmFkZUluOiAnYW5pbS1mYWRlLWluJyxcbiAgICBzbGlkZVVwOiAnYW5pbS1zbGlkZS11cCcsXG4gICAgc2xpZGVEb3duOiAnYW5pbS1zbGlkZS1kb3duJyxcbiAgICBzbGlkZUluUmlnaHQ6ICdhbmltLXNsaWRlLWluLXJpZ2h0JyxcbiAgICBzbGlkZUluTGVmdDogJ2FuaW0tc2xpZGUtaW4tbGVmdCcsXG4gICAgc2NhbGVJbjogJ2FuaW0tc2NhbGUtaW4nLFxuICAgIHB1bHNlOiAnYW5pbS1wdWxzZScsXG4gICAgc2hpbW1lcjogJ3NrZWxldG9uLXNoaW1tZXInLFxufTtcblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5pbWF0ZShlbCwgYW5pbWF0aW9uLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGR1cmF0aW9uID0gMzAwLCBkZWxheSA9IDAsIG9uRW5kIH0gPSBvcHRpb25zO1xuXG4gICAgZWwuY2xhc3NMaXN0LmFkZChhbmltYXRpb24pO1xuXG4gICAgaWYgKGR1cmF0aW9uICE9PSAzMDApIGVsLnN0eWxlLmFuaW1hdGlvbkR1cmF0aW9uID0gYCR7ZHVyYXRpb259bXNgO1xuICAgIGlmIChkZWxheSA+IDApIGVsLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gYCR7ZGVsYXl9bXNgO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBjb25zdCBoYW5kbGVyID0gZSA9PiB7XG4gICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoYW5pbWF0aW9uKTtcbiAgICAgICAgZWwuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSAnJztcbiAgICAgICAgZWwuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSAnJztcbiAgICAgICAgaWYgKG9uRW5kKSBvbkVuZChlKTtcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgaGFuZGxlcik7XG4gICAgfTtcblxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGhhbmRsZXIsIHsgb25jZTogdHJ1ZSB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhZ2dlcihlbCwgYW5pbWF0aW9uLCB7IHN0YWdnZXJEZWxheSA9IDUwLCAuLi5yZXN0IH0gPSB7fSkge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShlbC5jaGlsZHJlbik7XG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgYW5pbWF0ZShjaGlsZCwgYW5pbWF0aW9uLCB7IGRlbGF5OiBpICogc3RhZ2dlckRlbGF5LCAuLi5yZXN0IH0pO1xuICAgIH0pO1xufVxuXG5sZXQgcHJlZmVyc1JlZHVjZWRNb3Rpb24gPSBmYWxzZTtcblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdE1vdGlvblByZWZlcmVuY2VzKCkge1xuICAgIGNvbnN0IG1xID0gd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJyk7XG4gICAgcHJlZmVyc1JlZHVjZWRNb3Rpb24gPSBtcS5tYXRjaGVzO1xuXG4gICAgbXEuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZSA9PiB7XG4gICAgICAgIHByZWZlcnNSZWR1Y2VkTW90aW9uID0gZS5tYXRjaGVzO1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgncmVkdWNlZC1tb3Rpb24nLCBlLm1hdGNoZXMpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ3JlZHVjZWQtbW90aW9uJywgcHJlZmVyc1JlZHVjZWRNb3Rpb24pO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRBbmltYXRlKCkge1xuICAgIHJldHVybiAhcHJlZmVyc1JlZHVjZWRNb3Rpb247XG59XG4iLCAiY29uc3Qgc2Nyb2xsUG9zaXRpb25zID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEb2N1bWVudFRpdGxlKHRpdGxlLCBzdWZmaXggPSAnU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyJykge1xuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGUgPyBgJHt0aXRsZX0gXHUyMDE0ICR7c3VmZml4fWAgOiBzdWZmaXg7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVTY3JvbGxQb3NpdGlvbihrZXkpIHtcbiAgICBzY3JvbGxQb3NpdGlvbnMuc2V0KGtleSwgd2luZG93LnNjcm9sbFkpO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXN0b3JlU2Nyb2xsUG9zaXRpb24oa2V5LCB7IGZhbGxiYWNrID0gMCB9ID0ge30pIHtcbiAgICBjb25zdCBwb3MgPSBzY3JvbGxQb3NpdGlvbnMuaGFzKGtleSkgPyBzY3JvbGxQb3NpdGlvbnMuZ2V0KGtleSkgOiBmYWxsYmFjaztcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IHBvcywgYmVoYXZpb3I6ICdpbnN0YW50JyB9KTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNjcm9sbFJlc3RvcmF0aW9uKCkge1xuICAgIGlmICgnc2Nyb2xsUmVzdG9yYXRpb24nIGluIHdpbmRvdy5oaXN0b3J5KSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gJ21hbnVhbCc7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsICgpID0+IHtcbiAgICAgICAgc2F2ZVNjcm9sbFBvc2l0aW9uKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFRvRWxlbWVudChzZWxlY3Rvciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBiZWhhdmlvciA9ICdzbW9vdGgnLCBvZmZzZXQgPSAwIH0gPSBvcHRpb25zO1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICAgIGlmIChlbCkge1xuICAgICAgICAgICAgY29uc3QgdG9wID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgd2luZG93LnNjcm9sbFkgLSBvZmZzZXQ7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3AsIGJlaGF2aW9yIH0pO1xuICAgICAgICAgICAgZWwuZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFRvVG9wKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgYmVoYXZpb3IgPSAnc21vb3RoJyB9ID0gb3B0aW9ucztcbiAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IDAsIGJlaGF2aW9yIH0pO1xufVxuIiwgImltcG9ydCAnLi9zdHlsZXMvbWFpbi5jc3MnO1xuaW1wb3J0IHsgY3JlYXRlRW1wdHlTdGF0ZSB9IGZyb20gJy4vY29tcG9uZW50cy9FbXB0eVN0YXRlLmpzJztcbmltcG9ydCB7IHdpdGhFcnJvckJvdW5kYXJ5IH0gZnJvbSAnLi9jb21wb25lbnRzL0Vycm9yQm91bmRhcnkuanMnO1xuaW1wb3J0IHsgY3JlYXRlTG9hZGluZ1NwaW5uZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvTG9hZGluZ1NwaW5uZXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlTW9kYWwgfSBmcm9tICcuL2NvbXBvbmVudHMvTW9kYWwuanMnO1xuaW1wb3J0IHsgcmVuZGVyU2tlbGV0b24sIHJlbW92ZVNrZWxldG9ucyB9IGZyb20gJy4vY29tcG9uZW50cy9Ta2VsZXRvbkxvYWRlci5qcyc7XG5pbXBvcnQgeyBzaG93RXJyb3IsIHNob3dJbmZvIH0gZnJvbSAnLi9jb21wb25lbnRzL1RvYXN0LmpzJztcbmltcG9ydCB7IGNyZWF0ZVRvb2x0aXAgfSBmcm9tICcuL2NvbXBvbmVudHMvVG9vbHRpcC5qcyc7XG5pbXBvcnQgQXV0aENvbnRleHQgZnJvbSAnLi9jb250ZXh0L0F1dGhDb250ZXh0LmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvZ2luUGFnZSB9IGZyb20gJy4vcGFnZXMvTG9naW5QYWdlLmpzJztcbmltcG9ydCB7IGluaXRBcGkgfSBmcm9tICcuL3NlcnZpY2VzL2FwaS5qcyc7XG5pbXBvcnQgeyBpbml0TW90aW9uUHJlZmVyZW5jZXMgfSBmcm9tICcuL3V0aWxzL2FuaW1hdGlvbnMuanMnO1xuaW1wb3J0IHsgaGFuZGxlR2xvYmFsRXJyb3JzIH0gZnJvbSAnLi91dGlscy9lcnJvcnMuanMnO1xuaW1wb3J0IHsgaW5pdFNjcm9sbFJlc3RvcmF0aW9uLCB1cGRhdGVEb2N1bWVudFRpdGxlIH0gZnJvbSAnLi91dGlscy9yb3V0ZXIuanMnO1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVHbG9iYWxFcnJvckhhbmRsZXIoKSB7XG4gICAgaGFuZGxlR2xvYmFsRXJyb3JzKGVycm9yID0+IHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGVycm9yPy5tZXNzYWdlIHx8IGVycm9yPy5yZWFzb24/Lm1lc3NhZ2UgfHwgJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuJztcbiAgICAgICAgc2hvd0Vycm9yKCdFcnJvcicsIG1lc3NhZ2UpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVOZXR3b3JrRGV0ZWN0aW9uKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvZmZsaW5lJywgKCkgPT4ge1xuICAgICAgICBzaG93SW5mbygnT2ZmbGluZScsICdZb3UgYXJlIGN1cnJlbnRseSBvZmZsaW5lLiBTb21lIGZlYXR1cmVzIG1heSBiZSB1bmF2YWlsYWJsZS4nKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb25saW5lJywgKCkgPT4ge1xuICAgICAgICBzaG93SW5mbygnQmFjayBPbmxpbmUnLCAnWW91ciBpbnRlcm5ldCBjb25uZWN0aW9uIGhhcyBiZWVuIHJlc3RvcmVkLicpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVFcnJvckJvdW5kYXJ5KCkge1xuICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZS1jb250ZW50XScpO1xuICAgIGlmICghcGFnZUNvbnRlbnQpIHJldHVybjtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhdGh3YXk6cm91dGUnLCAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5fcGFnZUNvbnRlbnQgPSBwYWdlQ29udGVudDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgd2luZG93Ll9zaG93RXJyb3JCb3VuZGFyeSA9ICh7IHRpdGxlLCBtZXNzYWdlLCBvblJldHJ5IH0gPSB7fSkgPT4ge1xuICAgICAgICB3aXRoRXJyb3JCb3VuZGFyeShwYWdlQ29udGVudCwgeyB0aXRsZSwgbWVzc2FnZSwgb25SZXRyeSB9KTtcbiAgICB9O1xufVxuXG5sZXQgbG9naW5QYWdlSW5zdGFuY2UgPSBudWxsO1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHNob3dMb2dpblZpZXcoKSB7XG4gICAgaWYgKGxvZ2luUGFnZUluc3RhbmNlKSByZXR1cm47XG4gICAgY29uc3QgYXV0aFJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yb290Jyk7XG4gICAgaWYgKCFhdXRoUm9vdCkgcmV0dXJuO1xuICAgIGNvbnN0IGFwcFNoZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcC1zaGVsbCcpO1xuICAgIGlmIChhcHBTaGVsbCkgYXBwU2hlbGwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBhdXRoUm9vdC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgbG9naW5QYWdlSW5zdGFuY2UgPSBjcmVhdGVMb2dpblBhZ2UoYXV0aFJvb3QpO1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHNob3dBcHBWaWV3KCkge1xuICAgIGlmIChsb2dpblBhZ2VJbnN0YW5jZSkge1xuICAgICAgICBsb2dpblBhZ2VJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIGxvZ2luUGFnZUluc3RhbmNlID0gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgYXV0aFJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yb290Jyk7XG4gICAgaWYgKGF1dGhSb290KSBhdXRoUm9vdC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGNvbnN0IGFwcFNoZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcC1zaGVsbCcpO1xuICAgIGlmIChhcHBTaGVsbCkgYXBwU2hlbGwuc3R5bGUuZGlzcGxheSA9ICcnO1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVBdXRoKCkge1xuICAgIEF1dGhDb250ZXh0LnN1YnNjcmliZSgoeyBpc0F1dGhlbnRpY2F0ZWQsIGlzTG9hZGluZyB9KSA9PiB7XG4gICAgICAgIGlmIChpc0xvYWRpbmcpIHJldHVybjtcbiAgICAgICAgaWYgKGlzQXV0aGVudGljYXRlZCkgc2hvd0FwcFZpZXcoKTtcbiAgICAgICAgZWxzZSBzaG93TG9naW5WaWV3KCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzaWduT3V0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2ZpbGUtZHJvcGRvd24taXRlbS0tZGFuZ2VyJyk7XG4gICAgaWYgKHNpZ25PdXRCdG4pIHtcbiAgICAgICAgc2lnbk91dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIEF1dGhDb250ZXh0LmxvZ291dCgpO1xuICAgICAgICAgICAgc2hvd0luZm8oJ1NpZ25lZCBPdXQnLCAnWW91IGhhdmUgYmVlbiBzaWduZWQgb3V0IHN1Y2Nlc3NmdWxseS4nKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVMb2FkaW5nU3RhdGVzKCkge1xuICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZS1jb250ZW50XScpO1xuICAgIGlmICghcGFnZUNvbnRlbnQpIHJldHVybjtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhdGh3YXk6cm91dGUnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlclNrZWxldG9uKHBhZ2VDb250ZW50LCAnY2FyZCcsIDMpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICB3aW5kb3cuX3JlbW92ZVBhZ2VTa2VsZXRvbnMgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZVNrZWxldG9ucyhwYWdlQ29udGVudCk7XG4gICAgfTtcbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiB3aXJlVG9vbHRpcHMoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmljb24tYnV0dG9uLCAubmF2LWxpbmssIC5hY3Rpb24tYnRuLWNpcmNsZScpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYWJlbCA9XG4gICAgICAgICAgICBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSB8fCBlbC5xdWVyeVNlbGVjdG9yKCcubmF2LWxhYmVsJyk/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICAgICAgY3JlYXRlVG9vbHRpcChlbCwgeyBjb250ZW50OiBsYWJlbCwgcG9zaXRpb246ICdib3R0b20nIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gd2lyZUFwcEludGVyYWN0aW9ucygpIHtcbiAgICBjb25zdCBwYWdlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2UtY29udGVudF0nKTtcbiAgICBpZiAoIXBhZ2VDb250ZW50KSByZXR1cm47XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXRod2F5OnJvdXRlJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXBhZ2VDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3V0ZS1wbGFjZWhvbGRlciwgLnNldHRpbmdzLXBhZ2UnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHdpbmRvdy5fc2hvd0VtcHR5U3RhdGUgPSBvcHRzID0+IHtcbiAgICAgICAgY29uc3QgZW1wdHlFbCA9IGNyZWF0ZUVtcHR5U3RhdGUob3B0cyk7XG4gICAgICAgIHBhZ2VDb250ZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBwYWdlQ29udGVudC5hcHBlbmRDaGlsZChlbXB0eUVsKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICB3aW5kb3cuX3Nob3dNb2RhbCA9IG9wdHMgPT4ge1xuICAgICAgICByZXR1cm4gY3JlYXRlTW9kYWwob3B0cyk7XG4gICAgfTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5vdGlmaWNhdGlvbi1jbGVhcl0nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNyZWF0ZU1vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAnQ2xlYXIgTm90aWZpY2F0aW9ucycsXG4gICAgICAgICAgICBib2R5OiAnTWFyayBhbGwgbm90aWZpY2F0aW9ucyBhcyByZWFkPycsXG4gICAgICAgICAgICBmb290ZXI6ICc8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi0tcHJpbWFyeVwiIGRhdGEtY29uZmlybS1jbGVhcj5DbGVhciBhbGw8L2J1dHRvbj4nLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvbkNsb3NlOiAoKSA9PiB7fSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpbml0TW90aW9uUHJlZmVyZW5jZXMoKTtcbiAgICBpbml0U2Nyb2xsUmVzdG9yYXRpb24oKTtcbiAgICB1cGRhdGVEb2N1bWVudFRpdGxlKCk7XG4gICAgd2lyZUdsb2JhbEVycm9ySGFuZGxlcigpO1xuICAgIHdpcmVOZXR3b3JrRGV0ZWN0aW9uKCk7XG4gICAgd2lyZUVycm9yQm91bmRhcnkoKTtcbiAgICB3aXJlQXV0aCgpO1xuICAgIHdpcmVMb2FkaW5nU3RhdGVzKCk7XG4gICAgd2lyZVRvb2x0aXBzKCk7XG4gICAgd2lyZUFwcEludGVyYWN0aW9ucygpO1xuXG4gICAgY29uc3Qgc3Bpbm5lciA9IGNyZWF0ZUxvYWRpbmdTcGlubmVyKHsgc2l6ZTogJ2xnJywgbGFiZWw6ICdMb2FkaW5nIGFwcGxpY2F0aW9uLi4uJyB9KTtcbiAgICBzcGlubmVyLnN0eWxlLmNzc1RleHQgPVxuICAgICAgICAncG9zaXRpb246Zml4ZWQ7dG9wOjUwJTtsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7ei1pbmRleDoxMDAwOyc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcGlubmVyKTtcblxuICAgIGF3YWl0IEF1dGhDb250ZXh0LnJlc3RvcmVTZXNzaW9uKCk7XG4gICAgYXdhaXQgaW5pdEFwaSgpO1xuXG4gICAgaWYgKHNwaW5uZXIucGFyZW50Tm9kZSkgc3Bpbm5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNwaW5uZXIpO1xuXG4gICAgY29uc3QgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcC1zaGVsbCcpO1xuICAgIGlmIChhcHApIGFwcC5jbGFzc0xpc3QuYWRkKCdhcHAtLXJlYWR5Jyk7XG59XG5cbmRvY3VtZW50LmFk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Q3BCLENBQUM7QUFBQSxFQUNMLENBQUM7QUFDTDtBQUtBLGVBQWUsT0FBTztBQUNsQix3QkFBc0I7QUFDdEIsd0JBQXNCO0FBQ3RCLHNCQUFvQjtBQUNwQix5QkFBdUI7QUFDdkIsdUJBQXFCO0FBQ3JCLG9CQUFrQjtBQUNsQixXQUFTO0FBQ1Qsb0JBQWtCO0FBQ2xCLGVBQWE7QUFDYixzQkFBb0I7QUFFcEIsUUFBTSxVQUFVLHFCQUFxQixFQUFFLE1BQU0sTUFBTSxPQUFPLHlCQUF5QixDQUFDO0FBQ3BGLFVBQVEsTUFBTSxVQUNWO0FBQ0osV0FBUyxLQUFLLFlBQVksT0FBTztBQUVqQyxRQUFNLG9CQUFZLGVBQWU7QUFDakMsUUFBTSxRQUFRO0FBRWQsTUFBSSxRQUFRLFdBQVksU0FBUSxXQUFXLFlBQVksT0FBTztBQUU5RCxRQUFNLE1BQU0sU0FBUyxjQUFjLFlBQVk7QUFDL0MsTUFBSSxJQUFLLEtBQUksVUFBVSxJQUFJLFlBQVk7QUFDM0M7QUFFQSxTQUFTLGlCQUFpQixvQkFBb0IsSUFBSTsiLAogICJuYW1lcyI6IFsiY29udGFpbmVyIiwgImNvbnRhaW5lciIsICJjb250YWluZXIiLCAiY29udGFpbmVyIiwgImRlbGF5IiwgImNvbmZpZyIsICJzZXR1cE1vY2tTZXJ2ZXIiLCAiZGVsYXkiLCAibG9naW4iLCAiY29udGFpbmVyIiwgImNvbnRhaW5lciJdCn0K
