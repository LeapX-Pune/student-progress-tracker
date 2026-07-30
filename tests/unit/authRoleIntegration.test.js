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

    it('defines role-aware demo user constants for Student and Teacher', () => {
        expect(AUTH_CONSTANTS.DEMO_STUDENT).toBeDefined();
        expect(AUTH_CONSTANTS.DEMO_STUDENT.email).toBe('student@demo.com');
        expect(AUTH_CONSTANTS.DEMO_STUDENT.role).toBe('student');
        expect(AUTH_CONSTANTS.DEMO_STUDENT.studentId).toBe('STU-2024-001');

        expect(AUTH_CONSTANTS.DEMO_TEACHER).toBeDefined();
        expect(AUTH_CONSTANTS.DEMO_TEACHER.email).toBe('teacher@demo.com');
        expect(AUTH_CONSTANTS.DEMO_TEACHER.role).toBe('teacher');
        expect(AUTH_CONSTANTS.DEMO_TEACHER.teacherId).toBe('TCH-2024-001');
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

    // Scenario 2: Teacher selected + Teacher credentials
    it('Scenario 2: authenticates Teacher demo user and extends session user object', async () => {
        const result = await AuthContext.login({
            email: AUTH_CONSTANTS.DEMO_TEACHER.email,
            password: AUTH_CONSTANTS.DEMO_TEACHER.password,
            role: 'teacher',
            rememberMe: false,
        });

        expect(result.success).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.user.role).toBe('teacher');
        expect(result.user.teacherId).toBe('TCH-2024-001');
        expect(result.user.department).toBe('Mathematics & Computer Science');
        expect(result.user.designation).toBe('Senior Educator');

        const state = AuthContext.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.user.role).toBe('teacher');

        const stored = getAuthToken();
        expect(stored).not.toBeNull();
        expect(stored.user.role).toBe('teacher');
        expect(stored.user.department).toBe('Mathematics & Computer Science');
    });

    // Scenario 3: Student selected + Teacher credentials
    it('Scenario 3: rejects Teacher credentials when Student role is selected', async () => {
        const result = await AuthContext.login({
            email: AUTH_CONSTANTS.DEMO_TEACHER.email,
            password: AUTH_CONSTANTS.DEMO_TEACHER.password,
            role: 'student',
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid email or password for selected role');
        expect(AuthContext.getState().isAuthenticated).toBe(false);
    });

    // Scenario 4: Teacher selected + Student credentials
    it('Scenario 4: rejects Student credentials when Teacher role is selected', async () => {
        const result = await AuthContext.login({
            email: AUTH_CONSTANTS.DEMO_STUDENT.email,
            password: AUTH_CONSTANTS.DEMO_STUDENT.password,
            role: 'teacher',
        });

        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid email or password for selected role');
        expect(AuthContext.getState().isAuthenticated).toBe(false);
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
        const mockUser = { ...AUTH_CONSTANTS.DEMO_TEACHER };
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
        expect(restoredState.user.role).toBe('teacher');
        expect(restoredState.user.teacherId).toBe('TCH-2024-001');
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
