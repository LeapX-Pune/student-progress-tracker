/**
 * @fileoverview Authentication API Service — Part 3.
 *
 * Encapsulates every HTTP call related to authentication so that
 * consumers (AuthContext, useAuth hook) never deal with raw fetch
 * details, URL construction, or HTTP error codes.
 *
 * ─── API Integration Layer (Part 8) ─────────────────────────────────────────
 *   Uses the core ApiService (`src/services/api.js`) for retries,
 *   deduplication, and the shared response interceptor.
 *
 * ─── Error normalisation ────────────────────────────────────────────────────
 *   All errors are caught and converted to a { code, message } object
 *   that matches the shape expected by `AuthContext.normaliseError()`.
 *
 *   HTTP 401  → { code: 'INVALID_CREDENTIALS', message: '…' }
 *   HTTP 400  → { code: 'VALIDATION_ERROR',    message: '…' }
 *   Network   → { code: 'NETWORK_ERROR',       message: '…' }
 *   Other     → { code: 'UNKNOWN',             message: '…' }
 *
 * @module services/authApi
 */

import { api } from './api.js';
import { API_ENDPOINTS, ERROR_CODES } from '../utils/constants.js';
import { ENV } from '../config/env.js';

// ─── Exported API ─────────────────────────────────────────────────────────────

/**
 * Sends the user's credentials to the authentication endpoint and returns
 * the resulting token payload on success.
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
 *
 * On failure, throws a normalised `{ code, message }` error object.
 *
 * @param {Object}  credentials            - Login form data
 * @param {string}  credentials.email      - User's email address
 * @param {string}  credentials.password   - User's password
 * @returns {Promise<{ token: string, expiresAt: string|number, user: Object }>}
 *   The raw auth response body
 * @throws {{ code: string, message: string }} Normalised error on failure
 */
export async function login({ email, password }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ENV.API_TIMEOUT || 10000);

    try {
        const response = await api.post(API_ENDPOINTS.AUTH_LOGIN, { email, password }, {
            signal: controller.signal
        });
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

/**
 * Sends a server-side logout request to invalidate the token.
 *
 * This is a best-effort call — client-side token removal via
 * `authStorage.clearAuthToken()` is always performed first by the caller
 * (AuthContext.logout) regardless of whether this request succeeds.
 *
 * @returns {Promise<void>} Always resolves; never rejects
 */
export async function logout() {
    try {
        await api.post('/auth/logout', {});
    } catch (err) {
        // Fire-and-forget: fail silently so the client can still clear local state.
    }
}
