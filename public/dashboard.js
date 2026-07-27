/* global DOMParser */

// Dashboard theme and live data synchronization
/**
 *
 */
function applyTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

// Initial application
applyTheme();

// Helper to format date
/**
 *
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch (_e) {
        return dateString;
    }
}

// Helper to get grade letters
/**
 *
 */
function getGradeLetter(grade) {
    if (grade >= 90) return 'A';
    if (grade >= 85) return 'B+';
    if (grade >= 80) return 'B';
    if (grade >= 75) return 'C+';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
}

const DEFAULT_MOCK_COURSES = [
    {
        id: 'course_001',
        studentId: 'stu_001',
        title: 'Full Stack Web Development',
        instructor: 'Dr. Ankit Verma',
        thumbnailUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMiw4eziKnZ6okVY_lRgegT53w_bfaxA5sUs0Ng0QbCs4QwyszbRkV2Eq-&s=10',
        description:
            'Complete web development bootcamp covering HTML, CSS, JavaScript, React, Node.js',
        totalModules: 20,
        completedModules: 13,
        status: 'in-progress',
        currentGrade: 87.5,
        term: 'Spring 2024',
        lastAccessedAt: '2024-01-19T10:00:00Z',
        nextModule: 'React Hooks Deep Dive',
    },
    {
        id: 'course_002',
        studentId: 'stu_001',
        title: 'Data Structures & Algorithms',
        instructor: 'Prof. Priya Sharma',
        thumbnailUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU3_ZKJtTtwNplnn5J4iYmalV0v4rGBSDaWKPolk8j-WnHkPnlzumMXzc&s=10',
        description: 'Fundamental algorithms and data structures for technical interviews',
        totalModules: 15,
        completedModules: 8,
        status: 'in-progress',
        currentGrade: 78.2,
        term: 'Spring 2024',
        lastAccessedAt: '2024-01-18T14:30:00Z',
        nextModule: 'Graph Traversal Algorithms',
    },
    {
        id: 'course_003',
        studentId: 'stu_001',
        title: 'UX Design Fundamentals',
        instructor: 'Prof. Sneha Iyer',
        thumbnailUrl: 'https://spot-digital.com.tw/wp-content/uploads/2025/06/UIUX-1024x683.webp',
        description: 'User experience design principles, research, and prototyping',
        totalModules: 12,
        completedModules: 12,
        status: 'completed',
        currentGrade: 94.0,
        term: 'Fall 2023',
        lastAccessedAt: '2023-12-15T09:00:00Z',
    },
];

/**
 *
 */
async function loadStudentData() {
    // Determine active student
    let studentId = 'stu_001'; // Default fallback
    try {
        const authDataRaw = localStorage.getItem('student_tracker_auth');
        if (authDataRaw) {
            const authData = JSON.parse(authDataRaw);
            if (authData && authData.user && authData.user.id) {
                studentId = authData.user.id;
            }
        }
    } catch (e) {
        console.warn('Failed to parse auth token from localStorage:', e);
    }

    const apiBaseUrl = 'http://localhost:3001/api';

    // 1. Fetch Student Profile
    try {
        const studentResponse = await fetch(`${apiBaseUrl}/students/${studentId}`);
        if (studentResponse.ok) {
            const student = await studentResponse.json();

            const nameEl = document.getElementById('studentName');
            const emailEl = document.getElementById('studentEmail');
            const idEl = document.getElementById('studentId');
            const avatarEl = document.getElementById('studentAvatar');
            const sinceEl = document.getElementById('studentSince');

            if (nameEl) nameEl.textContent = student.name;
            if (emailEl) emailEl.textContent = student.email;
            if (idEl) idEl.textContent = student.studentId || student.id;
            if (avatarEl && student.avatarUrl) {
                avatarEl.src = student.avatarUrl;
                avatarEl.alt = student.name;
            }
            if (sinceEl && student.enrolledAt) {
                sinceEl.textContent = `Student since ${formatDate(student.enrolledAt)}`;
            }
        }
    } catch (e) {
        console.error('Failed to load student profile:', e);
    }

    // 2. Fetch and render Courses
    let allCourses = [];
    try {
        const coursesResponse = await fetch(`${apiBaseUrl}/students/${studentId}/courses`);
        if (coursesResponse.ok) {
            allCourses = await coursesResponse.json();
        }
    } catch (e) {
        console.error('Failed to load student courses:', e);
    }

    // If courses couldn't be loaded or list is empty, fallback to DEFAULT_MOCK_COURSES
    if (!allCourses || allCourses.length === 0) {
        allCourses = DEFAULT_MOCK_COURSES;
    }

    renderCourses(allCourses);

    // Bind search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = allCourses.filter(
                course =>
                    course.title.toLowerCase().includes(query) ||
                    (course.description && course.description.toLowerCase().includes(query)) ||
                    (course.instructor && course.instructor.toLowerCase().includes(query))
            );
            renderCourses(filtered);
        });
    }
}

/**
 *
 */
function renderCourses(courses) {
    const listContainer = document.querySelector('.course-list-container');
    if (!listContainer) return;

    if (courses.length === 0) {
        listContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                No courses found.
            </div>
        `;
        return;
    }

    const colors = ['purple', 'blue', 'green'];
    listContainer.innerHTML = courses
        .map((course, index) => {
            const colorClass = colors[index % colors.length];

            // Calculate progress percentage
            const progressPercent =
                course.totalModules > 0
                    ? Math.round((course.completedModules / course.totalModules) * 100)
                    : 0;

            return `
            <div class="course-item-box ${colorClass}" style="margin-bottom: 1.25rem;">
                <div class="course-header-row" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                    <div style="flex: 1; padding-right: 0.5rem;">
                        <h3 class="course-title-sub" style="margin-bottom: 0.15rem; font-size: 1.1rem; line-height: 1.3;">${course.title}</h3>
                        <p class="course-instructor" style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">${course.instructor}</p>
                    </div>
                    <span class="status-badge-new ${course.status}" style="font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;">
                        ${course.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                </div>
                
                <div class="course-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.8rem; background: rgba(255,255,255,0.4); padding: 0.5rem; border-radius: 8px; transition: background 0.3s ease;">
                    <div>
                        <span style="color: var(--text-secondary); font-weight: 500;">Modules:</span>
                        <span style="font-weight: 600; color: var(--text-primary); margin-left: 0.25rem;">${course.completedModules} / ${course.totalModules}</span>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); font-weight: 500;">Grade:</span>
                        <span style="font-weight: 600; color: var(--text-primary); margin-left: 0.25rem;">${course.currentGrade ? `${getGradeLetter(course.currentGrade)} (${course.currentGrade}%)` : 'N/A'}</span>
                    </div>
                </div>

                ${
                    course.nextModule
                        ? `<div class="course-next-module" style="font-size: 0.8rem; margin-bottom: 0.75rem; padding: 0.4rem 0.5rem; background: rgba(255,255,255,0.6); border-radius: 6px; border-left: 3px solid #3b82f6; transition: background 0.3s ease;">
    <span style="color: var(--text-secondary); font-weight: 500;">Next:</span>
    <span style="font-weight: 600; color: var(--text-primary); margin-left: 0.25rem;">${course.nextModule}</span>
</div>`
                        : ''
                }

                <div class="course-progress-section" style="margin-top: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem;">
                        <span>Progress</span>
                        <span>${progressPercent}%</span>
                    </div>
                    <div class="progress-bar-bg" style="width: 100%; height: 6px; background: rgba(0,0,0,0.06); border-radius: 3px; overflow: hidden;">
                        <div class="progress-bar-fill" style="width: ${progressPercent}%; height: 100%; background: #3b82f6; border-radius: 3px;"></div>
                    </div>
                </div>
            </div>
        `;
        })
        .join('');
}

/**
 *
 */
async function updateLiveAttendance() {
    try {
        const response = await fetch('index.html');
        if (!response.ok) return;
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const template = doc.getElementById('attendance-template');
        if (template) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = template.innerHTML;

            // Find Avg Attendance value
            const cards = tempDiv.querySelectorAll('.stat-card');
            let avgAttendance = '96.2%'; // Fallback
            cards.forEach(card => {
                const label = card.querySelector('.stat-card-label');
                if (label && label.textContent.trim().toLowerCase().includes('avg attendance')) {
                    const valueEl = card.querySelector('.stat-card-value');
                    if (valueEl) {
                        avgAttendance = valueEl.textContent.trim();
                    }
                }
            });

            // Update the UI
            const progressTextEl = document.querySelector('.progress-text');
            if (progressTextEl) {
                progressTextEl.textContent = avgAttendance;
            }

            const progressValue = parseFloat(avgAttendance);
            if (!isNaN(progressValue)) {
                const r = 26;
                const circumference = 2 * Math.PI * r;
                const offset = circumference - (progressValue / 100) * circumference;
                const circleBar = document.querySelector('.progress-ring-circle-bar');
                if (circleBar) {
                    circleBar.style.strokeDasharray = `${circumference}`;
                    circleBar.style.strokeDashoffset = `${offset}`;
                }
            }
        }
    } catch (e) {
        console.error('Failed to fetch live attendance:', e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');
    applyTheme();
    loadStudentData();
    updateLiveAttendance();
});
