/**
 * @fileoverview DashboardPage — Dashboard Student Profile — Part 5.
 *
 * Assembles the main dashboard view by composing the profile card,
 * overall progress, and metadata sections. Handles loading (skeleton),
 * error (retry), and lifecycle (mount/unmount) states.
 *
 * @module pages/DashboardPage
 */

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

// ─── State ────────────────────────────────────────────────────────────────────

let _currentContainer = null;
let _abortController = null;
let _isLoading = false;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initializes the dashboard page and mounts it into the page content area.
 *
 * @returns {Object} Dashboard page instance with destroy method
 */
export function initDashboardPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) {
        return {
            /**
             * No-op destroy method.
             */
            destroy() {},
        };
    }

    _currentContainer = pageContent;

    /**
     * Handles the route event for dashboard.
     * @param {Event} event - Route event
     */
    const handleRoute = event => {
        if (event.detail?.route === 'overview' || event.detail?.route === 'dashboard') {
            _fetchDashboardData();
        }
    };

    document.addEventListener('pathway:route', handleRoute);

    // Check if we are already on the dashboard route
    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'overview' || currentHash === 'dashboard' || currentHash === '') {
        _fetchDashboardData();
    }

    return {
        /**
         * Destroys the dashboard page instance.
         */
        destroy() {
            document.removeEventListener('pathway:route', handleRoute);
            _cleanup();
        },
    };
}

/**
 * Fetches dashboard data and renders the profile components.
 */
async function _fetchDashboardData() {
    if (_isLoading) return;
    _isLoading = true;

    _cleanup();
    _showLoading();

    _abortController = new AbortController();

    // Get user data from AuthContext (matches logged-in user)
    const authState = AuthContext.getState();
    const profile = authState.user;
    const studentId = profile?.id || _getStudentId();

    try {
        // Fetch courses only (profile comes from AuthContext)
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
 * Shows loading skeleton states.
 */
function _showLoading() {
    if (!_currentContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-profile';
    wrapper.id = 'dashboard-profile';

    // Title
    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Dashboard';
    title.style.marginBottom = '2rem';
    title.style.fontSize = '2.25rem';
    title.style.fontWeight = '700';
    wrapper.appendChild(title);

    // Profile section with skeleton
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
 * Renders the profile components with actual data.
 *
 * @param {Object} profile - Student profile data
 * @param {Array} courses - Student courses data
 */
function _renderProfile(profile, courses) {
    if (!_currentContainer) return;

    // Remove existing dashboard if present
    const existing = _currentContainer.querySelector('#dashboard-profile');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-profile';
    wrapper.id = 'dashboard-profile';

    // Title
    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Dashboard';
    title.style.marginBottom = '2rem';
    title.style.fontSize = '2.25rem';
    title.style.fontWeight = '700';
    wrapper.appendChild(title);

    // Calculate overall progress from courses
    const totalModules = courses?.reduce((sum, c) => sum + (c.totalModules || 0), 0) || 0;
    const completedModules = courses?.reduce((sum, c) => sum + (c.completedModules || 0), 0) || 0;

    // Profile section
    const profileSection = document.createElement('div');
    profileSection.className = 'dashboard-profile__section';

    // Profile card
    const profileCard = createStudentProfileCard(profile);
    profileSection.appendChild(profileCard);

    // Overall progress
    const progressCard = createOverallProgress({
        completed: completedModules,
        total: totalModules,
    });
    profileSection.appendChild(progressCard);

    // Student metadata
    const metadataCard = createStudentMetadata(profile);
    profileSection.appendChild(metadataCard);

    wrapper.appendChild(profileSection);
    _currentContainer.appendChild(wrapper);
}

/**
 * Shows error state with retry option.
 *
 * @param {Error} error - The error that occurred
 */
function _showError(error) {
    if (!_currentContainer) return;

    // Remove existing dashboard if present
    const existing = _currentContainer.querySelector('#dashboard-profile');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'dashboard-profile';
    wrapper.id = 'dashboard-profile';

    // Title
    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Dashboard';
    title.style.marginBottom = '2rem';
    title.style.fontSize = '2.25rem';
    title.style.fontWeight = '700';
    wrapper.appendChild(title);

    // Error states
    const profileError = createProfileCardError({
        message: error?.message || 'Unable to load profile',
        /**
         * Retry callback for profile error.
         */
        onRetry: () => _fetchDashboardData(),
    });
    wrapper.appendChild(profileError);

    const progressError = createProgressError({
        message: 'Unable to load progress',
        /**
         * Retry callback for progress error.
         */
        onRetry: () => _fetchDashboardData(),
    });
    wrapper.appendChild(progressError);

    const metadataError = createMetadataError({
        message: 'Unable to load student info',
        /**
         * Retry callback for metadata error.
         */
        onRetry: () => _fetchDashboardData(),
    });
    wrapper.appendChild(metadataError);

    _currentContainer.appendChild(wrapper);
}

/**
 * Cleans up the current dashboard state.
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
 * Gets the current student ID from auth storage.
 *
 * @returns {string} The student ID
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
    return 'stu_001'; // Default fallback
}

export default {
    initDashboardPage,
};
