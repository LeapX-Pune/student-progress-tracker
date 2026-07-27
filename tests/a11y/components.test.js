import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from './setup.js';

describe('Accessibility — LoginForm', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('login form has no auto-detected violations', async () => {
        document.body.innerHTML = `
        <main>
          <form id="login-form">
            <h1 class="login-form__title">Sign in</h1>
            <label for="login-email">Email</label>
            <input id="login-email" type="email" required />
            <label for="login-password">Password</label>
            <input id="login-password" type="password" required />
            <button id="login-submit" type="submit">Sign In</button>
          </form>
        </main>`;
        const results = await axe(document.body);
        expect(results).toHaveNoViolations();
    });
});

describe('Accessibility — CourseCard', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('course card has no auto-detected violations', async () => {
        document.body.innerHTML = `
        <main>
          <article class="course-card" tabindex="0">
            <h3 class="course-card__title">Full Stack Web Development</h3>
            <span class="course-card__instructor">Dr. Sarah Chen</span>
            <div class="course-card__progress">
              <span class="course-card__label">Modules</span>
              <span class="course-card__detail-value">13 / 20</span>
            </div>
            <div class="course-card__grade">
              <span class="course-card__label">Grade</span>
              <span class="course-card__detail-value">87.5%</span>
            </div>
          </article>
        </main>`;
        const results = await axe(document.body);
        expect(results).toHaveNoViolations();
    });

    it('completed course status badge is accessible', async () => {
        document.body.innerHTML = `
        <main>
          <span class="status-badge status-badge--completed" role="status">Completed</span>
        </main>`;
        const results = await axe(document.body);
        expect(results).toHaveNoViolations();
    });

    it('in-progress course status badge is accessible', async () => {
        document.body.innerHTML = `
        <main>
          <span class="status-badge status-badge--in-progress" role="status">In Progress</span>
        </main>`;
        const results = await axe(document.body);
        expect(results).toHaveNoViolations();
    });
});

describe('Accessibility — ProgressBar', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('progress bar has no auto-detected violations', async () => {
        document.body.innerHTML = `
        <main>
          <label for="course-progress" class="sr-only">Course progress: 65%</label>
          <div id="course-progress" class="progress-bar" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Course progress: 65%">
            <div class="progress-bar__fill" style="width: 65%"></div>
          </div>
        </main>`;
        const results = await axe(document.body);
        expect(results).toHaveNoViolations();
    });
});

describe('Accessibility — Navigation', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('navigation has no auto-detected violations', async () => {
        document.body.innerHTML = `
        <main>
          <nav aria-label="Main navigation">
            <a href="/dashboard" data-route="dashboard">Dashboard</a>
            <a href="/courses" data-route="courses">Courses</a>
            <a href="/grades" data-route="grades">Grades</a>
            <button aria-label="Open menu" class="nav-toggle">☰</button>
          </nav>
        </main>`;
        const results = await axe(document.body);
        expect(results).toHaveNoViolations();
    });
});
