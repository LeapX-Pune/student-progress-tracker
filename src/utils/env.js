let importEnv;

try {
    importEnv = typeof import.meta !== 'undefined' ? import.meta.env : void 0;
} catch {
    importEnv = void 0;
}

/**
 *
 */
const e = (key, fallback) => {
    try {
        const val = importEnv ? importEnv[key] : void 0;
        return val !== void 0 ? val : fallback;
    } catch {
        return fallback;
    }
};

const config = {
    appName: e('VITE_APP_NAME', 'Student Progress Tracker'),
    appEnv: e('VITE_APP_ENV', 'development'),
    apiBaseUrl: e('VITE_API_BASE_URL', 'http://localhost:3001/api'),
    apiMockEnabled: (() => {
        const val = e('VITE_ENABLE_MOCK_API', void 0);
        if (val === void 0) return false; // Default to false to use json-server (db.json)
        return val === true || val === 'true';
    })(),
    authTokenKey: e('VITE_AUTH_TOKEN_KEY', 'auth_token'),
    sessionTimeoutMinutes: parseInt(e('VITE_SESSION_TIMEOUT_MINUTES', '60'), 10),
    enableAnalytics: (() => {
        const val = e('VITE_ENABLE_ANALYTICS', void 0);
        return val === true || val === 'true';
    })(),
    enableNotifications: (() => {
        const val = e('VITE_ENABLE_NOTIFICATIONS', void 0);
        if (val === void 0) return true;
        return val !== false && val !== 'false';
    })(),
    cacheTtlSeconds: parseInt(e('VITE_CACHE_TTL_SECONDS', '300'), 10),
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
