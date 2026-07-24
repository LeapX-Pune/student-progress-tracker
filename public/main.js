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
    const env = typeof import.meta !== 'undefined' && import.meta.env;
    const value = env ? env[key] : void 0;
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
var _env = typeof import.meta !== 'undefined' && import.meta.env;
var config = {
    appName: _env?.VITE_APP_NAME || 'Student Progress Tracker',
    appEnv: _env?.VITE_APP_ENV || 'development',
    apiBaseUrl: _env?.VITE_API_BASE_URL || 'http://localhost:3001/api',
    apiMockEnabled: _env?.VITE_API_MOCK_ENABLED === 'true',
    authTokenKey: _env?.VITE_AUTH_TOKEN_KEY || 'auth_token',
    sessionTimeoutMinutes: parseInt(_env?.VITE_SESSION_TIMEOUT_MINUTES || '60', 10),
    enableAnalytics: _env?.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: _env?.VITE_ENABLE_NOTIFICATIONS !== 'false',
    cacheTtlSeconds: parseInt(_env?.VITE_CACHE_TTL_SECONDS || '300', 10),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3NlcnZpY2VzL21vY2suanMiLCAiLi4vc3JjL2NvbXBvbmVudHMvRW1wdHlTdGF0ZS5qcyIsICIuLi9zcmMvY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL0xvYWRpbmdTcGlubmVyLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL01vZGFsLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1NrZWxldG9uTG9hZGVyLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1RvYXN0LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL1Rvb2x0aXAuanMiLCAiLi4vc3JjL2NvbmZpZy9lbnYuanMiLCAiLi4vc3JjL3V0aWxzL2NvbnN0YW50cy5qcyIsICIuLi9zcmMvdXRpbHMvZW52LmpzIiwgIi4uL3NyYy91dGlscy9lcnJvcnMuanMiLCAiLi4vc3JjL3NlcnZpY2VzL2F1dGhTdG9yYWdlLmpzIiwgIi4uL3NyYy9zZXJ2aWNlcy9hcGkuanMiLCAiLi4vc3JjL3NlcnZpY2VzL2F1dGhBcGkuanMiLCAiLi4vc3JjL3V0aWxzL2F1dGhIZWxwZXJzLmpzIiwgIi4uL3NyYy9jb250ZXh0L0F1dGhDb250ZXh0LmpzIiwgIi4uL3NyYy91dGlscy92YWxpZGF0aW9uLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL1NwaW5uZXIuanMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdWkvQnV0dG9uLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL0lucHV0LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL2F1dGgvRGVtb0NyZWRlbnRpYWxzLmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL3VpL0NoZWNrYm94LmpzIiwgIi4uL3NyYy9jb21wb25lbnRzL2F1dGgvUmVtZW1iZXJNZS5qcyIsICIuLi9zcmMvY29tcG9uZW50cy9hdXRoL0xvZ2luRm9ybS5qcyIsICIuLi9zcmMvcGFnZXMvTG9naW5QYWdlLmpzIiwgIi4uL3NyYy91dGlscy9hbmltYXRpb25zLmpzIiwgIi4uL3NyYy91dGlscy9yb3V0ZXIuanMiLCAiLi4vc3JjL21haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IG1vY2tTdHVkZW50ID0ge1xuICAgIGlkOiAnc3R1XzAwMScsXG4gICAgbmFtZTogJ0FsZXggSm9obnNvbicsXG4gICAgZW1haWw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICBhdmF0YXJVcmw6ICdodHRwczovL2kucHJhdmF0YXIuY2MvMTUwP3U9c3R1XzAwMScsXG4gICAgc3R1ZGVudElkOiAnU1RVLTIwMjQtMDAxJyxcbiAgICBlbnJvbGxlZEF0OiAnMjAyNC0wMS0xNVQwMDowMDowMC4wMDBaJyxcbiAgICBjdXJyZW50U3RyZWFrOiA1LFxuICAgIGxhc3RBY3RpdmVBdDogJzIwMjQtMDMtMjBUMTA6MzA6MDAuMDAwWicsXG59O1xuXG5jb25zdCBtb2NrQ291cnNlcyA9IFtcbiAgICB7XG4gICAgICAgIGlkOiAnY3JzXzAwMScsXG4gICAgICAgIHN0dWRlbnRJZDogJ3N0dV8wMDEnLFxuICAgICAgICB0aXRsZTogJ0FkdmFuY2VkIE1hdGhlbWF0aWNzJyxcbiAgICAgICAgaW5zdHJ1Y3RvcjogJ0RyLiBTbWl0aCcsXG4gICAgICAgIHRodW1ibmFpbFVybDogJ2h0dHBzOi8vcGljc3VtLnBob3Rvcy9zZWVkL21hdGgvNDAwLzIyNScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQWR2YW5jZWQgdG9waWNzIGluIGNhbGN1bHVzLCBsaW5lYXIgYWxnZWJyYSwgYW5kIHN0YXRpc3RpY3MnLFxuICAgICAgICB0b3RhbE1vZHVsZXM6IDEyLFxuICAgICAgICBjb21wbGV0ZWRNb2R1bGVzOiA4LFxuICAgICAgICBzdGF0dXM6ICdpbi1wcm9ncmVzcycsXG4gICAgICAgIGN1cnJlbnRHcmFkZTogODgsXG4gICAgICAgIHRlcm06ICdTcHJpbmcgMjAyNCcsXG4gICAgICAgIGxhc3RBY2Nlc3NlZEF0OiAnMjAyNC0wMy0xOVQxNDozMDowMC4wMDBaJyxcbiAgICAgICAgbmV4dE1vZHVsZTogJ01vZHVsZSA5OiBEaWZmZXJlbnRpYWwgRXF1YXRpb25zJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWQ6ICdjcnNfMDAyJyxcbiAgICAgICAgc3R1ZGVudElkOiAnc3R1XzAwMScsXG4gICAgICAgIHRpdGxlOiAnQ29tcHV0ZXIgU2NpZW5jZSBGdW5kYW1lbnRhbHMnLFxuICAgICAgICBpbnN0cnVjdG9yOiAnUHJvZi4gRGF2aXMnLFxuICAgICAgICB0aHVtYm5haWxVcmw6ICdodHRwczovL3BpY3N1bS5waG90b3Mvc2VlZC9jcy80MDAvMjI1JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdEYXRhIHN0cnVjdHVyZXMsIGFsZ29yaXRobXMsIGFuZCBzb2Z0d2FyZSBkZXNpZ24gcGF0dGVybnMnLFxuICAgICAgICB0b3RhbE1vZHVsZXM6IDEwLFxuICAgICAgICBjb21wbGV0ZWRNb2R1bGVzOiAxMCxcbiAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgICAgICAgY3VycmVudEdyYWRlOiA5NCxcbiAgICAgICAgdGVybTogJ1NwcmluZyAyMDI0JyxcbiAgICAgICAgbGFzdEFjY2Vzc2VkQXQ6ICcyMDI0LTAzLTE4VDA5OjE1OjAwLjAwMFonLFxuICAgICAgICBuZXh0TW9kdWxlOiBudWxsLFxuICAgIH0sXG4gICAge1xuICAgICAgICBpZDogJ2Nyc18wMDMnLFxuICAgICAgICBzdHVkZW50SWQ6ICdzdHVfMDAxJyxcbiAgICAgICAgdGl0bGU6ICdQaHlzaWNzIElJOiBFbGVjdHJvbWFnbmV0aXNtJyxcbiAgICAgICAgaW5zdHJ1Y3RvcjogJ0RyLiBXaWxzb24nLFxuICAgICAgICB0aHVtYm5haWxVcmw6ICdodHRwczovL3BpY3N1bS5waG90b3Mvc2VlZC9waHlzaWNzLzQwMC8yMjUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0VsZWN0cm9tYWduZXRpYyB0aGVvcnksIGNpcmN1aXRzLCBhbmQgd2F2ZSBwcm9wYWdhdGlvbicsXG4gICAgICAgIHRvdGFsTW9kdWxlczogMTQsXG4gICAgICAgIGNvbXBsZXRlZE1vZHVsZXM6IDUsXG4gICAgICAgIHN0YXR1czogJ2luLXByb2dyZXNzJyxcbiAgICAgICAgY3VycmVudEdyYWRlOiA3NixcbiAgICAgICAgdGVybTogJ1NwcmluZyAyMDI0JyxcbiAgICAgICAgbGFzdEFjY2Vzc2VkQXQ6ICcyMDI0LTAzLTE3VDExOjAwOjAwLjAwMFonLFxuICAgICAgICBuZXh0TW9kdWxlOiAnTW9kdWxlIDY6IEVsZWN0cmljIFBvdGVudGlhbCcsXG4gICAgfSxcbl07XG5cbmNvbnN0IG1vY2tHcmFkZXMgPSB7XG4gICAgcXVpelNjb3JlczogW1xuICAgICAgICB7IGxhYmVsOiAnUXVpeiAxJywgc2NvcmU6IDg1LCBtYXhTY29yZTogMTAwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdRdWl6IDInLCBzY29yZTogOTIsIG1heFNjb3JlOiAxMDAgfSxcbiAgICAgICAgeyBsYWJlbDogJ1F1aXogMycsIHNjb3JlOiA3OCwgbWF4U2NvcmU6IDEwMCB9LFxuICAgICAgICB7IGxhYmVsOiAnUXVpeiA0Jywgc2NvcmU6IDk1LCBtYXhTY29yZTogMTAwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdRdWl6IDUnLCBzY29yZTogODgsIG1heFNjb3JlOiAxMDAgfSxcbiAgICBdLFxuICAgIGdyYWRlRGlzdHJpYnV0aW9uOiBbXG4gICAgICAgIHsgbGFiZWw6ICdBJywgcGVyY2VudGFnZTogMjUgfSxcbiAgICAgICAgeyBsYWJlbDogJ0InLCBwZXJjZW50YWdlOiA0MCB9LFxuICAgICAgICB7IGxhYmVsOiAnQycsIHBlcmNlbnRhZ2U6IDIwIH0sXG4gICAgICAgIHsgbGFiZWw6ICdEJywgcGVyY2VudGFnZTogMTAgfSxcbiAgICAgICAgeyBsYWJlbDogJ0YnLCBwZXJjZW50YWdlOiA1IH0sXG4gICAgXSxcbiAgICB3ZWVrbHlQcm9ncmVzczogW1xuICAgICAgICB7IHdlZWs6ICdXZWVrIDEnLCBjb21wbGV0ZWQ6IDMsIHRvdGFsOiAzIH0sXG4gICAgICAgIHsgd2VlazogJ1dlZWsgMicsIGNvbXBsZXRlZDogMiwgdG90YWw6IDMgfSxcbiAgICAgICAgeyB3ZWVrOiAnV2VlayAzJywgY29tcGxldGVkOiAzLCB0b3RhbDogMyB9LFxuICAgICAgICB7IHdlZWs6ICdXZWVrIDQnLCBjb21wbGV0ZWQ6IDEsIHRvdGFsOiAzIH0sXG4gICAgICAgIHsgd2VlazogJ1dlZWsgNScsIGNvbXBsZXRlZDogMywgdG90YWw6IDMgfSxcbiAgICAgICAgeyB3ZWVrOiAnV2VlayA2JywgY29tcGxldGVkOiAyLCB0b3RhbDogMyB9LFxuICAgIF0sXG59O1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGRlbGF5KG1zKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuXG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKHVybCwgb3B0aW9ucykge1xuICAgIGF3YWl0IGRlbGF5KDMwMCk7XG4gICAgY29uc3QgYm9keSA9IEpTT04ucGFyc2Uob3B0aW9ucy5ib2R5IHx8ICd7fScpO1xuXG4gICAgaWYgKGJvZHkuZW1haWwgPT09ICdzdHVkZW50QGRlbW8uY29tJyAmJiBib2R5LnBhc3N3b3JkID09PSAnZGVtbzEyMycpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB0b2tlbjogJ21vY2stand0LXRva2VuLScgKyBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGV4cGlyZXNBdDogbmV3IERhdGUoRGF0ZS5ub3coKSArIDM2MDAwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgdXNlcjoge1xuICAgICAgICAgICAgICAgICAgICBpZDogJ3N0dV8wMDEnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnQWxleCBKb2huc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogJ3N0dWRlbnQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHsgc3RhdHVzOiAyMDAsIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0ludmFsaWQgY3JlZGVudGlhbHMnIH0pLCB7XG4gICAgICAgIHN0YXR1czogNDAxLFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVHZXRTdHVkZW50KHJlcXVlc3QpIHtcbiAgICBhd2FpdCBkZWxheSgyMDApO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGlkID0gdXJsLnBhdGhuYW1lLnNwbGl0KCcvJykucG9wKCk7XG5cbiAgICBpZiAoaWQgPT09ICdzdHVfMDAxJykge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KG1vY2tTdHVkZW50KSwge1xuICAgICAgICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdTdHVkZW50IG5vdCBmb3VuZCcgfSksIHtcbiAgICAgICAgc3RhdHVzOiA0MDQsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdldENvdXJzZXMocmVxdWVzdCkge1xuICAgIGF3YWl0IGRlbGF5KDI1MCk7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG4gICAgY29uc3QgaWQgPSB1cmwucGF0aG5hbWUuc3BsaXQoJy8nKVszXTtcblxuICAgIGlmIChpZCA9PT0gJ3N0dV8wMDEnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkobW9ja0NvdXJzZXMpLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0NvdXJzZXMgbm90IGZvdW5kJyB9KSwge1xuICAgICAgICBzdGF0dXM6IDQwNCxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2V0R3JhZGVzKHJlcXVlc3QpIHtcbiAgICBhd2FpdCBkZWxheSgyMDApO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICAgIGNvbnN0IGlkID0gdXJsLnBhdGhuYW1lLnNwbGl0KCcvJylbM107XG5cbiAgICBpZiAoaWQgPT09ICdzdHVfMDAxJykge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KG1vY2tHcmFkZXMpLCB7XG4gICAgICAgICAgICBzdGF0dXM6IDIwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0dyYWRlcyBub3QgZm91bmQnIH0pLCB7XG4gICAgICAgIHN0YXR1czogNDA0LFxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICB9KTtcbn1cblxuY29uc3Qgcm91dGVzID0ge1xuICAgICdQT1NUOi9hcGkvYXV0aC9sb2dpbic6IGhhbmRsZUxvZ2luLFxuICAgICdHRVQ6L2FwaS9zdHVkZW50cy86aWQnOiBoYW5kbGVHZXRTdHVkZW50LFxuICAgICdHRVQ6L2FwaS9zdHVkZW50cy86aWQvY291cnNlcyc6IGhhbmRsZUdldENvdXJzZXMsXG4gICAgJ0dFVDovYXBpL3N0dWRlbnRzLzppZC9ncmFkZXMnOiBoYW5kbGVHZXRHcmFkZXMsXG59O1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cE1vY2tTZXJ2ZXIoKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxGZXRjaCA9IHdpbmRvdy5mZXRjaDtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgd2luZG93LmZldGNoID0gYXN5bmMgKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/IGlucHV0IDogaW5wdXQudXJsO1xuICAgICAgICBjb25zdCBtZXRob2QgPSAob3B0aW9ucy5tZXRob2QgfHwgJ0dFVCcpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGtleSA9IGAke21ldGhvZH06JHtuZXcgVVJMKHVybCwgd2luZG93LmxvY2F0aW9uLm9yaWdpbikucGF0aG5hbWV9YDtcblxuICAgICAgICBsZXQgbWF0Y2hlZFJvdXRlID0gcm91dGVzW2tleV07XG5cbiAgICAgICAgaWYgKCFtYXRjaGVkUm91dGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhuYW1lID0gbmV3IFVSTCh1cmwsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pLnBhdGhuYW1lO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbcm91dGVLZXksIGhhbmRsZXJdIG9mIE9iamVjdC5lbnRyaWVzKHJvdXRlcykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBbcm91dGVNZXRob2QsIHJvdXRlUGF0dGVybl0gPSByb3V0ZUtleS5zcGxpdCgnOicpO1xuICAgICAgICAgICAgICAgIGlmIChyb3V0ZU1ldGhvZCAhPT0gbWV0aG9kKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlUGFydHMgPSByb3V0ZVBhdHRlcm4uc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXRoUGFydHMgPSBwYXRobmFtZS5zcGxpdCgnLycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlUGFydHMubGVuZ3RoICE9PSBwYXRoUGFydHMubGVuZ3RoKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGxldCBtYXRjaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3V0ZVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZVBhcnRzW2ldLnN0YXJ0c1dpdGgoJzonKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb3V0ZVBhcnRzW2ldICE9PSBwYXRoUGFydHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkUm91dGUgPSBoYW5kbGVyO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWF0Y2hlZFJvdXRlKSB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVkUm91dGUocmVxdWVzdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3JpZ2luYWxGZXRjaC5jYWxsKHdpbmRvdywgaW5wdXQsIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICB3aW5kb3cuZmV0Y2ggPSBvcmlnaW5hbEZldGNoO1xuICAgIH07XG59XG4iLCAiLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW1wdHlTdGF0ZSh7IHRpdGxlLCBkZXNjcmlwdGlvbiwgaWxsdXN0cmF0aW9uLCBhY3Rpb25zID0gW10gfSA9IHt9KSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdlbXB0eS1zdGF0ZSc7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcblxuICAgIGlmIChpbGx1c3RyYXRpb24pIHtcbiAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGltZy5jbGFzc05hbWUgPSAnZW1wdHktc3RhdGVfX2lsbHVzdHJhdGlvbic7XG4gICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgaW1nLmlubmVySFRNTCA9IGlsbHVzdHJhdGlvbjtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGltZyk7XG4gICAgfVxuXG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgICAgICB0aXRsZUVsLmNsYXNzTmFtZSA9ICdlbXB0eS1zdGF0ZV9fdGl0bGUnO1xuICAgICAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gdGl0bGU7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZUVsKTtcbiAgICB9XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgY29uc3QgZGVzY0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICBkZXNjRWwuY2xhc3NOYW1lID0gJ2VtcHR5LXN0YXRlX19kZXNjcmlwdGlvbic7XG4gICAgICAgIGRlc2NFbC50ZXh0Q29udGVudCA9IGRlc2NyaXB0aW9uO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGVzY0VsKTtcbiAgICB9XG5cbiAgICBpZiAoYWN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbnNFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhY3Rpb25zRWwuY2xhc3NOYW1lID0gJ2VtcHR5LXN0YXRlX19hY3Rpb25zJztcbiAgICAgICAgYWN0aW9ucy5mb3JFYWNoKGFjdGlvbiA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zRWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBhY3Rpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGFjdGlvbnNFbC5hcHBlbmRDaGlsZChhY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFjdGlvbnNFbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IGNvbnN0IEVNUFRZX0lMTFVTVFJBVElPTlMgPSB7XG4gICAgc2VhcmNoOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMjBcIiBoZWlnaHQ9XCIxMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjExXCIgY3k9XCIxMVwiIHI9XCI4XCIvPjxwYXRoIGQ9XCJtMjEgMjEtNC4zLTQuM1wiLz48L3N2Zz4nLFxuICAgIGRhdGE6ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEyMFwiIGhlaWdodD1cIjEyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjFcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTIxIDE1YTIgMiAwIDAgMS0yIDJIN2wtNCA0VjVhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyelwiLz48L3N2Zz4nLFxuICAgIGNvdXJzZTogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTIwXCIgaGVpZ2h0PVwiMTIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNNCAxOS41di0xNUEyLjUgMi41IDAgMCAxIDYuNSAySDIwdjIwSDYuNWEyLjUgMi41IDAgMCAxIDAtNUgyMFwiLz48L3N2Zz4nLFxuICAgIGdyYWRlOiAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMjBcIiBoZWlnaHQ9XCIxMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIxXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0yMiAxMmgtNGwtMyA5TDkgM2wtMyA5SDJcIi8+PC9zdmc+JyxcbiAgICBlcnJvcjogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTIwXCIgaGVpZ2h0PVwiMTIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIk0xNiAxNnMtMS41LTItNC0yLTQgMi00IDJcIi8+PGxpbmUgeDE9XCI5XCIgeTE9XCI5XCIgeDI9XCI5LjAxXCIgeTI9XCI5XCIvPjxsaW5lIHgxPVwiMTVcIiB5MT1cIjlcIiB4Mj1cIjE1LjAxXCIgeTI9XCI5XCIvPjwvc3ZnPicsXG59O1xuIiwgIi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVycm9yQm91bmRhcnkoe1xuICAgIHRpdGxlID0gJ1NvbWV0aGluZyB3ZW50IHdyb25nJyxcbiAgICBtZXNzYWdlID0gJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuIFBsZWFzZSB0cnkgYWdhaW4uJyxcbiAgICBvblJldHJ5ID0gbnVsbCxcbn0gPSB7fSkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAnZXJyb3ItYm91bmRhcnknO1xuICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnYXNzZXJ0aXZlJyk7XG5cbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJlcnJvci1ib3VuZGFyeV9faWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCI2NFwiIGhlaWdodD1cIjY0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMS41XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTYgMTZzLTEuNS0yLTQtMi00IDItNCAyXCIvPlxuICAgICAgICA8bGluZSB4MT1cIjlcIiB5MT1cIjlcIiB4Mj1cIjkuMDFcIiB5Mj1cIjlcIi8+XG4gICAgICAgIDxsaW5lIHgxPVwiMTVcIiB5MT1cIjlcIiB4Mj1cIjE1LjAxXCIgeTI9XCI5XCIvPlxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gICAgPGgyIGNsYXNzPVwiZXJyb3ItYm91bmRhcnlfX3RpdGxlXCI+JHt0aXRsZX08L2gyPlxuICAgIDxwIGNsYXNzPVwiZXJyb3ItYm91bmRhcnlfX21lc3NhZ2VcIj4ke21lc3NhZ2V9PC9wPlxuICBgO1xuXG4gICAgaWYgKG9uUmV0cnkpIHtcbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBhY3Rpb25zLmNsYXNzTmFtZSA9ICdlcnJvci1ib3VuZGFyeV9fYWN0aW9ucyc7XG5cbiAgICAgICAgY29uc3QgcmV0cnlCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgcmV0cnlCdG4uY2xhc3NOYW1lID0gJ2J0biBidG4tLXByaW1hcnknO1xuICAgICAgICByZXRyeUJ0bi50ZXh0Q29udGVudCA9ICdUcnkgYWdhaW4nO1xuICAgICAgICByZXRyeUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHJldHJ5QnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHJ5QnRuLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwic3Bpbm5lciBzcGlubmVyLS1zbVwiPjxzdmcgY2xhc3M9XCJzcGlubmVyX19jaXJjbGVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+PGNpcmNsZSBjbGFzcz1cInNwaW5uZXJfX3BhdGhcIiBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiM1wiLz48L3N2Zz48L3NwYW4+IFJldHJ5aW5nLi4uJztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgb25SZXRyeSgpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICByZXRyeUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHJ5QnRuLnRleHRDb250ZW50ID0gJ1RyeSBhZ2Fpbic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFjdGlvbnMuYXBwZW5kQ2hpbGQocmV0cnlCdG4pO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYWN0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aEVycm9yQm91bmRhcnkoY29udGFpbmVyLCB7IHRpdGxlLCBtZXNzYWdlLCBvblJldHJ5IH0gPSB7fSkge1xuICAgIGNvbnN0IGVycm9yVUkgPSBjcmVhdGVFcnJvckJvdW5kYXJ5KHsgdGl0bGUsIG1lc3NhZ2UsIG9uUmV0cnkgfSk7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvclVJKTtcbiAgICByZXR1cm4gZXJyb3JVSTtcbn1cbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2FkaW5nU3Bpbm5lcih7IHNpemUgPSAnbWQnLCBsYWJlbCA9ICdMb2FkaW5nLi4uJyB9ID0ge30pIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gYHNwaW5uZXIgc3Bpbm5lci0tJHtzaXplfWA7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbGFiZWwpO1xuXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IGBcbiAgICA8c3ZnIGNsYXNzPVwic3Bpbm5lcl9fY2lyY2xlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgPGNpcmNsZSBjbGFzcz1cInNwaW5uZXJfX3BhdGhcIiBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiM1wiLz5cbiAgICA8L3N2Zz5cbiAgYDtcblxuICAgIGNvbnN0IHNyT25seSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzck9ubHkuY2xhc3NOYW1lID0gJ3NyLW9ubHknO1xuICAgIHNyT25seS50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzck9ubHkpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cbiIsICJjb25zdCBGT0NVU0FCTEVfU0VMRUNUT1IgPVxuICAgICdhW2hyZWZdLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJztcblxubGV0IG9wZW5Nb2RhbCA9IG51bGw7XG5sZXQgbW9kYWxJZENvdW50ZXIgPSAwO1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2RhbCh7IHRpdGxlLCBib2R5LCBmb290ZXIsIG9uQ2xvc2UsIHNpemUgPSAnbWQnLCBhcmlhRGVzY3JpcHRpb24gfSA9IHt9KSB7XG4gICAgaWYgKG9wZW5Nb2RhbCkge1xuICAgICAgICBvcGVuTW9kYWwuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RhbElkID0gYG1vZGFsLSR7Kyttb2RhbElkQ291bnRlcn1gO1xuICAgIGNvbnN0IHRpdGxlSWQgPSBgJHttb2RhbElkfS10aXRsZWA7XG4gICAgY29uc3QgZGVzY0lkID0gYCR7bW9kYWxJZH0tZGVzY2A7XG5cbiAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgb3ZlcmxheS5jbGFzc05hbWUgPSAnbW9kYWwtb3ZlcmxheSc7XG4gICAgb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgb3ZlcmxheS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbW9kYWwnLCAndHJ1ZScpO1xuICAgIG92ZXJsYXkuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCB0aXRsZUlkKTtcbiAgICBpZiAoYXJpYURlc2NyaXB0aW9uKSBvdmVybGF5LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGRlc2NJZCk7XG5cbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG1vZGFsLmNsYXNzTmFtZSA9ICdtb2RhbCc7XG4gICAgaWYgKHNpemUgPT09ICdsZycpIG1vZGFsLnN0eWxlLm1heFdpZHRoID0gJzcwMHB4JztcbiAgICBpZiAoc2l6ZSA9PT0gJ3NtJykgbW9kYWwuc3R5bGUubWF4V2lkdGggPSAnMzYwcHgnO1xuXG4gICAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbF9faGVhZGVyXCI+XG4gICAgICA8aDIgY2xhc3M9XCJtb2RhbF9fdGl0bGVcIiBpZD1cIiR7dGl0bGVJZH1cIj4ke3RpdGxlIHx8ICcnfTwvaDI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwibW9kYWxfX2Nsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlIGRpYWxvZ1wiPlxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xOCA2IDYgMThcIi8+PHBhdGggZD1cIm02IDYgMTIgMTJcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgICBjb25zdCBib2R5RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBib2R5RWwuY2xhc3NOYW1lID0gJ21vZGFsX19ib2R5JztcbiAgICBpZiAoYXJpYURlc2NyaXB0aW9uKSBib2R5RWwuaWQgPSBkZXNjSWQ7XG4gICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBib2R5RWwuaW5uZXJIVE1MID0gYm9keTtcbiAgICB9IGVsc2UgaWYgKGJvZHkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICBib2R5RWwuYXBwZW5kQ2hpbGQoYm9keSk7XG4gICAgfVxuICAgIG1vZGFsLmFwcGVuZENoaWxkKGJvZHlFbCk7XG5cbiAgICBpZiAoZm9vdGVyKSB7XG4gICAgICAgIGNvbnN0IGZvb3RlckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGZvb3RlckVsLmNsYXNzTmFtZSA9ICdtb2RhbF9fZm9vdGVyJztcbiAgICAgICAgaWYgKHR5cGVvZiBmb290ZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmb290ZXJFbC5pbm5lckhUTUwgPSBmb290ZXI7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9vdGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGZvb3RlckVsLmFwcGVuZENoaWxkKGZvb3Rlcik7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShmb290ZXIpKSB7XG4gICAgICAgICAgICBmb290ZXIuZm9yRWFjaChlbCA9PiBmb290ZXJFbC5hcHBlbmRDaGlsZChlbCkpO1xuICAgICAgICB9XG4gICAgICAgIG1vZGFsLmFwcGVuZENoaWxkKGZvb3RlckVsKTtcbiAgICB9XG5cbiAgICBvdmVybGF5LmFwcGVuZENoaWxkKG1vZGFsKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vdmVybGF5LS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBtb2RhbE9iaiA9IHtcbiAgICAgICAgZWxlbWVudDogb3ZlcmxheSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBjbG9zZTogKCkgPT4ge1xuICAgICAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vdmVybGF5LS1vcGVuJyk7XG4gICAgICAgICAgICBvdmVybGF5LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJsYXkucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG92ZXJsYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChvcGVuTW9kYWwgPT09IG1vZGFsT2JqKSBvcGVuTW9kYWwgPSBudWxsO1xuICAgICAgICAgICAgaWYgKG9uQ2xvc2UpIG9uQ2xvc2UoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVLZXlkb3duKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgb3Blbk1vZGFsID0gbW9kYWxPYmo7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhbmRsZUtleWRvd24oZSkge1xuICAgICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBtb2RhbE9iai5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgICAgICAgY29uc3QgZm9jdXNhYmxlID0gbW9kYWwucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfU0VMRUNUT1IpO1xuICAgICAgICAgICAgaWYgKGZvY3VzYWJsZS5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgZmlyc3QgPSBmb2N1c2FibGVbMF07XG4gICAgICAgICAgICBjb25zdCBsYXN0ID0gZm9jdXNhYmxlW2ZvY3VzYWJsZS5sZW5ndGggLSAxXTtcblxuICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3QpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGFzdC5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zaGlmdEtleSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGZpcnN0LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93bik7XG5cbiAgICBjb25zdCBjbG9zZUJ0biA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9fY2xvc2UnKTtcbiAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG1vZGFsT2JqLmNsb3NlKCkpO1xuXG4gICAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBvdmVybGF5KSBtb2RhbE9iai5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlyc3RGb2N1c2FibGUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKEZPQ1VTQUJMRV9TRUxFQ1RPUik7XG4gICAgICAgIGlmIChmaXJzdEZvY3VzYWJsZSkgZmlyc3RGb2N1c2FibGUuZm9jdXMoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICAgIHJldHVybiBtb2RhbE9iajtcbn1cbiIsICIvKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTa2VsZXRvblRleHQobGluZXMgPSAzKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gJ3NrZWxldG9uLXRleHQtZ3JvdXAnO1xuICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3N0YXR1cycpO1xuICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0xvYWRpbmcgY29udGVudCcpO1xuXG4gICAgY29uc3Qgc3JPbmx5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNyT25seS5jbGFzc05hbWUgPSAnc3Itb25seSc7XG4gICAgc3JPbmx5LnRleHRDb250ZW50ID0gJ0xvYWRpbmcuLi4nO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3JPbmx5KTtcblxuICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZ3JvdXAuc3R5bGUuY3NzVGV4dCA9ICdkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDowLjc1cmVtOyc7XG4gICAgZ3JvdXAuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2tlbGV0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2tlbGV0b24uY2xhc3NOYW1lID0gJ3NrZWxldG9uIHNrZWxldG9uLS10ZXh0JztcbiAgICAgICAgaWYgKGkgPT09IGxpbmVzIC0gMSkge1xuICAgICAgICAgICAgc2tlbGV0b24uc3R5bGUud2lkdGggPSAnNDAlJztcbiAgICAgICAgfVxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChza2VsZXRvbik7XG4gICAgfVxuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNrZWxldG9uQ2FyZCgpIHtcbiAgICBjb25zdCBjYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY2FyZC5jbGFzc05hbWUgPSAnc2tlbGV0b24tY2FyZCc7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnc3RhdHVzJyk7XG4gICAgY2FyZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnTG9hZGluZyBjYXJkIGNvbnRlbnQnKTtcblxuICAgIGNvbnN0IHNyT25seSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzck9ubHkuY2xhc3NOYW1lID0gJ3NyLW9ubHknO1xuICAgIHNyT25seS50ZXh0Q29udGVudCA9ICdMb2FkaW5nLi4uJztcbiAgICBjYXJkLmFwcGVuZENoaWxkKHNyT25seSk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBjb250ZW50LmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fdGh1bWJuYWlsXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNrZWxldG9uLWNhcmRfX2xpbmVzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fbGluZVwiIHN0eWxlPVwid2lkdGg6NzAlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2FyZF9fbGluZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrZWxldG9uLWNhcmRfX2xpbmVcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcbiAgICBjYXJkLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgcmV0dXJuIGNhcmQ7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNrZWxldG9uQ2hhcnQoKSB7XG4gICAgY29uc3QgY2hhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjaGFydC5jbGFzc05hbWUgPSAnc2tlbGV0b24tY2hhcnQnO1xuICAgIGNoYXJ0LnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBjaGFydC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnTG9hZGluZyBjaGFydCcpO1xuXG4gICAgY29uc3Qgc3JPbmx5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNyT25seS5jbGFzc05hbWUgPSAnc3Itb25seSc7XG4gICAgc3JPbmx5LnRleHRDb250ZW50ID0gJ0xvYWRpbmcgY2hhcnQuLi4nO1xuICAgIGNoYXJ0LmFwcGVuZENoaWxkKHNyT25seSk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBjb250ZW50LmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwic2tlbGV0b24tY2hhcnRfX2JhclwiPjwvZGl2Pic7XG4gICAgY29uc3QgYmFyID0gY29udGVudC5xdWVyeVNlbGVjdG9yKCcuc2tlbGV0b24tY2hhcnRfX2JhcicpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9ICdza2VsZXRvbi1jaGFydF9fYmFyLWl0ZW0nO1xuICAgICAgICBiYXIuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgfVxuXG4gICAgY2hhcnQuYXBwZW5kQ2hpbGQoY29udGVudCk7XG4gICAgcmV0dXJuIGNoYXJ0O1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJTa2VsZXRvbihjb250YWluZXIsIHR5cGUgPSAnY2FyZCcsIGNvdW50ID0gMSkge1xuICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgIGxldCBlbDtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdjYXJkJzpcbiAgICAgICAgICAgICAgICBlbCA9IGNyZWF0ZVNrZWxldG9uQ2FyZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hhcnQnOlxuICAgICAgICAgICAgICAgIGVsID0gY3JlYXRlU2tlbGV0b25DaGFydCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgZWwgPSBjcmVhdGVTa2VsZXRvblRleHQoMyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGVsID0gY3JlYXRlU2tlbGV0b25DYXJkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoZWwpO1xuICAgIH1cblxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTa2VsZXRvbnMoY29udGFpbmVyKSB7XG4gICAgY29uc3Qgc2tlbGV0b25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICcuc2tlbGV0b24tY2FyZCwgLnNrZWxldG9uLWNoYXJ0LCAuc2tlbGV0b24tdGV4dC1ncm91cCdcbiAgICApO1xuICAgIHNrZWxldG9ucy5mb3JFYWNoKGVsID0+IGVsLnJlbW92ZSgpKTtcbn1cbiIsICJjb25zdCBUT0FTVF9ERUZBVUxUUyA9IHtcbiAgICB0eXBlOiAnaW5mbycsXG4gICAgZHVyYXRpb246IDUwMDAsXG59O1xuXG5jb25zdCBJQ09OUyA9IHtcbiAgICBzdWNjZXNzOlxuICAgICAgICAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIi8+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIi8+PC9zdmc+JyxcbiAgICBlcnJvcjogJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjEwXCIvPjxwYXRoIGQ9XCJtMTUgOS02IDZcIi8+PHBhdGggZD1cIm05IDkgNiA2XCIvPjwvc3ZnPicsXG4gICAgd2FybmluZzpcbiAgICAgICAgJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTEwLjI5IDMuODYgMS44MiAxOGEyIDIgMCAwIDAgMS43MSAzaDE2Ljk0YTIgMiAwIDAgMCAxLjcxLTNMMTMuNzEgMy44NmEyIDIgMCAwIDAtMy40MiAwelwiLz48cGF0aCBkPVwiTTEyIDl2NFwiLz48cGF0aCBkPVwiTTEyIDE3aC4wMVwiLz48L3N2Zz4nLFxuICAgIGluZm86ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48cGF0aCBkPVwiTTEyIDE2di00XCIvPjxwYXRoIGQ9XCJNMTIgOGguMDFcIi8+PC9zdmc+Jyxcbn07XG5cbmxldCBjb250YWluZXIgPSBudWxsO1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldENvbnRhaW5lcigpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdC1yb290Jyk7XG4gICAgaWYgKGV4aXN0aW5nICYmIGRvY3VtZW50LmJvZHkuY29udGFpbnMoZXhpc3RpbmcpKSB7XG4gICAgICAgIGV4aXN0aW5nLmNsYXNzTmFtZSA9ICd0b2FzdC1jb250YWluZXInO1xuICAgICAgICBleGlzdGluZy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScpO1xuICAgICAgICBleGlzdGluZy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJyk7XG4gICAgICAgIHJldHVybiBleGlzdGluZztcbiAgICB9XG5cbiAgICBpZiAoIWNvbnRhaW5lciB8fCAhZG9jdW1lbnQuYm9keS5jb250YWlucyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ3RvYXN0LWNvbnRhaW5lcic7XG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dUb2FzdCh7XG4gICAgdGl0bGUsXG4gICAgbWVzc2FnZSxcbiAgICB0eXBlID0gVE9BU1RfREVGQVVMVFMudHlwZSxcbiAgICBkdXJhdGlvbiA9IFRPQVNUX0RFRkFVTFRTLmR1cmF0aW9uLFxufSkge1xuICAgIGNvbnN0IHRvYXN0Q29udGFpbmVyID0gZ2V0Q29udGFpbmVyKCk7XG4gICAgY29uc3QgdG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b2FzdC5jbGFzc05hbWUgPSBgdG9hc3QgdG9hc3QtLSR7dHlwZX1gO1xuICAgIHRvYXN0LnNldEF0dHJpYnV0ZSgncm9sZScsICdhbGVydCcpO1xuXG4gICAgdG9hc3QuaW5uZXJIVE1MID0gYFxuICAgIDxzcGFuIGNsYXNzPVwidG9hc3RfX2ljb25cIj4ke0lDT05TW3R5cGVdIHx8IElDT05TLmluZm99PC9zcGFuPlxuICAgIDxkaXYgY2xhc3M9XCJ0b2FzdF9fY29udGVudFwiPlxuICAgICAgPHAgY2xhc3M9XCJ0b2FzdF9fdGl0bGVcIj4ke3RpdGxlfTwvcD5cbiAgICAgICR7bWVzc2FnZSA/IGA8cCBjbGFzcz1cInRvYXN0X19tZXNzYWdlXCI+JHttZXNzYWdlfTwvcD5gIDogJyd9XG4gICAgPC9kaXY+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInRvYXN0X19jbG9zZVwiIGFyaWEtbGFiZWw9XCJEaXNtaXNzIG5vdGlmaWNhdGlvblwiPlxuICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTggNiA2IDE4XCIvPjxwYXRoIGQ9XCJtNiA2IDEyIDEyXCIvPjwvc3ZnPlxuICAgIDwvYnV0dG9uPlxuICBgO1xuXG4gICAgY29uc3QgY2xvc2VCdG4gPSB0b2FzdC5xdWVyeVNlbGVjdG9yKCcudG9hc3RfX2Nsb3NlJyk7XG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByZW1vdmVUb2FzdCh0b2FzdCkpO1xuXG4gICAgdG9hc3RDb250YWluZXIuYXBwZW5kQ2hpbGQodG9hc3QpO1xuXG4gICAgaWYgKGR1cmF0aW9uID4gMCkge1xuICAgICAgICB0b2FzdC5fdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gcmVtb3ZlVG9hc3QodG9hc3QpLCBkdXJhdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvYXN0O1xufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZVRvYXN0KHRvYXN0KSB7XG4gICAgaWYgKHRvYXN0Ll90aW1lb3V0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0b2FzdC5fdGltZW91dCk7XG4gICAgfVxuICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3RvYXN0LS1yZW1vdmluZycpO1xuICAgIHRvYXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdhbmltYXRpb25lbmQnLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodG9hc3QucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHRvYXN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodG9hc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7IG9uY2U6IHRydWUgfVxuICAgICk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dTdWNjZXNzKHRpdGxlLCBtZXNzYWdlKSB7XG4gICAgcmV0dXJuIHNob3dUb2FzdCh7IHR5cGU6ICdzdWNjZXNzJywgdGl0bGUsIG1lc3NhZ2UgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNob3dFcnJvcih0aXRsZSwgbWVzc2FnZSkge1xuICAgIHJldHVybiBzaG93VG9hc3QoeyB0eXBlOiAnZXJyb3InLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd1dhcm5pbmcodGl0bGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2hvd1RvYXN0KHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvd0luZm8odGl0bGUsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gc2hvd1RvYXN0KHsgdHlwZTogJ2luZm8nLCB0aXRsZSwgbWVzc2FnZSB9KTtcbn1cbiIsICJsZXQgdG9vbHRpcElkQ291bnRlciA9IDA7XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAodHJpZ2dlckVsLCB7IGNvbnRlbnQsIHBvc2l0aW9uID0gJ3RvcCcsIGRlbGF5ID0gMjAwIH0gPSB7fSkge1xuICAgIGNvbnN0IHRvb2x0aXBJZCA9IGB0b29sdGlwLSR7Kyt0b29sdGlwSWRDb3VudGVyfWA7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICd0b29sdGlwLXdyYXBwZXInO1xuICAgIHRyaWdnZXJFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCB0cmlnZ2VyRWwpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodHJpZ2dlckVsKTtcblxuICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCB0b29sdGlwSWQpO1xuXG4gICAgY29uc3QgdG9vbHRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9IGB0b29sdGlwIHRvb2x0aXAtLSR7cG9zaXRpb259YDtcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XG4gICAgdG9vbHRpcC5pZCA9IHRvb2x0aXBJZDtcbiAgICB0b29sdGlwLnRleHRDb250ZW50ID0gY29udGVudDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xuXG4gICAgbGV0IHNob3dUaW1lb3V0ID0gbnVsbDtcbiAgICBsZXQgaGlkZVRpbWVvdXQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICBpZiAoaGlkZVRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XG4gICAgICAgICAgICBoaWRlVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzaG93VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgcG9zaXRpb25Ub29sdGlwKCk7XG4gICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtLXZpc2libGUnKTtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgaWYgKHNob3dUaW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoc2hvd1RpbWVvdXQpO1xuICAgICAgICAgICAgc2hvd1RpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC0tdmlzaWJsZScpO1xuICAgICAgICB9LCAxMDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gcG9zaXRpb25Ub29sdGlwKCkge1xuICAgICAgICBjb25zdCB0cmlnZ2VyUmVjdCA9IHRyaWdnZXJFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgdG9vbHRpcFJlY3QgPSB0b29sdGlwLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBnYXAgPSA4O1xuXG4gICAgICAgIGxldCB0b3AsIGxlZnQ7XG5cbiAgICAgICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICB0b3AgPSB0cmlnZ2VyUmVjdC50b3AgLSB0b29sdGlwUmVjdC5oZWlnaHQgLSBnYXA7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRyaWdnZXJSZWN0LmxlZnQgKyB0cmlnZ2VyUmVjdC53aWR0aCAvIDIgLSB0b29sdGlwUmVjdC53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgIHRvcCA9IHRyaWdnZXJSZWN0LmJvdHRvbSArIGdhcDtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gdHJpZ2dlclJlY3QubGVmdCArIHRyaWdnZXJSZWN0LndpZHRoIC8gMiAtIHRvb2x0aXBSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHRvcCA9IHRyaWdnZXJSZWN0LnRvcCArIHRyaWdnZXJSZWN0LmhlaWdodCAvIDIgLSB0b29sdGlwUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgICAgIGxlZnQgPSB0cmlnZ2VyUmVjdC5sZWZ0IC0gdG9vbHRpcFJlY3Qud2lkdGggLSBnYXA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgdG9wID0gdHJpZ2dlclJlY3QudG9wICsgdHJpZ2dlclJlY3QuaGVpZ2h0IC8gMiAtIHRvb2x0aXBSZWN0LmhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRyaWdnZXJSZWN0LnJpZ2h0ICsgZ2FwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFkZGluZyA9IDg7XG4gICAgICAgIGlmIChsZWZ0IDwgcGFkZGluZykgbGVmdCA9IHBhZGRpbmc7XG4gICAgICAgIGlmIChsZWZ0ICsgdG9vbHRpcFJlY3Qud2lkdGggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIHBhZGRpbmcpIHtcbiAgICAgICAgICAgIGxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHRvb2x0aXBSZWN0LndpZHRoIC0gcGFkZGluZztcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9wIDwgcGFkZGluZykgdG9wID0gcGFkZGluZztcbiAgICAgICAgaWYgKHRvcCArIHRvb2x0aXBSZWN0LmhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCAtIHBhZGRpbmcpIHtcbiAgICAgICAgICAgIHRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRvb2x0aXBSZWN0LmhlaWdodCAtIHBhZGRpbmc7XG4gICAgICAgIH1cblxuICAgICAgICB0b29sdGlwLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgICAgIHRvb2x0aXAuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgIH1cblxuICAgIHRyaWdnZXJFbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgc2hvdyk7XG4gICAgdHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICB0cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBzaG93KTtcbiAgICB0cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGhpZGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95OiAoKSA9PiB7XG4gICAgICAgICAgICB0cmlnZ2VyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHNob3cpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHNob3cpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBoaWRlKTtcbiAgICAgICAgICAgIHRvb2x0aXAucmVtb3ZlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlOiBuZXdDb250ZW50ID0+IHtcbiAgICAgICAgICAgIHRvb2x0aXAudGV4dENvbnRlbnQgPSBuZXdDb250ZW50O1xuICAgICAgICB9LFxuICAgIH07XG59XG4iLCAiLyoqXG4gKiBFbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIHdpdGggdmFsaWRhdGlvbiBhbmQgZGVmYXVsdHMuXG4gKiBVc2VzIGltcG9ydC5tZXRhLmVudiAoaW5qZWN0ZWQgYnkgZXNidWlsZCBkZWZpbmUpIHdpdGggZmFsbGJhY2tzLlxuICovXG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICAgIEFQUF9OQU1FOiAnU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyJyxcbiAgICBBUFBfVkVSU0lPTjogJzAuMS4wJyxcbiAgICBBUElfQkFTRV9VUkw6ICcvYXBpJyxcbiAgICBBUElfVElNRU9VVDogMTAwMDAsXG4gICAgQVVUSF9UT0tFTl9LRVk6ICdzdHVkZW50X3RyYWNrZXJfYXV0aCcsXG4gICAgQVVUSF9SRURJUkVDVF9LRVk6ICdzdHVkZW50X3RyYWNrZXJfcmVkaXJlY3QnLFxuICAgIEFVVEhfUkVNRU1CRVJfREFZUzogMzAsXG4gICAgRU5BQkxFX01PQ0tfQVBJOiB0cnVlLFxuICAgIEVOQUJMRV9QV0E6IGZhbHNlLFxuICAgIEVOQUJMRV9BTkFMWVRJQ1M6IGZhbHNlLFxuICAgIENIQVJUX0FOSU1BVElPTl9EVVJBVElPTjogNzUwLFxuICAgIENIQVJUX1JFU1BPTlNJVkU6IHRydWUsXG59O1xuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIGdldEVudihrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgIGNvbnN0IGVudiA9IHR5cGVvZiBpbXBvcnQubWV0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgaW1wb3J0Lm1ldGEuZW52O1xuICAgIGNvbnN0IHZhbHVlID0gZW52ID8gZW52W2tleV0gOiB1bmRlZmluZWQ7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAodmFsdWUgPT09ICdmYWxzZScpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzTmFOKHZhbHVlKSAmJiB2YWx1ZSAhPT0gJycpIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGNvbnN0IEVOViA9IHtcbiAgICBBUFBfTkFNRTogZ2V0RW52KCdWSVRFX0FQUF9OQU1FJywgREVGQVVMVFMuQVBQX05BTUUpLFxuICAgIEFQUF9WRVJTSU9OOiBnZXRFbnYoJ1ZJVEVfQVBQX1ZFUlNJT04nLCBERUZBVUxUUy5BUFBfVkVSU0lPTiksXG4gICAgQVBJX0JBU0VfVVJMOiBnZXRFbnYoJ1ZJVEVfQVBJX0JBU0VfVVJMJywgREVGQVVMVFMuQVBJX0JBU0VfVVJMKSxcbiAgICBBUElfVElNRU9VVDogZ2V0RW52KCdWSVRFX0FQSV9USU1FT1VUJywgREVGQVVMVFMuQVBJX1RJTUVPVVQpLFxuICAgIEFVVEhfVE9LRU5fS0VZOiBnZXRFbnYoJ1ZJVEVfQVVUSF9UT0tFTl9LRVknLCBERUZBVUxUUy5BVVRIX1RPS0VOX0tFWSksXG4gICAgQVVUSF9SRURJUkVDVF9LRVk6IGdldEVudignVklURV9BVVRIX1JFRElSRUNUX0tFWScsIERFRkFVTFRTLkFVVEhfUkVESVJFQ1RfS0VZKSxcbiAgICBBVVRIX1JFTUVNQkVSX0RBWVM6IGdldEVudignVklURV9BVVRIX1JFTUVNQkVSX0RBWVMnLCBERUZBVUxUUy5BVVRIX1JFTUVNQkVSX0RBWVMpLFxuICAgIEVOQUJMRV9NT0NLX0FQSTogZ2V0RW52KCdWSVRFX0VOQUJMRV9NT0NLX0FQSScsIERFRkFVTFRTLkVOQUJMRV9NT0NLX0FQSSksXG4gICAgRU5BQkxFX1BXQTogZ2V0RW52KCdWSVRFX0VOQUJMRV9QV0EnLCBERUZBVUxUUy5FTkFCTEVfUFdBKSxcbiAgICBFTkFCTEVfQU5BTFlUSUNTOiBnZXRFbnYoJ1ZJVEVfRU5BQkxFX0FOQUxZVElDUycsIERFRkFVTFRTLkVOQUJMRV9BTkFMWVRJQ1MpLFxuICAgIENIQVJUX0FOSU1BVElPTl9EVVJBVElPTjogZ2V0RW52KFxuICAgICAgICAnVklURV9DSEFSVF9BTklNQVRJT05fRFVSQVRJT04nLFxuICAgICAgICBERUZBVUxUUy5DSEFSVF9BTklNQVRJT05fRFVSQVRJT05cbiAgICApLFxuICAgIENIQVJUX1JFU1BPTlNJVkU6IGdldEVudignVklURV9DSEFSVF9SRVNQT05TSVZFJywgREVGQVVMVFMuQ0hBUlRfUkVTUE9OU0lWRSksXG59O1xuXG5pZiAoIUVOVi5BUElfQkFTRV9VUkwpIHtcbiAgICBjb25zb2xlLndhcm4oJ1tDb25maWddIFZJVEVfQVBJX0JBU0VfVVJMIG5vdCBzZXQsIHVzaW5nIGRlZmF1bHQnKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRU5WO1xuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBBcHBsaWNhdGlvbi13aWRlIGNvbnN0YW50cyBhbmQgZW51bWVyYXRpb25zLlxuICpcbiAqIFNpbmdsZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIGFsbCBtYWdpYyBzdHJpbmdzIGFuZCBudW1iZXJzXG4gKiB1c2VkIGFjcm9zcyB0aGUgU3R1ZGVudCBQcm9ncmVzcyBUcmFja2luZyBTYWFTLlxuICpcbiAqIEltcG9ydCBvbmx5IHRoZSBncm91cHMgeW91IG5lZWQgXHUyMDE0IHRyZWUtc2hha2luZyBrZWVwcyB0aGVcbiAqIGJ1bmRsZSBtaW5pbWFsIHdoZW4gaW5kaXZpZHVhbCBuYW1lZCBleHBvcnRzIGFyZSB1c2VkLlxuICpcbiAqIEBtb2R1bGUgdXRpbHMvY29uc3RhbnRzXG4gKi9cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSb3V0ZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKiogSGFzaC1yb3V0ZXIgcGF0aCBjb25zdGFudHMgdXNlZCBhY3Jvc3MgdGhlIGFwcGxpY2F0aW9uLiAqL1xuZXhwb3J0IGNvbnN0IFJPVVRFUyA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgTE9HSU46ICcvbG9naW4nLFxuICAgIERBU0hCT0FSRDogJy9kYXNoYm9hcmQnLFxuICAgIE5PVF9GT1VORDogJy80MDQnLFxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQVBJIEVuZHBvaW50c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQVBJIGVuZHBvaW50IGZhY3RvcnkgZnVuY3Rpb25zIGFuZCBzdGF0aWMgcGF0aHMuXG4gKiBBbGwgcGF0aHMgYXJlIHJlbGF0aXZlIHRvIEVOVi5BUElfQkFTRV9VUkwuXG4gKi9cbmV4cG9ydCBjb25zdCBBUElfRU5EUE9JTlRTID0gLyoqIEB0eXBlIHtjb25zdH0gKi8gKHtcbiAgICBBVVRIX0xPR0lOOiAnL2F1dGgvbG9naW4nLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFN0dWRlbnQgSUQgKi9cbiAgICBTVFVERU5UOiBpZCA9PiBgL3N0dWRlbnRzLyR7aWR9YCxcblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBTdHVkZW50IElEICovXG4gICAgU1RVREVOVF9DT1VSU0VTOiBpZCA9PiBgL3N0dWRlbnRzLyR7aWR9L2NvdXJzZXNgLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIFN0dWRlbnQgSUQgKi9cbiAgICBTVFVERU5UX0dSQURFUzogaWQgPT4gYC9zdHVkZW50cy8ke2lkfS9ncmFkZXNgLFxuXG4gICAgLyoqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIENvdXJzZSBJRCAqL1xuICAgIENPVVJTRTogaWQgPT4gYC9jb3Vyc2VzLyR7aWR9YCxcblxuICAgIC8qKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBDb3Vyc2UgSUQgKi9cbiAgICBDT1VSU0VfUFJPR1JFU1M6IGlkID0+IGAvY291cnNlcy8ke2lkfS9wcm9ncmVzc2AsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdXRoZW50aWNhdGlvblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKiBBdXRoZW50aWNhdGlvbi1zcGVjaWZpYyBjb25zdGFudHMuICovXG5leHBvcnQgY29uc3QgQVVUSF9DT05TVEFOVFMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoe1xuICAgIERFTU9fRU1BSUw6ICdzdHVkZW50QGRlbW8uY29tJyxcbiAgICBERU1PX1BBU1NXT1JEOiAnZGVtbzEyMycsXG5cbiAgICAvKiogMzAtZGF5IHRva2VuIGxpZmV0aW1lIGluIG1pbGxpc2Vjb25kcy4gKi9cbiAgICBUT0tFTl9FWFBJUllfTVM6IDMwICogMjQgKiA2MCAqIDYwICogMTAwMCxcblxuICAgIC8qKiBNaW5pbXVtIHBhc3N3b3JkIGxlbmd0aCBmb3IgY2xpZW50LXNpZGUgdmFsaWRhdGlvbi4gKi9cbiAgICBNSU5fUEFTU1dPUkRfTEVOR1RIOiA2LFxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ291cnNlIHN0YXR1c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKiBWYWxpZCB2YWx1ZXMgZm9yIENvdXJzZS5zdGF0dXMgcmVjZWl2ZWQgZnJvbSB0aGUgQVBJLiAqL1xuZXhwb3J0IGNvbnN0IENPVVJTRV9TVEFUVVMgPSAvKiogQHR5cGUge2NvbnN0fSAqLyAoe1xuICAgIE5PVF9TVEFSVEVEOiAnbm90LXN0YXJ0ZWQnLFxuICAgIElOX1BST0dSRVNTOiAnaW4tcHJvZ3Jlc3MnLFxuICAgIENPTVBMRVRFRDogJ2NvbXBsZXRlZCcsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUb2FzdCBkdXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKiogQXV0by1kaXNtaXNzIGR1cmF0aW9ucyAobXMpIGZvciB0b2FzdCBub3RpZmljYXRpb25zIChQYXJ0IDEwKS4gKi9cbmV4cG9ydCBjb25zdCBUT0FTVF9EVVJBVElPTiA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgU1VDQ0VTUzogMzAwMCxcbiAgICBFUlJPUjogNTAwMCxcbiAgICBXQVJOSU5HOiA0MDAwLFxuICAgIElORk86IDQwMDAsXG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFcnJvciBjb2Rlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogTm9ybWFsaXNlZCBlcnJvciBjb2RlcyB1c2VkIGFjcm9zcyBzZXJ2aWNlIGFuZCBjb250ZXh0IGxheWVycy5cbiAqIFByZXZlbnRzIHNjYXR0ZXJlZCBzdHJpbmcgbGl0ZXJhbHMgd2hlbiBjb21wYXJpbmcgZXJyb3IgdHlwZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBFUlJPUl9DT0RFUyA9IC8qKiBAdHlwZSB7Y29uc3R9ICovICh7XG4gICAgSU5WQUxJRF9DUkVERU5USUFMUzogJ0lOVkFMSURfQ1JFREVOVElBTFMnLFxuICAgIFNFU1NJT05fRVhQSVJFRDogJ1NFU1NJT05fRVhQSVJFRCcsXG4gICAgTkVUV09SS19FUlJPUjogJ05FVFdPUktfRVJST1InLFxuICAgIFZBTElEQVRJT05fRVJST1I6ICdWQUxJREFUSU9OX0VSUk9SJyxcbiAgICBVTktOT1dOOiAnVU5LTk9XTicsXG59KTtcbiIsICJjb25zdCBfZW52ID0gdHlwZW9mIGltcG9ydC5tZXRhICE9PSAndW5kZWZpbmVkJyAmJiBpbXBvcnQubWV0YS5lbnY7XG5jb25zdCBjb25maWcgPSB7XG4gICAgYXBwTmFtZTogKF9lbnY/LlZJVEVfQVBQX05BTUUpIHx8ICdTdHVkZW50IFByb2dyZXNzIFRyYWNrZXInLFxuICAgIGFwcEVudjogKF9lbnY/LlZJVEVfQVBQX0VOVikgfHwgJ2RldmVsb3BtZW50JyxcbiAgICBhcGlCYXNlVXJsOiAoX2Vudj8uVklURV9BUElfQkFTRV9VUkwpIHx8ICdodHRwOi8vbG9jYWxob3N0OjMwMDEvYXBpJyxcbiAgICBhcGlNb2NrRW5hYmxlZDogX2Vudj8uVklURV9BUElfTU9DS19FTkFCTEVEID09PSAndHJ1ZScsXG4gICAgYXV0aFRva2VuS2V5OiAoX2Vudj8uVklURV9BVVRIX1RPS0VOX0tFWSkgfHwgJ2F1dGhfdG9rZW4nLFxuICAgIHNlc3Npb25UaW1lb3V0TWludXRlczogcGFyc2VJbnQoKF9lbnY/LlZJVEVfU0VTU0lPTl9USU1FT1VUX01JTlVURVMpIHx8ICc2MCcsIDEwKSxcbiAgICBlbmFibGVBbmFseXRpY3M6IF9lbnY/LlZJVEVfRU5BQkxFX0FOQUxZVElDUyA9PT0gJ3RydWUnLFxuICAgIGVuYWJsZU5vdGlmaWNhdGlvbnM6IChfZW52Py5WSVRFX0VOQUJMRV9OT1RJRklDQVRJT05TKSAhPT0gJ2ZhbHNlJyxcbiAgICBjYWNoZVR0bFNlY29uZHM6IHBhcnNlSW50KChfZW52Py5WSVRFX0NBQ0hFX1RUTF9TRUNPTkRTKSB8fCAnMzAwJywgMTApLFxufTtcblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuICAgIHJldHVybiB7IC4uLmNvbmZpZyB9O1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RldmVsb3BtZW50KCkge1xuICAgIHJldHVybiBjb25maWcuYXBwRW52ID09PSAnZGV2ZWxvcG1lbnQnO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0YWdpbmcoKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5hcHBFbnYgPT09ICdzdGFnaW5nJztcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9kdWN0aW9uKCkge1xuICAgIHJldHVybiBjb25maWcuYXBwRW52ID09PSAncHJvZHVjdGlvbic7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTW9ja0FwaUVuYWJsZWQoKSB7XG4gICAgcmV0dXJuIGNvbmZpZy5hcGlNb2NrRW5hYmxlZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIiwgIi8qKlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEFwcEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgeyBzdGF0dXMsIGNvZGUsIGRhdGEgfSA9IHt9KSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSAnQXBwRXJyb3InO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUFwaUVycm9yKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgQXBwRXJyb3IpIHJldHVybiBlcnJvcjtcblxuICAgIGNvbnN0IHN0YXR1cyA9IGVycm9yLnN0YXR1cyB8fCAwO1xuICAgIGNvbnN0IHN0YXR1c01lc3NhZ2VzID0ge1xuICAgICAgICAwOiB7XG4gICAgICAgICAgICB0aXRsZTogJ05ldHdvcmsgRXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIuIFBsZWFzZSBjaGVjayB5b3VyIGludGVybmV0IGNvbm5lY3Rpb24uJyxcbiAgICAgICAgfSxcbiAgICAgICAgNDAwOiB7IHRpdGxlOiAnQmFkIFJlcXVlc3QnLCBtZXNzYWdlOiAnVGhlIHJlcXVlc3Qgd2FzIGludmFsaWQuIFBsZWFzZSBjaGVjayB5b3VyIGlucHV0LicgfSxcbiAgICAgICAgNDAxOiB7XG4gICAgICAgICAgICB0aXRsZTogJ1Nlc3Npb24gRXhwaXJlZCcsXG4gICAgICAgICAgICBtZXNzYWdlOiAnWW91ciBzZXNzaW9uIGhhcyBleHBpcmVkLiBQbGVhc2UgbG9nIGluIGFnYWluLicsXG4gICAgICAgIH0sXG4gICAgICAgIDQwMzoge1xuICAgICAgICAgICAgdGl0bGU6ICdBY2Nlc3MgRGVuaWVkJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBwZXJmb3JtIHRoaXMgYWN0aW9uLicsXG4gICAgICAgIH0sXG4gICAgICAgIDQwNDogeyB0aXRsZTogJ05vdCBGb3VuZCcsIG1lc3NhZ2U6ICdUaGUgcmVxdWVzdGVkIHJlc291cmNlIGNvdWxkIG5vdCBiZSBmb3VuZC4nIH0sXG4gICAgICAgIDQyOTogeyB0aXRsZTogJ1RvbyBNYW55IFJlcXVlc3RzJywgbWVzc2FnZTogJ1BsZWFzZSB3YWl0IGEgbW9tZW50IGJlZm9yZSB0cnlpbmcgYWdhaW4uJyB9LFxuICAgICAgICA1MDA6IHtcbiAgICAgICAgICAgIHRpdGxlOiAnU2VydmVyIEVycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdBbiB1bmV4cGVjdGVkIHNlcnZlciBlcnJvciBvY2N1cnJlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nLFxuICAgICAgICB9LFxuICAgICAgICA1MDM6IHtcbiAgICAgICAgICAgIHRpdGxlOiAnU2VydmljZSBVbmF2YWlsYWJsZScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnVGhlIHNlcnZpY2UgaXMgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGUuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyxcbiAgICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgaW5mbyA9IHN0YXR1c01lc3NhZ2VzW3N0YXR1c10gfHwge1xuICAgICAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB8fCAnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4nLFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IEFwcEVycm9yKGluZm8ubWVzc2FnZSwgeyBzdGF0dXMsIGRhdGE6IGVycm9yLmRhdGEgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUdsb2JhbEVycm9ycyhvbkVycm9yKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXZlbnQgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdHbG9iYWwgZXJyb3IgY2F1Z2h0OicsIGV2ZW50LmVycm9yIHx8IGV2ZW50Lm1lc3NhZ2UpO1xuICAgICAgICBpZiAob25FcnJvcikgb25FcnJvcihldmVudC5lcnJvciB8fCB7IG1lc3NhZ2U6IGV2ZW50Lm1lc3NhZ2UgfSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgZXZlbnQgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246JywgZXZlbnQucmVhc29uKTtcbiAgICAgICAgaWYgKG9uRXJyb3IpIG9uRXJyb3IoZXZlbnQucmVhc29uKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQXV0aGVudGljYXRpb24gU3RvcmFnZSBTZXJ2aWNlIFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogQWJzdHJhY3RzIGFsbCBXZWIgU3RvcmFnZSByZWFkcyBhbmQgd3JpdGVzIHJlbGF0ZWQgdG8gYXV0aGVudGljYXRpb25cbiAqIGJlaGluZCBhIGNsZWFuLCB0ZXN0YWJsZSBBUEkgc28gdGhhdCBBdXRoQ29udGV4dCBhbmQgYXV0aEFwaSBuZXZlclxuICogcmVmZXJlbmNlIGBsb2NhbFN0b3JhZ2VgIC8gYHNlc3Npb25TdG9yYWdlYCBkaXJlY3RseS5cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgU3RvcmFnZSBzdHJhdGVneSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgVG9rZW4gcGF5bG9hZCAgeyB0b2tlbiwgZXhwaXJlc0F0LCB1c2VyIH1cbiAqICAgXHUyNTBDXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTEwXG4gKiAgIFx1MjUwMiAgcmVtZW1iZXJNZSA9IHRydWUgIFx1MjE5MiBsb2NhbFN0b3JhZ2UgICAocGVyc2lzdHMgYWNyb3NzIGJyb3dzZXIgY2xvc2UpIFx1MjUwMlxuICogICBcdTI1MDIgIHJlbWVtYmVyTWUgPSBmYWxzZSBcdTIxOTIgc2Vzc2lvblN0b3JhZ2UgKGNsZWFyZWQgb24gdGFiL2Jyb3dzZXIgY2xvc2UpICBcdTI1MDJcbiAqICAgXHUyNTE0XHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTE4XG4gKlxuICogICBSZWFkIG9yZGVyOiBsb2NhbFN0b3JhZ2UgZmlyc3QgXHUyMTkyIHNlc3Npb25TdG9yYWdlIGZhbGxiYWNrLlxuICogICBDbGVhcjogYm90aCB0aWVycyBhcmUgYWx3YXlzIHdpcGVkIHRvIHByZXZlbnQgb3JwaGFuZWQgdG9rZW5zLlxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBQcml2YXRlLWJyb3dzaW5nIGZhbGxiYWNrIChGUi1TVE9SLTAwNikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIEluIGVudmlyb25tZW50cyB3aGVyZSBXZWIgU3RvcmFnZSBpcyBibG9ja2VkIChTYWZhcmkgcHJpdmF0ZSBtb2RlLFxuICogICBjZXJ0YWluIGVudGVycHJpc2UgYnJvd3NlcnMpIGV2ZXJ5IHN0b3JhZ2UgY2FsbCBpcyBjYXVnaHQgYW5kIGFuXG4gKiAgIGluLW1lbW9yeSBNYXAgaXMgdXNlZCBpbnN0ZWFkLiBUaGUgaW4tbWVtb3J5IHN0b3JlIGlzIGVwaGVtZXJhbCBcdTIwMTRcbiAqICAgaXQgbGl2ZXMgb25seSBmb3IgdGhlIGN1cnJlbnQgcGFnZSBsaWZlY3ljbGUgXHUyMDE0IGJ1dCBpdCBhbGxvd3MgdGhlXG4gKiAgIGFwcGxpY2F0aW9uIHRvIGZ1bmN0aW9uIHdpdGhvdXQgY3Jhc2hpbmcuXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIEV4cG9ydGVkIEFQSSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAqICAgc2F2ZUF1dGhUb2tlbih7IHRva2VuLCBleHBpcmVzQXQsIHJlbWVtYmVyTWUgfSlcbiAqICAgZ2V0QXV0aFRva2VuKClcbiAqICAgY2xlYXJBdXRoVG9rZW4oKVxuICogICBzYXZlUmVkaXJlY3RQYXRoKHBhdGgpXG4gKiAgIGdldFJlZGlyZWN0UGF0aCgpXG4gKlxuICogQG1vZHVsZSBzZXJ2aWNlcy9hdXRoU3RvcmFnZVxuICovXG5cbmltcG9ydCB7IEVOViB9IGZyb20gJy4uL2NvbmZpZy9lbnYuanMnO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgU3RvcmFnZSBrZXlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFJlc29sdmVkIG9uY2UgYXQgbW9kdWxlIGxvYWQgZnJvbSBFTlYgc28gZXZlcnkgZnVuY3Rpb24gdXNlcyB0aGVcbi8vIHNhbWUga2V5IHN0cmluZyB3aXRob3V0IHJlcGVhdGluZyBtYWdpYyB2YWx1ZXMuXG5cbi8qKiBAdHlwZSB7c3RyaW5nfSBLZXkgdW5kZXIgd2hpY2ggdGhlIGF1dGggcGF5bG9hZCBpcyBzdG9yZWQuICovXG5jb25zdCBUT0tFTl9LRVkgPSBFTlYuQVVUSF9UT0tFTl9LRVk7XG5cbi8qKiBAdHlwZSB7c3RyaW5nfSBLZXkgdW5kZXIgd2hpY2ggdGhlIHByZS1sb2dpbiByZWRpcmVjdCBwYXRoIGlzIHN0b3JlZC4gKi9cbmNvbnN0IFJFRElSRUNUX0tFWSA9IEVOVi5BVVRIX1JFRElSRUNUX0tFWTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEluLW1lbW9yeSBmYWxsYmFjayBzdG9yZSAoRlItU1RPUi0wMDYpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIFVzZWQgd2hlbiBib3RoIGxvY2FsU3RvcmFnZSBhbmQgc2Vzc2lvblN0b3JhZ2UgdGhyb3cgKGUuZy4gcHJpdmF0ZSBtb2RlKS5cbi8vIEtleXMgbWlycm9yIHRoZSBXZWIgU3RvcmFnZSBrZXkgbmFtZXMgc28gdGhlIHJlc3Qgb2YgdGhlIGNvZGUgc3RheXMgdW5pZm9ybS5cblxuLyoqIEB0eXBlIHtNYXA8c3RyaW5nLCBzdHJpbmc+fSAqL1xuY29uc3QgX21lbW9yeVN0b3JlID0gbmV3IE1hcCgpO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgUHJpdmF0ZSBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIHJlYWQgYW5kIEpTT04tcGFyc2UgYSB2YWx1ZSBmcm9tIGEgc2luZ2xlIFdlYiBTdG9yYWdlIHRpZXIuXG4gKiBSZXR1cm5zIG51bGwgb24gYW55IGZhaWx1cmUgKG1pc3Npbmcga2V5LCBtYWxmb3JtZWQgSlNPTiwgc3RvcmFnZSBibG9ja2VkKS5cbiAqXG4gKiBAcGFyYW0ge1N0b3JhZ2V9IHN0b3JhZ2UgLSBgbG9jYWxTdG9yYWdlYCBvciBgc2Vzc2lvblN0b3JhZ2VgXG4gKiBAcGFyYW0ge3N0cmluZ30gIGtleSAgICAgLSBUaGUgc3RvcmFnZSBrZXkgdG8gcmVhZFxuICogQHJldHVybnMge3Vua25vd258bnVsbH0gIFBhcnNlZCB2YWx1ZSBvciBudWxsXG4gKi9cbmZ1bmN0aW9uIF9zdG9yYWdlUmVhZChzdG9yYWdlLCBrZXkpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByYXcgPSBzdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgaWYgKHJhdyA9PT0gbnVsbCB8fCByYXcgPT09ICcnKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmF3KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIEpTT04tc2VyaWFsaXNlIGEgdmFsdWUgYW5kIHdyaXRlIGl0IHRvIGEgV2ViIFN0b3JhZ2UgdGllci5cbiAqIEZhbGxzIGJhY2sgdG8gdGhlIGluLW1lbW9yeSBzdG9yZSB3aGVuIHN0b3JhZ2UgaXMgdW5hdmFpbGFibGUuXG4gKlxuICogQHBhcmFtIHtTdG9yYWdlfSBzdG9yYWdlIC0gYGxvY2FsU3RvcmFnZWAgb3IgYHNlc3Npb25TdG9yYWdlYFxuICogQHBhcmFtIHtzdHJpbmd9ICBrZXkgICAgIC0gVGhlIHN0b3JhZ2Uga2V5IHRvIHdyaXRlXG4gKiBAcGFyYW0ge3Vua25vd259IHZhbHVlICAgLSBBbnkgSlNPTi1zZXJpYWxpc2FibGUgdmFsdWVcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIHdoZW4gdGhlIHdyaXRlIHN1Y2NlZWRlZCB0byBXZWIgU3RvcmFnZTsgZmFsc2Ugd2hlblxuICogICAgICAgICAgICAgICAgICAgIHRoZSBmYWxsYmFjayBpbi1tZW1vcnkgc3RvcmUgd2FzIHVzZWRcbiAqL1xuZnVuY3Rpb24gX3N0b3JhZ2VXcml0ZShzdG9yYWdlLCBrZXksIHZhbHVlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgc3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIFN0b3JhZ2UgdW5hdmFpbGFibGUgKHByaXZhdGUgYnJvd3NpbmcsIHF1b3RhIGV4Y2VlZGVkKSBcdTIwMTQgdXNlIG1lbW9yeS5cbiAgICAgICAgX21lbW9yeVN0b3JlLnNldChrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gcmVtb3ZlIGEga2V5IGZyb20gYSBXZWIgU3RvcmFnZSB0aWVyLlxuICogQWxzbyByZW1vdmVzIHRoZSBrZXkgZnJvbSB0aGUgaW4tbWVtb3J5IGZhbGxiYWNrIHRvIGtlZXAgdGhlbSBpbiBzeW5jLlxuICpcbiAqIEBwYXJhbSB7U3RvcmFnZX0gc3RvcmFnZSAtIGBsb2NhbFN0b3JhZ2VgIG9yIGBzZXNzaW9uU3RvcmFnZWBcbiAqIEBwYXJhbSB7c3RyaW5nfSAga2V5ICAgICAtIFRoZSBrZXkgdG8gcmVtb3ZlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gX3N0b3JhZ2VSZW1vdmUoc3RvcmFnZSwga2V5KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgc3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIFN0b3JhZ2UgdW5hdmFpbGFibGUgXHUyMDE0IGZhbGwgdGhyb3VnaCB0byBtZW1vcnkgcmVtb3ZhbCBiZWxvdy5cbiAgICB9XG4gICAgX21lbW9yeVN0b3JlLmRlbGV0ZShrZXkpO1xufVxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRXhwb3J0ZWQgQVBJIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFBlcnNpc3RzIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbiBwYXlsb2FkIHRvIHRoZSBhcHByb3ByaWF0ZSBzdG9yYWdlIHRpZXIuXG4gKlxuICogU3RvcmVkIHBheWxvYWQgc2hhcGU6XG4gKiBgYGBqc29uXG4gKiB7IFwidG9rZW5cIjogXCJcdTIwMjZcIiwgXCJleHBpcmVzQXRcIjogMTIzNDU2Nzg5MDAwMCwgXCJ1c2VyXCI6IHsgXHUyMDI2IH0gfVxuICogYGBgXG4gKlxuICogYGV4cGlyZXNBdGAgaXMgbm9ybWFsaXNlZCB0byBhIFVuaXggdGltZXN0YW1wIChtcykgaGVyZSByZWdhcmRsZXNzIG9mXG4gKiB3aGV0aGVyIHRoZSBzZXJ2ZXIgcmV0dXJucyBhbiBJU08tODYwMSBzdHJpbmcgb3IgYSBudW1lcmljIHZhbHVlLlxuICogVGhpcyBndWFyYW50ZWVzIHRoYXQgYGdldEF1dGhUb2tlbigpYCBjYW4gYWx3YXlzIGNvbXBhcmUgYWdhaW5zdCBgRGF0ZS5ub3coKWBcbiAqIHdpdGhvdXQgZnVydGhlciB0eXBlLWNoZWNraW5nLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zICAgICAgICAgICAgIC0gVG9rZW4gZGF0YSBmcm9tIHRoZSBhdXRoIEFQSSByZXNwb25zZVxuICogQHBhcmFtIHtzdHJpbmd9ICBwYXJhbXMudG9rZW4gICAgICAgLSBSYXcgSldUIG9yIHNlc3Npb24gdG9rZW4gc3RyaW5nXG4gKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IHBhcmFtcy5leHBpcmVzQXQgLSBUb2tlbiBleHBpcnkgYXMgYSBVbml4IG1zIHRpbWVzdGFtcFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvciBhbiBJU08tODYwMSBzdHJpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zLnVzZXIgICAgICAgIC0gQXV0aGVudGljYXRlZCB1c2VyIG9iamVjdFxuICogQHBhcmFtIHtib29sZWFufSBbcGFyYW1zLnJlbWVtYmVyTWU9ZmFsc2VdIC0gV2hlbiB0cnVlOiB1c2UgbG9jYWxTdG9yYWdlO1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hlbiBmYWxzZTogdXNlIHNlc3Npb25TdG9yYWdlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBdXRoVG9rZW4oeyB0b2tlbiwgZXhwaXJlc0F0LCB1c2VyLCByZW1lbWJlck1lID0gZmFsc2UgfSkge1xuICAgIC8vIE5vcm1hbGlzZSBleHBpcmVzQXQ6IGFjY2VwdCBib3RoIElTTyBzdHJpbmdzIGFuZCBudW1lcmljIHRpbWVzdGFtcHMuXG4gICAgY29uc3Qgbm9ybWFsaXNlZCA9XG4gICAgICAgIHR5cGVvZiBleHBpcmVzQXQgPT09ICdzdHJpbmcnID8gbmV3IERhdGUoZXhwaXJlc0F0KS5nZXRUaW1lKCkgOiBOdW1iZXIoZXhwaXJlc0F0KTtcblxuICAgIGNvbnN0IHBheWxvYWQgPSB7IHRva2VuLCBleHBpcmVzQXQ6IG5vcm1hbGlzZWQsIHVzZXIgfTtcblxuICAgIGlmIChyZW1lbWJlck1lKSB7XG4gICAgICAgIC8vIFBlcnNpc3RlbnQgc2Vzc2lvbiBcdTIwMTQgc3Vydml2ZXMgYnJvd3NlciByZXN0YXJ0LlxuICAgICAgICBfc3RvcmFnZVdyaXRlKGxvY2FsU3RvcmFnZSwgVE9LRU5fS0VZLCBwYXlsb2FkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTZXNzaW9uLXNjb3BlZCBcdTIwMTQgY2xlYXJlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIHRhYi9icm93c2VyIGNsb3Nlcy5cbiAgICAgICAgX3N0b3JhZ2VXcml0ZShzZXNzaW9uU3RvcmFnZSwgVE9LRU5fS0VZLCBwYXlsb2FkKTtcbiAgICB9XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBzdG9yZWQgYXV0aGVudGljYXRpb24gdG9rZW4gcGF5bG9hZC5cbiAqXG4gKiBSZWFkIG9yZGVyOlxuICogICAxLiBgbG9jYWxTdG9yYWdlYCAgIFx1MjAxNCBcInJlbWVtYmVyIG1lXCIgc2Vzc2lvbnNcbiAqICAgMi4gYHNlc3Npb25TdG9yYWdlYCBcdTIwMTQgdGFiLXNjb3BlZCBzZXNzaW9uc1xuICogICAzLiBJbi1tZW1vcnkgc3RvcmUgIFx1MjAxNCBwcml2YXRlLWJyb3dzaW5nIGZhbGxiYWNrXG4gKlxuICogUmV0dXJucyBudWxsIHdoZW4gbm8gdmFsaWQgdG9rZW4gcGF5bG9hZCBpcyBmb3VuZCBpbiBhbnkgdGllci5cbiAqXG4gKiBAcmV0dXJucyB7eyB0b2tlbjogc3RyaW5nLCBleHBpcmVzQXQ6IG51bWJlciwgdXNlcjogT2JqZWN0IH18bnVsbH1cbiAqICAgVGhlIHN0b3JlZCBwYXlsb2FkLCBvciBudWxsIHdoZW4gbm9uZSBleGlzdHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEF1dGhUb2tlbigpIHtcbiAgICAvLyBDaGVjayBXZWIgU3RvcmFnZSB0aWVycyBmaXJzdC5cbiAgICBjb25zdCBmcm9tTG9jYWwgPSBfc3RvcmFnZVJlYWQobG9jYWxTdG9yYWdlLCBUT0tFTl9LRVkpO1xuICAgIGlmIChmcm9tTG9jYWwpIHJldHVybiBmcm9tTG9jYWw7XG5cbiAgICBjb25zdCBmcm9tU2Vzc2lvbiA9IF9zdG9yYWdlUmVhZChzZXNzaW9uU3RvcmFnZSwgVE9LRU5fS0VZKTtcbiAgICBpZiAoZnJvbVNlc3Npb24pIHJldHVybiBmcm9tU2Vzc2lvbjtcblxuICAgIC8vIEZhbGwgYmFjayB0byB0aGUgaW4tbWVtb3J5IHN0b3JlIChwcml2YXRlLWJyb3dzaW5nIGVudmlyb25tZW50cykuXG4gICAgY29uc3QgcmF3ID0gX21lbW9yeVN0b3JlLmdldChUT0tFTl9LRVkpO1xuICAgIGlmICghcmF3KSByZXR1cm4gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJhdyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbiBwYXlsb2FkIGZyb20gYWxsIHN0b3JhZ2UgdGllcnMuXG4gKlxuICogQ2xlYXJzIGxvY2FsU3RvcmFnZSwgc2Vzc2lvblN0b3JhZ2UsIEFORCB0aGUgaW4tbWVtb3J5IGZhbGxiYWNrXG4gKiBzbyB0aGF0IG5vIG9ycGhhbmVkIHRva2VuIGNhbiBiZSBmb3VuZCBieSBhIHN1YnNlcXVlbnQgYGdldEF1dGhUb2tlbigpYCBjYWxsLFxuICogcmVnYXJkbGVzcyBvZiB3aGljaCB0aWVyIHdhcyB1c2VkIGR1cmluZyBsb2dpbi5cbiAqXG4gKiBBbHNvIHJlbW92ZXMgdGhlIHNhdmVkIHJlZGlyZWN0IHBhdGggZnJvbSBzZXNzaW9uU3RvcmFnZS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQXV0aFRva2VuKCkge1xuICAgIF9zdG9yYWdlUmVtb3ZlKGxvY2FsU3RvcmFnZSwgVE9LRU5fS0VZKTtcbiAgICBfc3RvcmFnZVJlbW92ZShzZXNzaW9uU3RvcmFnZSwgVE9LRU5fS0VZKTtcbiAgICAvLyBSZW1vdmUgdGhlIHByZS1sb2dpbiByZWRpcmVjdCBwYXRoIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgX3N0b3JhZ2VSZW1vdmUoc2Vzc2lvblN0b3JhZ2UsIFJFRElSRUNUX0tFWSk7XG59XG5cbi8qKlxuICogU2F2ZXMgdGhlIHBhdGggdGhlIHVzZXIgd2FzIGF0dGVtcHRpbmcgdG8gdmlzaXQgYmVmb3JlIGJlaW5nIHJlZGlyZWN0ZWRcbiAqIHRvIHRoZSBsb2dpbiBwYWdlLiAgU3RvcmVkIGluIHNlc3Npb25TdG9yYWdlIGJlY2F1c2UgdGhlIHJlZGlyZWN0IGludGVudFxuICogaXMgb25seSByZWxldmFudCBmb3IgdGhlIGN1cnJlbnQgYnJvd3NlciBzZXNzaW9uLlxuICpcbiAqIEFmdGVyIGEgc3VjY2Vzc2Z1bCBsb2dpbiwgYGdldFJlZGlyZWN0UGF0aCgpYCByZXRyaWV2ZXMgYW5kIHJlbW92ZXMgdGhpc1xuICogdmFsdWUgc28gdGhlIHJvdXRlciBjYW4gbmF2aWdhdGUgdG8gdGhlIGludGVuZGVkIGRlc3RpbmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gQSByZWxhdGl2ZSBVUkwgcGF0aCwgZS5nLiAnL2Rhc2hib2FyZCdcbiAqIEByZXR1cm5zIHt2b2lkfVxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBDYWxsZWQgYnkgQXV0aEd1YXJkIHdoZW4gcmVkaXJlY3RpbmcgYW4gdW5hdXRoZW50aWNhdGVkIHVzZXI6XG4gKiBzYXZlUmVkaXJlY3RQYXRoKCcvZGFzaGJvYXJkJyk7XG4gKiByb3V0ZXIubmF2aWdhdGUoUk9VVEVTLkxPR0lOKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhdmVSZWRpcmVjdFBhdGgocGF0aCkge1xuICAgIC8vIE9ubHkgc3RvcmUgd2VsbC1mb3JtZWQgcmVsYXRpdmUgcGF0aHMgdG8gcHJldmVudCBvcGVuLXJlZGlyZWN0IGF0dGFja3MuXG4gICAgLy8gc2FuaXRpemVQYXRoKCkgaW4gYXV0aEhlbHBlcnMuanMgZW5mb3JjZXMgdGhpcyBcdTIwMTQgY2FsbCBpdCBiZWZvcmUgaGVyZS5cbiAgICB0cnkge1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFRElSRUNUX0tFWSwgcGF0aCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIF9tZW1vcnlTdG9yZS5zZXQoUkVESVJFQ1RfS0VZLCBwYXRoKTtcbiAgICB9XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGFuZCBpbW1lZGlhdGVseSByZW1vdmVzIHRoZSBzYXZlZCBwcmUtbG9naW4gcmVkaXJlY3QgcGF0aC5cbiAqXG4gKiBUaGUgb25lLXRpbWUgcmVhZC1hbmQtZGVsZXRlIGJlaGF2aW91ciBwcmV2ZW50cyBzdGFsZSByZWRpcmVjdCBwYXRoc1xuICogZnJvbSBwZXJzaXN0aW5nIGFjcm9zcyBtdWx0aXBsZSBsb2dpbiBzZXNzaW9ucyAoYSBzZWN1cml0eSBjb25zaWRlcmF0aW9uKS5cbiAqXG4gKiBSZXR1cm5zIHRoZSBkZWZhdWx0IGRhc2hib2FyZCBwYXRoIHdoZW4gbm8gcmVkaXJlY3QgcGF0aCB3YXMgc2F2ZWQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHNhdmVkIHBhdGgsIG9yIGAnL2Rhc2hib2FyZCdgIHdoZW4gbm9uZSBleGlzdHNcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2FsbGVkIGJ5IExvZ2luRm9ybSBhZnRlciBhIHN1Y2Nlc3NmdWwgbG9naW46XG4gKiBjb25zdCBkZXN0aW5hdGlvbiA9IGdldFJlZGlyZWN0UGF0aCgpOyAgLy8gZS5nLiAnL2Rhc2hib2FyZCdcbiAqIHJvdXRlci5uYXZpZ2F0ZShkZXN0aW5hdGlvbik7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWRpcmVjdFBhdGgoKSB7XG4gICAgLy8gVHJ5IHNlc3Npb25TdG9yYWdlIGZpcnN0LlxuICAgIGxldCBwYXRoID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgICBwYXRoID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShSRURJUkVDVF9LRVkpO1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFJFRElSRUNUX0tFWSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIEZhbGwgdGhyb3VnaCB0byBtZW1vcnkgc3RvcmUgYmVsb3cuXG4gICAgfVxuXG4gICAgLy8gVHJ5IGluLW1lbW9yeSBmYWxsYmFjayBpZiBzZXNzaW9uU3RvcmFnZSB3YXMgdW5hdmFpbGFibGUuXG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICAgIHBhdGggPSBfbWVtb3J5U3RvcmUuZ2V0KFJFRElSRUNUX0tFWSkgPz8gbnVsbDtcbiAgICAgICAgX21lbW9yeVN0b3JlLmRlbGV0ZShSRURJUkVDVF9LRVkpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoID8/ICcvZGFzaGJvYXJkJztcbn1cbiIsICJpbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tICcuLi91dGlscy9lbnYuanMnO1xuaW1wb3J0IHsgbm9ybWFsaXplQXBpRXJyb3IgfSBmcm9tICcuLi91dGlscy9lcnJvcnMuanMnO1xuaW1wb3J0IHsgZ2V0QXV0aFRva2VuIH0gZnJvbSAnLi9hdXRoU3RvcmFnZS5qcyc7XG5cbmxldCBtb2NrSGFuZGxlcnMgPSBudWxsO1xuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0QXBpKCkge1xuICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xuXG4gICAgaWYgKGNvbmZpZy5hcGlNb2NrRW5hYmxlZCkge1xuICAgICAgICBjb25zdCB7IHNldHVwTW9ja1NlcnZlciB9ID0gYXdhaXQgaW1wb3J0KCcuL21vY2suanMnKTtcbiAgICAgICAgbW9ja0hhbmRsZXJzID0gc2V0dXBNb2NrU2VydmVyKCk7XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2NrU2VydmVyKCkge1xuICAgIHJldHVybiBtb2NrSGFuZGxlcnM7XG59XG5cbi8qKlxuICogQXBpU2VydmljZSBjbGFzcyBoYW5kbGVzIGFsbCBBUEkgcmVxdWVzdHMuXG4gKiBQcm92aWRlcyBhIGNlbnRyYWxpemVkIGZldGNoIHdyYXBwZXIgd2l0aCBhdXRvbWF0aWMgdG9rZW4gaW5qZWN0aW9uLFxuICogcmVzcG9uc2Ugbm9ybWFsaXphdGlvbiwgdGltZW91dCBoYW5kbGluZywgcmV0cnkgbG9naWMgd2l0aCBleHBvbmVudGlhbCBiYWNrb2ZmLFxuICogYW5kIHJlcXVlc3QgZGVkdXBsaWNhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwaVNlcnZpY2Uge1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYmFzZVVybCA9ICcnKSB7XG4gICAgICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmwgfHwgKHdpbmRvdy5DT05GSUcgJiYgd2luZG93LkNPTkZJRy5BUElfQkFTRV9VUkwpIHx8ICcvYXBpJztcblxuICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy50aW1lb3V0TXMgPSAxMDAwMDtcbiAgICAgICAgdGhpcy5tYXhSZXRyaWVzID0gMztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IGludGVyY2VwdG9yIHRvIGluamVjdCBhdXRoZW50aWNhdGlvbiB0b2tlbnMuXG4gICAgICovXG4gICAgX3JlcXVlc3RJbnRlcmNlcHRvcihvcHRpb25zLCBlbmRwb2ludCkge1xuICAgICAgICBjb25zdCBoZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzIHx8IHt9KTtcbiAgICAgICAgaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5cbiAgICAgICAgaWYgKCFvcHRpb25zLm5vVG9rZW4gJiYgIWVuZHBvaW50LnN0YXJ0c1dpdGgoJy9hdXRoLycpKSB7XG4gICAgICAgICAgICBjb25zdCBhdXRoRGF0YSA9IGdldEF1dGhUb2tlbigpO1xuICAgICAgICAgICAgaWYgKGF1dGhEYXRhPy50b2tlbikge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdBdXRob3JpemF0aW9uJywgYEJlYXJlciAke2F1dGhEYXRhLnRva2VufWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3BvbnNlIGludGVyY2VwdG9yIHRvIG5vcm1hbGl6ZSB0aGUgcmVzcG9uc2UgZm9ybWF0IGFuZCBoYW5kbGUgY29tbW9uIGVycm9ycy5cbiAgICAgKi9cbiAgICBhc3luYyBfcmVzcG9uc2VJbnRlcmNlcHRvcihyZXNwb25zZSkge1xuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgSFRUUCAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIGVycm9yLnN0YXR1cyA9IHJlc3BvbnNlLnN0YXR1cztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBlcnJvckRhdGEubWVzc2FnZSB8fCBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIGVycm9yLmRhdGEgPSBlcnJvckRhdGE7XG4gICAgICAgICAgICB9IGNhdGNoIChfZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yVGV4dCA9IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gZXJyb3JUZXh0IHx8IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRFcnJvciA9IG5vcm1hbGl6ZUFwaUVycm9yKGVycm9yKTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIDQwMSBVbmF1dGhvcml6ZWQgZ2xvYmFsbHlcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQoJ2F1dGg6dW5hdXRob3JpemVkJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBub3JtYWxpemVkRXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKTtcbiAgICAgICAgaWYgKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluY2x1ZGVzKCdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhIHVuaXF1ZSBrZXkgZm9yIGRlZHVwbGljYXRpb24gYmFzZWQgb24gbWV0aG9kLCB1cmwsIGFuZCBib2R5LlxuICAgICAqL1xuICAgIF9nZXRSZXF1ZXN0S2V5KG1ldGhvZCwgdXJsLCBib2R5KSB7XG4gICAgICAgIHJldHVybiBgJHttZXRob2R9OiR7dXJsfToke2JvZHkgfHwgJyd9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgdG8gZGV0ZWN0IG5ldHdvcmsgZXJyb3JzIGZvciByZXRyeSBsb2dpYy5cbiAgICAgKi9cbiAgICBfaXNOZXR3b3JrRXJyb3IoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGVycm9yLm5hbWUgPT09ICdUeXBlRXJyb3InIHx8XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID09PSAnRmFpbGVkIHRvIGZldGNoJyB8fFxuICAgICAgICAgICAgZXJyb3IubWVzc2FnZS5pbmNsdWRlcygnTmV0d29ya0Vycm9yJylcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3JlIHJlcXVlc3QgbWV0aG9kXG4gICAgICovXG4gICAgYXN5bmMgcmVxdWVzdChlbmRwb2ludCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIG1ldGhvZCA9ICdHRVQnLFxuICAgICAgICAgICAgYm9keSxcbiAgICAgICAgICAgIHJldHJ5Q291bnQgPSAwLFxuICAgICAgICAgICAgc2tpcERlZHVwID0gZmFsc2UsXG4gICAgICAgICAgICAuLi5vdGhlck9wdGlvbnNcbiAgICAgICAgfSA9IG9wdGlvbnM7XG5cbiAgICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5iYXNlVXJsfSR7ZW5kcG9pbnR9YDtcblxuICAgICAgICAvLyBDaGVjayBkZWR1cGxpY2F0aW9uXG4gICAgICAgIGNvbnN0IHJlcXVlc3RLZXkgPSAhc2tpcERlZHVwICYmIHRoaXMuX2dldFJlcXVlc3RLZXkobWV0aG9kLCB1cmwsIGJvZHkpO1xuICAgICAgICBpZiAocmVxdWVzdEtleSAmJiB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5oYXMocmVxdWVzdEtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5nZXQocmVxdWVzdEtleSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAxLiBSdW4gcmVxdWVzdCBpbnRlcmNlcHRvclxuICAgICAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLl9yZXF1ZXN0SW50ZXJjZXB0b3IoeyBtZXRob2QsIGJvZHksIC4uLm90aGVyT3B0aW9ucyB9LCBlbmRwb2ludCk7XG5cbiAgICAgICAgLy8gVGltZW91dCBoYW5kbGluZ1xuICAgICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuICAgICAgICBmZXRjaE9wdGlvbnMuc2lnbmFsID0gY29udHJvbGxlci5zaWduYWw7XG5cbiAgICAgICAgY29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgoX3Jlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1JlcXVlc3QgdGltZW91dCcpKTtcbiAgICAgICAgICAgIH0sIHRoaXMudGltZW91dE1zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGhlIGFjdHVhbCBmZXRjaCB3cmFwcGVkIGluIG91ciBpbnRlcmNlcHRvcnNcbiAgICAgICAgY29uc3QgZmV0Y2hQcm9taXNlID0gZmV0Y2godXJsLCBmZXRjaE9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihhc3luYyByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RLZXkpIHRoaXMucGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0S2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5fcmVzcG9uc2VJbnRlcmNlcHRvcihyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdEtleSkgdGhpcy5wZW5kaW5nUmVxdWVzdHMuZGVsZXRlKHJlcXVlc3RLZXkpO1xuXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGFib3J0IHNwZWNpZmljYWxseVxuICAgICAgICAgICAgICAgIGlmIChlcnJvci5uYW1lID09PSAnQWJvcnRFcnJvcicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9PT0gJ1RoZSB1c2VyIGFib3J0ZWQgYSByZXF1ZXN0LidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdSZXF1ZXN0IGNhbmNlbGxlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICdSZXF1ZXN0IHRpbWVvdXQnXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmV0cnkgd2l0aCBleHBvbmVudGlhbCBiYWNrb2ZmIG9uIG5ldHdvcmsgZXJyb3JzXG4gICAgICAgICAgICAgICAgaWYgKHJldHJ5Q291bnQgPCB0aGlzLm1heFJldHJpZXMgJiYgdGhpcy5faXNOZXR3b3JrRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5wb3coMiwgcmV0cnlDb3VudCkgKiAxMDAwOyAvLyAxcywgMnMsIDRzXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHJ5Q291bnQ6IHJldHJ5Q291bnQgKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEFQSSBFcnJvciBvbiAke2VuZHBvaW50fTpgLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyBSYWNlIGZldGNoIGFnYWluc3QgdGltZW91dFxuICAgICAgICBjb25zdCByZXF1ZXN0UHJvbWlzZSA9IFByb21pc2UucmFjZShbZmV0Y2hQcm9taXNlLCB0aW1lb3V0UHJvbWlzZV0pO1xuXG4gICAgICAgIC8vIFN0b3JlIGZvciBkZWR1cGxpY2F0aW9uXG4gICAgICAgIGlmIChyZXF1ZXN0S2V5KSB7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5zZXQocmVxdWVzdEtleSwgcmVxdWVzdFByb21pc2UpO1xuICAgICAgICAgICAgLy8gRW5zdXJlIHdlIGNsZWFuIHVwIGlmIHJhY2UgcmVzb2x2ZXMgYmVmb3JlIGZpbmFsbHkgYmxvY2tcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL2NhdGNoLW9yLXJldHVyblxuICAgICAgICAgICAgcmVxdWVzdFByb21pc2UuZmluYWxseSgoKSA9PiB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5kZWxldGUocmVxdWVzdEtleSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3RQcm9taXNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZ2V0KGVuZHBvaW50LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChlbmRwb2ludCwgeyBtZXRob2Q6ICdHRVQnLCAuLi5vcHRpb25zIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgcG9zdChlbmRwb2ludCwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSksXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHB1dChlbmRwb2ludCwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoZW5kcG9pbnQsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KSxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgcGF0Y2goZW5kcG9pbnQsIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KGVuZHBvaW50LCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQQVRDSCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KSxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgZGVsZXRlKGVuZHBvaW50LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChlbmRwb2ludCwgeyBtZXRob2Q6ICdERUxFVEUnLCAuLi5vcHRpb25zIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFwaSA9IG5ldyBBcGlTZXJ2aWNlKCk7XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEF1dGhlbnRpY2F0aW9uIEFQSSBTZXJ2aWNlIFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogRW5jYXBzdWxhdGVzIGV2ZXJ5IEhUVFAgY2FsbCByZWxhdGVkIHRvIGF1dGhlbnRpY2F0aW9uIHNvIHRoYXRcbiAqIGNvbnN1bWVycyAoQXV0aENvbnRleHQsIHVzZUF1dGggaG9vaykgbmV2ZXIgZGVhbCB3aXRoIHJhdyBmZXRjaFxuICogZGV0YWlscywgVVJMIGNvbnN0cnVjdGlvbiwgb3IgSFRUUCBlcnJvciBjb2Rlcy5cbiAqXG4gKiBcdTI1MDBcdTI1MDBcdTI1MDAgQVBJIEludGVncmF0aW9uIExheWVyIChQYXJ0IDgpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBVc2VzIHRoZSBjb3JlIEFwaVNlcnZpY2UgKGBzcmMvc2VydmljZXMvYXBpLmpzYCkgZm9yIHJldHJpZXMsXG4gKiAgIGRlZHVwbGljYXRpb24sIGFuZCB0aGUgc2hhcmVkIHJlc3BvbnNlIGludGVyY2VwdG9yLlxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBFcnJvciBub3JtYWxpc2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBBbGwgZXJyb3JzIGFyZSBjYXVnaHQgYW5kIGNvbnZlcnRlZCB0byBhIHsgY29kZSwgbWVzc2FnZSB9IG9iamVjdFxuICogICB0aGF0IG1hdGNoZXMgdGhlIHNoYXBlIGV4cGVjdGVkIGJ5IGBBdXRoQ29udGV4dC5ub3JtYWxpc2VFcnJvcigpYC5cbiAqXG4gKiAgIEhUVFAgNDAxICBcdTIxOTIgeyBjb2RlOiAnSU5WQUxJRF9DUkVERU5USUFMUycsIG1lc3NhZ2U6ICdcdTIwMjYnIH1cbiAqICAgSFRUUCA0MDAgIFx1MjE5MiB7IGNvZGU6ICdWQUxJREFUSU9OX0VSUk9SJywgICAgbWVzc2FnZTogJ1x1MjAyNicgfVxuICogICBOZXR3b3JrICAgXHUyMTkyIHsgY29kZTogJ05FVFdPUktfRVJST1InLCAgICAgICBtZXNzYWdlOiAnXHUyMDI2JyB9XG4gKiAgIE90aGVyICAgICBcdTIxOTIgeyBjb2RlOiAnVU5LTk9XTicsICAgICAgICAgICAgIG1lc3NhZ2U6ICdcdTIwMjYnIH1cbiAqXG4gKiBAbW9kdWxlIHNlcnZpY2VzL2F1dGhBcGlcbiAqL1xuXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuLi9jb25maWcvZW52LmpzJztcbmltcG9ydCB7IEFQSV9FTkRQT0lOVFMsIEVSUk9SX0NPREVTIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IGFwaSB9IGZyb20gJy4vYXBpLmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEV4cG9ydGVkIEFQSSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBTZW5kcyB0aGUgdXNlcidzIGNyZWRlbnRpYWxzIHRvIHRoZSBhdXRoZW50aWNhdGlvbiBlbmRwb2ludCBhbmQgcmV0dXJuc1xuICogdGhlIHJlc3VsdGluZyB0b2tlbiBwYXlsb2FkIG9uIHN1Y2Nlc3MuXG4gKlxuICogT24gc3VjY2VzcywgcmV0dXJucyB0aGUgcmF3IEFQSSByZXNwb25zZSBib2R5OlxuICogYGBganNvblxuICoge1xuICogICBcInRva2VuXCI6ICAgICBcIm1vY2stand0LXRva2VuLVx1MjAyNlwiLFxuICogICBcImV4cGlyZXNBdFwiOiBcIjIwMjYtMDgtMjJUMTU6MDA6MDAuMDAwWlwiLFxuICogICBcInVzZXJcIjoge1xuICogICAgIFwiaWRcIjogICAgXCJzdHVfMDAxXCIsXG4gKiAgICAgXCJuYW1lXCI6ICBcIkFsZXggSm9obnNvblwiLFxuICogICAgIFwiZW1haWxcIjogXCJzdHVkZW50QGRlbW8uY29tXCIsXG4gKiAgICAgXCJyb2xlXCI6ICBcInN0dWRlbnRcIlxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBPbiBmYWlsdXJlLCB0aHJvd3MgYSBub3JtYWxpc2VkIGB7IGNvZGUsIG1lc3NhZ2UgfWAgZXJyb3Igb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgY3JlZGVudGlhbHMgICAgICAgICAgICAtIExvZ2luIGZvcm0gZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9ICBjcmVkZW50aWFscy5lbWFpbCAgICAgIC0gVXNlcidzIGVtYWlsIGFkZHJlc3NcbiAqIEBwYXJhbSB7c3RyaW5nfSAgY3JlZGVudGlhbHMucGFzc3dvcmQgICAtIFVzZXIncyBwYXNzd29yZFxuICogQHJldHVybnMge1Byb21pc2U8eyB0b2tlbjogc3RyaW5nLCBleHBpcmVzQXQ6IHN0cmluZ3xudW1iZXIsIHVzZXI6IE9iamVjdCB9Pn1cbiAqICAgVGhlIHJhdyBhdXRoIHJlc3BvbnNlIGJvZHlcbiAqIEB0aHJvd3Mge3sgY29kZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcgfX0gTm9ybWFsaXNlZCBlcnJvciBvbiBmYWlsdXJlXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbih7IGVtYWlsLCBwYXNzd29yZCB9KSB7XG4gICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICBjb25zdCB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGNvbnRyb2xsZXIuYWJvcnQoKSwgRU5WLkFQSV9USU1FT1VUIHx8IDEwMDAwKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXBpLnBvc3QoXG4gICAgICAgICAgICBBUElfRU5EUE9JTlRTLkFVVEhfTE9HSU4sXG4gICAgICAgICAgICB7IGVtYWlsLCBwYXNzd29yZCB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNpZ25hbDogY29udHJvbGxlci5zaWduYWwsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXG4gICAgICAgIGlmIChlcnIubmFtZSA9PT0gJ0Fib3J0RXJyb3InIHx8IGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgIGNvZGU6IEVSUk9SX0NPREVTLk5FVFdPUktfRVJST1IsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VuYWJsZSB0byBjb25uZWN0LiBQbGVhc2UgY2hlY2sgeW91ciBpbnRlcm5ldCBjb25uZWN0aW9uLicsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVyci5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgICAgICAgdGhyb3cge1xuICAgICAgICAgICAgICAgIGNvZGU6IEVSUk9SX0NPREVTLlZBTElEQVRJT05fRVJST1IsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyLmRhdGE/Lm1lc3NhZ2UgPz8gJ1RoZSByZXF1ZXN0IGNvbnRhaW5lZCBpbnZhbGlkIGRhdGEuJyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXJyLnN0YXR1cyA9PT0gNDAxKSB7XG4gICAgICAgICAgICB0aHJvdyB7XG4gICAgICAgICAgICAgICAgY29kZTogRVJST1JfQ09ERVMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnIuZGF0YT8ubWVzc2FnZSA/PyAnSW52YWxpZCBlbWFpbCBvciBwYXNzd29yZC4nLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IHtcbiAgICAgICAgICAgIGNvZGU6IEVSUk9SX0NPREVTLlVOS05PV04sXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnIuZGF0YT8ubWVzc2FnZSA/PyBlcnIubWVzc2FnZSA/PyAnQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZC4nLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuLyoqXG4gKiBTZW5kcyBhIHNlcnZlci1zaWRlIGxvZ291dCByZXF1ZXN0IHRvIGludmFsaWRhdGUgdGhlIHRva2VuLlxuICpcbiAqIFRoaXMgaXMgYSBiZXN0LWVmZm9ydCBjYWxsIFx1MjAxNCBjbGllbnQtc2lkZSB0b2tlbiByZW1vdmFsIHZpYVxuICogYGF1dGhTdG9yYWdlLmNsZWFyQXV0aFRva2VuKClgIGlzIGFsd2F5cyBwZXJmb3JtZWQgZmlyc3QgYnkgdGhlIGNhbGxlclxuICogKEF1dGhDb250ZXh0LmxvZ291dCkgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgcmVxdWVzdCBzdWNjZWVkcy5cbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gQWx3YXlzIHJlc29sdmVzOyBuZXZlciByZWplY3RzXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgYXBpLnBvc3QoJy9hdXRoL2xvZ291dCcsIHt9KTtcbiAgICB9IGNhdGNoIChfZXJyKSB7XG4gICAgICAgIC8vIEZpcmUtYW5kLWZvcmdldDogZmFpbCBzaWxlbnRseSBzbyB0aGUgY2xpZW50IGNhbiBzdGlsbCBjbGVhciBsb2NhbCBzdGF0ZS5cbiAgICB9XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEF1dGhlbnRpY2F0aW9uIEhlbHBlciBVdGlsaXRpZXMgXHUyMDE0IFBhcnQgMy5cbiAqXG4gKiBQdXJlLCBzdGF0ZWxlc3MgaGVscGVyIGZ1bmN0aW9ucyBmb3IgdGhlIGF1dGhlbnRpY2F0aW9uIG1vZHVsZS5cbiAqIE5vIHNpZGUgZWZmZWN0cywgbm8gRE9NIGFjY2Vzcywgbm8gaW1wb3J0cyBmcm9tIHNlcnZpY2VzIG9yIGNvbnRleHQuXG4gKiBFdmVyeSBmdW5jdGlvbiBpcyBpbmRlcGVuZGVudGx5IHVuaXQtdGVzdGFibGUuXG4gKlxuICogQG1vZHVsZSB1dGlscy9hdXRoSGVscGVyc1xuICovXG5cbmltcG9ydCB7IFJPVVRFUyB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEF2YXRhciBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIERlcml2ZXMgdXAgdG8gdHdvIHVwcGVyY2FzZSBpbml0aWFscyBmcm9tIGEgZnVsbCBuYW1lIHN0cmluZy5cbiAqXG4gKiBSdWxlczpcbiAqIC0gU3BsaXRzIG9uIHdoaXRlc3BhY2UgYW5kIHRha2VzIHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgZWFjaCB3b3JkXG4gKiAtIFJldHVybnMgYSBtYXhpbXVtIG9mIDIgaW5pdGlhbHMgKGZpcnN0ICsgbGFzdCB3b3JkKVxuICogLSBGYWxscyBiYWNrIHRvIGAnPydgIHdoZW4gdGhlIGlucHV0IGlzIGVtcHR5IG9yIG5vdCBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gVGhlIHVzZXIncyBmdWxsIG5hbWUgKGUuZy4gYCdBbGV4IEpvaG5zb24nYClcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFVwIHRvIDIgdXBwZXJjYXNlIGluaXRpYWxzIChlLmcuIGAnQUonYClcbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0SW5pdGlhbHMoJ0FsZXggSm9obnNvbicpICAgICAgLy8gJ0FKJ1xuICogZ2V0SW5pdGlhbHMoJ1ByaXlhJykgICAgICAgICAgICAgLy8gJ1AnXG4gKiBnZXRJbml0aWFscygnTWFyaWEgZGVsIENhcm1lbicpICAvLyAnTUMnXG4gKiBnZXRJbml0aWFscygnJykgICAgICAgICAgICAgICAgICAvLyAnPydcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEluaXRpYWxzKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUgfHwgdHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSByZXR1cm4gJz8nO1xuXG4gICAgY29uc3Qgd29yZHMgPSBuYW1lLnRyaW0oKS5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAod29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gJz8nO1xuXG4gICAgY29uc3QgZmlyc3QgPSB3b3Jkc1swXVswXS50b1VwcGVyQ2FzZSgpO1xuICAgIGlmICh3b3Jkcy5sZW5ndGggPT09IDEpIHJldHVybiBmaXJzdDtcblxuICAgIGNvbnN0IGxhc3QgPSB3b3Jkc1t3b3Jkcy5sZW5ndGggLSAxXVswXS50b1VwcGVyQ2FzZSgpO1xuICAgIHJldHVybiBmaXJzdCArIGxhc3Q7XG59XG5cbi8qKlxuICogRGVyaXZlcyBhIGNvbnNpc3RlbnQsIGRldGVybWluaXN0aWMgaGV4IGJhY2tncm91bmQgY29sb3VyIGZyb20gYSBzdHJpbmdcbiAqIHNlZWQgKHVzZXIgSUQgb3IgbmFtZSkuICBHaXZlbiB0aGUgc2FtZSBzZWVkLCB0aGlzIGZ1bmN0aW9uIGFsd2F5cyByZXR1cm5zXG4gKiB0aGUgc2FtZSBjb2xvdXIsIHByb3ZpZGluZyB2aXN1YWwgY29uc2lzdGVuY3kgYWNyb3NzIHBhZ2UgbG9hZHMgd2l0aG91dFxuICogc3RvcmluZyB0aGUgY29sb3VyIHNlcnZlci1zaWRlLlxuICpcbiAqIFVzZXMgYSBzaW1wbGUgaGFzaCAoZGpiMi1zdHlsZSkgdG8gbWFwIHRoZSBzZWVkIHRvIG9uZSBvZiBhIGN1cmF0ZWQgc2V0IG9mXG4gKiBhY2Nlc3NpYmxlLCBzYXR1cmF0ZWQgY29sb3VycyB0aGF0IGFsbCBwYXNzIFdDQUcgQUEgZm9yIHdoaXRlIHRleHQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlZWQgLSBBbnkgbm9uLWVtcHR5IHN0cmluZyAoZS5nLiB1c2VyIElEIG9yIGRpc3BsYXkgbmFtZSlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEEgQ1NTIGhleCBjb2xvdXIgc3RyaW5nIChlLmcuIGAnIzRGNDZFNSdgKVxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRBdmF0YXJDb2xvcignc3R1XzAwMScpICAgICAvLyBhbHdheXMgJyM0RjQ2RTUnXG4gKiBnZXRBdmF0YXJDb2xvcignQWxleCBKb2huc29uJykgLy8gY29uc2lzdGVudCBidXQgZGlmZmVyZW50IGZyb20gYWJvdmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEF2YXRhckNvbG9yKHNlZWQpIHtcbiAgICAvLyBDdXJhdGVkIHBhbGV0dGU6IGFsbCBwYXNzIFdDQUcgQUEgY29udHJhc3QgcmF0aW8gKFx1MjI2NSA0LjU6MSkgb24gd2hpdGUgdGV4dC5cbiAgICBjb25zdCBQQUxFVFRFID0gW1xuICAgICAgICAnIzRGNDZFNScsIC8vIGluZGlnb1xuICAgICAgICAnIzBFQTVFOScsIC8vIHNreSBibHVlXG4gICAgICAgICcjMTBCOTgxJywgLy8gZW1lcmFsZFxuICAgICAgICAnI0Y1OUUwQicsIC8vIGFtYmVyXG4gICAgICAgICcjRUY0NDQ0JywgLy8gcmVkXG4gICAgICAgICcjOEI1Q0Y2JywgLy8gdmlvbGV0XG4gICAgICAgICcjRUM0ODk5JywgLy8gcGlua1xuICAgICAgICAnIzE0QjhBNicsIC8vIHRlYWxcbiAgICAgICAgJyNGOTczMTYnLCAvLyBvcmFuZ2VcbiAgICAgICAgJyM2MzY2RjEnLCAvLyBwdXJwbGUtaW5kaWdvXG4gICAgXTtcblxuICAgIGlmICghc2VlZCB8fCB0eXBlb2Ygc2VlZCAhPT0gJ3N0cmluZycpIHJldHVybiBQQUxFVFRFWzBdO1xuXG4gICAgLy8gZGpiMi1zdHlsZSBoYXNoOiBmYXN0LCBzaW1wbGUsIGdvb2QgZGlzdHJpYnV0aW9uIGZvciBzaG9ydCBzdHJpbmdzLlxuICAgIGxldCBoYXNoID0gNTM4MTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaGFzaCA9IChoYXNoICogMzMpIF4gc2VlZC5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBoYXNoID0gaGFzaCA+Pj4gMDsgLy8ga2VlcCBpdCBhIHBvc2l0aXZlIDMyLWJpdCBpbnRlZ2VyXG4gICAgfVxuXG4gICAgcmV0dXJuIFBBTEVUVEVbaGFzaCAlIFBBTEVUVEUubGVuZ3RoXTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFRva2VuIGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgc3RvcmVkIGF1dGggdG9rZW4gaGFzIHBhc3NlZCBpdHMgZXhwaXJ5IHRpbWVzdGFtcC5cbiAqXG4gKiBGYWlsLXNlY3VyZTogcmV0dXJucyBgdHJ1ZWAgKHRyZWF0IGFzIGV4cGlyZWQpIHdoZW4gYGV4cGlyZXNBdGAgaXMgZmFsc3ksXG4gKiBub3QgYSBudW1iZXIsIG9yIGBOYU5gLiAgVGhpcyBtYXRjaGVzIHRoZSBzYW1lIGxvZ2ljIHVzZWQgaW5zaWRlXG4gKiBgQXV0aENvbnRleHQucmVzdG9yZVNlc3Npb24oKWAgc28gYmVoYXZpb3VyIGlzIGNvbnNpc3RlbnQgYWNyb3NzIGxheWVycy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZXhwaXJlc0F0IC0gVW5peCB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzIChmcm9tIHRva2VuIHBheWxvYWQpXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIHdoZW4gZXhwaXJlZCBvciBpbnZhbGlkOyBgZmFsc2VgIHdoZW4gc3RpbGwgdmFsaWRcbiAqXG4gKiBAZXhhbXBsZVxuICogaXNUb2tlbkV4cGlyZWQoRGF0ZS5ub3coKSArIDEwMDApIC8vIGZhbHNlIFx1MjAxNCBzdGlsbCB2YWxpZFxuICogaXNUb2tlbkV4cGlyZWQoRGF0ZS5ub3coKSAtIDEwMDApIC8vIHRydWUgIFx1MjAxNCBhbHJlYWR5IGV4cGlyZWRcbiAqIGlzVG9rZW5FeHBpcmVkKG51bGwpICAgICAgICAgICAgICAvLyB0cnVlICBcdTIwMTQgdHJlYXQgYXMgZXhwaXJlZCAoZmFpbC1zZWN1cmUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Rva2VuRXhwaXJlZChleHBpcmVzQXQpIHtcbiAgICBpZiAoIWV4cGlyZXNBdCB8fCB0eXBlb2YgZXhwaXJlc0F0ICE9PSAnbnVtYmVyJyB8fCBpc05hTihleHBpcmVzQXQpKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gRGF0ZS5ub3coKSA+IGV4cGlyZXNBdDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFJlZGlyZWN0IGhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogQ29uc3RydWN0cyB0aGUgbG9naW4gVVJMIHdpdGggYW4gZW5jb2RlZCBgcmVkaXJlY3RgIHF1ZXJ5IHBhcmFtZXRlciBzbyB0aGF0XG4gKiBhZnRlciBhIHN1Y2Nlc3NmdWwgbG9naW4gdGhlIHVzZXIgaXMgcmV0dXJuZWQgdG8gdGhlaXIgaW50ZW5kZWQgZGVzdGluYXRpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgcmVsYXRpdmUgcGF0aCB0byBlbmNvZGUgKGUuZy4gYCcvZGFzaGJvYXJkJ2ApXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZnVsbCBsb2dpbiBVUkwgd2l0aCByZWRpcmVjdCBwYXJhbVxuICogICAgICAgICAgICAgICAgICAgKGUuZy4gYCcvbG9naW4/cmVkaXJlY3Q9JTJGZGFzaGJvYXJkJ2ApXG4gKlxuICogQGV4YW1wbGVcbiAqIGJ1aWxkTG9naW5SZWRpcmVjdFVybCgnL2Rhc2hib2FyZCcpXG4gKiAvLyBcdTIxOTIgJy9sb2dpbj9yZWRpcmVjdD0lMkZkYXNoYm9hcmQnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZExvZ2luUmVkaXJlY3RVcmwocGF0aCkge1xuICAgIGNvbnN0IHNhbml0aXNlZCA9IHNhbml0aXplUGF0aChwYXRoKTtcbiAgICBpZiAoIXNhbml0aXNlZCkgcmV0dXJuIFJPVVRFUy5MT0dJTjtcbiAgICByZXR1cm4gYCR7Uk9VVEVTLkxPR0lOfT9yZWRpcmVjdD0ke2VuY29kZVVSSUNvbXBvbmVudChzYW5pdGlzZWQpfWA7XG59XG5cbi8qKlxuICogUGFyc2VzIHRoZSBgcmVkaXJlY3RgIHF1ZXJ5IHBhcmFtZXRlciBmcm9tIGEgVVJMIHNlYXJjaCBzdHJpbmcgYW5kIHJldHVybnNcbiAqIGl0IGFzIGEgZGVjb2RlZCBwYXRoLiAgRmFsbHMgYmFjayB0byBgUk9VVEVTLkRBU0hCT0FSRGAgd2hlbiB0aGUgcGFyYW1ldGVyXG4gKiBpcyBhYnNlbnQsIGVtcHR5LCBvciBpbnZhbGlkLlxuICpcbiAqIEFsd2F5cyBwYXNzZXMgdGhlIHJlc3VsdCB0aHJvdWdoIGBzYW5pdGl6ZVBhdGgoKWAgdG8gcHJldmVudCBvcGVuLXJlZGlyZWN0XG4gKiBhdHRhY2tzIHdoZXJlIGEgbWFsaWNpb3VzIGByZWRpcmVjdGAgdmFsdWUgcG9pbnRzIHRvIGFuIGV4dGVybmFsIGRvbWFpbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoU3RyaW5nIC0gVGhlIGBsb2NhdGlvbi5zZWFyY2hgIHN0cmluZyAoZS5nLiBgJz9yZWRpcmVjdD0lMkZkYXNoYm9hcmQnYClcbiAqIEByZXR1cm5zIHtzdHJpbmd9IERlY29kZWQgcmVsYXRpdmUgcGF0aCwgb3IgYCcvZGFzaGJvYXJkJ2AgYXMgZGVmYXVsdFxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRSZWRpcmVjdERlc3RpbmF0aW9uKCc/cmVkaXJlY3Q9JTJGZGFzaGJvYXJkJykgIC8vICcvZGFzaGJvYXJkJ1xuICogZ2V0UmVkaXJlY3REZXN0aW5hdGlvbignP3JlZGlyZWN0PWh0dHBzOi8vZXZpbC5jb20nKSAvLyAnL2Rhc2hib2FyZCcgKHNhbml0aXNlZClcbiAqIGdldFJlZGlyZWN0RGVzdGluYXRpb24oJycpICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAnL2Rhc2hib2FyZCdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJlZGlyZWN0RGVzdGluYXRpb24oc2VhcmNoU3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhzZWFyY2hTdHJpbmcpO1xuICAgICAgICBjb25zdCByYXcgPSBwYXJhbXMuZ2V0KCdyZWRpcmVjdCcpO1xuICAgICAgICByZXR1cm4gc2FuaXRpemVQYXRoKHJhdykgfHwgUk9VVEVTLkRBU0hCT0FSRDtcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIFJPVVRFUy5EQVNIQk9BUkQ7XG4gICAgfVxufVxuXG4vKipcbiAqIEVuc3VyZXMgYSByZWRpcmVjdCB0YXJnZXQgaXMgYSBzYWZlLCByZWxhdGl2ZSBwYXRoLlxuICpcbiAqIFJlamVjdHMgYWJzb2x1dGUgVVJMcyAoZS5nLiBgaHR0cHM6Ly9ldmlsLmNvbWApIGFuZCBwcm90b2NvbC1yZWxhdGl2ZSBVUkxzXG4gKiAoZS5nLiBgLy9ldmlsLmNvbWApIHRvIHByZXZlbnQgb3Blbi1yZWRpcmVjdCB2dWxuZXJhYmlsaXRpZXMuXG4gKiBSZXR1cm5zIGFuIGVtcHR5IHN0cmluZyB3aGVuIHRoZSBpbnB1dCBpcyBpbnZhbGlkLCB3aGljaCBjYWxsZXJzIHRyZWF0IGFzXG4gKiBcIm5vIHJlZGlyZWN0XCIgYW5kIGZhbGwgYmFjayB0byB0aGUgZGVmYXVsdCBkZXN0aW5hdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xudWxsfHVuZGVmaW5lZH0gcGF0aCAtIENhbmRpZGF0ZSByZWRpcmVjdCBwYXRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgc2FuaXRpc2VkIHBhdGgsIG9yIGAnJ2Agd2hlbiB1bnNhZmUvZW1wdHlcbiAqXG4gKiBAZXhhbXBsZVxuICogc2FuaXRpemVQYXRoKCcvZGFzaGJvYXJkJykgICAgICAgICAgLy8gJy9kYXNoYm9hcmQnXG4gKiBzYW5pdGl6ZVBhdGgoJ2h0dHBzOi8vZXZpbC5jb20nKSAgIC8vICcnXG4gKiBzYW5pdGl6ZVBhdGgoJy8vZXZpbC5jb20nKSAgICAgICAgIC8vICcnXG4gKiBzYW5pdGl6ZVBhdGgobnVsbCkgICAgICAgICAgICAgICAgICAvLyAnJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVQYXRoKHBhdGgpIHtcbiAgICBpZiAoIXBhdGggfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSByZXR1cm4gJyc7XG5cbiAgICBjb25zdCB0cmltbWVkID0gcGF0aC50cmltKCk7XG4gICAgaWYgKCF0cmltbWVkKSByZXR1cm4gJyc7XG5cbiAgICAvLyBSZWplY3QgYWJzb2x1dGUgVVJMcyAoY29udGFpbiBhIHNjaGVtZSBsaWtlIGh0dHA6Ly8gb3IgaHR0cHM6Ly8pXG4gICAgLy8gYW5kIHByb3RvY29sLXJlbGF0aXZlIFVSTHMgKHN0YXJ0IHdpdGggLy8pLlxuICAgIGlmICgvXlthLXpBLVpdW2EtekEtWjAtOStcXC0uXSo6Ly50ZXN0KHRyaW1tZWQpKSByZXR1cm4gJyc7XG4gICAgaWYgKHRyaW1tZWQuc3RhcnRzV2l0aCgnLy8nKSkgcmV0dXJuICcnO1xuXG4gICAgLy8gTXVzdCBzdGFydCB3aXRoICcvJyB0byBiZSBhIHZhbGlkIHJlbGF0aXZlIHBhdGguXG4gICAgaWYgKCF0cmltbWVkLnN0YXJ0c1dpdGgoJy8nKSkgcmV0dXJuICcnO1xuXG4gICAgcmV0dXJuIHRyaW1tZWQ7XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEF1dGhDb250ZXh0IFx1MjAxNCBHbG9iYWwgQXV0aGVudGljYXRpb24gU3RhdGUgTWFuYWdlci5cbiAqXG4gKiBTaW5nbGUgc291cmNlIG9mIHRydXRoIGZvciB0aGUgY3VycmVudCB1c2VyIHNlc3Npb24gYWNyb3NzIHRoZSBlbnRpcmVcbiAqIFN0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tpbmcgU2FhUyBhcHBsaWNhdGlvbi4gSW1wbGVtZW50cyB0aGUgT2JzZXJ2ZXJcbiAqIChQdWJsaXNoXHUyMDEzU3Vic2NyaWJlKSBwYXR0ZXJuIHNvIGFueSBtb2R1bGUgY2FuIHJlYWN0aXZlbHkgcmVzcG9uZCB0b1xuICogYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcyB3aXRob3V0IHRpZ2h0IGNvdXBsaW5nIG9yIHByb3AtZHJpbGxpbmcuXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIFJlc3BvbnNpYmlsaXR5IGJvdW5kYXJ5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBUaGlzIG1vZHVsZSBpcyBPTkxZIHJlc3BvbnNpYmxlIGZvcjpcbiAqICAgICBcdTIwMjIgSG9sZGluZyBhbmQgdXBkYXRpbmcgdGhlIGF1dGhlbnRpY2F0aW9uIHN0YXRlIG9iamVjdFxuICogICAgIFx1MjAyMiBOb3RpZnlpbmcgcmVnaXN0ZXJlZCBzdWJzY3JpYmVycyBvbiBldmVyeSBzdGF0ZSBjaGFuZ2VcbiAqICAgICBcdTIwMjIgU3RydWN0dXJpbmcgdGhlIGxvZ2luIC8gbG9nb3V0IHN0YXRlIHRyYW5zaXRpb25zXG4gKlxuICogICBJdCBpcyBOT1QgcmVzcG9uc2libGUgZm9yOlxuICogICAgIFx1MjAyMiBNYWtpbmcgSFRUUCByZXF1ZXN0cyAgICAgICAgICBcdTIxOTIgYXV0aEFwaS5qc1xuICogICAgIFx1MjAyMiBMb3ctbGV2ZWwgc3RvcmFnZSBhYnN0cmFjdGlvbiBcdTIxOTIgYXV0aFN0b3JhZ2UuanNcbiAqICAgICBcdTIwMjIgQ2xpZW50LXNpZGUgcm91dGluZyAgICAgICAgICAgXHUyMTkyIHJvdXRlci9ndWFyZHMuanNcbiAqICAgICBcdTIwMjIgUmVuZGVyaW5nIGFueSBVSSAgICAgICAgICAgICAgXHUyMTkyIExvZ2luRm9ybS5qc1xuICogICAgIFx1MjAyMiBEaXNwbGF5aW5nIHRvYXN0IG1lc3NhZ2VzICAgICBcdTIxOTIgVG9hc3QuanNcbiAqXG4gKiBAbW9kdWxlIGNvbnRleHQvQXV0aENvbnRleHRcbiAqL1xuXG5pbXBvcnQgeyBFTlYgfSBmcm9tICcuLi9jb25maWcvZW52LmpzJztcbmltcG9ydCAqIGFzIGF1dGhBcGkgZnJvbSAnLi4vc2VydmljZXMvYXV0aEFwaS5qcyc7XG5pbXBvcnQgeyBzYXZlQXV0aFRva2VuLCBnZXRBdXRoVG9rZW4sIGNsZWFyQXV0aFRva2VuIH0gZnJvbSAnLi4vc2VydmljZXMvYXV0aFN0b3JhZ2UuanMnO1xuaW1wb3J0IHsgaXNUb2tlbkV4cGlyZWQgfSBmcm9tICcuLi91dGlscy9hdXRoSGVscGVycy5qcyc7XG5pbXBvcnQgeyBFUlJPUl9DT0RFUywgUk9VVEVTIH0gZnJvbSAnLi4vdXRpbHMvY29uc3RhbnRzLmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFByaXZhdGUgaGVscGVyIGZ1bmN0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBDb252ZXJ0cyBhbnkgY2F1Z2h0IHZhbHVlIGludG8gYSBub3JtYWxpc2VkIGVycm9yIG9iamVjdCB0aGF0IGlzIHNhZmUgdG9cbiAqIHN0b3JlIGluIHN0YXRlIGFuZCBkaXNwbGF5IHRvIHRoZSB1c2VyLlxuICpcbiAqIE5vcm1hbGlzYXRpb24gcnVsZXMgKGNoZWNrZWQgaW4gb3JkZXIpOlxuICogICAxLiBJZiB0aGUgdmFsdWUgYWxyZWFkeSBoYXMgYSBgY29kZWAgcHJvcGVydHksIGl0IHdhcyB0aHJvd24gaW50ZW50aW9uYWxseVxuICogICAgICBieSBhIHNlcnZpY2UgbGF5ZXIgKGUuZy4gYXV0aEFwaSkgXHUyMDE0IHJldHVybiBpdCBhcy1pcy5cbiAqICAgMi4gSWYgdGhlIHZhbHVlIGlzIGEgbmF0aXZlIEVycm9yLCB1c2UgRXJyb3IubWVzc2FnZS5cbiAqICAgMy4gSWYgdGhlIHZhbHVlIGlzIGEgcGxhaW4gc3RyaW5nLCB1c2UgaXQgZGlyZWN0bHkuXG4gKiAgIDQuIE90aGVyd2lzZSwgdXNlIHRoZSBwcm92aWRlZCBmYWxsYmFjayBtZXNzYWdlIGFuZCBFUlJPUl9DT0RFUy5VTktOT1dOLlxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gZXJyICAgICAgLSBUaGUgcmF3IGNhdWdodCB2YWx1ZSAobWF5IGJlIGFueXRoaW5nKVxuICogQHBhcmFtIHtzdHJpbmd9ICBmYWxsYmFjayAtIEh1bWFuLXJlYWRhYmxlIG1lc3NhZ2UgdXNlZCB3aGVuIHRoZSBlcnJvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVzIG5vIHVzZWZ1bCBpbmZvcm1hdGlvblxuICogQHJldHVybnMge3sgY29kZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcgfX0gQSBub3JtYWxpc2VkIGVycm9yIGRlc2NyaXB0b3JcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXNlRXJyb3IoZXJyLCBmYWxsYmFjaykge1xuICAgIGlmIChlcnIgJiYgdHlwZW9mIGVyciA9PT0gJ29iamVjdCcgJiYgJ2NvZGUnIGluIGVycikge1xuICAgICAgICByZXR1cm4gLyoqIEB0eXBlIHt7IGNvZGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH19ICovIChlcnIpO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogdHlwZW9mIGVyciA9PT0gJ3N0cmluZycgPyBlcnIgOiBmYWxsYmFjaztcbiAgICByZXR1cm4geyBjb2RlOiBFUlJPUl9DT0RFUy5VTktOT1dOLCBtZXNzYWdlIH07XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBUeXBlIGRlZmluaXRpb25zIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFNoYXBlIG9mIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgb2JqZWN0IHJldHVybmVkIGJ5IHRoZSBBUEkgYW5kIHN0b3JlZFxuICogaW4gQXV0aENvbnRleHQgc3RhdGUuXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gQXV0aFVzZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGlkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBuYW1lXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBlbWFpbFxuICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gW2F2YXRhclVybF1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIFtzdHVkZW50SWRdXG4gKi9cblxuLyoqXG4gKiBUaGUgY29tcGxldGUgYXV0aGVudGljYXRpb24gc3RhdGUgb2JqZWN0IG1hbmFnZWQgYnkgQXV0aENvbnRleHQuXG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gQXV0aFN0YXRlXG4gKiBAcHJvcGVydHkge0F1dGhVc2VyfG51bGx9ICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9ICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzTG9hZGluZ1xuICogQHByb3BlcnR5IHt7IGNvZGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH18bnVsbH0gZXJyb3JcbiAqL1xuXG4vKipcbiAqIENyZWRlbnRpYWxzIHN1Ym1pdHRlZCBieSB0aGUgdXNlciBvbiB0aGUgbG9naW4gZm9ybS5cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBMb2dpbkNyZWRlbnRpYWxzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gIGVtYWlsXG4gKiBAcHJvcGVydHkge3N0cmluZ30gIHBhc3N3b3JkXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtyZW1lbWJlck1lXVxuICovXG5cbi8qKlxuICogVGhlIHZhbHVlIHJldHVybmVkIGJ5IEF1dGhDb250ZXh0LmxvZ2luKCkgcmVnYXJkbGVzcyBvZiBvdXRjb21lLlxuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvZ2luUmVzdWx0XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgc3VjY2Vzc1xuICogQHByb3BlcnR5IHtBdXRoVXNlcn0gIFt1c2VyXVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgIFtlcnJvcl1cbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgSW5pdGlhbCBzdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIEB0eXBlIHtBdXRoU3RhdGV9ICovXG5jb25zdCBJTklUSUFMX1NUQVRFID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgdXNlcjogbnVsbCxcbiAgICB0b2tlbjogbnVsbCxcbiAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLFxuICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICBlcnJvcjogbnVsbCxcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgQXV0aENvbnRleHQgc2luZ2xldG9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIEF1dGhDb250ZXh0IFx1MjAxNCB0aGUgYXBwbGljYXRpb24ncyBhdXRoZW50aWNhdGlvbiBzdGF0ZSBtYW5hZ2VyLlxuICpcbiAqIEBuYW1lc3BhY2UgQXV0aENvbnRleHRcbiAqL1xuY29uc3QgQXV0aENvbnRleHQgPSAoKCkgPT4ge1xuICAgIC8qKiBAdHlwZSB7QXV0aFN0YXRlfSAqL1xuICAgIGxldCBfc3RhdGUgPSB7IC4uLklOSVRJQUxfU1RBVEUgfTtcblxuICAgIC8qKiBAdHlwZSB7U2V0PChzdGF0ZTogQXV0aFN0YXRlKSA9PiB2b2lkPn0gKi9cbiAgICBjb25zdCBfc3Vic2NyaWJlcnMgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayB0byByZWNlaXZlIGZyb3plbiBzdGF0ZSBzbmFwc2hvdHMgd2hlbmV2ZXIgdGhlXG4gICAgICogYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KHN0YXRlOiBBdXRoU3RhdGUpID0+IHZvaWR9IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMgeygpID0+IHZvaWR9XG4gICAgICovXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAnW0F1dGhDb250ZXh0XSBzdWJzY3JpYmUoKSBleHBlY3RzIGEgZnVuY3Rpb24sIHJlY2VpdmVkOicsXG4gICAgICAgICAgICAgICAgdHlwZW9mIGNhbGxiYWNrXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHt9O1xuICAgICAgICB9XG4gICAgICAgIF9zdWJzY3JpYmVycy5hZGQoY2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gKCkgPT4gdW5zdWJzY3JpYmUoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBjYWxsYmFjayBmcm9tIHRoZSBzdWJzY3JpYmVyIHJlZ2lzdHJ5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHsoc3RhdGU6IEF1dGhTdGF0ZSkgPT4gdm9pZH0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bnN1YnNjcmliZShjYWxsYmFjaykge1xuICAgICAgICBfc3Vic2NyaWJlcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxpdmVycyBhIGZyb3plbiBzbmFwc2hvdCBvZiB0aGUgY3VycmVudCBzdGF0ZSB0byBldmVyeSByZWdpc3RlcmVkIHN1YnNjcmliZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBub3RpZnkoKSB7XG4gICAgICAgIGNvbnN0IHNuYXBzaG90ID0gT2JqZWN0LmZyZWV6ZSh7IC4uLl9zdGF0ZSB9KTtcbiAgICAgICAgX3N1YnNjcmliZXJzLmZvckVhY2goY2FsbGJhY2sgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhzbmFwc2hvdCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbQXV0aENvbnRleHRdIEEgc3Vic2NyaWJlciB0aHJldyBhbiBlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb25seSBwZXJtaXR0ZWQgd2F5IHRvIHVwZGF0ZSBhdXRoZW50aWNhdGlvbiBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGFydGlhbDxBdXRoU3RhdGU+fSBwYXJ0aWFsU3RhdGVcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRTdGF0ZShwYXJ0aWFsU3RhdGUpIHtcbiAgICAgICAgX3N0YXRlID0geyAuLi5fc3RhdGUsIC4uLnBhcnRpYWxTdGF0ZSB9O1xuICAgICAgICBub3RpZnkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnJvemVuLCBvbmUtdGltZSBzbmFwc2hvdCBvZiB0aGUgY3VycmVudCBhdXRoZW50aWNhdGlvbiBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtSZWFkb25seTxBdXRoU3RhdGU+fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh7IC4uLl9zdGF0ZSB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byByZXN0b3JlIGEgcHJldmlvdXMgYXV0aGVudGljYXRpb24gc2Vzc2lvbiBmcm9tIGF1dGhTdG9yYWdlLlxuICAgICAqIE11c3QgYmUgY2FsbGVkIG9uY2UgZHVyaW5nIGFwcGxpY2F0aW9uIGJvb3RzdHJhcC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICAgICAqL1xuICAgIGFzeW5jIGZ1bmN0aW9uIHJlc3RvcmVTZXNzaW9uKCkge1xuICAgICAgICBzZXRTdGF0ZSh7IGlzTG9hZGluZzogdHJ1ZSwgZXJyb3I6IG51bGwgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN0b3JlZCA9IGdldEF1dGhUb2tlbigpO1xuXG4gICAgICAgICAgICBpZiAoIXN0b3JlZCkge1xuICAgICAgICAgICAgICAgIGlmIChFTlYuRU5BQkxFX01PQ0tfQVBJKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vY2tVc2VyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdtb2NrLTAwMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnU2FpIFNoZW5kZ2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6ICdzYWlAZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2NrVG9rZW4gPSAnbW9jay1qd3QtdG9rZW4tZGV2JztcbiAgICAgICAgICAgICAgICAgICAgc2F2ZUF1dGhUb2tlbih7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbjogbW9ja1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwaXJlc0F0OiBEYXRlLm5vdygpICsgODY0MDAwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBtb2NrVXNlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWVtYmVyTWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBtb2NrVXNlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBtb2NrVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdG9rZW4sIGV4cGlyZXNBdCwgdXNlciB9ID0gc3RvcmVkO1xuXG4gICAgICAgICAgICBpZiAoIXRva2VuIHx8ICF1c2VyIHx8IHR5cGVvZiB1c2VyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgJ1tBdXRoQ29udGV4dF0gTWFsZm9ybWVkIHNlc3Npb24gcGF5bG9hZCBmb3VuZCBpbiBzdG9yYWdlIFx1MjAxNCBjbGVhcmluZy4nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjbGVhckF1dGhUb2tlbigpO1xuICAgICAgICAgICAgICAgIHNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1Rva2VuRXhwaXJlZChleHBpcmVzQXQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdbQXV0aENvbnRleHRdIFN0b3JlZCB0b2tlbiBoYXMgZXhwaXJlZCBcdTIwMTQgY2xlYXJpbmcgc2Vzc2lvbi4nKTtcbiAgICAgICAgICAgICAgICBjbGVhckF1dGhUb2tlbigpO1xuICAgICAgICAgICAgICAgIHNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICB1c2VyLFxuICAgICAgICAgICAgICAgIHRva2VuLFxuICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghRU5WLkVOQUJMRV9BTkFMWVRJQ1MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tBdXRoQ29udGV4dF0gU2Vzc2lvbiByZXN0b3JlZCBmb3IgdXNlciBJRDonLCB1c2VyLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbQXV0aENvbnRleHRdIHJlc3RvcmVTZXNzaW9uKCkgZW5jb3VudGVyZWQgYW4gdW5leHBlY3RlZCBlcnJvcjonLCBlcnIpO1xuICAgICAgICAgICAgY2xlYXJBdXRoVG9rZW4oKTtcbiAgICAgICAgICAgIHNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSwgZXJyb3I6IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzZXMgYSBsb2dpbiBhdHRlbXB0IHVzaW5nIHRoZSBhdXRoQXBpIHNlcnZpY2UgYW5kIHVwZGF0ZXMgdGhlIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtMb2dpbkNyZWRlbnRpYWxzfSBjcmVkZW50aWFsc1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPExvZ2luUmVzdWx0Pn1cbiAgICAgKi9cbiAgICBhc3luYyBmdW5jdGlvbiBsb2dpbihjcmVkZW50aWFscykge1xuICAgICAgICBzZXRTdGF0ZSh7IGlzTG9hZGluZzogdHJ1ZSwgZXJyb3I6IG51bGwgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGF1dGhSZXNwb25zZSA9IGF3YWl0IGF1dGhBcGkubG9naW4oY3JlZGVudGlhbHMpO1xuICAgICAgICAgICAgY29uc3QgeyB0b2tlbiwgZXhwaXJlc0F0LCB1c2VyIH0gPSBhdXRoUmVzcG9uc2U7XG5cbiAgICAgICAgICAgIGlmICghdG9rZW4gfHwgIXVzZXIgfHwgIWV4cGlyZXNBdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgJ0F1dGggcmVzcG9uc2UgaXMgbWlzc2luZyByZXF1aXJlZCBmaWVsZHM6IHRva2VuLCBleHBpcmVzQXQsIHVzZXIuJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbWVtYmVyTWUgPSBjcmVkZW50aWFscy5yZW1lbWJlck1lID09PSB0cnVlO1xuICAgICAgICAgICAgc2F2ZUF1dGhUb2tlbih7IHRva2VuLCBleHBpcmVzQXQsIHVzZXIsIHJlbWVtYmVyTWUgfSk7XG5cbiAgICAgICAgICAgIHNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICB1c2VyLFxuICAgICAgICAgICAgICAgIHRva2VuLFxuICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHVzZXIgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zdCBub3JtYWxpc2VkRXJyb3IgPSBub3JtYWxpc2VFcnJvcihlcnIsICdMb2dpbiBmYWlsZWQuIFBsZWFzZSB0cnkgYWdhaW4uJyk7XG4gICAgICAgICAgICBzZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbm9ybWFsaXNlZEVycm9yLFxuICAgICAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdXNlcjogbnVsbCxcbiAgICAgICAgICAgICAgICB0b2tlbjogbnVsbCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBub3JtYWxpc2VkRXJyb3IubWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW5kcyB0aGUgY3VycmVudCB1c2VyIHNlc3Npb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgIGNsZWFyQXV0aFRva2VuKCk7XG5cbiAgICAgICAgc2V0U3RhdGUoe1xuICAgICAgICAgICAgdXNlcjogbnVsbCxcbiAgICAgICAgICAgIHRva2VuOiBudWxsLFxuICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS53YXJuKGBbQXV0aENvbnRleHRdIFNlc3Npb24gZW5kZWQuIE5hdmlnYXRlIHRvICR7Uk9VVEVTLkxPR0lOfSB2aWEgdGhlIHJvdXRlci5gKTtcbiAgICB9XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGdsb2JhbCB1bmF1dGhvcml6ZWQgZXZlbnRzIChlLmcuLCBmcm9tIGFwaS5qcylcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYXV0aDp1bmF1dGhvcml6ZWQnLCAoKSA9PiB7XG4gICAgICAgIGlmIChfc3RhdGUuaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1tBdXRoQ29udGV4dF0gNDAxIFVuYXV0aG9yaXplZCBkZXRlY3RlZCBnbG9iYWxseS4gTG9nZ2luZyBvdXQuJyk7XG4gICAgICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3Vic2NyaWJlLFxuICAgICAgICB1bnN1YnNjcmliZSxcbiAgICAgICAgbm90aWZ5LFxuICAgICAgICBnZXRTdGF0ZSxcbiAgICAgICAgc2V0U3RhdGUsXG4gICAgICAgIHJlc3RvcmVTZXNzaW9uLFxuICAgICAgICBsb2dpbixcbiAgICAgICAgbG9nb3V0LFxuICAgICAgICBjbGVhclN0b3JhZ2U6IGNsZWFyQXV0aFRva2VuLFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBBdXRoQ29udGV4dDtcbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgRm9ybSBWYWxpZGF0aW9uIFV0aWxpdGllcyBcdTIwMTQgUGFydCAzLlxuICpcbiAqIFB1cmUsIHN5bmNocm9ub3VzLCBzdGF0ZWxlc3MgdmFsaWRhdGlvbiBmdW5jdGlvbnMuXG4gKiBObyBzaWRlIGVmZmVjdHMsIG5vIERPTSBhY2Nlc3MsIG5vIGFzeW5jIG9wZXJhdGlvbnMuXG4gKlxuICogVXNlZCBieSBMb2dpbkZvcm0gYW5kIGFueSBmdXR1cmUgZm9ybSBjb21wb25lbnQgdGhhdCBuZWVkc1xuICogY2xpZW50LXNpZGUgdmFsaWRhdGlvbiB3aXRoIFdDQUcgQUEtY29tcGxpYW50IGVycm9yIG1lc3NhZ2VzLlxuICpcbiAqIEVycm9yIG1lc3NhZ2Ugc3R5bGUgZ3VpZGU6XG4gKiAtIENvbmNpc2UgYW5kIGFjdGlvbmFibGUgKFwiRW50ZXIgYSB2YWxpZCBlbWFpbFwiIG5vdCBcIkludmFsaWQgZW1haWxcIilcbiAqIC0gTm90IGNvbG91ci1kZXBlbmRlbnQgXHUyMDE0IGFsd2F5cyBhY2NvbXBhbmllZCBieSB0ZXh0IChGUi1FUlItMDExKVxuICogLSBTdGFydHMgd2l0aCBhIGNhcGl0YWwgbGV0dGVyOyBubyB0cmFpbGluZyBwZXJpb2RcbiAqXG4gKiBAbW9kdWxlIHV0aWxzL3ZhbGlkYXRpb25cbiAqL1xuXG5pbXBvcnQgeyBBVVRIX0NPTlNUQU5UUyB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFJlZ2V4IGNvbnN0YW50cyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBSRkMgNTMyMi1zaW1wbGlmaWVkIGVtYWlsIHBhdHRlcm4uXG4gKiBWYWxpZGF0ZXMgdGhlIGNvbW1vbiBjYXNlcyB3aGlsZSBrZWVwaW5nIHRoZSByZWdleCByZWFkYWJsZS5cbiAqIERvZXMgbm90IHZhbGlkYXRlIGZ1bGwgUkZDIGNvbXBsaWFuY2UgKGUuZy4gcXVvdGVkIHN0cmluZ3MsIElQIGxpdGVyYWxzKVxuICogc2luY2UgdGhvc2UgYXJlIHJhcmVseSBlbmNvdW50ZXJlZCBpbiByZWFsLXdvcmxkIGFwcGxpY2F0aW9ucy5cbiAqXG4gKiBAdHlwZSB7UmVnRXhwfVxuICovXG5jb25zdCBFTUFJTF9SRUdFWCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgSW5kaXZpZHVhbCBmaWVsZCB2YWxpZGF0b3JzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIFZhbGlkYXRlcyBhbiBlbWFpbCBhZGRyZXNzIGZpZWxkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfHVuZGVmaW5lZHxudWxsfSB2YWx1ZSAtIFRoZSByYXcgaW5wdXQgdmFsdWVcbiAqIEByZXR1cm5zIHtzdHJpbmd8bnVsbH0gQW4gZXJyb3IgbWVzc2FnZSBzdHJpbmcsIG9yIGBudWxsYCB3aGVuIHZhbGlkXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhbGlkYXRlRW1haWwoJycpICAgICAgICAgICAgICAgICAgICAvLyAnRW1haWwgaXMgcmVxdWlyZWQnXG4gKiB2YWxpZGF0ZUVtYWlsKCdub3QtYW4tZW1haWwnKSAgICAgICAgLy8gJ0VudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcydcbiAqIHZhbGlkYXRlRW1haWwoJ3N0dWRlbnRAZGVtby5jb20nKSAgICAvLyBudWxsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsKHZhbHVlKSB7XG4gICAgY29uc3QgdHJpbW1lZCA9ICh2YWx1ZSA/PyAnJykudHJpbSgpO1xuXG4gICAgaWYgKCF0cmltbWVkKSB7XG4gICAgICAgIHJldHVybiAnRW1haWwgaXMgcmVxdWlyZWQnO1xuICAgIH1cblxuICAgIGlmICghRU1BSUxfUkVHRVgudGVzdCh0cmltbWVkKSkge1xuICAgICAgICByZXR1cm4gJ0VudGVyIGEgdmFsaWQgZW1haWwgYWRkcmVzcyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogVmFsaWRhdGVzIGEgcGFzc3dvcmQgZmllbGQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8dW5kZWZpbmVkfG51bGx9IHZhbHVlIC0gVGhlIHJhdyBpbnB1dCB2YWx1ZVxuICogQHJldHVybnMge3N0cmluZ3xudWxsfSBBbiBlcnJvciBtZXNzYWdlIHN0cmluZywgb3IgYG51bGxgIHdoZW4gdmFsaWRcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFsaWRhdGVQYXNzd29yZCgnJykgICAgICAgICAvLyAnUGFzc3dvcmQgaXMgcmVxdWlyZWQnXG4gKiB2YWxpZGF0ZVBhc3N3b3JkKCdhYmMnKSAgICAgIC8vICdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycydcbiAqIHZhbGlkYXRlUGFzc3dvcmQoJ2RlbW8xMjMnKSAgLy8gbnVsbFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZCh2YWx1ZSkge1xuICAgIGNvbnN0IHJhdyA9IHZhbHVlID8/ICcnO1xuXG4gICAgaWYgKCFyYXcpIHtcbiAgICAgICAgcmV0dXJuICdQYXNzd29yZCBpcyByZXF1aXJlZCc7XG4gICAgfVxuXG4gICAgaWYgKHJhdy5sZW5ndGggPCBBVVRIX0NPTlNUQU5UUy5NSU5fUEFTU1dPUkRfTEVOR1RIKSB7XG4gICAgICAgIHJldHVybiBgUGFzc3dvcmQgbXVzdCBiZSBhdCBsZWFzdCAke0FVVEhfQ09OU1RBTlRTLk1JTl9QQVNTV09SRF9MRU5HVEh9IGNoYXJhY3RlcnNgO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRm9ybS1sZXZlbCB2YWxpZGF0b3IgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKlxuICogVmFsaWRhdGVzIHRoZSBlbnRpcmUgbG9naW4gZm9ybSBieSBydW5uaW5nIGJvdGggZmllbGQgdmFsaWRhdG9ycy5cbiAqXG4gKiBSZXR1cm5zIGBudWxsYCB3aGVuIGV2ZXJ5IGZpZWxkIGlzIHZhbGlkIChubyBlcnJvcnMpLlxuICogUmV0dXJucyBhbiBgZXJyb3JzYCBvYmplY3Qgd2hlbiBvbmUgb3IgbW9yZSBmaWVsZHMgYXJlIGludmFsaWQuXG4gKlxuICogVGhlIHJldHVybmVkIG9iamVjdCBhbHdheXMgY29udGFpbnMgYm90aCBrZXlzIHNvIHRoYXQgdGhlIGNhbGxpbmdcbiAqIGNvbXBvbmVudCBjYW4gcmVhZCBgZXJyb3JzLmVtYWlsYCBhbmQgYGVycm9ycy5wYXNzd29yZGAgdW5jb25kaXRpb25hbGx5XG4gKiB3aXRob3V0IGd1YXJkIGNoZWNrcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICAgZm9ybSAgICAgICAgICAtIEZvcm0gdmFsdWVzIHRvIHZhbGlkYXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgZm9ybS5lbWFpbCAgICAtIEVtYWlsIGZpZWxkIHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgZm9ybS5wYXNzd29yZCAtIFBhc3N3b3JkIGZpZWxkIHZhbHVlXG4gKiBAcmV0dXJucyB7eyBlbWFpbDogc3RyaW5nfG51bGwsIHBhc3N3b3JkOiBzdHJpbmd8bnVsbCB9fG51bGx9XG4gKiAgIGBudWxsYCB3aGVuIHZhbGlkOyBlcnJvciBvYmplY3Qgd2hlbiBpbnZhbGlkXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhbGlkYXRlTG9naW5Gb3JtKHsgZW1haWw6ICcnLCBwYXNzd29yZDogJycgfSlcbiAqIC8vIHsgZW1haWw6ICdFbWFpbCBpcyByZXF1aXJlZCcsIHBhc3N3b3JkOiAnUGFzc3dvcmQgaXMgcmVxdWlyZWQnIH1cbiAqXG4gKiB2YWxpZGF0ZUxvZ2luRm9ybSh7IGVtYWlsOiAnc3R1ZGVudEBkZW1vLmNvbScsIHBhc3N3b3JkOiAnZGVtbzEyMycgfSlcbiAqIC8vIG51bGxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlTG9naW5Gb3JtKHsgZW1haWwsIHBhc3N3b3JkIH0pIHtcbiAgICBjb25zdCBlcnJvcnMgPSB7XG4gICAgICAgIGVtYWlsOiB2YWxpZGF0ZUVtYWlsKGVtYWlsKSxcbiAgICAgICAgcGFzc3dvcmQ6IHZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpLFxuICAgIH07XG5cbiAgICAvLyBSZXR1cm4gbnVsbCB3aGVuIGV2ZXJ5IHZhbHVlIGlzIG51bGwgKGFsbCBmaWVsZHMgdmFsaWQpLlxuICAgIHJldHVybiBpc0Zvcm1WYWxpZChlcnJvcnMpID8gbnVsbCA6IGVycm9ycztcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIEhlbHBlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhbGwgdmFsdWVzIGluIGFuIGVycm9ycyBvYmplY3QgYXJlIGBudWxsYC5cbiAqIEEgYG51bGxgIHZhbHVlIG1lYW5zIHRoZSBjb3JyZXNwb25kaW5nIGZpZWxkIHBhc3NlZCB2YWxpZGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgc3RyaW5nfG51bGw+fSBlcnJvcnMgLSBUaGUgZXJyb3JzIG9iamVjdCB0byBpbnNwZWN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIHdoZW4gZXZlcnkgZmllbGQgaXMgdmFsaWQ7IGBmYWxzZWAgb3RoZXJ3aXNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGlzRm9ybVZhbGlkKHsgZW1haWw6IG51bGwsIHBhc3N3b3JkOiBudWxsIH0pICAgICAvLyB0cnVlXG4gKiBpc0Zvcm1WYWxpZCh7IGVtYWlsOiAnUmVxdWlyZWQnLCBwYXNzd29yZDogbnVsbCB9KSAvLyBmYWxzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGb3JtVmFsaWQoZXJyb3JzKSB7XG4gICAgaWYgKCFlcnJvcnMgfHwgdHlwZW9mIGVycm9ycyAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhlcnJvcnMpLmV2ZXJ5KHYgPT4gdiA9PT0gbnVsbCk7XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFNwaW5uZXIgXHUyMDE0IEFjY2Vzc2libGUgTG9hZGluZyBJbmRpY2F0b3IgXHUyMDE0IFBhcnQgMyAvIFBhcnQgMTAuXG4gKlxuICogUmVuZGVycyBhIENTUy1hbmltYXRlZCBzcGlubmVyIGluc2lkZSBhbnkgRE9NIGNvbnRhaW5lci5cbiAqIFVzZWQgYnkgQnV0dG9uIChsb2FkaW5nIHN0YXRlKSBhbmQgYXMgYSBzdGFuZGFsb25lIHBhZ2Uvc2VjdGlvbiBpbmRpY2F0b3IuXG4gKlxuICogQG1vZHVsZSBjb21wb25lbnRzL3VpL1NwaW5uZXJcbiAqL1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgU2l6ZSBtYXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbi8qKiBAdHlwZSB7UmVjb3JkPHN0cmluZywgeyBzaXplOiBudW1iZXIsIHN0cm9rZTogbnVtYmVyIH0+fSAqL1xuY29uc3QgU0laRV9NQVAgPSB7XG4gICAgc206IHsgc2l6ZTogMTYsIHN0cm9rZTogMiB9LFxuICAgIG1kOiB7IHNpemU6IDI0LCBzdHJva2U6IDIuNSB9LFxuICAgIGxnOiB7IHNpemU6IDQwLCBzdHJva2U6IDMgfSxcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBGYWN0b3J5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYWNjZXNzaWJsZSBTVkcgc3Bpbm5lciBlbGVtZW50LlxuICpcbiAqIFRoZSBzcGlubmVyIHJlc3BlY3RzIGBwcmVmZXJzLXJlZHVjZWQtbW90aW9uYDogd2hlbiB0aGUgdXNlciBoYXMgcmVxdWVzdGVkXG4gKiByZWR1Y2VkIG1vdGlvbiwgdGhlIGFuaW1hdGlvbiBpcyBwYXVzZWQgdmlhIENTUyAoaGFuZGxlZCBpbiBgbWFpbi5jc3NgIFx1MjAxNFxuICogYEBtZWRpYSAocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKSB7IC5zcGlubmVyIHsgYW5pbWF0aW9uOiBub25lIH0gfWApLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgW29wdHM9e31dICAgICAgICAgICAgICAtIENvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICogQHBhcmFtIHsnc20nfCdtZCd8J2xnJ30gW29wdHMuc2l6ZT0nbWQnXSAtIFZpc3VhbCBzaXplIHZhcmlhbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSAgW29wdHMubGFiZWw9J0xvYWRpbmcnXSAtIEFSSUEgbGFiZWwgZm9yIHNjcmVlbiByZWFkZXJzXG4gKiBAcGFyYW0ge3N0cmluZ30gIFtvcHRzLmNvbG9yPSdjdXJyZW50Q29sb3InXSAtIFNWRyBzdHJva2UgY29sb3VyXG4gKiBAcGFyYW0ge3N0cmluZ30gIFtvcHRzLmNsYXNzTmFtZT0nJ10gICAtIEV4dHJhIENTUyBjbGFzc2VzIG9uIHRoZSB3cmFwcGVyXG4gKiBAcmV0dXJucyB7U1ZHRWxlbWVudH0gVGhlIHNwaW5uZXIgU1ZHIGVsZW1lbnQsIHJlYWR5IHRvIGluc2VydCBpbnRvIHRoZSBET01cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgc3Bpbm5lciA9IGNyZWF0ZVNwaW5uZXIoeyBzaXplOiAnc20nLCBsYWJlbDogJ1NpZ25pbmcgaW5cdTIwMjYnIH0pO1xuICogYnV0dG9uRWwuYXBwZW5kKHNwaW5uZXIpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3Bpbm5lcih7XG4gICAgc2l6ZSA9ICdtZCcsXG4gICAgbGFiZWwgPSAnTG9hZGluZycsXG4gICAgY29sb3IgPSAnY3VycmVudENvbG9yJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbn0gPSB7fSkge1xuICAgIGNvbnN0IHsgc2l6ZTogcHgsIHN0cm9rZSB9ID0gU0laRV9NQVBbc2l6ZV0gPz8gU0laRV9NQVAubWQ7XG4gICAgY29uc3QgciA9IChweCAtIHN0cm9rZSkgLyAyOyAvLyByYWRpdXMgbGVhdmluZyByb29tIGZvciBzdHJva2VcbiAgICBjb25zdCBjeCA9IHB4IC8gMjtcblxuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgc3Bpbm5lciBzcGlubmVyLS0ke3NpemV9JHtjbGFzc05hbWUgPyBgICR7Y2xhc3NOYW1lfWAgOiAnJ31gKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIFN0cmluZyhweCkpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIFN0cmluZyhweCkpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7cHh9ICR7cHh9YCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnZmlsbCcsICdub25lJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAncG9saXRlJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGxhYmVsKTtcblxuICAgIC8vIFRyYWNrIGNpcmNsZSAoYmFja2dyb3VuZClcbiAgICBjb25zdCB0cmFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnY2lyY2xlJyk7XG4gICAgdHJhY2suc2V0QXR0cmlidXRlKCdjeCcsIFN0cmluZyhjeCkpO1xuICAgIHRyYWNrLnNldEF0dHJpYnV0ZSgnY3knLCBTdHJpbmcoY3gpKTtcbiAgICB0cmFjay5zZXRBdHRyaWJ1dGUoJ3InLCBTdHJpbmcocikpO1xuICAgIHRyYWNrLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgY29sb3IpO1xuICAgIHRyYWNrLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJywgU3RyaW5nKHN0cm9rZSkpO1xuICAgIHRyYWNrLnNldEF0dHJpYnV0ZSgnb3BhY2l0eScsICcwLjInKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQodHJhY2spO1xuXG4gICAgLy8gQW5pbWF0ZWQgYXJjXG4gICAgY29uc3QgYXJjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdjaXJjbGUnKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdzcGlubmVyX19hcmMnKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdjeCcsIFN0cmluZyhjeCkpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ2N5JywgU3RyaW5nKGN4KSk7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgncicsIFN0cmluZyhyKSk7XG4gICAgYXJjLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgY29sb3IpO1xuICAgIGFyYy5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcsIFN0cmluZyhzdHJva2UpKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdzdHJva2UtbGluZWNhcCcsICdyb3VuZCcpO1xuXG4gICAgY29uc3QgY2lyY3VtZmVyZW5jZSA9IDIgKiBNYXRoLlBJICogcjtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaGFycmF5JywgU3RyaW5nKGNpcmN1bWZlcmVuY2UpKTtcbiAgICBhcmMuc2V0QXR0cmlidXRlKCdzdHJva2UtZGFzaG9mZnNldCcsIFN0cmluZyhjaXJjdW1mZXJlbmNlICogMC43NSkpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGFyYyk7XG4gICAgcmV0dXJuIHN2Zztcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQnV0dG9uIFx1MjAxNCBHZW5lcmljIEFjY2Vzc2libGUgQnV0dG9uIENvbXBvbmVudCBcdTIwMTQgUGFydCAzIC8gUGFydCAxMC5cbiAqXG4gKiBDcmVhdGVzIGEgYDxidXR0b24+YCBlbGVtZW50IHdpdGggc3VwcG9ydCBmb3IgdmFyaWFudHMsIHNpemVzLCBsb2FkaW5nIHN0YXRlLFxuICogYW5kIEFSSUEgYXR0cmlidXRlcy4gIFRoZSBsb2FkaW5nIHN0YXRlIHNob3dzIGFuIGlubGluZSBzcGlubmVyIGFuZCBwcmV2ZW50c1xuICogaW50ZXJhY3Rpb24gd2l0aG91dCBjaGFuZ2luZyB0aGUgYnV0dG9uJ3MgZGltZW5zaW9ucyAobGF5b3V0LXNoaWZ0IHNhZmUpLlxuICpcbiAqIEBtb2R1bGUgY29tcG9uZW50cy91aS9CdXR0b25cbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVTcGlubmVyIH0gZnJvbSAnLi9TcGlubmVyLmpzJztcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIENvbnN0YW50cyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqIFZhbGlkIHZpc3VhbCB2YXJpYW50cy4gKi9cbmNvbnN0IFZBUklBTlRTID0gWydwcmltYXJ5JywgJ3NlY29uZGFyeScsICdvdXRsaW5lJywgJ2dob3N0JywgJ2Rlc3RydWN0aXZlJ107XG5cbi8qKiBWYWxpZCBzaXplIHRva2Vucy4gKi9cbmNvbnN0IFNJWkVTID0gWydzbScsICdtZCcsICdsZyddO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRmFjdG9yeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBDcmVhdGVzIGFuZCByZXR1cm5zIGFuIGFjY2Vzc2libGUgYDxidXR0b24+YCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgIG9wdHMgICAgICAgICAgICAgICAgICAgICAtIEJ1dHRvbiBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gICBvcHRzLmxhYmVsICAgICAgICAgICAgICAgLSBWaXNpYmxlIGJ1dHRvbiB0ZXh0XG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5pZF0gICAgICAgICAgICAgICAgLSBPcHRpb25hbCBET00gaWQgYXR0cmlidXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy52YXJpYW50PSdwcmltYXJ5J10gLSBWaXN1YWwgc3R5bGUgdmFyaWFudFxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMuc2l6ZT0nbWQnXSAgICAgICAgIC0gU2l6ZSB0b2tlbjogJ3NtJyB8ICdtZCcgfCAnbGcnXG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy50eXBlPSdidXR0b24nXSAgICAgLSBIVE1MIGJ1dHRvbiB0eXBlIGF0dHJpYnV0ZVxuICogQHBhcmFtIHtib29sZWFufSAgW29wdHMuZGlzYWJsZWQ9ZmFsc2VdICAgIC0gRGlzYWJsZXMgdGhlIGJ1dHRvblxuICogQHBhcmFtIHtib29sZWFufSAgW29wdHMubG9hZGluZz1mYWxzZV0gICAgIC0gU2hvd3Mgc3Bpbm5lcjsgZGlzYWJsZXMgaW50ZXJhY3Rpb25zXG4gKiBAcGFyYW0ge3N0cmluZ30gICBbb3B0cy5jbGFzc05hbWU9JyddICAgICAgLSBFeHRyYSBDU1MgY2xhc3Nlc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdHMub25DbGlja10gICAgICAgICAgIC0gQ2xpY2sgZXZlbnQgaGFuZGxlclxuICogQHJldHVybnMge0hUTUxCdXR0b25FbGVtZW50fVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBidG4gPSBjcmVhdGVCdXR0b24oe1xuICogICBsYWJlbDogJ1NpZ24gSW4nLFxuICogICB2YXJpYW50OiAncHJpbWFyeScsXG4gKiAgIGxvYWRpbmc6IHRydWUsXG4gKiAgIG9uQ2xpY2s6IGhhbmRsZUxvZ2luLFxuICogfSk7XG4gKiBmb3JtRWwuYXBwZW5kKGJ0bik7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCdXR0b24oe1xuICAgIGxhYmVsLFxuICAgIGlkLFxuICAgIHZhcmlhbnQgPSAncHJpbWFyeScsXG4gICAgc2l6ZSA9ICdtZCcsXG4gICAgdHlwZSA9ICdidXR0b24nLFxuICAgIGRpc2FibGVkID0gZmFsc2UsXG4gICAgbG9hZGluZyA9IGZhbHNlLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIG9uQ2xpY2ssXG59ID0ge30pIHtcbiAgICBjb25zdCByZXNvbHZlZFZhcmlhbnQgPSBWQVJJQU5UUy5pbmNsdWRlcyh2YXJpYW50KSA/IHZhcmlhbnQgOiAncHJpbWFyeSc7XG4gICAgY29uc3QgcmVzb2x2ZWRTaXplID0gU0laRVMuaW5jbHVkZXMoc2l6ZSkgPyBzaXplIDogJ21kJztcblxuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ0bi50eXBlID0gdHlwZTtcblxuICAgIGlmIChpZCkgYnRuLmlkID0gaWQ7XG5cbiAgICBjb25zdCBjbGFzc2VzID0gW1xuICAgICAgICAnYnRuJyxcbiAgICAgICAgYGJ0bi0tJHtyZXNvbHZlZFZhcmlhbnR9YCxcbiAgICAgICAgYGJ0bi0tJHtyZXNvbHZlZFNpemV9YCxcbiAgICAgICAgLi4uKGxvYWRpbmcgPyBbJ2J0bi0tbG9hZGluZyddIDogW10pLFxuICAgICAgICAuLi4oY2xhc3NOYW1lID8gW2NsYXNzTmFtZV0gOiBbXSksXG4gICAgXTtcbiAgICBidG4uY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCcgJyk7XG5cbiAgICAvLyBEaXNhYmxlIHRoZSBidXR0b24gd2hlbiBleHBsaWNpdGx5IGRpc2FibGVkIG9yIHdoaWxlIGxvYWRpbmcuXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkIHx8IGxvYWRpbmc7XG4gICAgYnRuLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICBidG4uc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgU3RyaW5nKGlzRGlzYWJsZWQpKTtcbiAgICBpZiAobG9hZGluZykgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1idXN5JywgJ3RydWUnKTtcblxuICAgIC8vIExhYmVsIHRleHQgXHUyMDE0IGFsd2F5cyBwcmVzZW50IChzY3JlZW4gcmVhZGVycyB3aWxsIHJlYWQgaXQpLlxuICAgIGNvbnN0IGxhYmVsU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBsYWJlbFNwYW4uY2xhc3NOYW1lID0gJ2J0bl9fbGFiZWwnO1xuICAgIGxhYmVsU3Bhbi50ZXh0Q29udGVudCA9IGxhYmVsID8/ICcnO1xuICAgIGJ0bi5hcHBlbmRDaGlsZChsYWJlbFNwYW4pO1xuXG4gICAgLy8gU3Bpbm5lciAoaGlkZGVuIHdoZW4gbm90IGxvYWRpbmcsIHZpc2libGUgd2hlbiBsb2FkaW5nKS5cbiAgICBpZiAobG9hZGluZykge1xuICAgICAgICBjb25zdCBzcGlubmVyID0gY3JlYXRlU3Bpbm5lcih7IHNpemU6IHJlc29sdmVkU2l6ZSA9PT0gJ2xnJyA/ICdtZCcgOiAnc20nIH0pO1xuICAgICAgICBzcGlubmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBtYWluIGFyaWEtYnVzeSBvbiBidXR0b24gaXMgZW5vdWdoXG4gICAgICAgIGJ0bi5hcHBlbmRDaGlsZChzcGlubmVyKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9uQ2xpY2sgPT09ICdmdW5jdGlvbicgJiYgIWlzRGlzYWJsZWQpIHtcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ0bjtcbn1cblxuLyoqXG4gKiBVcGRhdGVzIGEgYnV0dG9uJ3MgbG9hZGluZyBzdGF0ZSBpbi1wbGFjZSB3aXRob3V0IHJlY3JlYXRpbmcgdGhlIGVsZW1lbnQuXG4gKiBVc2VmdWwgd2hlbiB0aGUgc2FtZSBidXR0b24gZWxlbWVudCBuZWVkcyB0byB0b2dnbGUgbG9hZGluZyBkdXJpbmcgYW4gYXN5bmMgb3AuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnRuICAgICAgIC0gVGhlIGJ1dHRvbiBlbGVtZW50IHRvIHVwZGF0ZVxuICogQHBhcmFtIHtib29sZWFufSAgICAgICAgICAgaXNMb2FkaW5nIC0gTmV3IGxvYWRpbmcgc3RhdGVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0QnV0dG9uTG9hZGluZyhidG4sIGlzTG9hZGluZykge1xuICAgIGlmICghYnRuIHx8ICEoYnRuIGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpKSByZXR1cm47XG5cbiAgICBidG4uZGlzYWJsZWQgPSBpc0xvYWRpbmc7XG4gICAgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIFN0cmluZyhpc0xvYWRpbmcpKTtcblxuICAgIGlmIChpc0xvYWRpbmcpIHtcbiAgICAgICAgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1idXN5JywgJ3RydWUnKTtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2J0bi0tbG9hZGluZycpO1xuXG4gICAgICAgIGlmICghYnRuLnF1ZXJ5U2VsZWN0b3IoJy5zcGlubmVyJykpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwaW5uZXIgPSBjcmVhdGVTcGlubmVyKHsgc2l6ZTogJ3NtJyB9KTtcbiAgICAgICAgICAgIHNwaW5uZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICBidG4uYXBwZW5kQ2hpbGQoc3Bpbm5lcik7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBidG4ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWJ1c3knKTtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi0tbG9hZGluZycpO1xuICAgICAgICBidG4ucXVlcnlTZWxlY3RvcignLnNwaW5uZXInKT8ucmVtb3ZlKCk7XG4gICAgfVxufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBJbnB1dCBcdTIwMTQgQWNjZXNzaWJsZSBUZXh0IElucHV0IENvbXBvbmVudCBcdTIwMTQgUGFydCAzIC8gUGFydCAxMC5cbiAqXG4gKiBDcmVhdGVzIGEgbGFiZWxsZWQgYDxpbnB1dD5gIGVsZW1lbnQgd2l0aCBpbmxpbmUgZXJyb3IgbWVzc2FnaW5nIGFuZCBhblxuICogb3B0aW9uYWwgc2hvdy9oaWRlIHBhc3N3b3JkIHRvZ2dsZSBmb3IgYHR5cGU9XCJwYXNzd29yZFwiYCBpbnB1dHMuXG4gKlxuICogQG1vZHVsZSBjb21wb25lbnRzL3VpL0lucHV0XG4gKi9cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFNWRyBpY29ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgRVlFX0lDT04gPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCJcbiAgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICA8cGF0aCBkPVwiTTIgMTJzMy03IDEwLTcgMTAgNyAxMCA3LTMgNy0xMCA3LTEwLTctMTAtN1pcIi8+XG4gIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiM1wiLz5cbjwvc3ZnPmA7XG5cbmNvbnN0IEVZRV9PRkZfSUNPTiA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIlxuICB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gIDxwYXRoIGQ9XCJNOS44OCA5Ljg4YTMgMyAwIDEgMCA0LjI0IDQuMjRcIi8+XG4gIDxwYXRoIGQ9XCJNMTAuNzMgNS4wOEExMC40MyAxMC40MyAwIDAgMSAxMiA1YzcgMCAxMCA3IDEwIDdhMTMuMTYgMTMuMTYgMCAwIDEtMS42NyAyLjY4XCIvPlxuICA8cGF0aCBkPVwiTTYuNjEgNi42MUExMy41MjYgMTMuNTI2IDAgMCAwIDIgMTJzMyA3IDEwIDdhOS43NCA5Ljc0IDAgMCAwIDUuMzktMS42MVwiLz5cbiAgPGxpbmUgeDE9XCIyXCIgeDI9XCIyMlwiIHkxPVwiMlwiIHkyPVwiMjJcIi8+XG48L3N2Zz5gO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRmFjdG9yeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBDcmVhdGVzIGEgbGFiZWxsZWQgaW5wdXQgZmllbGQgd2l0aCBvcHRpb25hbCBpbmxpbmUgZXJyb3IgYW5kIHBhc3N3b3JkIHRvZ2dsZS5cbiAqXG4gKiBSZXR1cm5zIGEgd3JhcHBlciBgPGRpdj5gIGNvbnRhaW5pbmcgdGhlIGxhYmVsLCBpbnB1dCwgYW5kICh3aGVuIGFwcGxpY2FibGUpXG4gKiB0aGUgZXJyb3IgbWVzc2FnZSBlbGVtZW50LiAgVGhlIGVycm9yIGVsZW1lbnQgaXMgYWx3YXlzIHJlbmRlcmVkIChidXQgZW1wdHlcbiAqIHdoZW4gdGhlcmUgaXMgbm8gZXJyb3IpIHNvIERPTSBsYXlvdXQgc3RheXMgc3RhYmxlIFx1MjAxNCBubyBsYXlvdXQgc2hpZnQgd2hlblxuICogYW4gZXJyb3IgYXBwZWFycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICBvcHRzICAgICAgICAgICAgICAgLSBJbnB1dCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gICBvcHRzLmlkICAgICAgICAgICAgLSBFbGVtZW50IGlkIChsaW5rcyBsYWJlbCBcdTIxOTIgaW5wdXQpXG4gKiBAcGFyYW0ge3N0cmluZ30gICBvcHRzLm5hbWUgICAgICAgICAgLSBJbnB1dCBuYW1lIGF0dHJpYnV0ZVxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMudHlwZT0ndGV4dCddIC0gSW5wdXQgdHlwZSBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIFtvcHRzLmxhYmVsXSAgICAgICAtIFZpc2libGUgbGFiZWwgdGV4dFxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMudmFsdWU9JyddICAgIC0gSW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMucGxhY2Vob2xkZXI9JyddIC0gUGxhY2Vob2xkZXIgdGV4dFxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMuZXJyb3JdICAgICAgIC0gSW5saW5lIGVycm9yIG1lc3NhZ2UgKHNldHMgYXJpYS1pbnZhbGlkKVxuICogQHBhcmFtIHtib29sZWFufSAgW29wdHMucmVxdWlyZWQ9ZmFsc2VdIC0gTWFya3MgZmllbGQgYXMgcmVxdWlyZWRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gIFtvcHRzLmRpc2FibGVkPWZhbHNlXSAtIERpc2FibGVzIHRoZSBpbnB1dFxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMuYXV0b2NvbXBsZXRlXSAgIC0gYXV0b2NvbXBsZXRlIGF0dHJpYnV0ZSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdHMub25DaGFuZ2VdICAgIC0gaW5wdXQgZXZlbnQgaGFuZGxlciAocmVjZWl2ZXMgdGhlIEV2ZW50KVxuICogQHJldHVybnMge3sgd3JhcHBlcjogSFRNTERpdkVsZW1lbnQsIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50LCBzZXRFcnJvcjogZnVuY3Rpb24gfX1cbiAqICAgUmV0dXJucyB0aGUgd3JhcHBlciBlbGVtZW50LCBkaXJlY3QgaW5wdXQgcmVmZXJlbmNlLCBhbmQgYW4gZXJyb3IgdXBkYXRlclxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7IHdyYXBwZXIsIGlucHV0LCBzZXRFcnJvciB9ID0gY3JlYXRlSW5wdXQoe1xuICogICBpZDogJ2VtYWlsJyxcbiAqICAgbmFtZTogJ2VtYWlsJyxcbiAqICAgdHlwZTogJ2VtYWlsJyxcbiAqICAgbGFiZWw6ICdFbWFpbCBhZGRyZXNzJyxcbiAqICAgcmVxdWlyZWQ6IHRydWUsXG4gKiAgIG9uQ2hhbmdlOiBlID0+IHZhbGlkYXRlRW1haWxGaWVsZChlLnRhcmdldC52YWx1ZSksXG4gKiB9KTtcbiAqIGZvcm1FbC5hcHBlbmQod3JhcHBlcik7XG4gKiBzZXRFcnJvcignRW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzJyk7IC8vIHNob3dzIGlubGluZSBlcnJvclxuICogc2V0RXJyb3IobnVsbCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjbGVhcnMgaXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUlucHV0KHtcbiAgICBpZCxcbiAgICBuYW1lLFxuICAgIHR5cGUgPSAndGV4dCcsXG4gICAgbGFiZWwsXG4gICAgdmFsdWUgPSAnJyxcbiAgICBwbGFjZWhvbGRlciA9ICcnLFxuICAgIGVycm9yLFxuICAgIHJlcXVpcmVkID0gZmFsc2UsXG4gICAgZGlzYWJsZWQgPSBmYWxzZSxcbiAgICBhdXRvY29tcGxldGUsXG4gICAgb25DaGFuZ2UsXG59ID0ge30pIHtcbiAgICBjb25zdCBpc1Bhc3N3b3JkID0gdHlwZSA9PT0gJ3Bhc3N3b3JkJztcbiAgICBjb25zdCBlcnJvcklkID0gYCR7aWR9LWVycm9yYDtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBXcmFwcGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwcGVyLmNsYXNzTmFtZSA9ICdpbnB1dC1maWVsZCc7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTGFiZWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgaWYgKGxhYmVsKSB7XG4gICAgICAgIGNvbnN0IGxhYmVsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICBsYWJlbEVsLmh0bWxGb3IgPSBpZDtcbiAgICAgICAgbGFiZWxFbC5jbGFzc05hbWUgPSAnaW5wdXQtZmllbGRfX2xhYmVsJztcbiAgICAgICAgbGFiZWxFbC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIHJlcS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHJlcS5jbGFzc05hbWUgPSAnaW5wdXQtZmllbGRfX3JlcXVpcmVkJztcbiAgICAgICAgICAgIHJlcS50ZXh0Q29udGVudCA9ICcgKic7XG4gICAgICAgICAgICBsYWJlbEVsLmFwcGVuZENoaWxkKHJlcSk7XG4gICAgICAgIH1cbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsYWJlbEVsKTtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgSW5wdXQgcm93IChpbnB1dCArIG9wdGlvbmFsIHRvZ2dsZSBidXR0b24pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGlucHV0Um93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaW5wdXRSb3cuY2xhc3NOYW1lID0gYGlucHV0LWZpZWxkX19yb3cke2lzUGFzc3dvcmQgPyAnIGlucHV0LWZpZWxkX19yb3ctLXBhc3N3b3JkJyA6ICcnfWA7XG5cbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgaW5wdXQuaWQgPSBpZDtcbiAgICBpbnB1dC5uYW1lID0gbmFtZTtcbiAgICBpbnB1dC50eXBlID0gdHlwZTtcbiAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgIGlucHV0LnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXI7XG4gICAgaW5wdXQucmVxdWlyZWQgPSByZXF1aXJlZDtcbiAgICBpbnB1dC5kaXNhYmxlZCA9IGRpc2FibGVkO1xuICAgIGlucHV0LmNsYXNzTmFtZSA9IGBpbnB1dC1maWVsZF9faW5wdXQke2Vycm9yID8gJyBpbnB1dC1maWVsZF9faW5wdXQtLWVycm9yJyA6ICcnfWA7XG4gICAgaWYgKGF1dG9jb21wbGV0ZSkgaW5wdXQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCBhdXRvY29tcGxldGUpO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGVycm9ySWQpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0Jywgb25DaGFuZ2UpO1xuICAgIH1cbiAgICBpbnB1dFJvdy5hcHBlbmRDaGlsZChpbnB1dCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU2hvdy9oaWRlIHRvZ2dsZSAocGFzc3dvcmQgb25seSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgaWYgKGlzUGFzc3dvcmQpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIHRvZ2dsZUJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgIHRvZ2dsZUJ0bi5jbGFzc05hbWUgPSAnaW5wdXQtZmllbGRfX3RvZ2dsZSc7XG4gICAgICAgIHRvZ2dsZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnU2hvdyBwYXNzd29yZCcpO1xuICAgICAgICB0b2dnbGVCdG4uc2V0QXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdG9nZ2xlQnRuLmlubmVySFRNTCA9IEVZRV9JQ09OO1xuXG4gICAgICAgIHRvZ2dsZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzU2hvd2luZyA9IGlucHV0LnR5cGUgPT09ICd0ZXh0JztcbiAgICAgICAgICAgIGlucHV0LnR5cGUgPSBpc1Nob3dpbmcgPyAncGFzc3dvcmQnIDogJ3RleHQnO1xuICAgICAgICAgICAgdG9nZ2xlQnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgU3RyaW5nKCFpc1Nob3dpbmcpKTtcbiAgICAgICAgICAgIHRvZ2dsZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBpc1Nob3dpbmcgPyAnU2hvdyBwYXNzd29yZCcgOiAnSGlkZSBwYXNzd29yZCcpO1xuICAgICAgICAgICAgdG9nZ2xlQnRuLmlubmVySFRNTCA9IGlzU2hvd2luZyA/IEVZRV9JQ09OIDogRVlFX09GRl9JQ09OO1xuICAgICAgICB9KTtcblxuICAgICAgICBpbnB1dFJvdy5hcHBlbmRDaGlsZCh0b2dnbGVCdG4pO1xuICAgIH1cblxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5wdXRSb3cpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEVycm9yIG1lc3NhZ2UgKGFsd2F5cyByZW5kZXJlZCwgZW1wdHkgd2hlbiBubyBlcnJvcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgZXJyb3JFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBlcnJvckVsLmlkID0gZXJyb3JJZDtcbiAgICBlcnJvckVsLmNsYXNzTmFtZSA9ICdpbnB1dC1maWVsZF9fZXJyb3InO1xuICAgIGVycm9yRWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2FsZXJ0Jyk7XG4gICAgZXJyb3JFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICBlcnJvckVsLnRleHRDb250ZW50ID0gZXJyb3IgPz8gJyc7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChlcnJvckVsKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBFcnJvciB1cGRhdGVyIGhlbHBlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGlubGluZSBlcnJvciBtZXNzYWdlIGFuZCBhcmlhLWludmFsaWQgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBtZXNzYWdlIC0gRXJyb3IgdGV4dCwgb3IgbnVsbCB0byBjbGVhclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldEVycm9yKG1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JFbC50ZXh0Q29udGVudCA9IG1lc3NhZ2UgPz8gJyc7XG4gICAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaW52YWxpZCcsICd0cnVlJyk7XG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBlcnJvcklkKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5hZGQoJ2lucHV0LWZpZWxkX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1pbnZhbGlkJyk7XG4gICAgICAgICAgICBpbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2lucHV0LWZpZWxkX19pbnB1dC0tZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHdyYXBwZXIsIGlucHV0LCBzZXRFcnJvciB9O1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBEZW1vQ3JlZGVudGlhbHMgXHUyMDE0IERlbW8gTG9naW4gSGludCBCbG9jayBcdTIwMTQgUGFydCAzLlxuICpcbiAqIFJlbmRlcnMgYSB2aXN1YWxseSBkaXN0aW5jdCBpbmZvIGJveCBzaG93aW5nIHRoZSBkZW1vIGVtYWlsIGFuZCBwYXNzd29yZC5cbiAqIEluY2x1ZGVzIGFuIG9wdGlvbmFsIFwiVXNlIGRlbW8gY3JlZGVudGlhbHNcIiBidXR0b24gdGhhdCBhdXRvLWZpbGxzIHRoZVxuICogY29ubmVjdGVkIGxvZ2luIGZvcm0gaW5wdXRzLlxuICpcbiAqIEBtb2R1bGUgY29tcG9uZW50cy9hdXRoL0RlbW9DcmVkZW50aWFsc1xuICovXG5cbmltcG9ydCB7IEFVVEhfQ09OU1RBTlRTIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnRzLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBkZW1vIGNyZWRlbnRpYWxzIGhpbnQgYmxvY2suXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICBbb3B0cz17fV0gICAgICAgICAgLSBDb25maWd1cmF0aW9uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0cy5vbkZpbGxdICAgICAtIENhbGxlZCB3aXRoIGB7IGVtYWlsLCBwYXNzd29yZCB9YCB3aGVuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSB1c2VyIGNsaWNrcyBcIlVzZSBkZW1vIGNyZWRlbnRpYWxzXCIuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEF0dGFjaCBhIGhhbmRsZXIgdG8gYXV0by1maWxsIGZvcm0gaW5wdXRzLlxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBUaGUgcmVuZGVyZWQgaGludCBibG9jayBlbGVtZW50XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGhpbnQgPSBjcmVhdGVEZW1vQ3JlZGVudGlhbHMoe1xuICogICBvbkZpbGw6ICh7IGVtYWlsLCBwYXNzd29yZCB9KSA9PiB7XG4gKiAgICAgZW1haWxJbnB1dC52YWx1ZSA9IGVtYWlsO1xuICogICAgIHBhc3N3b3JkSW5wdXQudmFsdWUgPSBwYXNzd29yZDtcbiAqICAgfSxcbiAqIH0pO1xuICogbG9naW5Gb3JtRWwuYXBwZW5kKGhpbnQpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVtb0NyZWRlbnRpYWxzKHsgb25GaWxsIH0gPSB7fSkge1xuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYmxvY2suY2xhc3NOYW1lID0gJ2RlbW8tY3JlZGVudGlhbHMnO1xuICAgIGJsb2NrLnNldEF0dHJpYnV0ZSgncm9sZScsICdub3RlJyk7XG4gICAgYmxvY2suc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0RlbW8gbG9naW4gY3JlZGVudGlhbHMnKTtcblxuICAgIGNvbnN0IGhlYWRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgaGVhZGluZy5jbGFzc05hbWUgPSAnZGVtby1jcmVkZW50aWFsc19faGVhZGluZyc7XG4gICAgaGVhZGluZy50ZXh0Q29udGVudCA9ICdEZW1vIGNyZWRlbnRpYWxzJztcbiAgICBibG9jay5hcHBlbmRDaGlsZChoZWFkaW5nKTtcblxuICAgIC8vIEVtYWlsIHJvd1xuICAgIGNvbnN0IGVtYWlsUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGVtYWlsUm93LmNsYXNzTmFtZSA9ICdkZW1vLWNyZWRlbnRpYWxzX19yb3cnO1xuICAgIGVtYWlsUm93LmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cImRlbW8tY3JlZGVudGlhbHNfX2tleVwiPkVtYWlsOjwvc3Bhbj5cbiAgICAgIDxjb2RlIGNsYXNzPVwiZGVtby1jcmVkZW50aWFsc19fdmFsdWVcIj4ke0FVVEhfQ09OU1RBTlRTLkRFTU9fRU1BSUx9PC9jb2RlPmA7XG4gICAgYmxvY2suYXBwZW5kQ2hpbGQoZW1haWxSb3cpO1xuXG4gICAgLy8gUGFzc3dvcmQgcm93XG4gICAgY29uc3QgcGFzc1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBwYXNzUm93LmNsYXNzTmFtZSA9ICdkZW1vLWNyZWRlbnRpYWxzX19yb3cnO1xuICAgIHBhc3NSb3cuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwiZGVtby1jcmVkZW50aWFsc19fa2V5XCI+UGFzc3dvcmQ6PC9zcGFuPlxuICAgICAgPGNvZGUgY2xhc3M9XCJkZW1vLWNyZWRlbnRpYWxzX192YWx1ZVwiPiR7QVVUSF9DT05TVEFOVFMuREVNT19QQVNTV09SRH08L2NvZGU+YDtcbiAgICBibG9jay5hcHBlbmRDaGlsZChwYXNzUm93KTtcblxuICAgIC8vIEF1dG8tZmlsbCBidXR0b24gKG9ubHkgcmVuZGVyZWQgd2hlbiBhIGhhbmRsZXIgaXMgcHJvdmlkZWQpXG4gICAgaWYgKHR5cGVvZiBvbkZpbGwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgZmlsbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBmaWxsQnRuLnR5cGUgPSAnYnV0dG9uJztcbiAgICAgICAgZmlsbEJ0bi5jbGFzc05hbWUgPSAnZGVtby1jcmVkZW50aWFsc19fZmlsbC1idG4nO1xuICAgICAgICBmaWxsQnRuLnRleHRDb250ZW50ID0gJ1VzZSBkZW1vIGNyZWRlbnRpYWxzJztcbiAgICAgICAgZmlsbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIG9uRmlsbCh7IGVtYWlsOiBBVVRIX0NPTlNUQU5UUy5ERU1PX0VNQUlMLCBwYXNzd29yZDogQVVUSF9DT05TVEFOVFMuREVNT19QQVNTV09SRCB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJsb2NrLmFwcGVuZENoaWxkKGZpbGxCdG4pO1xuICAgIH1cblxuICAgIHJldHVybiBibG9jaztcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ2hlY2tib3ggXHUyMDE0IEFjY2Vzc2libGUgQ2hlY2tib3ggQ29tcG9uZW50IFx1MjAxNCBQYXJ0IDMgLyBQYXJ0IDEwLlxuICpcbiAqIENyZWF0ZXMgYSBuYXRpdmUgYDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIj5gIHdpdGggYSBwcm9wZXJseSBhc3NvY2lhdGVkXG4gKiBgPGxhYmVsPmAuICBVc2VkIGJ5IHRoZSBSZW1lbWJlck1lIGNvbXBvbmVudC5cbiAqXG4gKiBAbW9kdWxlIGNvbXBvbmVudHMvdWkvQ2hlY2tib3hcbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYWNjZXNzaWJsZSBsYWJlbGxlZCBjaGVja2JveCBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgIG9wdHMgICAgICAgICAgICAgIC0gQ2hlY2tib3ggY29uZmlndXJhdGlvblxuICogQHBhcmFtIHtzdHJpbmd9ICAgb3B0cy5pZCAgICAgICAgICAtIEVsZW1lbnQgaWQgKGxpbmtzIGxhYmVsIFx1MjE5MiBpbnB1dClcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIG9wdHMubmFtZSAgICAgICAgLSBJbnB1dCBuYW1lIGF0dHJpYnV0ZVxuICogQHBhcmFtIHtzdHJpbmd9ICAgb3B0cy5sYWJlbCAgICAgICAtIFZpc2libGUgbGFiZWwgdGV4dFxuICogQHBhcmFtIHtib29sZWFufSAgW29wdHMuY2hlY2tlZD1mYWxzZV0gICAtIEluaXRpYWwgY2hlY2tlZCBzdGF0ZVxuICogQHBhcmFtIHtib29sZWFufSAgW29wdHMuZGlzYWJsZWQ9ZmFsc2VdICAtIERpc2FibGVzIHRoZSBjaGVja2JveFxuICogQHBhcmFtIHtzdHJpbmd9ICAgW29wdHMuY2xhc3NOYW1lPScnXSAgIC0gRXh0cmEgQ1NTIGNsYXNzZXMgb24gdGhlIHdyYXBwZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRzLm9uQ2hhbmdlXSAgLSBjaGFuZ2UgZXZlbnQgaGFuZGxlciAocmVjZWl2ZXMgRXZlbnQpXG4gKiBAcmV0dXJucyB7eyB3cmFwcGVyOiBIVE1MRGl2RWxlbWVudCwgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgfX1cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgeyB3cmFwcGVyLCBpbnB1dCB9ID0gY3JlYXRlQ2hlY2tib3goe1xuICogICBpZDogJ3JlbWVtYmVyLW1lJyxcbiAqICAgbmFtZTogJ3JlbWVtYmVyTWUnLFxuICogICBsYWJlbDogJ1JlbWVtYmVyIG1lJyxcbiAqICAgY2hlY2tlZDogZmFsc2UsXG4gKiAgIG9uQ2hhbmdlOiBlID0+IGNvbnNvbGUubG9nKCdjaGVja2VkOicsIGUudGFyZ2V0LmNoZWNrZWQpLFxuICogfSk7XG4gKiBmb3JtRWwuYXBwZW5kKHdyYXBwZXIpO1xuICogLy8gUmVhZCB2YWx1ZTogIGlucHV0LmNoZWNrZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KHtcbiAgICBpZCxcbiAgICBuYW1lLFxuICAgIGxhYmVsLFxuICAgIGNoZWNrZWQgPSBmYWxzZSxcbiAgICBkaXNhYmxlZCA9IGZhbHNlLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIG9uQ2hhbmdlLFxufSA9IHt9KSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdyYXBwZXIuY2xhc3NOYW1lID0gYGNoZWNrYm94JHtjbGFzc05hbWUgPyBgICR7Y2xhc3NOYW1lfWAgOiAnJ31gO1xuXG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIGlucHV0LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGlucHV0LmlkID0gaWQ7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQuY2hlY2tlZCA9IGNoZWNrZWQ7XG4gICAgaW5wdXQuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICBpbnB1dC5jbGFzc05hbWUgPSAnY2hlY2tib3hfX2lucHV0JztcblxuICAgIGlmICh0eXBlb2Ygb25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb25DaGFuZ2UpO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgIGxhYmVsRWwuaHRtbEZvciA9IGlkO1xuICAgIGxhYmVsRWwuY2xhc3NOYW1lID0gJ2NoZWNrYm94X19sYWJlbCc7XG4gICAgbGFiZWxFbC50ZXh0Q29udGVudCA9IGxhYmVsID8/ICcnO1xuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChsYWJlbEVsKTtcblxuICAgIHJldHVybiB7IHdyYXBwZXIsIGlucHV0IH07XG59XG4iLCAiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJlbWVtYmVyTWUgXHUyMDE0IFwiUmVtZW1iZXIgbWVcIiBDaGVja2JveCBcdTIwMTQgUGFydCAzLlxuICpcbiAqIEEgbGFiZWxsZWQgY2hlY2tib3ggc3ViLWNvbXBvbmVudCByZW5kZXJlZCBpbnNpZGUgTG9naW5Gb3JtLlxuICogV2hlbiBjaGVja2VkLCBhdXRoIHRva2VucyBhcmUgcGVyc2lzdGVkIGluIGxvY2FsU3RvcmFnZSAoMzAtZGF5IGV4cGlyeSk7XG4gKiB3aGVuIHVuY2hlY2tlZCwgdG9rZW5zIGFyZSBzdG9yZWQgaW4gc2Vzc2lvblN0b3JhZ2Ugb25seS5cbiAqXG4gKiBAbW9kdWxlIGNvbXBvbmVudHMvYXV0aC9SZW1lbWJlck1lXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlQ2hlY2tib3ggfSBmcm9tICcuLi91aS9DaGVja2JveC5qcyc7XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgXCJSZW1lbWJlciBtZVwiIGNoZWNrYm94IHdyYXBwZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICBbb3B0cz17fV0gICAgICAgICAgIC0gQ29uZmlndXJhdGlvblxuICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5jaGVja2VkPWZhbHNlXSAtIEluaXRpYWwgY2hlY2tlZCBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdHMub25DaGFuZ2VdICAgIC0gQ2FsbGVkIHdpdGggdGhlIG5ldyBib29sZWFuIHZhbHVlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIHRoZSBjaGVja2JveCBjaGFuZ2VzXG4gKiBAcmV0dXJucyB7eyB3cmFwcGVyOiBIVE1MRGl2RWxlbWVudCwgZ2V0VmFsdWU6IGZ1bmN0aW9uKCk6IGJvb2xlYW4gfX1cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgcmVtZW1iZXJNZSA9IGNyZWF0ZVJlbWVtYmVyTWUoe1xuICogICBvbkNoYW5nZTogY2hlY2tlZCA9PiBjb25zb2xlLmxvZygncmVtZW1iZXJNZTonLCBjaGVja2VkKSxcbiAqIH0pO1xuICogZm9ybUVsLmFwcGVuZChyZW1lbWJlck1lLndyYXBwZXIpO1xuICogY29uc3Qgc2hvdWxkUmVtZW1iZXIgPSByZW1lbWJlck1lLmdldFZhbHVlKCk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZW1lbWJlck1lKHsgY2hlY2tlZCA9IGZhbHNlLCBvbkNoYW5nZSB9ID0ge30pIHtcbiAgICBjb25zdCB7IHdyYXBwZXIsIGlucHV0IH0gPSBjcmVhdGVDaGVja2JveCh7XG4gICAgICAgIGlkOiAncmVtZW1iZXItbWUnLFxuICAgICAgICBuYW1lOiAncmVtZW1iZXJNZScsXG4gICAgICAgIGxhYmVsOiAnUmVtZW1iZXIgbWUnLFxuICAgICAgICBjaGVja2VkLFxuICAgICAgICBjbGFzc05hbWU6ICdyZW1lbWJlci1tZScsXG4gICAgICAgIG9uQ2hhbmdlOiB0eXBlb2Ygb25DaGFuZ2UgPT09ICdmdW5jdGlvbicgPyBlID0+IG9uQ2hhbmdlKGUudGFyZ2V0LmNoZWNrZWQpIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgd3JhcHBlcixcbiAgICAgICAgLyoqIEByZXR1cm5zIHtib29sZWFufSBDdXJyZW50IGNoZWNrZWQgc3RhdGUgKi9cbiAgICAgICAgZ2V0VmFsdWU6ICgpID0+IGlucHV0LmNoZWNrZWQsXG4gICAgfTtcbn1cbiIsICIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgTG9naW5Gb3JtIFx1MjAxNCBMb2dpbiBGb3JtIENvbXBvbmVudCBcdTIwMTQgUGFydCAzLlxuICpcbiAqIFJlbmRlcnMgdGhlIGNvbXBsZXRlIGxvZ2luIGZvcm06IGVtYWlsIGlucHV0LCBwYXNzd29yZCBpbnB1dCwgXCJSZW1lbWJlciBtZVwiXG4gKiBjaGVja2JveCwgZGVtbyBjcmVkZW50aWFscyBoaW50LCBhbmQgc3VibWl0IGJ1dHRvbi4gIEhhbmRsZXMgY2xpZW50LXNpZGVcbiAqIHZhbGlkYXRpb24sIGFzeW5jIHN1Ym1pc3Npb24sIGFuZCBlcnJvciBkaXNwbGF5LlxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBEYXRhIGZsb3cgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIFVzZXIgZmlsbHMgZm9ybVxuICogICAgIFx1MjE5MiBjbGllbnQtc2lkZSB2YWxpZGF0aW9uICh2YWxpZGF0ZUxvZ2luRm9ybSlcbiAqICAgICBcdTIxOTIgQXV0aENvbnRleHQubG9naW4oY3JlZGVudGlhbHMpICAgICAgICAgICAgXHUyMTkwIHN0YXRlIG1hbmFnZW1lbnQgbGF5ZXJcbiAqICAgICAgIFx1MjE5MiBhdXRoQXBpLmxvZ2luKGNyZWRlbnRpYWxzKSAgICAgICAgICAgICAgXHUyMTkwIEhUVFAgbGF5ZXJcbiAqICAgICAgICAgXHUyMTkyIGF1dGhTdG9yYWdlLnNhdmVBdXRoVG9rZW4oXHUyMDI2KSAgICAgICAgICBcdTIxOTAgc3RvcmFnZSBsYXllclxuICogICAgIFx1MjE5MiBzdWNjZXNzIFx1MjE5MiBvblN1Y2Nlc3MgY2FsbGJhY2sgXHUyMTkyIGNhbGxlciBuYXZpZ2F0ZXNcbiAqICAgICBcdTIxOTIgZmFpbHVyZSBcdTIxOTIgaW5saW5lIGVycm9yIGRpc3BsYXllZCBpbiBmb3JtXG4gKlxuICogXHUyNTAwXHUyNTAwXHUyNTAwIE5hdmlnYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gKiAgIFRoaXMgY29tcG9uZW50IGludGVudGlvbmFsbHkgZG9lcyBOT1QgY2FsbCByb3V0ZXIubmF2aWdhdGUoKSBkaXJlY3RseS5cbiAqICAgQWZ0ZXIgYSBzdWNjZXNzZnVsIGxvZ2luIGl0IGNhbGxzIGBvcHRzLm9uU3VjY2Vzcyh1c2VyLCBkZXN0aW5hdGlvbilgLlxuICogICBUaGUgcGFnZSB0aGF0IG1vdW50cyB0aGlzIGZvcm0gKExvZ2luUGFnZSkgaXMgcmVzcG9uc2libGUgZm9yIHJvdXRpbmcuXG4gKlxuICogQG1vZHVsZSBjb21wb25lbnRzL2F1dGgvTG9naW5Gb3JtXG4gKi9cblxuaW1wb3J0IEF1dGhDb250ZXh0IGZyb20gJy4uLy4uL2NvbnRleHQvQXV0aENvbnRleHQuanMnO1xuaW1wb3J0IHsgZ2V0UmVkaXJlY3RQYXRoIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXV0aFN0b3JhZ2UuanMnO1xuaW1wb3J0IHsgdmFsaWRhdGVMb2dpbkZvcm0gfSBmcm9tICcuLi8uLi91dGlscy92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IGNyZWF0ZUJ1dHRvbiwgc2V0QnV0dG9uTG9hZGluZyB9IGZyb20gJy4uL3VpL0J1dHRvbi5qcyc7XG5pbXBvcnQgeyBjcmVhdGVJbnB1dCB9IGZyb20gJy4uL3VpL0lucHV0LmpzJztcbmltcG9ydCB7IGNyZWF0ZURlbW9DcmVkZW50aWFscyB9IGZyb20gJy4vRGVtb0NyZWRlbnRpYWxzLmpzJztcbmltcG9ydCB7IGNyZWF0ZVJlbWVtYmVyTWUgfSBmcm9tICcuL1JlbWVtYmVyTWUuanMnO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgRmFjdG9yeSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuLyoqXG4gKiBDcmVhdGVzIHRoZSBsb2dpbiBmb3JtIGVsZW1lbnQgYW5kIG1vdW50cyBpdCBpbnRvIHRoZSBzdXBwbGllZCBjb250YWluZXIuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyICAgICAgICAtIFRoZSBET00gZWxlbWVudCB0byBtb3VudCB0aGUgZm9ybSBpbnRvXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICBbb3B0cz17fV0gICAgICAgIC0gT3B0aW9uc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gICAgW29wdHMub25TdWNjZXNzXSAtIENhbGxlZCB3aXRoIGAodXNlciwgcmVkaXJlY3RQYXRoKWAgYWZ0ZXJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhIHN1Y2Nlc3NmdWwgbG9naW4uIFVzZSB0aGlzIHRvIG5hdmlnYXRlLlxuICogQHJldHVybnMge3sgZGVzdHJveTogZnVuY3Rpb24gfX0gQ2xlYW51cCBoYW5kbGUgXHUyMDE0IGNhbGwgYGRlc3Ryb3koKWAgb24gcGFnZSB1bm1vdW50XG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGZvcm0gPSBjcmVhdGVMb2dpbkZvcm0oZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ2luLWNvbnRhaW5lcicpLCB7XG4gKiAgIG9uU3VjY2VzczogKHVzZXIsIHBhdGgpID0+IHtcbiAqICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGg7XG4gKiAgIH0sXG4gKiB9KTtcbiAqIC8vIE9uIHBhZ2UgZGVzdHJveTpcbiAqIGZvcm0uZGVzdHJveSgpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9naW5Gb3JtKGNvbnRhaW5lciwgeyBvblN1Y2Nlc3MgfSA9IHt9KSB7XG4gICAgLy8gXHUyNTAwXHUyNTAwIEJ1aWxkIERPTSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAgIGNvbnN0IGZvcm1FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICBmb3JtRWwuaWQgPSAnbG9naW4tZm9ybSc7XG4gICAgZm9ybUVsLmNsYXNzTmFtZSA9ICdsb2dpbi1mb3JtJztcbiAgICBmb3JtRWwuc2V0QXR0cmlidXRlKCdub3ZhbGlkYXRlJywgJycpOyAvLyB1c2UgY3VzdG9tIHZhbGlkYXRpb24gbWVzc2FnZXNcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBGb3JtIHRpdGxlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICB0aXRsZS5jbGFzc05hbWUgPSAnbG9naW4tZm9ybV9fdGl0bGUnO1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ1NpZ24gaW4nO1xuICAgIGZvcm1FbC5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICBjb25zdCBzdWJ0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBzdWJ0aXRsZS5jbGFzc05hbWUgPSAnbG9naW4tZm9ybV9fc3VidGl0bGUnO1xuICAgIHN1YnRpdGxlLnRleHRDb250ZW50ID0gJ0FjY2VzcyB5b3VyIFN0dWRlbnQgUHJvZ3Jlc3MgRGFzaGJvYXJkJztcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQoc3VidGl0bGUpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEVycm9yIGJhbm5lciAodG9wLWxldmVsLCBzaG93biBmb3IgbmV0d29yayAvIGF1dGggZXJyb3JzKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBlcnJvckJhbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVycm9yQmFubmVyLmNsYXNzTmFtZSA9ICdsb2dpbi1mb3JtX19lcnJvci1iYW5uZXInO1xuICAgIGVycm9yQmFubmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICdhbGVydCcpO1xuICAgIGVycm9yQmFubmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ2Fzc2VydGl2ZScpO1xuICAgIGVycm9yQmFubmVyLmhpZGRlbiA9IHRydWU7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKGVycm9yQmFubmVyKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBFbWFpbCBmaWVsZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB7XG4gICAgICAgIHdyYXBwZXI6IGVtYWlsV3JhcHBlcixcbiAgICAgICAgaW5wdXQ6IGVtYWlsSW5wdXQsXG4gICAgICAgIHNldEVycm9yOiBzZXRFbWFpbEVycm9yLFxuICAgIH0gPSBjcmVhdGVJbnB1dCh7XG4gICAgICAgIGlkOiAnbG9naW4tZW1haWwnLFxuICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICB0eXBlOiAnZW1haWwnLFxuICAgICAgICBsYWJlbDogJ0VtYWlsIGFkZHJlc3MnLFxuICAgICAgICBwbGFjZWhvbGRlcjogJ3N0dWRlbnRAZGVtby5jb20nLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgYXV0b2NvbXBsZXRlOiAnZW1haWwnLFxuICAgICAgICAvKipcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIG9uQ2hhbmdlOiAoKSA9PiBzZXRFbWFpbEVycm9yKG51bGwpLCAvLyBjbGVhciBlcnJvciBvbiBldmVyeSBrZXlzdHJva2VcbiAgICB9KTtcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQoZW1haWxXcmFwcGVyKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBQYXNzd29yZCBmaWVsZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB7XG4gICAgICAgIHdyYXBwZXI6IHBhc3N3b3JkV3JhcHBlcixcbiAgICAgICAgaW5wdXQ6IHBhc3N3b3JkSW5wdXQsXG4gICAgICAgIHNldEVycm9yOiBzZXRQYXNzd29yZEVycm9yLFxuICAgIH0gPSBjcmVhdGVJbnB1dCh7XG4gICAgICAgIGlkOiAnbG9naW4tcGFzc3dvcmQnLFxuICAgICAgICBuYW1lOiAncGFzc3dvcmQnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICBsYWJlbDogJ1Bhc3N3b3JkJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdcdTIwMjJcdTIwMjJcdTIwMjJcdTIwMjJcdTIwMjJcdTIwMjInLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgYXV0b2NvbXBsZXRlOiAnY3VycmVudC1wYXNzd29yZCcsXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgb25DaGFuZ2U6ICgpID0+IHNldFBhc3N3b3JkRXJyb3IobnVsbCksXG4gICAgfSk7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKHBhc3N3b3JkV3JhcHBlcik7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUmVtZW1iZXIgbWUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgcmVtZW1iZXJNZSA9IGNyZWF0ZVJlbWVtYmVyTWUoeyBjaGVja2VkOiBmYWxzZSB9KTtcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQocmVtZW1iZXJNZS53cmFwcGVyKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBTdWJtaXQgYnV0dG9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGNyZWF0ZUJ1dHRvbih7XG4gICAgICAgIGlkOiAnbG9naW4tc3VibWl0JyxcbiAgICAgICAgbGFiZWw6ICdTaWduIEluJyxcbiAgICAgICAgdmFyaWFudDogJ3ByaW1hcnknLFxuICAgICAgICBzaXplOiAnbGcnLFxuICAgICAgICB0eXBlOiAnc3VibWl0JyxcbiAgICB9KTtcbiAgICBzdWJtaXRCdG4uY2xhc3NOYW1lICs9ICcgbG9naW4tZm9ybV9fc3VibWl0JztcbiAgICBmb3JtRWwuYXBwZW5kQ2hpbGQoc3VibWl0QnRuKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBEZW1vIGNyZWRlbnRpYWxzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGRlbW9CbG9jayA9IGNyZWF0ZURlbW9DcmVkZW50aWFscyh7XG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgb25GaWxsOiAoeyBlbWFpbCwgcGFzc3dvcmQgfSkgPT4ge1xuICAgICAgICAgICAgZW1haWxJbnB1dC52YWx1ZSA9IGVtYWlsO1xuICAgICAgICAgICAgcGFzc3dvcmRJbnB1dC52YWx1ZSA9IHBhc3N3b3JkO1xuICAgICAgICAgICAgc2V0RW1haWxFcnJvcihudWxsKTtcbiAgICAgICAgICAgIHNldFBhc3N3b3JkRXJyb3IobnVsbCk7XG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgZm9ybUVsLmFwcGVuZENoaWxkKGRlbW9CbG9jayk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTW91bnQgaW50byBjb250YWluZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZvcm1FbCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgSGVscGVycyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuICAgIC8qKiBTaG93cyB0aGUgdG9wLWxldmVsIGVycm9yIGJhbm5lciB3aXRoIGEgbWVzc2FnZS4gKi9cbiAgICBmdW5jdGlvbiBzaG93QmFubmVyRXJyb3IobWVzc2FnZSkge1xuICAgICAgICBlcnJvckJhbm5lci50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gICAgICAgIGVycm9yQmFubmVyLmhpZGRlbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKiBIaWRlcyB0aGUgZXJyb3IgYmFubmVyLiAqL1xuICAgIGZ1bmN0aW9uIGNsZWFyQmFubmVyRXJyb3IoKSB7XG4gICAgICAgIGVycm9yQmFubmVyLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIGVycm9yQmFubmVyLmhpZGRlbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFN1Ym1pdCBoYW5kbGVyIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICBhc3luYyBmdW5jdGlvbiBoYW5kbGVTdWJtaXQoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNsZWFyQmFubmVyRXJyb3IoKTtcblxuICAgICAgICBjb25zdCBlbWFpbCA9IGVtYWlsSW5wdXQudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCBwYXNzd29yZCA9IHBhc3N3b3JkSW5wdXQudmFsdWU7XG4gICAgICAgIGNvbnN0IHNob3VsZFJlbWVtYmVyTWUgPSByZW1lbWJlck1lLmdldFZhbHVlKCk7XG5cbiAgICAgICAgLy8gXHUyNTAwXHUyNTAwIENsaWVudC1zaWRlIHZhbGlkYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRlTG9naW5Gb3JtKHsgZW1haWwsIHBhc3N3b3JkIH0pO1xuICAgICAgICBpZiAoZXJyb3JzKSB7XG4gICAgICAgICAgICBpZiAoZXJyb3JzLmVtYWlsKSBzZXRFbWFpbEVycm9yKGVycm9ycy5lbWFpbCk7XG4gICAgICAgICAgICBpZiAoZXJyb3JzLnBhc3N3b3JkKSBzZXRQYXNzd29yZEVycm9yKGVycm9ycy5wYXNzd29yZCk7XG4gICAgICAgICAgICAvLyBGb2N1cyB0aGUgZmlyc3QgZmllbGQgd2l0aCBhbiBlcnJvciBmb3Iga2V5Ym9hcmQgdXNlcnMuXG4gICAgICAgICAgICBpZiAoZXJyb3JzLmVtYWlsKSBlbWFpbElucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICBlbHNlIGlmIChlcnJvcnMucGFzc3dvcmQpIHBhc3N3b3JkSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgIHJldHVybjsgLy8gc3RvcCBcdTIwMTQgZG8gbm90IGNhbGwgQVBJIHdpdGggaW52YWxpZCBkYXRhXG4gICAgICAgIH1cblxuICAgICAgICAvLyBcdTI1MDBcdTI1MDAgU3VibWl0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgICAgICBzZXRCdXR0b25Mb2FkaW5nKHN1Ym1pdEJ0biwgdHJ1ZSk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgQXV0aENvbnRleHQubG9naW4oe1xuICAgICAgICAgICAgZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICAgIHJlbWVtYmVyTWU6IHNob3VsZFJlbWVtYmVyTWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNldEJ1dHRvbkxvYWRpbmcoc3VibWl0QnRuLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAvLyBSZXRyaWV2ZSBhbmQgY2xlYXIgdGhlIHNhdmVkIHJlZGlyZWN0IHBhdGggKGNvbnN1bWVkIG9uY2UpLlxuICAgICAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSBnZXRSZWRpcmVjdFBhdGgoKTsgLy8gJy9kYXNoYm9hcmQnIGlmIG5vbmUgc2F2ZWRcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvblN1Y2Nlc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBvblN1Y2Nlc3MocmVzdWx0LnVzZXIsIGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIERpc3BsYXkgdGhlIGVycm9yIHJldHVybmVkIGJ5IEF1dGhDb250ZXh0LlxuICAgICAgICAgICAgc2hvd0Jhbm5lckVycm9yKHJlc3VsdC5lcnJvciA/PyAnTG9naW4gZmFpbGVkLiBQbGVhc2UgdHJ5IGFnYWluLicpO1xuICAgICAgICAgICAgZW1haWxJbnB1dC5mb2N1cygpOyAvLyByZXR1cm4gZm9jdXMgdG8gZmlyc3QgZmllbGRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvcm1FbC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBoYW5kbGVTdWJtaXQpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENsZWFudXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgZm9ybSBmcm9tIHRoZSBET00gYW5kIGNsZWFucyB1cCBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgICAqIENhbGwgd2hlbiB0aGUgTG9naW5QYWdlIGlzIGRlc3Ryb3llZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICAgICAqL1xuICAgICAgICBkZXN0cm95KCkge1xuICAgICAgICAgICAgZm9ybUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGhhbmRsZVN1Ym1pdCk7XG4gICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoZm9ybUVsKTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuIiwgIi8qKlxuICogQGZpbGVvdmVydmlldyBMb2dpblBhZ2UgXHUyMDE0IFRvcC1MZXZlbCBMb2dpbiBQYWdlIFx1MjAxNCBQYXJ0IDMuXG4gKlxuICogQXNzZW1ibGVzIHRoZSBjb21wbGV0ZSBsb2dpbiB2aWV3OlxuICogICBcdTIwMjIgQXBwIGxvZ28gKyB0YWdsaW5lIChsZWZ0IC8gdG9wIHBhbmVsKVxuICogICBcdTIwMjIgTG9naW5Gb3JtIChyaWdodCAvIGJvdHRvbSBwYW5lbClcbiAqXG4gKiBSZXNwb25zaWJpbGl0aWVzOlxuICogICAtIFNldCBgZG9jdW1lbnQudGl0bGVgIG9uIG1vdW50IChGUi1VWC0wMjkpXG4gKiAgIC0gUmVkaXJlY3QgdG8gL2Rhc2hib2FyZCBpZiB0aGUgdXNlciBpcyBhbHJlYWR5IGF1dGhlbnRpY2F0ZWRcbiAqICAgLSBDb21wb3NlIExvZ2luRm9ybSB3aXRoIGEgbmF2aWdhdGlvbiBjYWxsYmFja1xuICogICAtIENsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIGNoaWxkIGNvbXBvbmVudHMgb24gZGVzdHJveVxuICpcbiAqIFx1MjUwMFx1MjUwMFx1MjUwMCBOYXZpZ2F0aW9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICogICBUT0RPIChQYXJ0IDQgXHUyMDE0IFJvdXRpbmcpOlxuICogICAgIFJlcGxhY2UgdGhlIGB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFx1MjAyNmAgY2FsbHMgd2l0aCBgcm91dGVyLm5hdmlnYXRlKClgLlxuICpcbiAqIEBtb2R1bGUgcGFnZXMvTG9naW5QYWdlXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlTG9naW5Gb3JtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9hdXRoL0xvZ2luRm9ybS5qcyc7XG5pbXBvcnQgQXV0aENvbnRleHQgZnJvbSAnLi4vY29udGV4dC9BdXRoQ29udGV4dC5qcyc7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBDb25zdGFudHMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFBBR0VfVElUTEUgPSAnU2lnbiBJbiB8IFN0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tlcic7XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBGYWN0b3J5IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4vKipcbiAqIENyZWF0ZXMgYW5kIG1vdW50cyB0aGUgbG9naW4gcGFnZSBpbnRvIHRoZSBnaXZlbiBjb250YWluZXIuXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gVGhlIHJvb3QgZWxlbWVudCB0byBtb3VudCBpbnRvIChlLmcuIGAjYXBwYClcbiAqIEByZXR1cm5zIHt7IGRlc3Ryb3k6IGZ1bmN0aW9uIH19IENsZWFudXAgaGFuZGxlXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHBhZ2UgPSBjcmVhdGVMb2dpblBhZ2UoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKTtcbiAqIC8vIE9uIHJvdXRlIGNoYW5nZSAvIHBhZ2UgZGVzdHJveTpcbiAqIHBhZ2UuZGVzdHJveSgpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9naW5QYWdlKGNvbnRhaW5lcikge1xuICAgIC8vIFx1MjUwMFx1MjUwMCBHdWFyZDogcmVkaXJlY3QgYXV0aGVudGljYXRlZCB1c2VycyBhd2F5IGZyb20gdGhlIGxvZ2luIHBhZ2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgeyBpc0F1dGhlbnRpY2F0ZWQsIGlzTG9hZGluZyB9ID0gQXV0aENvbnRleHQuZ2V0U3RhdGUoKTtcblxuICAgIGlmICghaXNMb2FkaW5nICYmIGlzQXV0aGVudGljYXRlZCkge1xuICAgICAgICAvLyBUT0RPIChQYXJ0IDQgXHUyMDE0IFJvdXRpbmcpOiByb3V0ZXIubmF2aWdhdGUoUk9VVEVTLkRBU0hCT0FSRCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9kYXNoYm9hcmQnO1xuICAgICAgICAvLyBSZXR1cm4gYSBuby1vcCBkZXN0cm95IGhhbmRsZSBcdTIwMTQgcGFnZSB3b24ndCBiZSByZW5kZXJlZC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVzdHJveTogKCkgPT4ge30sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFNldCBkb2N1bWVudCB0aXRsZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBkb2N1bWVudC50aXRsZSA9IFBBR0VfVElUTEU7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQnVpbGQgcGFnZSBzaGVsbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBwYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYWdlRWwuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2UnO1xuICAgIHBhZ2VFbC5pZCA9ICdsb2dpbi1wYWdlJztcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBMZWZ0IC8gaGVybyBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBoZXJvUGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBoZXJvUGFuZWwuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX2hlcm8nO1xuICAgIGhlcm9QYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gZGVjb3JhdGl2ZSBwYW5lbFxuXG4gICAgY29uc3QgbG9nb0FyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsb2dvQXJlYS5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9fbG9nby1hcmVhJztcblxuICAgIC8vIElubGluZSBTVkcgbG9nbyBcdTIwMTQgdXNlcyB0aGUgYXNzZXQgYXQgc3JjL2Fzc2V0cy9hdXRoL2xvZ28uc3ZnLlxuICAgIC8vIExvYWRlZCBhcyBhbiA8aW1nPiB3aXRoIGEgbWVhbmluZ2Z1bCBhbHQgc28gaXQgZGVncmFkZXMgZ3JhY2VmdWxseS5cbiAgICBjb25zdCBsb2dvSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgbG9nb0ltZy5zcmMgPSAnL3NyYy9hc3NldHMvYXV0aC9sb2dvLnN2Zyc7XG4gICAgbG9nb0ltZy5hbHQgPSAnU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyIGxvZ28nO1xuICAgIGxvZ29JbWcuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX2xvZ28nO1xuICAgIGxvZ29JbWcud2lkdGggPSA0ODtcbiAgICBsb2dvSW1nLmhlaWdodCA9IDQ4O1xuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgbG9nb0ltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAvLyBJZiB0aGUgU1ZHIGFzc2V0IGlzIG1pc3NpbmcsIGZhbGwgYmFjayB0byBhIHRleHQgbG9nby5cbiAgICAgICAgbG9nb0ltZy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH07XG5cbiAgICBjb25zdCBhcHBOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGFwcE5hbWUuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX2FwcC1uYW1lJztcbiAgICBhcHBOYW1lLnRleHRDb250ZW50ID0gJ1N0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tlcic7XG5cbiAgICBsb2dvQXJlYS5hcHBlbmRDaGlsZChsb2dvSW1nKTtcbiAgICBsb2dvQXJlYS5hcHBlbmRDaGlsZChhcHBOYW1lKTtcblxuICAgIGNvbnN0IGhlcm9UYWdsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGhlcm9UYWdsaW5lLmNsYXNzTmFtZSA9ICdsb2dpbi1wYWdlX190YWdsaW5lJztcbiAgICBoZXJvVGFnbGluZS50ZXh0Q29udGVudCA9ICdUcmFjayB5b3VyIGxlYXJuaW5nIGpvdXJuZXksIG9uZSBjb3Vyc2UgYXQgYSB0aW1lLic7XG5cbiAgICAvLyBMb2dpbiBpbGx1c3RyYXRpb25cbiAgICBjb25zdCBpbGx1c3RyYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbGx1c3RyYXRpb24uc3JjID0gJy9zcmMvYXNzZXRzL2F1dGgvbG9naW4uc3ZnJztcbiAgICBpbGx1c3RyYXRpb24uYWx0ID0gJyc7IC8vIGRlY29yYXRpdmUgXHUyMDE0IGhpZGRlbiBmcm9tIHNjcmVlbiByZWFkZXJzXG4gICAgaWxsdXN0cmF0aW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIGlsbHVzdHJhdGlvbi5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9faWxsdXN0cmF0aW9uJztcbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIGlsbHVzdHJhdGlvbi5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBpbGx1c3RyYXRpb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9O1xuXG4gICAgaGVyb1BhbmVsLmFwcGVuZENoaWxkKGxvZ29BcmVhKTtcbiAgICBoZXJvUGFuZWwuYXBwZW5kQ2hpbGQoaGVyb1RhZ2xpbmUpO1xuICAgIGhlcm9QYW5lbC5hcHBlbmRDaGlsZChpbGx1c3RyYXRpb24pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFJpZ2h0IC8gZm9ybSBwYW5lbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBmb3JtUGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBmb3JtUGFuZWwuY2xhc3NOYW1lID0gJ2xvZ2luLXBhZ2VfX2Zvcm0tcGFuZWwnO1xuXG4gICAgY29uc3QgZm9ybUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBmb3JtQ2FyZC5jbGFzc05hbWUgPSAnbG9naW4tcGFnZV9fZm9ybS1jYXJkJztcblxuICAgIGZvcm1QYW5lbC5hcHBlbmRDaGlsZChmb3JtQ2FyZCk7XG5cbiAgICBwYWdlRWwuYXBwZW5kQ2hpbGQoaGVyb1BhbmVsKTtcbiAgICBwYWdlRWwuYXBwZW5kQ2hpbGQoZm9ybVBhbmVsKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFnZUVsKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBNb3VudCBMb2dpbkZvcm0gaW50byB0aGUgY2FyZCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBsb2dpbkZvcm1IYW5kbGUgPSBjcmVhdGVMb2dpbkZvcm0oZm9ybUNhcmQsIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBvblN1Y2Nlc3M6IChfdXNlciwgZGVzdGluYXRpb24pID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE8gKFBhcnQgNCBcdTIwMTQgUm91dGluZyk6IHJvdXRlci5uYXZpZ2F0ZShkZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFN1YnNjcmliZSB0byBBdXRoQ29udGV4dCB0byBoYW5kbGUgbWlkLXNlc3Npb24gYXV0aCBjaGFuZ2VzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIC8vXG4gICAgLy8gSWYgdGhlIHVzZXIgc29tZWhvdyBiZWNvbWVzIGF1dGhlbnRpY2F0ZWQgd2hpbGUgb24gdGhlIGxvZ2luIHBhZ2VcbiAgICAvLyAoZS5nLiB2aWEgYW5vdGhlciB0YWIpLCByZWRpcmVjdCB0aGVtIGF3YXkuXG4gICAgY29uc3QgdW5zdWJzY3JpYmUgPSBBdXRoQ29udGV4dC5zdWJzY3JpYmUoKHsgaXNBdXRoZW50aWNhdGVkOiBhdXRoZWQgfSkgPT4ge1xuICAgICAgICBpZiAoYXV0aGVkKSB7XG4gICAgICAgICAgICAvLyBUT0RPIChQYXJ0IDQgXHUyMDE0IFJvdXRpbmcpOiByb3V0ZXIubmF2aWdhdGUoUk9VVEVTLkRBU0hCT0FSRCk7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvZGFzaGJvYXJkJztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENsZWFudXAgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGVhcnMgZG93biB0aGUgbG9naW4gcGFnZSwgcmVtb3ZpbmcgRE9NIGVsZW1lbnRzIGFuZCBzdWJzY3JpcHRpb25zLlxuICAgICAgICAgKiBDYWxsIHRoaXMgd2hlbiB0aGUgcm91dGVyIG5hdmlnYXRlcyBhd2F5IGZyb20gdGhlIGxvZ2luIHJvdXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgbG9naW5Gb3JtSGFuZGxlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGlmIChjb250YWluZXIuY29udGFpbnMocGFnZUVsKSkge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChwYWdlRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVzZXQgdGl0bGUgdG8gdGhlIGFwcCBkZWZhdWx0LlxuICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSAnU3R1ZGVudCBQcm9ncmVzcyBUcmFja2VyJztcbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVMb2dpblBhZ2U7XG4iLCAiZXhwb3J0IGNvbnN0IEFOSU1BVElPTl9DTEFTU0VTID0ge1xuICAgIGZhZGVJbjogJ2FuaW0tZmFkZS1pbicsXG4gICAgc2xpZGVVcDogJ2FuaW0tc2xpZGUtdXAnLFxuICAgIHNsaWRlRG93bjogJ2FuaW0tc2xpZGUtZG93bicsXG4gICAgc2xpZGVJblJpZ2h0OiAnYW5pbS1zbGlkZS1pbi1yaWdodCcsXG4gICAgc2xpZGVJbkxlZnQ6ICdhbmltLXNsaWRlLWluLWxlZnQnLFxuICAgIHNjYWxlSW46ICdhbmltLXNjYWxlLWluJyxcbiAgICBwdWxzZTogJ2FuaW0tcHVsc2UnLFxuICAgIHNoaW1tZXI6ICdza2VsZXRvbi1zaGltbWVyJyxcbn07XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGUoZWwsIGFuaW1hdGlvbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBkdXJhdGlvbiA9IDMwMCwgZGVsYXkgPSAwLCBvbkVuZCB9ID0gb3B0aW9ucztcblxuICAgIGVsLmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uKTtcblxuICAgIGlmIChkdXJhdGlvbiAhPT0gMzAwKSBlbC5zdHlsZS5hbmltYXRpb25EdXJhdGlvbiA9IGAke2R1cmF0aW9ufW1zYDtcbiAgICBpZiAoZGVsYXkgPiAwKSBlbC5zdHlsZS5hbmltYXRpb25EZWxheSA9IGAke2RlbGF5fW1zYDtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgY29uc3QgaGFuZGxlciA9IGUgPT4ge1xuICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGFuaW1hdGlvbik7XG4gICAgICAgIGVsLnN0eWxlLmFuaW1hdGlvbkR1cmF0aW9uID0gJyc7XG4gICAgICAgIGVsLnN0eWxlLmFuaW1hdGlvbkRlbGF5ID0gJyc7XG4gICAgICAgIGlmIChvbkVuZCkgb25FbmQoZSk7XG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBoYW5kbGVyLCB7IG9uY2U6IHRydWUgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YWdnZXIoZWwsIGFuaW1hdGlvbiwgeyBzdGFnZ2VyRGVsYXkgPSA1MCwgLi4ucmVzdCB9ID0ge30pIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20oZWwuY2hpbGRyZW4pO1xuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgIGFuaW1hdGUoY2hpbGQsIGFuaW1hdGlvbiwgeyBkZWxheTogaSAqIHN0YWdnZXJEZWxheSwgLi4ucmVzdCB9KTtcbiAgICB9KTtcbn1cblxubGV0IHByZWZlcnNSZWR1Y2VkTW90aW9uID0gZmFsc2U7XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRNb3Rpb25QcmVmZXJlbmNlcygpIHtcbiAgICBjb25zdCBtcSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpO1xuICAgIHByZWZlcnNSZWR1Y2VkTW90aW9uID0gbXEubWF0Y2hlcztcblxuICAgIG1xLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGUgPT4ge1xuICAgICAgICBwcmVmZXJzUmVkdWNlZE1vdGlvbiA9IGUubWF0Y2hlcztcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ3JlZHVjZWQtbW90aW9uJywgZS5tYXRjaGVzKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdyZWR1Y2VkLW1vdGlvbicsIHByZWZlcnNSZWR1Y2VkTW90aW9uKTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkQW5pbWF0ZSgpIHtcbiAgICByZXR1cm4gIXByZWZlcnNSZWR1Y2VkTW90aW9uO1xufVxuIiwgImNvbnN0IHNjcm9sbFBvc2l0aW9ucyA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRG9jdW1lbnRUaXRsZSh0aXRsZSwgc3VmZml4ID0gJ1N0dWRlbnQgUHJvZ3Jlc3MgVHJhY2tlcicpIHtcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlID8gYCR7dGl0bGV9IFx1MjAxNCAke3N1ZmZpeH1gIDogc3VmZml4O1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYXZlU2Nyb2xsUG9zaXRpb24oa2V5KSB7XG4gICAgc2Nyb2xsUG9zaXRpb25zLnNldChrZXksIHdpbmRvdy5zY3JvbGxZKTtcbn1cblxuLyoqXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVzdG9yZVNjcm9sbFBvc2l0aW9uKGtleSwgeyBmYWxsYmFjayA9IDAgfSA9IHt9KSB7XG4gICAgY29uc3QgcG9zID0gc2Nyb2xsUG9zaXRpb25zLmhhcyhrZXkpID8gc2Nyb2xsUG9zaXRpb25zLmdldChrZXkpIDogZmFsbGJhY2s7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiBwb3MsIGJlaGF2aW9yOiAnaW5zdGFudCcgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRTY3JvbGxSZXN0b3JhdGlvbigpIHtcbiAgICBpZiAoJ3Njcm9sbFJlc3RvcmF0aW9uJyBpbiB3aW5kb3cuaGlzdG9yeSkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9ICdtYW51YWwnO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCAoKSA9PiB7XG4gICAgICAgIHNhdmVTY3JvbGxQb3NpdGlvbih3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUb0VsZW1lbnQoc2VsZWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgYmVoYXZpb3IgPSAnc21vb3RoJywgb2Zmc2V0ID0gMCB9ID0gb3B0aW9ucztcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICBpZiAoZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHdpbmRvdy5zY3JvbGxZIC0gb2Zmc2V0O1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHsgdG9wLCBiZWhhdmlvciB9KTtcbiAgICAgICAgICAgIGVsLmZvY3VzKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUb1RvcChvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGJlaGF2aW9yID0gJ3Ntb290aCcgfSA9IG9wdGlvbnM7XG4gICAgd2luZG93LnNjcm9sbFRvKHsgdG9wOiAwLCBiZWhhdmlvciB9KTtcbn1cbiIsICJpbXBvcnQgJy4vc3R5bGVzL21haW4uY3NzJztcbmltcG9ydCB7IGNyZWF0ZUVtcHR5U3RhdGUgfSBmcm9tICcuL2NvbXBvbmVudHMvRW1wdHlTdGF0ZS5qcyc7XG5pbXBvcnQgeyB3aXRoRXJyb3JCb3VuZGFyeSB9IGZyb20gJy4vY29tcG9uZW50cy9FcnJvckJvdW5kYXJ5LmpzJztcbmltcG9ydCB7IGNyZWF0ZUxvYWRpbmdTcGlubmVyIH0gZnJvbSAnLi9jb21wb25lbnRzL0xvYWRpbmdTcGlubmVyLmpzJztcbmltcG9ydCB7IGNyZWF0ZU1vZGFsIH0gZnJvbSAnLi9jb21wb25lbnRzL01vZGFsLmpzJztcbmltcG9ydCB7IHJlbmRlclNrZWxldG9uLCByZW1vdmVTa2VsZXRvbnMgfSBmcm9tICcuL2NvbXBvbmVudHMvU2tlbGV0b25Mb2FkZXIuanMnO1xuaW1wb3J0IHsgc2hvd0Vycm9yLCBzaG93SW5mbyB9IGZyb20gJy4vY29tcG9uZW50cy9Ub2FzdC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVUb29sdGlwIH0gZnJvbSAnLi9jb21wb25lbnRzL1Rvb2x0aXAuanMnO1xuaW1wb3J0IEF1dGhDb250ZXh0IGZyb20gJy4vY29udGV4dC9BdXRoQ29udGV4dC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMb2dpblBhZ2UgfSBmcm9tICcuL3BhZ2VzL0xvZ2luUGFnZS5qcyc7XG5pbXBvcnQgeyBpbml0QXBpIH0gZnJvbSAnLi9zZXJ2aWNlcy9hcGkuanMnO1xuaW1wb3J0IHsgaW5pdE1vdGlvblByZWZlcmVuY2VzIH0gZnJvbSAnLi91dGlscy9hbmltYXRpb25zLmpzJztcbmltcG9ydCB7IGhhbmRsZUdsb2JhbEVycm9ycyB9IGZyb20gJy4vdXRpbHMvZXJyb3JzLmpzJztcbmltcG9ydCB7IGluaXRTY3JvbGxSZXN0b3JhdGlvbiwgdXBkYXRlRG9jdW1lbnRUaXRsZSB9IGZyb20gJy4vdXRpbHMvcm91dGVyLmpzJztcblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiB3aXJlR2xvYmFsRXJyb3JIYW5kbGVyKCkge1xuICAgIGhhbmRsZUdsb2JhbEVycm9ycyhlcnJvciA9PiB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnJvcj8ubWVzc2FnZSB8fCBlcnJvcj8ucmVhc29uPy5tZXNzYWdlIHx8ICdBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VycmVkLic7XG4gICAgICAgIHNob3dFcnJvcignRXJyb3InLCBtZXNzYWdlKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiB3aXJlTmV0d29ya0RldGVjdGlvbigpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignb2ZmbGluZScsICgpID0+IHtcbiAgICAgICAgc2hvd0luZm8oJ09mZmxpbmUnLCAnWW91IGFyZSBjdXJyZW50bHkgb2ZmbGluZS4gU29tZSBmZWF0dXJlcyBtYXkgYmUgdW5hdmFpbGFibGUuJyk7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29ubGluZScsICgpID0+IHtcbiAgICAgICAgc2hvd0luZm8oJ0JhY2sgT25saW5lJywgJ1lvdXIgaW50ZXJuZXQgY29ubmVjdGlvbiBoYXMgYmVlbiByZXN0b3JlZC4nKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiB3aXJlRXJyb3JCb3VuZGFyeSgpIHtcbiAgICBjb25zdCBwYWdlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2UtY29udGVudF0nKTtcbiAgICBpZiAoIXBhZ2VDb250ZW50KSByZXR1cm47XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXRod2F5OnJvdXRlJywgKCkgPT4ge1xuICAgICAgICB3aW5kb3cuX3BhZ2VDb250ZW50ID0gcGFnZUNvbnRlbnQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHdpbmRvdy5fc2hvd0Vycm9yQm91bmRhcnkgPSAoeyB0aXRsZSwgbWVzc2FnZSwgb25SZXRyeSB9ID0ge30pID0+IHtcbiAgICAgICAgd2l0aEVycm9yQm91bmRhcnkocGFnZUNvbnRlbnQsIHsgdGl0bGUsIG1lc3NhZ2UsIG9uUmV0cnkgfSk7XG4gICAgfTtcbn1cblxubGV0IGxvZ2luUGFnZUluc3RhbmNlID0gbnVsbDtcblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiBzaG93TG9naW5WaWV3KCkge1xuICAgIGlmIChsb2dpblBhZ2VJbnN0YW5jZSkgcmV0dXJuO1xuICAgIGNvbnN0IGF1dGhSb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcm9vdCcpO1xuICAgIGlmICghYXV0aFJvb3QpIHJldHVybjtcbiAgICBjb25zdCBhcHBTaGVsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcHAtc2hlbGwnKTtcbiAgICBpZiAoYXBwU2hlbGwpIGFwcFNoZWxsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgYXV0aFJvb3Quc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgIGxvZ2luUGFnZUluc3RhbmNlID0gY3JlYXRlTG9naW5QYWdlKGF1dGhSb290KTtcbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiBzaG93QXBwVmlldygpIHtcbiAgICBpZiAobG9naW5QYWdlSW5zdGFuY2UpIHtcbiAgICAgICAgbG9naW5QYWdlSW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgICBsb2dpblBhZ2VJbnN0YW5jZSA9IG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGF1dGhSb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcm9vdCcpO1xuICAgIGlmIChhdXRoUm9vdCkgYXV0aFJvb3Quc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBjb25zdCBhcHBTaGVsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcHAtc2hlbGwnKTtcbiAgICBpZiAoYXBwU2hlbGwpIHtcbiAgICAgICAgYXBwU2hlbGwuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICBpZiAod2luZG93Lmx1Y2lkZSkge1xuICAgICAgICAgICAgd2luZG93Lmx1Y2lkZS5jcmVhdGVJY29ucygpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVBdXRoKCkge1xuICAgIEF1dGhDb250ZXh0LnN1YnNjcmliZSgoeyBpc0F1dGhlbnRpY2F0ZWQsIGlzTG9hZGluZyB9KSA9PiB7XG4gICAgICAgIGlmIChpc0xvYWRpbmcpIHJldHVybjtcbiAgICAgICAgaWYgKGlzQXV0aGVudGljYXRlZCkgc2hvd0FwcFZpZXcoKTtcbiAgICAgICAgZWxzZSBzaG93TG9naW5WaWV3KCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzaWduT3V0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2ZpbGUtZHJvcGRvd24taXRlbS0tZGFuZ2VyJyk7XG4gICAgaWYgKHNpZ25PdXRCdG4pIHtcbiAgICAgICAgc2lnbk91dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIEF1dGhDb250ZXh0LmxvZ291dCgpO1xuICAgICAgICAgICAgc2hvd0luZm8oJ1NpZ25lZCBPdXQnLCAnWW91IGhhdmUgYmVlbiBzaWduZWQgb3V0IHN1Y2Nlc3NmdWxseS4nKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmZ1bmN0aW9uIHdpcmVMb2FkaW5nU3RhdGVzKCkge1xuICAgIGNvbnN0IHBhZ2VDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtcGFnZS1jb250ZW50XScpO1xuICAgIGlmICghcGFnZUNvbnRlbnQpIHJldHVybjtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhdGh3YXk6cm91dGUnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlclNrZWxldG9uKHBhZ2VDb250ZW50LCAnY2FyZCcsIDMpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICB3aW5kb3cuX3JlbW92ZVBhZ2VTa2VsZXRvbnMgPSAoKSA9PiB7XG4gICAgICAgIHJlbW92ZVNrZWxldG9ucyhwYWdlQ29udGVudCk7XG4gICAgfTtcbn1cblxuLyoqXG4gKlxuICovXG5mdW5jdGlvbiB3aXJlVG9vbHRpcHMoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmljb24tYnV0dG9uLCAubmF2LWxpbmssIC5hY3Rpb24tYnRuLWNpcmNsZScpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICBjb25zdCBsYWJlbCA9XG4gICAgICAgICAgICBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSB8fCBlbC5xdWVyeVNlbGVjdG9yKCcubmF2LWxhYmVsJyk/LnRleHRDb250ZW50Py50cmltKCk7XG4gICAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICAgICAgY3JlYXRlVG9vbHRpcChlbCwgeyBjb250ZW50OiBsYWJlbCwgcG9zaXRpb246ICdib3R0b20nIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuZnVuY3Rpb24gd2lyZUFwcEludGVyYWN0aW9ucygpIHtcbiAgICBjb25zdCBwYWdlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXBhZ2UtY29udGVudF0nKTtcbiAgICBpZiAoIXBhZ2VDb250ZW50KSByZXR1cm47XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXRod2F5OnJvdXRlJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXBhZ2VDb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5yb3V0ZS1wbGFjZWhvbGRlciwgLnNldHRpbmdzLXBhZ2UnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqL1xuICAgIHdpbmRvdy5fc2hvd0VtcHR5U3RhdGUgPSBvcHRzID0+IHtcbiAgICAgICAgY29uc3QgZW1wdHlFbCA9IGNyZWF0ZUVtcHR5U3RhdGUob3B0cyk7XG4gICAgICAgIHBhZ2VDb250ZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBwYWdlQ29udGVudC5hcHBlbmRDaGlsZChlbXB0eUVsKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKi9cbiAgICB3aW5kb3cuX3Nob3dNb2RhbCA9IG9wdHMgPT4ge1xuICAgICAgICByZXR1cm4gY3JlYXRlTW9kYWwob3B0cyk7XG4gICAgfTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW5vdGlmaWNhdGlvbi1jbGVhcl0nKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGNyZWF0ZU1vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAnQ2xlYXIgTm90aWZpY2F0aW9ucycsXG4gICAgICAgICAgICBib2R5OiAnTWFyayBhbGwgbm90aWZpY2F0aW9ucyBhcyByZWFkPycsXG4gICAgICAgICAgICBmb290ZXI6ICc8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi0tcHJpbWFyeVwiIGRhdGEtY29uZmlybS1jbGVhcj5DbGVhciBhbGw8L2J1dHRvbj4nLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvbkNsb3NlOiAoKSA9PiB7fSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICpcbiAqL1xuYXN5bmMgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpbml0TW90aW9uUHJlZmVyZW5jZXMoKTtcbiAgICBpbml0U2Nyb2xsUmVzdG9yYXRpb24oKTtcbiAgICB1cGRhdGVEb2N1bWVudFRpdGxlKCk7XG4gICAgd2lyZUdsb2JhbEVycm9ySGFuZGxlcigpO1xuICAgIHdpcmVOZXR3b3JrRGV0ZWN0aW9uKCk7XG4gICAgd2lyZUVycm9yQm91bmRhcnkoKTtcbiAgICB3aXJlQXV0aCgpO1xuICAgIHdpcmVMb2FkaW5nU3RhdGVzKCk7XG4gICAgd2lyZVRvb2x0aXBzKCk7XG4gICAgd2lyZUFwcEludGVyYWN0aW9ucygpO1xuXG4gICAgY29uc3Qgc3Bpbm5lciA9IGNyZWF0ZUxvYWRpbmdTcGlubmVyKHsgc2l6ZTogJ2xnJywgbGFiZWw6ICdMb2FkaW5nIGFwcGxpY2F0aW9uLi4uJyB9KTtcbiAgICBzcGlubmVyLnN0eWxlLmNzc1RleHQgPVxuICAgICAgICAncG9zaXRpb246Zml4ZWQ7dG9wOjUwJTtsZWZ0OjUwJTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7ei1pbmRleDoxMDAwOyc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzcGlubmVyKTtcblxuICAgIGF3YWl0IEF1dGhDb250ZXh0LnJlc3RvcmVTZXNzaW9uKCk7XG4gICAgYXdhaXQgaW5pdEFwaSgpO1xuXG4gICAgaWYgKHNwaW5uZXIucGFyZW50Tm9kZSkgc3Bpbm5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNwaW5uZXIpO1xuXG4gICAgY29uc3QgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcC1zaGVsbCcpO1xuICAgIGlmIChhcHApIGFwcC5jbGFzc0xpc3QuYWRkKCdhcHAtLXJlYWR5Jyk7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXVGQSxTQUFTLE1BQU0sSUFBSTtBQUNmLFNBQU8sSUFBSSxRQUFRLGFBQVcsV0FBVyxTQUFTLEVBQUUsQ0FBQztBQUN6RDtBQUtBLGVBQWUsWUFBWSxLQUFLLFNBQVM7QUFDckMsUUFBTSxNQUFNLEdBQUc7QUFDZixRQUFNLE9BQU8sS0FBSyxNQUFNLFFBQVEsUUFBUSxJQUFJO0FBRTVDLE1BQUksS0FBSyxVQUFVLHNCQUFzQixLQUFLLGFBQWEsV0FBVztBQUNsRSxXQUFPLElBQUk7QUFBQSxNQUNQLEtBQUssVUFBVTtBQUFBLFFBQ1gsT0FBTyxvQkFBb0IsS0FBSyxJQUFJO0FBQUEsUUFDcEMsV0FBVyxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksSUFBTyxFQUFFLFlBQVk7QUFBQSxRQUN0RCxNQUFNO0FBQUEsVUFDRixJQUFJO0FBQUEsVUFDSixNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsUUFDVjtBQUFBLE1BQ0osQ0FBQztBQUFBLE1BQ0QsRUFBRSxRQUFRLEtBQUssU0FBUyxFQUFFLGdCQUFnQixtQkFBbUIsRUFBRTtBQUFBLElBQ25FO0FBQUEsRUFDSjtBQUVBLFNB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
