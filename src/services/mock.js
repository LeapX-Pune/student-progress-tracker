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

    if (body.name) {
        const signupRole = body.role || 'student';
        return new Response(
            JSON.stringify({
                token: 'mock-jwt-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                user: {
                    id: signupRole === 'teacher' ? 'tch_mock' : 'stu_mock',
                    name: body.name,
                    email: body.email,
                    role: signupRole,
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
async function handlePutStudent(request) {
    const denied = checkMockPermission(PERMISSIONS.READ_STUDENTS); // or UPDATE_STUDENTS
    if (denied) return denied;
    await delay(200);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const bodyText = await request.text();

    let updates = {};
    try {
        if (bodyText) updates = JSON.parse(bodyText);
    } catch (_e) {
        // ignore JSON parse errors
    }

    const student = MOCK_USERS.find(u => u.id === id);
    if (student) {
        if (updates.phone !== undefined) student.phone = updates.phone;
        if (updates.emergencyContact !== undefined)
            student.emergencyContact = updates.emergencyContact;
        if (updates.address !== undefined) student.address = updates.address;
        if (updates.bio !== undefined) student.bio = updates.bio;
        if (updates.avatarUrl !== undefined) student.avatarUrl = updates.avatarUrl;

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
async function handleGetSettings(request) {
    await delay(100);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];

    let settings = MOCK_STUDENT_SETTINGS.find(s => s.studentId === studentId);
    if (!settings) {
        settings = {
            studentId,
            theme: 'system',
            language: 'en-US',
            timeZone: 'UTC',
            emailNotifications: true,
            notificationSound: true,
            compactView: false,
            dashboardWidgets: ['courses', 'grades', 'attendance'],
            defaultLandingPage: 'dashboard',
        };
    }
    return new Response(JSON.stringify(settings), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
 */
async function handlePutSettings(request) {
    await delay(100);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];
    const bodyText = await request.text();

    let updates = {};
    try {
        if (bodyText) updates = JSON.parse(bodyText);
    } catch (_e) {
        // ignore JSON parse errors
    }

    let settings = MOCK_STUDENT_SETTINGS.find(s => s.studentId === studentId);
    if (!settings) {
        settings = { studentId, ...updates };
        MOCK_STUDENT_SETTINGS.push(settings);
    } else {
        Object.assign(settings, updates);
    }

    return new Response(JSON.stringify(settings), {
        status: 200,
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

    if (window.AuthContext && window.AuthContext.isAuthenticated()) {
        const user = window.AuthContext.getCurrentStudent();
        if (user && user.id !== studentId) {
            return new Response(JSON.stringify({ message: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        courses = getCoursesForStudent(studentId);
    } else {
        courses = [];
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
    if (window.AuthContext && window.AuthContext.isAuthenticated()) {
        const user = window.AuthContext.getCurrentStudent();
        if (user && user.id !== studentId) {
            return new Response(JSON.stringify({ message: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        grades = getGradesForStudent(studentId);
    } else {
        grades = null;
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
 *
 */
async function handleGetMetrics(request) {
    await delay(100);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];
    const metrics = getMetricsForStudent(studentId);
    if (metrics) {
        return new Response(JSON.stringify(metrics), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return new Response(JSON.stringify({ message: 'Metrics not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
 */
async function handleGetNotifications(request) {
    await delay(100);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];
    const notifications = getNotificationsForStudent(studentId);
    return new Response(JSON.stringify(notifications), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
 */
async function handleGetUpcoming(request) {
    await delay(100);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];
    const upcoming = getUpcomingActivitiesForStudent(studentId);
    return new Response(JSON.stringify(upcoming), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 *
 */
async function handleMarkAllNotificationsRead(request) {
    await delay(100);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];

    MOCK_NOTIFICATIONS.forEach(n => {
        if (n.studentId === studentId) {
            n.isRead = true;
        }
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle PATCH for a specific notification
 */
async function handlePatchNotification(request) {
    await delay(100);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const bodyText = await request.text();

    let updates = {};
    try {
        if (bodyText) updates = JSON.parse(bodyText);
    } catch (_e) {
        // ignore
    }

    const notification = MOCK_NOTIFICATIONS.find(n => n.id === id);
    if (notification) {
        if (typeof updates.isRead === 'boolean') {
            notification.isRead = updates.isRead;
        }
        return new Response(JSON.stringify(notification), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Notification not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle PATCH for a specific upcoming activity
 */
async function handlePatchActivity(request) {
    await delay(100);
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const bodyText = await request.text();

    let updates = {};
    try {
        if (bodyText) updates = JSON.parse(bodyText);
    } catch (_e) {
        // ignore
    }

    const activity = MOCK_UPCOMING_ACTIVITIES.find(a => a.id === id);
    if (activity) {
        if (updates.status === 'completed') {
            activity.status = 'completed';
        }
        return new Response(JSON.stringify(activity), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ message: 'Activity not found' }), {
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

/**
 * Handle GET course modules
 */
async function handleGetCourseModules(request) {
    await delay(100);
    const url = new URL(request.url);
    const courseId = url.pathname.split('/')[3];
    const data = MOCK_COURSE_MODULES.find(m => m.courseId === courseId);
    return new Response(JSON.stringify(data ? data.modules : []), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle GET course timeline
 */
async function handleGetCourseTimeline(request) {
    await delay(100);
    const url = new URL(request.url);
    const courseId = url.pathname.split('/')[3];
    const studentId = url.searchParams.get('studentId') || 'stu_001';
    const data = MOCK_COURSE_TIMELINES.find(
        m => m.courseId === courseId && m.studentId === studentId
    );
    return new Response(JSON.stringify(data || {}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle GET course metrics
 */
async function handleGetCourseMetrics(request) {
    await delay(100);
    const url = new URL(request.url);
    const courseId = url.pathname.split('/')[3];
    const studentId = url.searchParams.get('studentId') || 'stu_001';
    const data = MOCK_COURSE_METRICS.find(
        m => m.courseId === courseId && m.studentId === studentId
    );
    return new Response(JSON.stringify(data || {}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle GET academic performance
 */
async function handleGetAcademicPerformance(request) {
    await delay(200);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];
    const data = MOCK_GRADES_ANALYTICS.find(m => m.studentId === studentId);

    return new Response(JSON.stringify(data || {}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Handle GET attendance
 */
async function handleGetAttendance(request) {
    await delay(200);
    const url = new URL(request.url);
    const studentId = url.pathname.split('/')[3];
    const data = MOCK_ATTENDANCE_RECORDS.find(m => m.studentId === studentId);

    return new Response(JSON.stringify(data || {}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

const routes = {
    'POST:/api/auth/login': handleLogin,
    'GET:/api/students/:id': handleGetStudent,
    'PUT:/api/students/:id': handlePutStudent,
    'GET:/api/students/:id/settings': handleGetSettings,
    'PUT:/api/students/:id/settings': handlePutSettings,
    'PUT:/api/students/:id/preferences': handlePutSettings,
    'PUT:/api/students/:id/notifications/mark-all-read': handleMarkAllNotificationsRead,
    'GET:/api/students/:id/courses': handleGetCourses,
    'GET:/api/students/:id/grades': handleGetGrades,
    'GET:/api/students/:id/metrics': handleGetMetrics,
    'GET:/api/students/:id/notifications': handleGetNotifications,
    'GET:/api/students/:id/upcoming': handleGetUpcoming,
    'GET:/api/students/:id/performance': handleGetAcademicPerformance,
    'GET:/api/students/:id/attendance': handleGetAttendance,
    'PATCH:/api/notifications/:id': handlePatchNotification,
    'PATCH:/api/upcoming/:id': handlePatchActivity,
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
