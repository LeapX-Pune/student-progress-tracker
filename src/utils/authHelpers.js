/**
 * Authentication Module — Part 3
 * File: src/utils/authHelpers.js
 *
 * Purpose:
 *   Pure, stateless helper functions for the authentication
 *   module. No side effects; no imports from services or context.
 *
 * Planned exports (to be implemented):
 *
 *   getInitials(name)
 *     - Returns up to 2 uppercase initials from a full name
 *     - e.g. "Alex Johnson" → "AJ", "Priya" → "P"
 *
 *   getAvatarColor(seed)
 *     - Derives a consistent hex background colour from a string
 *       seed (user ID or name) for the avatar fallback
 *     - Returns a CSS colour string, e.g. "#4F46E5"
 *
 *   isTokenExpired(expiresAt)
 *     - Returns true if Date.now() > expiresAt
 *     - Returns true if expiresAt is falsy (treat as expired)
 *
 *   buildLoginRedirectUrl(path)
 *     - Constructs "/login?redirect=<encodedPath>"
 *
 *   getRedirectDestination(searchString)
 *     - Parses the `redirect` query param from a URL search string
 *     - Returns the path or '/dashboard' as default
 *
 *   sanitizePath(path)
 *     - Ensures the redirect target is a relative path
 *       (prevents open-redirect attacks)
 *
 * TODO: Implement all helper functions (AUTH-005, AUTH-006,
 *       AUTH-015, AUTH-017, FR-AUTH-005, FR-DASH-005).
 */

export {};
