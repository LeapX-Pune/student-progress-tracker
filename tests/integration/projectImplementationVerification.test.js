import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import AuthContext from '../../src/context/AuthContext.js';
import {
    getStudentProfile,
    getStudentCourses,
    getStudentGrades,
    getStudentMetrics,
    getStudentNotifications,
} from '../../src/services/studentApi.js';
import { useCourses } from '../../src/hooks/useCourses.js';
import { useGrades } from '../../src/hooks/useGrades.js';
import { useAttendance } from '../../src/hooks/useAttendance.js';
import { useNotifications } from '../../src/hooks/useNotifications.js';
import { createToolbar } from '../../src/components/Toolbar.js';

import { setupMockServer } from '../../src/services/mock.js';

describe('Final Project Verification Suite — Phase 3.2 → Phase 4.8', () => {
    beforeAll(() => {
        setupMockServer();
    });

    beforeEach(() => {
        sessionStorage.clear();
        AuthContext._session = null;
    });

    // --- Phase 3.2 & 3.3: Data Architecture & Authentication ---
    describe('Phase 3.2 & 3.3: Data Architecture & Authentication', () => {
        it('✓ AuthContext login works & resolves student correctly', async () => {
            const result = await AuthContext.login({
                email: 'student@demo.com',
                password: 'demo123',
                role: 'student',
            });
            expect(result.user).toBeDefined();
            expect(result.user.role).toBe('student');
        });

        it('✓ Services automatically use authenticated student and data exists', async () => {
            await AuthContext.login({
                email: 'student@demo.com',
                password: 'demo123',
                role: 'student',
            });

            const profile = await getStudentProfile();
            expect(profile).toBeDefined();
            expect(profile.id).toBe(AuthContext.getCurrentUserId());

            const courses = await getStudentCourses();
            expect(courses).toBeDefined();
            expect(courses.length).toBeGreaterThan(0);

            const metrics = await getStudentMetrics();
            expect(metrics).toBeDefined();

            const grades = await getStudentGrades();
            expect(grades).toBeDefined();

            const notifications = await getStudentNotifications();
            expect(notifications).toBeDefined();
        });
    });

    // --- Phase 3.4 & 3.5: Authorization Verification ---
    describe('Phase 3.4 & 3.5: Authorization Verification', () => {
        it('✓ Rejects Teacher/Admin login', async () => {
            const res1 = await AuthContext.login({
                email: 'teacher@demo.com',
                password: 'demo123',
                role: 'teacher',
            });
            expect(res1.success).toBe(false);

            const res2 = await AuthContext.login({
                email: 'admin@demo.com',
                password: 'demo123',
                role: 'admin',
            });
            expect(res2.success).toBe(false);
        });
    });

    // --- Phase 4.7: Search & Filtering ---
    describe('Phase 4.7: Search & Filtering Verification', () => {
        it('✓ Hooks support search, filter, sort', () => {
            const cHook = useCourses();
            expect(cHook.setSearch).toBeTypeOf('function');
            expect(cHook.setFilter).toBeTypeOf('function');
            expect(cHook.setSort).toBeTypeOf('function');
            expect(cHook.subscribe).toBeTypeOf('function');

            const gHook = useGrades();
            expect(gHook.setSearch).toBeTypeOf('function');
            expect(gHook.setFilter).toBeTypeOf('function');
            expect(gHook.setSort).toBeTypeOf('function');
            expect(gHook.subscribe).toBeTypeOf('function');

            const aHook = useAttendance();
            expect(aHook.setSearch).toBeTypeOf('function');
            expect(aHook.setFilter).toBeTypeOf('function');
            expect(aHook.setSort).toBeTypeOf('function');
            expect(aHook.subscribe).toBeTypeOf('function');

            const nHook = useNotifications();
            expect(nHook.setSearch).toBeTypeOf('function');
            expect(nHook.setFilter).toBeTypeOf('function');
            expect(nHook.setSort).toBeTypeOf('function');
            expect(nHook.subscribe).toBeTypeOf('function');
        });
    });

    // --- Phase 4.7: Search & Filtering ---
    describe('Phase 4.7: Search & Filtering Verification', () => {
        it('Courses hook supports search, filter, sort', () => {
            const hook = useCourses();
            expect(hook.setSearch).toBeTypeOf('function');
            expect(hook.setFilter).toBeTypeOf('function');
            expect(hook.setSort).toBeTypeOf('function');
            expect(hook.subscribe).toBeTypeOf('function');
        });

        it('Grades hook supports search, filter, sort', () => {
            const hook = useGrades();
            expect(hook.setSearch).toBeTypeOf('function');
            expect(hook.setFilter).toBeTypeOf('function');
            expect(hook.setSort).toBeTypeOf('function');
            expect(hook.subscribe).toBeTypeOf('function');
        });

        it('Attendance hook supports search, filter, sort', () => {
            const hook = useAttendance();
            expect(hook.setSearch).toBeTypeOf('function');
            expect(hook.setFilter).toBeTypeOf('function');
            expect(hook.setSort).toBeTypeOf('function');
            expect(hook.subscribe).toBeTypeOf('function');
        });

        it('Notifications hook supports search, filter, sort', () => {
            const hook = useNotifications();
            expect(hook.setSearch).toBeTypeOf('function');
            expect(hook.setFilter).toBeTypeOf('function');
            expect(hook.setSort).toBeTypeOf('function');
            expect(hook.subscribe).toBeTypeOf('function');
        });
    });

    // --- Phase 4.8: Final UX ---
    describe('Phase 4.8: Final UX Verification', () => {
        it('✓ Toolbar component creates accessible inputs', () => {
            const toolbar = createToolbar({ searchPlaceholder: 'Test Search' });
            const input = toolbar.querySelector('input');
            expect(input).not.toBeNull();
            expect(input.getAttribute('aria-label')).toBe('Test Search');
        });
    });
});
