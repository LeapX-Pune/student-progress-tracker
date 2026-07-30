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
import { getStudentCourses } from '../services/studentApi.js';

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
    const profile = authState.user;
    const studentId = profile?.id || _getStudentId();

    try {
        const courses = await getStudentCourses(studentId);

        if (_abortController.signal.aborted) return;

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

    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Dashboard';
    title.style.marginBottom = '2rem';
    title.style.fontSize = '2.25rem';
    title.style.fontWeight = '700';
    wrapper.appendChild(title);

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

    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Dashboard';
    title.style.marginBottom = '2rem';
    title.style.fontSize = '2.25rem';
    title.style.fontWeight = '700';
    wrapper.appendChild(title);

    const totalModules = courses?.reduce((sum, c) => sum + (c.totalModules || 0), 0) || 0;
    const completedModules = courses?.reduce((sum, c) => sum + (c.completedModules || 0), 0) || 0;
    const activeCourses =
        courses?.filter(c => c.status === 'in-progress' || c.status === 'not-started') || [];
    const grades = courses?.filter(c => c.currentGrade != null).map(c => c.currentGrade) || [];
    const avgGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    const streak = profile?.currentStreak || 12;

    const statsRow = _createStatsRow(
        activeCourses.length,
        avgGrade,
        totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
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

    const metadataCard = createStudentMetadata(profile);
    profileSection.appendChild(metadataCard);

    wrapper.appendChild(profileSection);

    if (courses && courses.length > 0) {
        const coursesSection = _createCoursesSection(courses);
        wrapper.appendChild(coursesSection);
    }

    _currentContainer.appendChild(wrapper);
}

/**
 *
 */
function _createStatsRow(activeCount, avgGrade, overallProgress, streak) {
    const row = document.createElement('div');
    row.className = 'overview-stats';

    const stats = [
        { icon: 'book-open', label: 'Active Courses', value: String(activeCount) },
        { icon: 'trending-up', label: 'Average Grade', value: `${avgGrade.toFixed(1)}%` },
        { icon: 'target', label: 'Overall Progress', value: `${overallProgress}%` },
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

    const heading = document.createElement('h2');
    heading.className = 'overview-courses__title';
    heading.textContent = 'Current Courses';
    section.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'overview-courses__list';

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'overview-course-card';

        const progress =
            course.totalModules > 0
                ? Math.round((course.completedModules / course.totalModules) * 100)
                : 0;

        const header = document.createElement('div');
        header.className = 'overview-course-card__header';

        const titleEl = document.createElement('h3');
        titleEl.className = 'overview-course-card__title';
        titleEl.textContent = course.title;
        header.appendChild(titleEl);

        const gradeEl = document.createElement('span');
        gradeEl.className = 'overview-course-card__grade';
        gradeEl.textContent = course.currentGrade ? `${course.currentGrade}%` : '--';
        header.appendChild(gradeEl);

        card.appendChild(header);

        const instructor = document.createElement('p');
        instructor.className = 'overview-course-card__instructor';
        instructor.textContent = course.instructor || '';
        card.appendChild(instructor);

        const barWrapper = document.createElement('div');
        barWrapper.className = 'overview-course-card__bar';

        const bar = document.createElement('div');
        bar.className = 'overview-course-card__bar-fill';
        bar.style.width = `${progress}%`;
        barWrapper.appendChild(bar);
        card.appendChild(barWrapper);

        const footer = document.createElement('div');
        footer.className = 'overview-course-card__footer';

        const modules = document.createElement('span');
        modules.className = 'overview-course-card__modules';
        modules.textContent = `${course.completedModules}/${course.totalModules} modules`;
        footer.appendChild(modules);

        const badge = document.createElement('span');
        badge.className = `overview-course-card__badge overview-course-card__badge--${course.status === 'completed' ? 'completed' : 'active'}`;
        badge.textContent = course.status === 'completed' ? 'Completed' : 'In Progress';
        footer.appendChild(badge);

        card.appendChild(footer);
        list.appendChild(card);
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

    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Dashboard';
    title.style.marginBottom = '2rem';
    title.style.fontSize = '2.25rem';
    title.style.fontWeight = '700';
    wrapper.appendChild(title);

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
 *
 */
function _getIcon(name) {
    const icons = {
        'book-open':
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        'trending-up':
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
        target: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        flame: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    };
    return icons[name] || '';
}

export default {
    initDashboardPage,
};
