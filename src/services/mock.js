import { ROLES, PERMISSIONS } from '../config/rbac.js';
import { AUTH_CONSTANTS } from '../utils/constants.js';

// ============================================================================
// RELATIONAL DATASETS (PHASE 3.2 REFACTOR)
// ============================================================================

const MOCK_USERS = [
    {
        ...AUTH_CONSTANTS.DEMO_STUDENT,
        enrolledAt: '2024-01-15T00:00:00.000Z',
        currentStreak: 5,
        lastActiveAt: '2024-03-20T10:30:00.000Z',
    },
    {
        ...AUTH_CONSTANTS.DEMO_TEACHER,
    },
];

const MOCK_COURSES = [
    {
        id: 'crs_001',
        title: 'Advanced Mathematics',
        instructor: 'Dr. Smith',
        thumbnailUrl: 'https://picsum.photos/seed/math/400/225',
        description: 'Advanced topics in calculus, linear algebra, and statistics',
        totalModules: 12,
        term: 'Spring 2024',
    },
    {
        id: 'crs_002',
        title: 'Computer Science Fundamentals',
        instructor: 'Prof. Davis',
        thumbnailUrl: 'https://picsum.photos/seed/cs/400/225',
        description: 'Data structures, algorithms, and software design patterns',
        totalModules: 10,
        term: 'Spring 2024',
    },
    {
        id: 'crs_003',
        title: 'Physics II: Electromagnetism',
        instructor: 'Dr. Wilson',
        thumbnailUrl: 'https://picsum.photos/seed/physics/400/225',
        description: 'Electromagnetic theory, circuits, and wave propagation',
        totalModules: 14,
        term: 'Spring 2024',
    },
];

const MOCK_ENROLLMENTS = [
    {
        id: 'enr_001',
        studentId: 'stu_001',
        courseId: 'crs_001',
        completedModules: 8,
        status: 'in-progress',
        currentGrade: 88,
        lastAccessedAt: '2024-03-19T14:30:00.000Z',
        nextModule: 'Module 9: Differential Equations',
    },
    {
        id: 'enr_002',
        studentId: 'stu_001',
        courseId: 'crs_002',
        completedModules: 10,
        status: 'completed',
        currentGrade: 94,
        lastAccessedAt: '2024-03-18T09:15:00.000Z',
        nextModule: null,
    },
    {
        id: 'enr_003',
        studentId: 'stu_001',
        courseId: 'crs_003',
        completedModules: 5,
        status: 'in-progress',
        currentGrade: 76,
        lastAccessedAt: '2024-03-17T11:00:00.000Z',
        nextModule: 'Module 6: Electric Potential',
    },
];

const MOCK_STUDENT_METRICS = [
    {
        studentId: 'stu_001',
        grades: {
            quizScores: [
                { label: 'Quiz 1', score: 85, maxScore: 100 },
                { label: 'Quiz 2', score: 92, maxScore: 100 },
                { label: 'Quiz 3', score: 78, maxScore: 100 },
                { label: 'Quiz 4', score: 95, maxScore: 100 },
                { label: 'Quiz 5', score: 88, maxScore: 100 },
            ],
            gradeDistribution: [
                { label: 'A', percentage: 25 },
                { label: 'B', percentage: 40 },
                { label: 'C', percentage: 20 },
                { label: 'D', percentage: 10 },
                { label: 'F', percentage: 5 },
            ],
            weeklyProgress: [
                { week: 'Week 1', completed: 3, total: 3 },
                { week: 'Week 2', completed: 2, total: 3 },
                { week: 'Week 3', completed: 3, total: 3 },
                { week: 'Week 4', completed: 1, total: 3 },
                { week: 'Week 5', completed: 3, total: 3 },
                { week: 'Week 6', completed: 2, total: 3 },
            ],
        },
    },
];

// ============================================================================
// TRANSFORMATION LAYER (HELPERS)
// ============================================================================

/**
 *
 */
function getCoursesForStudent(studentId) {
    const enrollments = MOCK_ENROLLMENTS.filter(e => e.studentId === studentId);
    return enrollments.map(enr => {
        const course = MOCK_COURSES.find(c => c.id === enr.courseId);
        // Merge course metadata with student-specific enrollment data
        return { ...course, ...enr, id: course.id };
    });
}

/**
 *
 */
function getGradesForStudent(studentId) {
    const metrics = MOCK_STUDENT_METRICS.find(m => m.studentId === studentId);
    return metrics ? metrics.grades : null;
}

/**
 *
 */
function getCourseDetails(courseId) {
    return MOCK_COURSES.find(c => c.id === courseId);
}

/**
 *
 */
function getCourseProgress(courseId, studentId = 'stu_001') {
    // Fallback to stu_001 to maintain backward compatibility since the current
    // endpoint (/api/courses/:id/progress) doesn't pass a student ID.
    const enrollment = MOCK_ENROLLMENTS.find(
        e => e.courseId === courseId && e.studentId === studentId
    );
    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (enrollment && course) {
        return {
            id: courseId,
            completedModules: enrollment.completedModules,
            totalModules: course.totalModules,
        };
    }
    return null;
}

/**
 *
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 *
 */
async function handleLogin(request) {
    await delay(300);
    const bodyText = await request.text();
    const body = JSON.parse(bodyText || '{}');

    if (
        body.email === AUTH_CONSTANTS.DEMO_STUDENT.email &&
        body.password === AUTH_CONSTANTS.DEMO_STUDENT.password
    ) {
        if (body.role && body.role !== 'student') {
            return new Response(
                JSON.stringify({ message: 'Invalid email or password for selected role' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const student = MOCK_USERS.find(u => u.role === ROLES.STUDENT);
        return new Response(
            JSON.stringify({
                token: 'mock-jwt-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                user: {
                    id: student.id,
                    studentId: student.studentId,
                    name: student.name,
                    email: student.email,
                    role: student.role,
                    avatar: student.avatar,
                    avatarUrl: student.avatarUrl,
                    class: student.class,
                    rollNumber: student.rollNumber,
                    status: student.status,
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (
        body.email === AUTH_CONSTANTS.DEMO_TEACHER.email &&
        body.password === AUTH_CONSTANTS.DEMO_TEACHER.password
    ) {
        if (body.role && body.role !== 'teacher') {
            return new Response(
                JSON.stringify({ message: 'Invalid email or password for selected role' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
        const teacher = MOCK_USERS.find(u => u.role === ROLES.TEACHER);
        return new Response(
            JSON.stringify({
                token: 'mock-jwt-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                user: {
                    id: teacher.id,
                    teacherId: teacher.teacherId,
                    name: teacher.name,
                    email: teacher.email,
                    role: teacher.role,
                    avatar: teacher.avatar,
                    avatarUrl: teacher.avatarUrl,
                    department: teacher.department,
                    designation: teacher.designation,
                    status: teacher.status,
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Helper to enforce permissions at the mock API layer
 */
function checkMockPermission(permission) {
    if (
        window.AuthContext &&
        window.AuthContext.isAuthenticated() &&
        !window.AuthContext.hasPermission(permission)
    ) {
        return new Response(
            JSON.stringify({ message: 'Access Denied: Missing permission ' + permission }),
            {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
    return null;
}

/**
 *
 */
async function handleGetStudent(request) {
    const denied = checkMockPermission(PERMISSIONS.READ_STUDENTS);
    if (denied) return denied;
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const student = MOCK_USERS.find(u => u.id === id);
    if (student) {
        return new Response(JSON.stringify(student), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Student not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
 */
async function handleGetCourses(request) {
    const denied = checkMockPermission(PERMISSIONS.READ_COURSES);
    if (denied) return denied;

    await delay(250);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];

    let courses;

    if (window.AuthContext && window.AuthContext.isStudent()) {
        const user = window.AuthContext.getCurrentUser();
        if (user && user.studentId !== studentId) {
            return new Response(JSON.stringify({ message: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        courses = getCoursesForStudent(studentId);
    } else {
        // Teacher or Admin sees all courses for now
        courses = MOCK_COURSES;
    }

    if (courses.length > 0) {
        return new Response(JSON.stringify(courses), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Courses not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
 */
async function handleGetGrades(request) {
    const denied = checkMockPermission(PERMISSIONS.READ_GRADES);
    if (denied) return denied;

    await delay(200);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];

    let grades;
    if (window.AuthContext && window.AuthContext.isStudent()) {
        const user = window.AuthContext.getCurrentUser();
        if (user && user.studentId !== studentId) {
            return new Response(JSON.stringify({ message: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        grades = getGradesForStudent(studentId);
    } else {
        // Teachers/Admins see all requested grades
        grades = getGradesForStudent(studentId);
    }

    if (grades) {
        return new Response(JSON.stringify(grades), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Grades not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle individual course fetch
 */
async function handleGetCourse(request) {
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const course = getCourseDetails(id);
    if (course) {
        // Mock a single course response (without student specific data unless we pass student id)
        return new Response(JSON.stringify(course), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle course progress fetch
 */
async function handleGetCourseProgress(request) {
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/')[3]; // /api/courses/:id/progress
    const studentId = url.searchParams.get('studentId');

    const progress = getCourseProgress(id, studentId || 'stu_001');
    if (progress) {
        return new Response(JSON.stringify(progress), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

const routes = {
    'POST:/api/auth/login': handleLogin,
    'GET:/api/students/:id': handleGetStudent,
    'GET:/api/students/:id/courses': handleGetCourses,
    'GET:/api/students/:id/grades': handleGetGrades,
    'GET:/api/courses/:id': handleGetCourse,
    'GET:/api/courses/:id/progress': handleGetCourseProgress,
};

/**
 *
 */
export function setupMockServer() {
    const originalFetch = window.fetch;

    /**
     *
     */
    window.fetch = async (input, options = {}) => {
        const urlStr = typeof input === 'string' ? input : input.url;
        const method = (options.method || 'GET').toUpperCase();
        const baseOrigin =
            window.location.origin && window.location.origin !== 'null'
                ? window.location.origin
                : 'http://localhost:3001';
        const parsedUrl = new URL(urlStr, baseOrigin);
        const key = `${method}:${parsedUrl.pathname}`;

        let matchedRoute = routes[key];

        if (!matchedRoute) {
            const pathname = parsedUrl.pathname;
            for (const [routeKey, handler] of Object.entries(routes)) {
                const [routeMethod, routePattern] = routeKey.split(':');
                if (routeMethod !== method) continue;

                const routeParts = routePattern.split('/');
                const pathParts = pathname.split('/');

                if (routeParts.length !== pathParts.length) continue;

                let match = true;
                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith(':')) continue;
                    if (routeParts[i] !== pathParts[i]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    matchedRoute = handler;
                    break;
                }
            }
        }

        if (matchedRoute) {
            const request = new Request(parsedUrl.href, options);
            return matchedRoute(request);
        }

        return originalFetch.call(window, input, options);
    };

    return () => {
        window.fetch = originalFetch;
    };
}
