export const mockStudent = {
  id: 'stu_001',
  name: 'Alex Johnson',
  email: 'alex@student.edu',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  studentId: 'STU-2024-001',
  enrolledAt: '2024-01-15T00:00:00Z',
  currentStreak: 12,
  lastActiveAt: '2024-01-20T14:30:00Z',
}

export const mockCourses = [
  {
    id: 'course_001',
    studentId: 'stu_001',
    title: 'Full Stack Web Development',
    instructor: 'Dr. Sarah Chen',
    thumbnailUrl: 'https://picsum.photos/seed/webdev/400/225',
    description: 'Complete web development bootcamp',
    totalModules: 20,
    completedModules: 13,
    status: 'in-progress',
    currentGrade: 87.5,
    term: 'Spring 2024',
    lastAccessedAt: '2024-01-19T10:00:00Z',
    nextModule: { id: 'mod_14', title: 'React Hooks' },
  },
  {
    id: 'course_002',
    studentId: 'stu_001',
    title: 'Data Structures & Algorithms',
    instructor: 'Prof. Michael Roberts',
    thumbnailUrl: 'https://picsum.photos/seed/dsa/400/225',
    description: 'Fundamental algorithms and data structures',
    totalModules: 15,
    completedModules: 8,
    status: 'in-progress',
    currentGrade: 78.2,
    term: 'Spring 2024',
    lastAccessedAt: '2024-01-18T14:30:00Z',
    nextModule: { id: 'mod_09', title: 'Graph Algorithms' },
  },
  {
    id: 'course_003',
    studentId: 'stu_001',
    title: 'UX Design Fundamentals',
    instructor: 'Jane Smith',
    thumbnailUrl: 'https://picsum.photos/seed/ux/400/225',
    description: 'User experience design principles',
    totalModules: 12,
    completedModules: 12,
    status: 'completed',
    currentGrade: 94.0,
    term: 'Fall 2023',
    lastAccessedAt: '2023-12-15T09:00:00Z',
  },
]

export const mockQuizScores = [
  { id: 'q1', label: 'Quiz 1: HTML Basics', score: 90, maxScore: 100 },
  { id: 'q2', label: 'Quiz 2: CSS Layout', score: 85, maxScore: 100 },
  { id: 'q3', label: 'Quiz 3: JavaScript Basics', score: 92, maxScore: 100 },
]

export const mockGradeDistribution = [
  { grade: 'A', count: 5, percentage: 35 },
  { grade: 'B', count: 6, percentage: 42 },
  { grade: 'C', count: 2, percentage: 14 },
  { grade: 'D', count: 1, percentage: 7 },
  { grade: 'F', count: 0, percentage: 0 },
]

export const mockWeeklyProgress = [
  { week: 1, dateRange: 'Jan 8-14', courses: { course_001: 10 }, cumulative: 10 },
  { week: 2, dateRange: 'Jan 15-21', courses: { course_001: 25 }, cumulative: 25 },
  { week: 3, dateRange: 'Jan 22-28', courses: { course_001: 45 }, cumulative: 45 },
  { week: 4, dateRange: 'Jan 29-Feb 4', courses: { course_001: 65 }, cumulative: 65 },
]

export const mockAuthToken = {
  token: 'fake-jwt-token',
  expiresAt: Date.now() + 3600000,
  user: mockStudent,
}
