/**
 * Authentication Module — Part 3
 * File: src/services/authApi.js
 *
 * Purpose:
 *   Authentication-specific API service layer. Encapsulates all
 *   HTTP calls related to authentication (login, token refresh,
 *   logout) so that consumers (AuthContext, hooks) never need
 *   to know about raw fetch/URL details.
 *
 * Planned exports (to be implemented):
 *
 *   login({ email, password, rememberMe })
 *     - POST /api/auth/login
 *     - Returns: { token, expiresAt, user } on success
 *     - Throws a normalised error object on 400 / 401
 *
 *   logout()
 *     - Optional server-side logout call (if the API supports it)
 *     - Client-side token invalidation is handled by authStorage
 *
 * Error normalisation:
 *   - 401 → { code: 'INVALID_CREDENTIALS', message: '…' }
 *   - 400 → { code: 'VALIDATION_ERROR', message: '…' }
 *   - network → { code: 'NETWORK_ERROR', message: '…' }
 *
 * Dependencies (once implemented):
 *   - src/config/env.js  (ENV.API_BASE_URL, ENV.API_TIMEOUT)
 *   - utils/authHelpers.js
 *   - utils/constants.js  (API_ENDPOINTS)
 *
 * NOTE: Uses the native Fetch API with AbortController for
 *       timeouts. No external HTTP library (aligns with PRD §6.2
 *       zero-dependency approach).
 *
 * TODO: Implement login() API call and error normalisation
 *       (AUTH-004, FR-AUTH-001, FR-AUTH-002, FR-API-001).
 */

export {};
