/**
 * Environment configuration with validation and defaults.
 * Uses import.meta.env (injected by esbuild define) with fallbacks.
 */

const DEFAULTS = {
    APP_NAME: 'Student Progress Tracker',
    APP_VERSION: '0.1.0',
    API_BASE_URL: '/api',
    API_TIMEOUT: 10000,
    AUTH_TOKEN_KEY: 'student_tracker_auth',
    AUTH_REDIRECT_KEY: 'student_tracker_redirect',
    AUTH_REMEMBER_DAYS: 30,
    ENABLE_MOCK_API: true,
    ENABLE_PWA: false,
    ENABLE_ANALYTICS: false,
    CHART_ANIMATION_DURATION: 750,
    CHART_RESPONSIVE: true,
};

/**
 *
 */
function getEnv(key, defaultValue) {
    const env = typeof import.meta !== 'undefined' && import.meta.env;
    const value = env ? env[key] : undefined;
    if (value === undefined || value === '') return defaultValue;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value) && value !== '') return Number(value);
    return value;
}

export const ENV = {
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

export default ENV;
