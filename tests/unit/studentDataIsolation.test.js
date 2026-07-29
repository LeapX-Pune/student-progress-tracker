import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import AuthContext from '../../src/context/AuthContext.js';
import { setupMockServer } from '../../src/services/mock.js';
import { getStudentCourses } from '../../src/services/studentApi.js';
import { AUTH_CONSTANTS } from '../../src/utils/constants.js';

describe('Student Data Isolation (Phase 3.5)', () => {
    let teardownMock;

    beforeEach(() => {
        teardownMock = setupMockServer();
        AuthContext.logout();
    });

    afterEach(() => {
        if (teardownMock) teardownMock();
        AuthContext.logout();
    });

    it('Scenario: Student fetch isolates data to the authenticated student', async () => {
        // 1. Authenticate as the demo student
        const authResult = await AuthContext.login({
            email: AUTH_CONSTANTS.DEMO_STUDENT.email,
            password: AUTH_CONSTANTS.DEMO_STUDENT.password,
            role: 'student',
        });
        expect(authResult.success).toBe(true);
        expect(AuthContext.isAuthenticated()).toBe(true);

        const currentStudent = AuthContext.getCurrentStudent();
        expect(currentStudent.studentId).toBe('STU-2024-001');

        // 2. Fetch courses for this student
        const courses = await getStudentCourses(currentStudent.id);
        expect(courses).toBeDefined();
        expect(Array.isArray(courses)).toBe(true);

        // 3. Attempt to fetch courses for another student ID (should be forbidden by mock API)
        let forbiddenError;
        try {
            await getStudentCourses('stu_999_other');
        } catch (err) {
            forbiddenError = err;
        }

        // Mock API should reject fetching for other students
        expect(forbiddenError).toBeDefined();
        expect(forbiddenError.message).toContain('permission');
    });
});
