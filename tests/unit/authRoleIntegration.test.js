import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import AuthContext from '../../src/context/AuthContext.js';
import { AUTH_CONSTANTS } from '../../src/utils/constants.js';
import { saveAuthToken, getAuthToken, clearAuthToken } from '../../src/services/authStorage.js';
import { setupMockServer } from '../../src/services/mock.js';
import { validateLoginForm } from '../../src/utils/validation.js';

describe('Role-Based Authentication Integration (Phase 1.5 Validation)', () => {
    let teardownMock;

    beforeEach(() => {
        teardownMock = setupMockServer();
        clearAuthToken();
        AuthContext.logout();
    });

    afterEach(() => {
        if (teardownMock) teardownMock();
        clearAuthToken();
        AuthContext.logout();
    });

    it('defines role-aware demo user constant for Student', () => {
        expect(AUTH_CONSTANTS.DEMO_STUDENT).toBeDefined();
        expect(AUTH_CONSTANTS.DEMO_STUDENT.email).toBe('student@demo.com');
        expect(AUTH_CONSTANTS.DEMO_STUDENT.role).toBe('student');
    });

    // Scenario 1: Student selected + Student credentials
    it('Scenario 1: authenticates Student demo user and extends session user object', async () => {
        const result = await AuthContext.login({
            email: AUTH_CONSTANTS.DEMO_STUDENT.email,
            password: AUTH_CONSTANTS.DEMO_STUDENT.password,
            role: 'student',
            rememberMe: true,
        });

        expect(result.success).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.user.role).toBe('student');
        expect(result.user.studentId).toBe('STU-2024-001');
        expect(result.user.class).toBe('Class 10-A');
        expect(result.user.status).toBe('active');
        expect(result.user.avatar).toBeDefined();
        expect(result.user.avatarUrl).toBeDefined();

        const state = AuthContext.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.user.role).toBe('student');

        const stored = getAuthToken();
        expect(stored).not.toBeNull();
        expect(stored.user.role).toBe('student');
        expect(stored.user.studentId).toBe('STU-2024-001');
    });

    // Scenario 5: Incorrect Password
    it('Scenario 5: rejects login attempt with incorrect password', async () => {
        const result = await AuthContext.login({
            email: AUTH_CONSTANTS.DEMO_STUDENT.email,
            password: 'wrongpassword',
            role: 'student',
        });

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(AuthContext.getState().isAuthenticated).toBe(false);
    });

    // Scenario 6: Empty Fields Validation
    it('Scenario 6: validates empty form fields via client validation', () => {
        const emptyResult = validateLoginForm({ email: '', password: '' });
        expect(emptyResult).not.toBeNull();
        expect(emptyResult.email).toBeDefined();
        expect(emptyResult.password).toBeDefined();

        const invalidEmail = validateLoginForm({ email: 'not-an-email', password: '123' });
        expect(invalidEmail).not.toBeNull();
        expect(invalidEmail.email).toBeDefined();
    });

    // Scenario 7: Refresh Browser / Session Restoration
    it('Scenario 7: restores authenticated session upon browser reload', async () => {
        const mockUser = { ...AUTH_CONSTANTS.DEMO_STUDENT };
        saveAuthToken({
            token: 'mock-jwt-token-restore-123',
            expiresAt: Date.now() + 3600000,
            user: mockUser,
            rememberMe: true,
        });

        // Reset in-memory AuthContext state to simulate a fresh page load
        AuthContext.setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,
            error: null,
        });

        expect(AuthContext.getState().isAuthenticated).toBe(false);
        expect(getAuthToken()).not.toBeNull();

        await AuthContext.restoreSession();

        const restoredState = AuthContext.getState();
        expect(restoredState.isAuthenticated).toBe(true);
        expect(restoredState.user.role).toBe('student');
        expect(restoredState.user.studentId).toBe('STU-2024-001');
    });

    // Scenario 8: Logout Session Teardown
    it('Scenario 8: clears session storage and resets state on logout', async () => {
        await AuthContext.login({
            email: AUTH_CONSTANTS.DEMO_STUDENT.email,
            password: AUTH_CONSTANTS.DEMO_STUDENT.password,
            role: 'student',
        });

        expect(AuthContext.getState().isAuthenticated).toBe(true);
        expect(getAuthToken()).not.toBeNull();

        AuthContext.logout();

        expect(AuthContext.getState().isAuthenticated).toBe(false);
        expect(AuthContext.getState().user).toBeNull();
        expect(getAuthToken()).toBeNull();
    });
});
