import { ROLES, PERMISSIONS } from '../config/rbac.js';
import { AUTH_CONSTANTS } from '../utils/constants.js';

// ============================================================================
// RELATIONAL DATASETS (PHASE 3.2 REFACTOR)
// ============================================================================

const MOCK_USERS = [
    {
        ...AUTH_CONSTANTS.DEMO_STUDENT,
        phone: '+1 (555) 123-4567',
        emergencyContact: 'Jane Doe (+1 555-987-6543)',
        address: '123 University Ave, Apt 4B',
        bio: 'Passionate about computer science and mathematics.',
        department: 'Computer Science',
        program: 'B.Sc. Computer Science',
        semester: 6,
        batch: 'Class of 2025',
        academicAdvisor: 'Dr. Alan Turing',
        enrolledAt: '2024-01-15T00:00:00.000Z',
        currentStreak: 5,
        lastActiveAt: '2024-03-20T10:30:00.000Z',
    },
];

const MOCK_STUDENT_SETTINGS = [
    {
        studentId: 'stu_001',
        theme: 'system',
        language: 'en-US',
        timeZone: 'America/New_York',
        emailNotifications: true,
        notificationSound: true,
        compactView: false,
        dashboardWidgets: ['courses', 'grades', 'attendance', 'upcoming'],
        defaultLandingPage: 'dashboard',
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
            overallAttendance: 96.2,
            academicSummary: {
                currentSemester: 'Spring 2025',
                academicYear: '2024-2025',
                overallGpa: 3.8,
                creditsEarned: 84,
                creditsRemaining: 36,
                totalRegisteredCredits: 120,
            },
            attendanceOverview: {
                overallAttendance: 96.2,
                classesAttended: 120,
                classesMissed: 5,
                trend: 'stable',
            },
            weeklyActivity: {
                hoursStudied: 14.5,
                modulesCompleted: 3,
                assignmentsSubmitted: 2,
                quizAttempts: 1,
            },
        },
    },
];

const MOCK_NOTIFICATIONS = [
    {
        id: 'notif_1',
        studentId: 'stu_001',
        title: 'Assignment Reminder',
        message: 'Your Physics assignment is due tomorrow.',
        type: 'warning',
        isRead: false,
        timestamp: '2025-05-14T09:00:00Z',
    },
    {
        id: 'notif_2',
        studentId: 'stu_001',
        title: 'Grade Published',
        message: 'Your Math Midterm grade has been published.',
        type: 'success',
        isRead: true,
        timestamp: '2025-05-12T14:30:00Z',
    },
];

const MOCK_UPCOMING_ACTIVITIES = [
    {
        id: 'act_1',
        studentId: 'stu_001',
        title: 'Physics Lab Report',
        type: 'Assignment',
        dueDate: '2025-05-16T23:59:00Z',
        course: 'Physics 101',
    },
    {
        id: 'act_2',
        studentId: 'stu_001',
        title: 'Math Quiz 3',
        type: 'Quiz',
        dueDate: '2025-05-18T10:00:00Z',
        course: 'Calculus II',
    },
];

const MOCK_COURSE_MODULES = [
    {
        courseId: 'crs_001',
        modules: [
            { id: 'm1', title: 'Introduction to Calculus', isCompleted: true, isLocked: false },
            { id: 'm2', title: 'Limits and Continuity', isCompleted: true, isLocked: false },
            { id: 'm3', title: 'Derivatives', isCompleted: false, isLocked: false },
            { id: 'm4', title: 'Integrals', isCompleted: false, isLocked: true },
            { id: 'm5', title: 'Applications of Integration', isCompleted: false, isLocked: true },
        ],
    },
];

const MOCK_COURSE_TIMELINES = [
    {
        courseId: 'crs_001',
        studentId: 'stu_001',
        enrolledAt: '2024-01-15T08:00:00Z',
        lastAccessedAt: '2024-03-19T14:30:00Z',
        lastQuizAttemptAt: '2024-03-15T10:00:00Z',
        recentActivity: 'Completed Module 2 Quiz',
    },
];

const MOCK_COURSE_METRICS = [
    {
        courseId: 'crs_001',
        studentId: 'stu_001',
        completionPercentage: 75,
        averageQuizScore: 88,
        timeSpentHours: 45.5,
        estimatedRemainingHours: 12.5,
        assignmentCompletionRate: 90,
    },
];

const MOCK_GRADES_ANALYTICS = [
    {
        studentId: 'stu_001',
        semesterGpa: 3.8,
        overallGpa: 3.75,
        creditsCompleted: 45,
        subjectsPassed: 15,
        subjectsRemaining: 25,
        overallStanding: 'Excellent',
        highestScoringSubject: 'Advanced Mathematics',
        lowestScoringSubject: 'Computer Science Fundamentals',
    },
];

const MOCK_ATTENDANCE_RECORDS = [
    {
        studentId: 'stu_001',
        overallPercentage: 92,
        trend: [90, 92, 88, 94, 96, 98],
        courses: [
            {
                courseId: 'crs_001',
                courseName: 'Advanced Mathematics',
                percentage: 95,
                conducted: 20,
                attended: 19,
                missed: 1,
                required: 75,
                status: 'Excellent',
            },
            {
                courseId: 'crs_002',
                courseName: 'Computer Science Fundamentals',
                percentage: 85,
                conducted: 20,
                attended: 17,
                missed: 3,
                required: 75,
                status: 'Good',
            },
        ],
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

        let calculatedStatus;
        if (enr.completedModules === 0) {
            calculatedStatus = 'not-started';
        } else if (enr.completedModules === course.totalModules) {
            calculatedStatus = 'completed';
        } else if (enr.completedModules / course.totalModules >= 0.8) {
            calculatedStatus = 'almost-complete';
        } else {
            calculatedStatus = 'in-progress';
        }

        // Merge course metadata with student-specific enrollment data
        return { ...course, ...enr, id: course.id, status: calculatedStatus };
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
function getMetricsForStudent(studentId) {
    return MOCK_STUDENT_METRICS.find(m => m.studentId === studentId) || null;
}

/**
 *
 */
function getNotificationsForStudent(studentId) {
    return MOCK_NOTIFICATIONS.filter(n => n.studentId === studentId);
}

/**
 *
 */
function getUpcomingActivitiesForStudent(studentId) {
    return MOCK_UPCOMING_ACTIVITIES.filter(a => a.studentId === studentId);
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
    'GET:/api/courses/:id/modules': handleGetCourseModules,
    'GET:/api/courses/:id/timeline': handleGetCourseTimeline,
    'GET:/api/courses/:id/metrics': handleGetCourseMetrics,
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
            const request = new Request(parsedUrl.href, options);
            return matchedRoute(request);
        }

        return originalFetch.call(window, input, options);
    };

    return () => {
        window.fetch = originalFetch;
    };
}
