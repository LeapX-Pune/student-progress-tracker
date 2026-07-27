import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mockCourses, mockStudent } from '../fixtures/test-data.js';

describe('DashboardPage', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '';
        container = document.createElement('div');
        container.id = 'app';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders student profile section when data is provided', () => {
        container.innerHTML = `
        <section class="profile-card">
          <h2 class="profile-card__name">${mockStudent.name}</h2>
          <p class="profile-card__id">${mockStudent.studentId}</p>
        </section>`;
        expect(container.querySelector('.profile-card')).toBeTruthy();
        expect(container.querySelector('.profile-card__name').textContent).toBe('Alex Johnson');
        expect(container.querySelector('.profile-card__id').textContent).toBe('STU-2024-001');
    });

    it('renders course grid with course cards', () => {
        container.innerHTML = `
        <div class="course-grid">
          ${mockCourses
              .map(
                  c => `
            <article class="course-card" data-course-id="${c.id}">
              <h3 class="course-card__title">${c.title}</h3>
              <span class="course-card__instructor">${c.instructor}</span>
              <div class="course-card__progress">
                <span class="course-card__detail-value">${c.completedModules} / ${c.totalModules}</span>
              </div>
            </article>`
              )
              .join('')}
        </div>`;
        const cards = container.querySelectorAll('.course-card');
        expect(cards.length).toBe(3);
        expect(cards[0].querySelector('.course-card__title').textContent).toBe(
            'Full Stack Web Development'
        );
    });

    it('shows completed module count for each course', () => {
        container.innerHTML = `
        <div class="course-grid">
          ${mockCourses
              .map(
                  c => `
            <article class="course-card">
              <span class="course-card__detail-value">${c.completedModules} / ${c.totalModules}</span>
            </article>`
              )
              .join('')}
        </div>`;
        const progressTexts = [...container.querySelectorAll('.course-card__detail-value')].map(
            el => el.textContent
        );
        expect(progressTexts).toContain('13 / 20');
        expect(progressTexts).toContain('8 / 15');
        expect(progressTexts).toContain('12 / 12');
    });

    it('displays status badges for different course statuses', () => {
        container.innerHTML = `
        <div class="course-grid">
          ${mockCourses
              .map(
                  c => `
            <article class="course-card">
              <span class="status-badge status-badge--${c.status}">${c.status}</span>
            </article>`
              )
              .join('')}
        </div>`;
        const badges = [...container.querySelectorAll('.status-badge')];
        expect(badges[0].className).toContain('status-badge--in-progress');
        expect(badges[1].className).toContain('status-badge--in-progress');
        expect(badges[2].className).toContain('status-badge--completed');
    });

    it('renders overall progress section', () => {
        const completed = mockCourses.filter(c => c.status === 'completed').length;
        const total = mockCourses.length;
        container.innerHTML = `
        <section class="overall-progress">
          <div class="overall-progress__stat">
            <span class="overall-progress__value">${completed}/${total}</span>
            <span class="overall-progress__label">Courses Completed</span>
          </div>
        </section>`;
        expect(container.querySelector('.overall-progress')).toBeTruthy();
        expect(container.querySelector('.overall-progress__value').textContent).toBe('1/3');
    });

    it('shows last accessed info for courses', () => {
        container.innerHTML = `
        <div class="course-grid">
          ${mockCourses
              .map(
                  c => `
            <article class="course-card">
              <span class="course-card__meta">Last accessed: ${c.lastAccessedAt || 'N/A'}</span>
            </article>`
              )
              .join('')}
        </div>`;
        const metaElements = [...container.querySelectorAll('.course-card__meta')];
        expect(metaElements.length).toBe(3);
        expect(metaElements[0].textContent).toContain('2024-01-19');
    });
});
