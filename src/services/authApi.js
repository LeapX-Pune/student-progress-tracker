/**
 * @fileoverview Authentication API Service — Part 3.
 *
 * Encapsulates every HTTP call related to authentication so that
 * consumers (AuthContext, useAuth hook) never deal with raw fetch
 * details, URL construction, or HTTP error codes.
 *
 * ─── Current behaviour (Part 3) ─────────────────────────────────────────────
 *   Uses the native Fetch API.  When the mock server is enabled
 *   (ENV.ENABLE_MOCK_API = true, default in development), requests are
 *   intercepted by `src/services/mock.js` and resolved locally.
 *
 * ─── Future integration (Part 8 — API Integration Layer) ────────────────────
 *   TODO (Part 8):
 *     The core ApiService class (`src/services/api.js`) will be wired here
 *     to gain retries, deduplication, and the shared response interceptor.
 *     Replace the internal `_fetch()` helper with `ApiService.post()`.
 *
 * ─── Error normalisation ────────────────────────────────────────────────────
 *   All errors are caught and converted to a { code, message } object
 *   that matches the shape expected by `AuthContext.normaliseError()`.
 *
 *   HTTP 401  → { code: 'INVALID_CREDENTIALS', message: '…' }
 *   HTTP 400  → { code: 'VALIDATION_ERROR',    message: '…' }
 *   Timeout   → { code: 'NETWORK_ERROR',       message: '…' }
 *   Network   → { code: 'NETWORK_ERROR',       message: '…' }
 *   Other     → { code: 'UNKNOWN',             message: '…' }
 *
 * @module services/authApi
 */

import { ENV } from '../config/env.js';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants.js';

// ─── Private helpers ──────────────────────────────────────────────────────────

/**
 * Performs a fetch request with an AbortController timeout.
 * Returns the parsed JSON response body on HTTP 2xx.
 * Throws a normalised error object on any failure.
 *
 * @param {string} url     - Absolute or relative URL
 * @param {RequestInit} options - Fetch options (method, headers, body …)
 * @param {number} timeoutMs   - Request timeout in milliseconds
 * @returns {Promise<unknown>} Parsed JSON response body
 * @throws {{ code: string, message: string }} Normalised error
 */
async function _fetch(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return await _handleResponse(response);
    } catch (err) {
        clearTimeout(timeoutId);

        // AbortError means the timeout fired.
        if (err.name === 'AbortError') {
            throw {
                code: ERROR_CODES.NETWORK_ERROR,
                message: 'Request timed out. Please check your connection and try again.',
            };
        }

        // TypeError from fetch means no network connectivity.
        if (err instanceof TypeError) {
            throw {
                code: ERROR_CODES.NETWORK_ERROR,
                message: 'Unable to connect. Please check your internet connection.',
            };
        }

        // Already a normalised error — re-throw as-is.
        if (err && typeof err === 'object' && 'code' in err) {
            throw err;
        }

        throw {
            code: ERROR_CODES.UNKNOWN,
            message: err?.message ?? 'An unexpected error occurred.',
        };
    }
}

/**
 * Reads a fetch Response and maps HTTP status codes to normalised errors.
 * Returns the parsed JSON body on HTTP 2xx.
 *
 * @param {Response} response - The raw fetch Response object
 * @returns {Promise<unknown>} Parsed JSON body
 * @throws {{ code: string, message: string }} Normalised error
 */
async function _handleResponse(response) {
    // Parse the body regardless of status so error messages from the API
    // can be surfaced to the user.
    let body = null;
    try {
        body = await response.json();
    } catch {
        // Non-JSON body — ignore parse failure; use generic messages below.
    }

    if (response.ok) {
        return body;
    }

    // Map HTTP status → normalised error code.
    switch (response.status) {
        case 400:
            throw {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: body?.message ?? 'The request contained invalid data.',
            };
        case 401:
            throw {
                code: ERROR_CODES.INVALID_CREDENTIALS,
                message: body?.message ?? 'Invalid email or password.',
            };
        default:
            throw {
                code: ERROR_CODES.UNKNOWN,
                message: body?.message ?? `Server error (${response.status}).`,
            };
    }
}

// ─── Exported API ─────────────────────────────────────────────────────────────

/**
 * Sends the user's credentials to the authentication endpoint and returns
 * the resulting token payload on success.
 *
 * The endpoint is `POST ENV.API_BASE_URL + API_ENDPOINTS.AUTH_LOGIN`.
 * In development, the mock server (`src/services/mock.js`) intercepts this
 * request and responds with a synthetic token when the demo credentials are
 * provided (`student@demo.com` / `demo123`).
 *
 * On success, returns the raw API response body:
 * ```json
 * {
 *   "token":     "mock-jwt-token-…",
 *   "expiresAt": "2026-08-22T15:00:00.000Z",
 *   "user": {
 *     "id":    "stu_001",
 *     "name":  "Alex Johnson",
 *     "email": "student@demo.com",
 *     "role":  "student"
 *   }
 * }
 * ```
 * `authStorage.saveAuthToken()` normalises `expiresAt` to a numeric
 * timestamp before storing it, so callers do not need to do this themselves.
 *
 * On failure, throws a normalised `{ code, message }` error object.
 * The caller (AuthContext.login) catches this and stores it in state —
 * this function should never be called inside a try/catch by the component.
 *
 * @param {Object}  credentials            - Login form data
 * @param {string}  credentials.email      - User's email address
 * @param {string}  credentials.password   - User's password
 * @param {boolean} [credentials.rememberMe=false] - Passed through to the
 *   caller for storage-tier selection; not sent to the API
 * @returns {Promise<{ token: string, expiresAt: string|number, user: Object }>}
 *   The raw auth response body
 * @throws {{ code: string, message: string }} Normalised error on failure
 *
 * @example
 * // Inside AuthContext.login() — after Part 8 wiring:
 * const authResponse = await authApi.login({ email, password, rememberMe });
 * // authResponse = { token, expiresAt, user }
 */
export async function login({ email, password }) {
    const url = `${ENV.API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`;

    return _fetch(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // rememberMe is a client-side concept — not sent to the server.
            body: JSON.stringify({ email, password }),
        },
        ENV.API_TIMEOUT
    );
}

/**
 * Sends a server-side logout request if the API supports token invalidation.
 *
 * This is a best-effort call — client-side token removal via
 * `authStorage.clearAuthToken()` is always performed first by the caller
 * (AuthContext.logout) regardless of whether this request succeeds.
 *
 * Currently resolves immediately because the mock server does not implement
 * a logout endpoint.
 *
 * TODO (Part 8 — API Integration):
 *   Implement the actual POST to `/api/auth/logout` with the Bearer token
 *   in the Authorization header.  Ensure failure does NOT prevent the client
 *   from clearing local state (fire-and-forget pattern is acceptable).
 *
 * @param {string} [_token] - The current auth token (for the Authorization header)
 * @returns {Promise<void>} Always resolves; never rejects
 */
export async function logout(_token) {
    // TODO (Part 8): POST /api/auth/logout with Authorization: Bearer <token>
    // For now this is a client-side-only operation.
    return Promise.resolve();
}
