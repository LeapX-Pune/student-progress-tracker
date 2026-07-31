import {
    createOverallProgress,
    createProgressSkeleton,
    createProgressError,
} from '../components/dashboard/OverallProgress.js';
import {
    createStudentMetadata,
    createMetadataSkeleton,
    createMetadataError,
} from '../components/dashboard/StudentMetadata.js';
import {
    createStudentProfileCard,
    createProfileCardSkeleton,
    createProfileCardError,
} from '../components/dashboard/StudentProfileCard.js';
import AuthContext from '../context/AuthContext.js';
import { getStudentCourses, getStudentProfile } from '../services/studentApi.js';
import { getLetterGrade } from '../utils/courseHelpers.js';

const ACCENT_CLASSES = ['accent-1', 'accent-2', 'accent-3'];

let _currentContainer = null;
let _abortController = null;
let _isLoading = false;

/**
 *
 */
export function initDashboardPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) {
        return {
            /**
             *
             */
            destroy() {},
        };
    }

    _currentContainer = pageContent;

    /**
     *
     */
    const handleRoute = event => {
        if (event.detail?.route === 'overview' || event.detail?.route === 'dashboard') {
            _fetchDashboardData();
        }
    };

    document.addEventListener('pathway:route', handleRoute);

    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'overview' || currentHash === 'dashboard' || currentHash === '') {
        _fetchDashboardData();
    }

    return {
        /**
         *
         */
        destroy() {
            document.removeEventListener('pathway:route', handleRoute);
            _cleanup();
        },
    };
}

/**
 *
 */
async function _fetchDashboardData() {
    if (_isLoading) return;
    _isLoading = true;

    _cleanup();
    _showLoading();

    _abortController = new AbortController();

    const authState = AuthContext.getState();
    const authUser = authState.user;
    const studentId = authUser?.id || _getStudentId();

    try {
        // Fetch the student profile from the API alongside courses. The auth
        // payload is used as the identity fallback so the dashboard never
        // breaks if the profile endpoint is unavailable (FR-DASH-001/003).
        const [courses, apiProfile] = await Promise.all([
            getStudentCourses(studentId),
            getStudentProfile(studentId).catch(err => {
                console.warn('[DashboardPage] Failed to fetch student profile:', err);
                return null;
            }),
        ]);

        if (_abortController.signal.aborted) return;

        const profile = { ...(apiProfile || {}), ...(authState.user || {}) };
        _renderProfile(profile, courses);
    } catch (error) {
        if (_abortController.signal.aborted) return;

        console.error('[DashboardPage] Failed to fetch dashboard data:', error);
        _showError(error);
    } finally {
        _isLoading = false;
    }
}

/**
 *
 */
function _showLoading() {
    if (!_currentContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-profile';
    wrapper.id = 'dashboard-profile';

    wrapper.appendChild(_createHeader('Overview'));

    const statsRow = document.createElement('div');
    statsRow.className = 'overview-stats';

    for (let i = 0; i < 4; i++) {
        const card = document.createElement('div');
        card.className = 'overview-stat-card overview-stat-card--skeleton';
        card.setAttribute('aria-hidden', 'true');
        card.innerHTML = `
      <div class="skeleton skeleton--circle" style="width: 40px; height: 40px;"></div>
      <div class="skeleton skeleton--text" style="width: 48px; height: 1.5rem;"></div>
      <div class="skeleton skeleton--text" style="width: 72px; height: 0.75rem;"></div>
    `;
        statsRow.appendChild(card);
    }

    wrapper.appendChild(statsRow);

    const profileSection = document.createElement('div');
    profileSection.className = 'dashboard-profile__section';

    const profileCard = createProfileCardSkeleton();
    const progressCard = createProgressSkeleton();
    const metadataCard = createMetadataSkeleton();

    profileSection.appendChild(profileCard);
    profileSection.appendChild(progressCard);
    profileSection.appendChild(metadataCard);

    wrapper.appendChild(profileSection);
    _currentContainer.appendChild(wrapper);
}

/**
 *
 */
function _renderProfile(profile, courses) {
    if (!_currentContainer) return;

    const existing = _currentContainer.querySelector('#dashboard-profile');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-profile';
    wrapper.id = 'dashboard-profile';

    const firstName = profile?.name?.trim().split(/\s+/)[0] || '';
    wrapper.appendChild(_createHeader('Overview', firstName ? `Welcome back, ${firstName}!` : ''));

    const totalModules = courses?.reduce((sum, c) => sum + (c.totalModules || 0), 0) || 0;
    const completedModules = courses?.reduce((sum, c) => sum + (c.completedModules || 0), 0) || 0;
    const activeCourses =
        courses?.filter(c => c.status === 'in-progress' || c.status === 'not-started') || [];
    const completedCourses = courses?.filter(c => c.status === 'completed') || [];
    const grades = courses?.filter(c => c.currentGrade != null).map(c => c.currentGrade) || [];
    const avgGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    const streak = profile?.currentStreak || 12;

    const statsRow = _createStatsRow(
        activeCourses.length,
        completedCourses.length,
        avgGrade,
        streak
    );
    wrapper.appendChild(statsRow);

    const profileSection = document.createElement('div');
    profileSection.className = 'dashboard-profile__section';

    const profileCard = createStudentProfileCard(profile);
    profileSection.appendChild(profileCard);

    const progressCard = createOverallProgress({
        completed: completedModules,
        total: totalModules,
    });
    profileSection.appendChild(progressCard);

    const metadataCard = createStudentMetadata(profile, { showStreak: false });
    profileSection.appendChild(metadataCard);

    wrapper.appendChild(profileSection);

    if (courses && courses.length > 0) {
        const coursesSection = _createCoursesSection(courses);
        wrapper.appendChild(coursesSection);

        const activitySection = _createActivitySection(courses);
        wrapper.appendChild(activitySection);
    }

    _currentContainer.appendChild(wrapper);
}

/**
 * Builds the page header (title + optional greeting).
 *
 * @param {string} title - Page title
 * @param {string} [subtitle=''] - Optional greeting subtitle
 * @returns {HTMLElement} The header element
 */
function _createHeader(title, subtitle = '') {
    const header = document.createElement('header');
    header.className = 'dashboard-header';

    const h1 = document.createElement('h1');
    h1.className = 'dashboard-title';
    h1.textContent = title;
    header.appendChild(h1);

    if (subtitle) {
        const p = document.createElement('p');
        p.className = 'dashboard-subtitle';
        p.textContent = subtitle;
        header.appendChild(p);
    }

    return header;
}

/**
 *
 */
function _createStatsRow(activeCount, completedCount, avgGrade, streak) {
    const row = document.createElement('div');
    row.className = 'overview-stats';

    const stats = [
        { icon: 'book-open', label: 'Active Courses', value: String(activeCount) },
        { icon: 'check-circle', label: 'Completed Courses', value: String(completedCount) },
        { icon: 'trending-up', label: 'Average Grade', value: `${avgGrade.toFixed(1)}%` },
        { icon: 'flame', label: 'Day Streak', value: `${streak} days` },
    ];

    stats.forEach(s => {
        const card = document.createElement('div');
        card.className = 'overview-stat-card';

        const icon = document.createElement('div');
        icon.className = 'overview-stat-card__icon';
        icon.innerHTML = _getIcon(s.icon);
        card.appendChild(icon);

        const value = document.createElement('span');
        value.className = 'overview-stat-card__value';
        value.textContent = s.value;
        card.appendChild(value);

        const label = document.createElement('span');
        label.className = 'overview-stat-card__label';
        label.textContent = s.label;
        card.appendChild(label);

        row.appendChild(card);
    });

    return row;
}

/**
 *
 */
function _createCoursesSection(courses) {
    const section = document.createElement('section');
    section.className = 'overview-courses';
    section.setAttribute('aria-labelledby', 'overview-courses-title');

    const heading = document.createElement('h2');
    heading.id = 'overview-courses-title';
    heading.className = 'overview-courses__title';
    heading.textContent = 'Current Courses';
    section.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'overview-courses__list';

    courses.forEach((course, index) => {
        const card = _createCourseCard(course, index);
        list.appendChild(card);
    });

    section.appendChild(list);
    return section;
}

/**
 * Creates a single richer course card with accent color, initials icon,
 * progress stats, progress bar, and a "next up" hint.
 *
 * @param {Object} course - Course data
 * @param {number} index - Index for accent color assignment
 * @returns {HTMLElement} The course card element
 */
function _createCourseCard(course, index) {
    const accentClass = ACCENT_CLASSES[index % ACCENT_CLASSES.length];
    const progress =
        course.totalModules > 0
            ? Math.round((course.completedModules / course.totalModules) * 100)
            : 0;
    const isCompleted = course.status === 'completed';
    const statusLabel = isCompleted ? 'Completed' : 'In Progress';

    const card = document.createElement('article');
    card.className = `overview-course-card overview-course-card--${accentClass}`;

    const accent = document.createElement('div');
    accent.className = 'overview-course-card__accent';
    accent.setAttribute('aria-hidden', 'true');
    card.appendChild(accent);

    const body = document.createElement('div');
    body.className = 'overview-course-card__body';

    const top = document.createElement('div');
    top.className = 'overview-course-card__top';

    const info = document.createElement('div');
    info.className = 'overview-course-card__info';

    const icon = document.createElement('div');
    icon.className = 'overview-course-card__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = _getInitials(course.title || '');
    info.appendChild(icon);

    const meta = document.createElement('div');
    meta.className = 'overview-course-card__meta';

    const titleEl = document.createElement('h3');
    titleEl.className = 'overview-course-card__title';
    titleEl.textContent = course.title || '';
    meta.appendChild(titleEl);

    const instructorEl = document.createElement('p');
    instructorEl.className = 'overview-course-card__instructor';
    instructorEl.textContent = course.instructor || '';
    meta.appendChild(instructorEl);

    info.appendChild(meta);
    top.appendChild(info);

    const badge = document.createElement('span');
    badge.className = `overview-course-card__badge overview-course-card__badge--${isCompleted ? 'completed' : 'active'}`;
    badge.textContent = statusLabel;
    top.appendChild(badge);

    body.appendChild(top);

    const progressRow = document.createElement('div');
    progressRow.className = 'overview-course-card__progress';

    const progressValue = document.createElement('span');
    progressValue.className = 'overview-course-card__progress-value';
    progressValue.textContent = `${progress}%`;
    progressRow.appendChild(progressValue);

    const progressLabel = document.createElement('span');
    progressLabel.className = 'overview-course-card__progress-label';
    progressLabel.textContent = 'Course Progress';
    progressRow.appendChild(progressLabel);

    body.appendChild(progressRow);

    const stats = document.createElement('div');
    stats.className = 'overview-course-card__stats';

    const modulesStat = document.createElement('div');
    modulesStat.className = 'overview-course-card__stat';
    const modulesValue = document.createElement('span');
    modulesValue.className = 'overview-course-card__stat-value';
    modulesValue.textContent = `${course.completedModules || 0}/${course.totalModules || 0}`;
    modulesStat.appendChild(modulesValue);
    const modulesLabel = document.createElement('span');
    modulesLabel.className = 'overview-course-card__stat-label';
    modulesLabel.textContent = 'Modules';
    modulesStat.appendChild(modulesLabel);
    stats.appendChild(modulesStat);

    const divider = document.createElement('div');
    divider.className = 'overview-course-card__stat-divider';
    divider.setAttribute('aria-hidden', 'true');
    stats.appendChild(divider);

    const gradeStat = document.createElement('div');
    gradeStat.className = 'overview-course-card__stat';
    const gradeValue = document.createElement('span');
    gradeValue.className = 'overview-course-card__stat-value';
    if (course.currentGrade != null) {
        gradeValue.textContent = `${course.currentGrade}% (${getLetterGrade(course.currentGrade)})`;
    } else {
        gradeValue.textContent = '--';
    }
    gradeStat.appendChild(gradeValue);
    const gradeLabel = document.createElement('span');
    gradeLabel.className = 'overview-course-card__stat-label';
    gradeLabel.textContent = 'Grade';
    gradeStat.appendChild(gradeLabel);
    stats.appendChild(gradeStat);

    body.appendChild(stats);

    const barWrap = document.createElement('div');
    barWrap.className = 'overview-course-card__bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'overview-course-card__bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuenow', progress);
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-label', `${progress}% complete`);

    const fill = document.createElement('div');
    fill.className = 'overview-course-card__bar-fill';
    fill.style.width = `${progress}%`;
    bar.appendChild(fill);
    barWrap.appendChild(bar);

    const barLabel = document.createElement('div');
    barLabel.className = 'overview-course-card__bar-label';
    barLabel.setAttribute('aria-hidden', 'true');
    const barModules = document.createElement('span');
    barModules.textContent = `${course.completedModules || 0} / ${course.totalModules || 0} modules`;
    barLabel.appendChild(barModules);
    const barPercent = document.createElement('span');
    barPercent.textContent = `${progress}%`;
    barLabel.appendChild(barPercent);
    barWrap.appendChild(barLabel);

    body.appendChild(barWrap);

    const next = document.createElement('div');
    next.className = 'overview-course-card__next';
    const nextLabel = document.createElement('span');
    nextLabel.className = 'overview-course-card__next-label';
    nextLabel.textContent = 'Next up:';
    next.appendChild(nextLabel);
    const nextName = document.createElement('span');
    nextName.className = 'overview-course-card__next-name';
    nextName.textContent = course.nextModule || 'Course completed';
    next.appendChild(nextName);
    body.appendChild(next);

    card.appendChild(body);
    return card;
}

/**
 * Creates the recent activity feed sorted by most recent access.
 *
 * @param {Array} courses - Course list
 * @returns {HTMLElement} The activity section element
 */
function _createActivitySection(courses) {
    const section = document.createElement('section');
    section.className = 'overview-activity';
    section.setAttribute('aria-labelledby', 'overview-activity-title');

    const heading = document.createElement('h2');
    heading.id = 'overview-activity-title';
    heading.className = 'overview-activity__title';
    heading.textContent = 'Recent Activity';
    section.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'overview-activity__list';

    const sorted = courses
        .slice()
        .sort((a, b) => new Date(b.lastAccessedAt || 0) - new Date(a.lastAccessedAt || 0));

    sorted.forEach((course, index) => {
        const accentClass = ACCENT_CLASSES[index % ACCENT_CLASSES.length];

        const item = document.createElement('div');
        item.className = `overview-activity__item overview-activity__item--${accentClass}`;

        const dot = document.createElement('span');
        dot.className = 'overview-activity__dot';
        dot.setAttribute('aria-hidden', 'true');
        item.appendChild(dot);

        const content = document.createElement('div');
        content.className = 'overview-activity__content';

        const text = document.createElement('div');
        text.className = 'overview-activity__text';
        text.textContent = `Accessed "${course.title || ''}"`;
        content.appendChild(text);

        const meta = document.createElement('div');
        meta.className = 'overview-activity__meta';
        meta.textContent = _getTimeAgo(course.lastAccessedAt);
        content.appendChild(meta);

        item.appendChild(content);
        list.appendChild(item);
    });

    section.appendChild(list);
    return section;
}

/**
 *
 */
function _showError(error) {
    if (!_currentContainer) return;

    const existing = _currentContainer.querySelector('#dashboard-profile');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-profile';
    wrapper.id = 'dashboard-profile';

    wrapper.appendChild(_createHeader('Overview'));

    const profileError = createProfileCardError({
        message: error?.message || 'Unable to load profile',
        /**
         *
         */
        onRetry: () => _fetchDashboardData(),
    });
    wrapper.appendChild(profileError);

    const progressError = createProgressError({
        message: 'Unable to load progress',
        /**
         *
         */
        onRetry: () => _fetchDashboardData(),
    });
    wrapper.appendChild(progressError);

    const metadataError = createMetadataError({
        message: 'Unable to load student info',
        /**
         *
         */
        onRetry: () => _fetchDashboardData(),
    });
    wrapper.appendChild(metadataError);

    _currentContainer.appendChild(wrapper);
}

/**
 *
 */
function _cleanup() {
    if (_abortController) {
        _abortController.abort();
        _abortController = null;
    }

    if (_currentContainer) {
        const existing = _currentContainer.querySelector('#dashboard-profile');
        if (existing) existing.remove();

        const legacyOverview = _currentContainer.querySelector('.overview-page');
        if (legacyOverview) legacyOverview.remove();
    }
}

/**
 *
 */
function _getStudentId() {
    try {
        const authDataRaw = localStorage.getItem('student_tracker_auth');
        if (authDataRaw) {
            const authData = JSON.parse(authDataRaw);
            if (authData?.user?.id) {
                return authData.user.id;
            }
        }
    } catch (e) {
        console.warn('[DashboardPage] Failed to parse auth token:', e);
    }
    return 'stu_001';
}

/**
 * Extracts up to 2 uppercase initials from a name/title.
 *
 * @param {string} text - Source text
 * @returns {string} Initials string
 */
function _getInitials(text) {
    const parts = String(text || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    let initials = '';
    for (const part of parts) {
        initials += part[0];
    }
    return initials.toUpperCase().slice(0, 2);
}

/**
 * Formats a date as a short human-readable "time ago" string.
 *
 * @param {string} dateString - ISO date string
 * @returns {string} Time-ago label
 */
function _getTimeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

/**
 *
 */
function _getIcon(name) {
    const icons = {
        'book-open':
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        'check-circle':
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        'trending-up':
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
        flame: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    };
    return icons[name] || '';
}

export default {
    initDashboardPage,
};
