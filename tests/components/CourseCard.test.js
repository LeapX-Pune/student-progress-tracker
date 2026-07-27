import { describe, it, expect, beforeEach } from 'vitest';
import { createCourseCard } from '../../src/components/courses/CourseCard.js';
import { mockCourses } from '../fixtures/test-data.js';

describe('CourseCard', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('renders course title', () => {
        const card = createCourseCard(mockCourses[0]);
        document.body.appendChild(card);
        expect(card.querySelector('.course-card__title').textContent).toBe(
            'Full Stack Web Development'
        );
    });

    it('renders instructor name', () => {
        const card = createCourseCard(mockCourses[0]);
        document.body.appendChild(card);
        expect(card.querySelector('.course-card__instructor').textContent).toBe('Dr. Sarah Chen');
    });

    it('renders module count', () => {
        const card = createCourseCard(mockCourses[0]);
        document.body.appendChild(card);
        expect(card.querySelector('.course-card__detail-value').textContent).toBe('13 / 20');
    });

    it('renders grade', () => {
        const card = createCourseCard(mockCourses[0]);
        document.body.appendChild(card);
        const gradeValues = card.querySelectorAll('.course-card__detail-value');
        const gradeText = gradeValues[1].textContent;
        expect(gradeText).toContain('B+');
        expect(gradeText).toContain('%');
        expect(gradeText).not.toBe('N/A');
    });

    it('has tabindex 0 for keyboard accessibility', () => {
        const card = createCourseCard(mockCourses[0]);
        expect(card.getAttribute('tabindex')).toBe('0');
    });
});
