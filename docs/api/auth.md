# Authentication Flow

## Login

1. User submits email + password via `POST /auth/login`
2. On success, API returns `{ token, expiresAt, user }`
3. Token is stored in `localStorage` (or `sessionStorage` if "Remember Me" is
   unchecked)
4. Auth context updates, user is redirected to dashboard

## Session Persistence

- On page load, stored token is checked for expiry
- Valid token restores the session automatically
- Expired token triggers redirect to login

## Logout

- Token is cleared from storage
- Auth context resets
- User is redirected to login

## Route Protection

- Unauthenticated users accessing protected routes are redirected to `/login`
  with a `redirect` query param
- After login, they are returned to the original destination
