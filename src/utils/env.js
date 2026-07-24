const _env = typeof import.meta !== 'undefined' && import.meta.env;
const config = {
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

/**
 *
 */
export function getConfig() {
    return { ...config };
}

/**
 *
 */
export function isDevelopment() {
    return config.appEnv === 'development';
}

/**
 *
 */
export function isStaging() {
    return config.appEnv === 'staging';
}

/**
 *
 */
export function isProduction() {
    return config.appEnv === 'production';
}

/**
 *
 */
export function isMockApiEnabled() {
    return config.apiMockEnabled;
}

export default config;
