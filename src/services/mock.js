import db from '../../mock-api/db.json';

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
    const body = await request.json().catch(() => ({}));

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

    const courses = mockCourses.filter(c => c.studentId === id);

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
async function handleGetGrades() {
    await delay(200);

    const gradesData = {
        quizScores: mockGrades.quizScores,
        gradeDistribution: mockGrades.gradeDistribution,
        weeklyProgress: mockGrades.weeklyProgress,
    };

    return new Response(JSON.stringify(gradesData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
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
 *
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
        const url = typeof input === 'string' ? input : input.url;
        const method = (options.method || 'GET').toUpperCase();
        const key = `${method}:${new URL(url, window.location.origin).pathname}`;

        let matchedRoute = routes[key];

        if (!matchedRoute) {
            const pathname = new URL(url, window.location.origin).pathname;
            for (const [routeKey, handler] of Object.entries(routes)) {
                const colonIndex = routeKey.indexOf(':');
                const routeMethod = routeKey.slice(0, colonIndex);
                const routePattern = routeKey.slice(colonIndex + 1);

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
            const request = new Request(url, options);
            return matchedRoute(request);
        }

        return originalFetch.call(window, input, options);
    };

    return () => {
        window.fetch = originalFetch;
    };
}
