import db from '../../mock-api/db.json';
import { AUTH_CONSTANTS } from '../utils/constants.js';

const mockStudent = {
    ...AUTH_CONSTANTS.DEMO_STUDENT,
    enrolledAt: '2024-01-15T00:00:00.000Z',
    currentStreak: 5,
    lastActiveAt: '2024-03-20T10:30:00.000Z',
};

const mockTeacher = {
    ...AUTH_CONSTANTS.DEMO_TEACHER,
};

const mockCourses = db.courses;
const mockGrades = {
    quizScores: db.quizScores,
    gradeDistribution: db.gradeDistribution,
    weeklyProgress: db.weeklyProgress,
};

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

    const student = db.students.find(s => s.email === body.email && s.password === body.password);

    if (student) {
        return new Response(
            JSON.stringify({
                token: 'mock-jwt-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                user: {
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    role: 'student',
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }

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
        return new Response(
            JSON.stringify({
                token: 'mock-jwt-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                user: {
                    id: mockStudent.id,
                    studentId: mockStudent.studentId,
                    name: mockStudent.name,
                    email: mockStudent.email,
                    role: mockStudent.role,
                    avatar: mockStudent.avatar,
                    avatarUrl: mockStudent.avatarUrl,
                    class: mockStudent.class,
                    rollNumber: mockStudent.rollNumber,
                    status: mockStudent.status,
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
        return new Response(
            JSON.stringify({
                token: 'mock-jwt-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                user: {
                    id: mockTeacher.id,
                    teacherId: mockTeacher.teacherId,
                    name: mockTeacher.name,
                    email: mockTeacher.email,
                    role: mockTeacher.role,
                    avatar: mockTeacher.avatar,
                    avatarUrl: mockTeacher.avatarUrl,
                    department: mockTeacher.department,
                    designation: mockTeacher.designation,
                    status: mockTeacher.status,
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
 *
 */
async function handleGetStudent(request) {
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const student = db.students.find(s => s.id === id);

    if (student) {
        return new Response(JSON.stringify(student), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (id === 'stu_001') {
        return new Response(JSON.stringify(mockStudent), {
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
    await delay(250);
    const url = new URL(request.url);
    const id = url.pathname.split('/')[3];

    if (id === 'stu_001') {
        return new Response(JSON.stringify(mockCourses), {
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
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/')[3];

    if (id === 'stu_001') {
        return new Response(JSON.stringify(mockGrades), {
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

    const course = mockCourses.find(c => c.id === id);
    if (course) {
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
    const id = url.pathname.split('/')[3];

    const course = mockCourses.find(c => c.id === id);
    if (course) {
        return new Response(
            JSON.stringify({
                id,
                completedModules: course.completedModules,
                totalModules: course.totalModules,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    return new Response(JSON.stringify({ message: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
 */
async function handleGetWeeklyProgress(_request) {
    await delay(150);
    return new Response(JSON.stringify(db.weeklyProgress), {
        status: 200,
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
    'GET:/api/weeklyProgress': handleGetWeeklyProgress,
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
                const colonIndex = routeKey.indexOf(':');
                const routeMethod = routeKey.substring(0, colonIndex);
                const routePattern = routeKey.substring(colonIndex + 1);
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
