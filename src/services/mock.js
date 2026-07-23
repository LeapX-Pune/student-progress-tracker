const mockStudent = {
  id: 'stu_001',
  name: 'Alex Johnson',
  email: 'student@demo.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=stu_001',
  studentId: 'STU-2024-001',
  enrolledAt: '2024-01-15T00:00:00.000Z',
  currentStreak: 5,
  lastActiveAt: '2024-03-20T10:30:00.000Z',
};

const mockCourses = [
  {
    id: 'crs_001',
    studentId: 'stu_001',
    title: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    thumbnailUrl: 'https://picsum.photos/seed/math/400/225',
    description: 'Advanced topics in calculus, linear algebra, and statistics',
    totalModules: 12,
    completedModules: 8,
    status: 'in-progress',
    currentGrade: 88,
    term: 'Spring 2024',
    lastAccessedAt: '2024-03-19T14:30:00.000Z',
    nextModule: 'Module 9: Differential Equations',
  },
  {
    id: 'crs_002',
    studentId: 'stu_001',
    title: 'Computer Science Fundamentals',
    instructor: 'Prof. Davis',
    thumbnailUrl: 'https://picsum.photos/seed/cs/400/225',
    description: 'Data structures, algorithms, and software design patterns',
    totalModules: 10,
    completedModules: 10,
    status: 'completed',
    currentGrade: 94,
    term: 'Spring 2024',
    lastAccessedAt: '2024-03-18T09:15:00.000Z',
    nextModule: null,
  },
  {
    id: 'crs_003',
    studentId: 'stu_001',
    title: 'Physics II: Electromagnetism',
    instructor: 'Dr. Wilson',
    thumbnailUrl: 'https://picsum.photos/seed/physics/400/225',
    description: 'Electromagnetic theory, circuits, and wave propagation',
    totalModules: 14,
    completedModules: 5,
    status: 'in-progress',
    currentGrade: 76,
    term: 'Spring 2024',
    lastAccessedAt: '2024-03-17T11:00:00.000Z',
    nextModule: 'Module 6: Electric Potential',
  },
];

const mockGrades = {
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
async function handleLogin(url, options) {
  await delay(300);
  const body = JSON.parse(options.body || '{}');

  if (body.email === 'student@demo.com' && body.password === 'demo123') {
    return new Response(
      JSON.stringify({
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        user: { id: 'stu_001', name: 'Alex Johnson', email: 'student@demo.com', role: 'student' },
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

const routes = {
  'POST:/api/auth/login': handleLogin,
  'GET:/api/students/:id': handleGetStudent,
  'GET:/api/students/:id/courses': handleGetCourses,
  'GET:/api/students/:id/grades': handleGetGrades,
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
      const request = new Request(url, options);
      return matchedRoute(request);
    }

    return originalFetch.call(window, input, options);
  };

  return () => {
    window.fetch = originalFetch;
  };
}
