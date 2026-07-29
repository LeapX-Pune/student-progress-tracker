import AuthContext from '../context/AuthContext.js';
import { useGrades } from '../hooks/useGrades.js';

/**
 *
 */
export function initGradesPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    let isFetching = false;

    const gradesHook = useGrades({
        /**
         *
         */
        onLoading: () => {
            const placeholder = pageContent.querySelector('.route-placeholder');
            if (placeholder) {
                placeholder.remove();
            } else {
                pageContent.innerHTML = '';
            }

            pageContent.innerHTML = `
        <div class="grades-dashboard" role="region" aria-label="Grades dashboard with performance charts">
            <header class="grades-header">
                <h1 id="grades-heading">Grades & Analytics</h1>
                <p>Track your academic performance across quizzes, assignments, and weekly progress.</p>
                <div id="gpa-summary" class="metrics-grid" style="margin-top:1.5rem; display:flex; gap:1rem;">
                    <!-- dynamic gpa -->
                </div>
            </header>

            <div class="charts-grid" role="list" aria-labelledby="grades-heading">

                <article class="chart-card" role="listitem" id="chart-quiz" tabindex="0" aria-labelledby="quiz-title" aria-describedby="quiz-desc">
                    <h3 class="chart-title" id="quiz-title">Quiz Scores</h3>
                    <p class="chart-subtitle" id="quiz-desc">Your scores across all quizzes taken.</p>
                    <div class="chart-container" role="img" aria-label="Bar chart showing quiz scores">
                        <div class="loading-state" role="status" aria-live="polite">
                            <span class="sr-only">Loading quiz scores chart</span>
                            <div class="skeleton skeleton-title" aria-hidden="true"></div>
                            <div class="skeleton skeleton-subtitle" aria-hidden="true"></div>
                            <div class="skeleton skeleton-chart" aria-hidden="true"></div>
                            <div class="skeleton skeleton-legend" aria-hidden="true"></div>
                        </div>
                    </div>
                </article>

                <article class="chart-card" role="listitem" id="chart-assignment" tabindex="0" aria-labelledby="assignment-title" aria-describedby="assignment-desc">
                    <h3 class="chart-title" id="assignment-title">Assignment Performance</h3>
                    <p class="chart-subtitle" id="assignment-desc">Grades earned on submitted assignments.</p>
                    <div class="chart-container" role="img" aria-label="Doughnut chart showing assignment grades">
                        <div class="loading-state" role="status" aria-live="polite">
                            <span class="sr-only">Loading assignment performance chart</span>
                            <div class="skeleton skeleton-title" aria-hidden="true"></div>
                            <div class="skeleton skeleton-subtitle" aria-hidden="true"></div>
                            <div class="skeleton skeleton-chart" aria-hidden="true"></div>
                            <div class="skeleton skeleton-legend" aria-hidden="true"></div>
                        </div>
                    </div>
                </article>

            </div>
        </div>
        `;
        },
        /**
         *
         */
        onSuccess: ({ grades, performance }) => {
            const summary = document.getElementById('gpa-summary');
            if (summary) {
                summary.innerHTML = `
                    <div class="metric-card" style="background:#f8fafc; padding:1rem; border-radius:8px; flex:1;">
                        <h4 style="margin:0; font-size:0.875rem; color:#64748b;">Semester GPA</h4>
                        <p style="margin:0.25rem 0 0; font-size:1.5rem; font-weight:bold;">${performance.semesterGpa || 'N/A'}</p>
                    </div>
                    <div class="metric-card" style="background:#f8fafc; padding:1rem; border-radius:8px; flex:1;">
                        <h4 style="margin:0; font-size:0.875rem; color:#64748b;">Overall GPA</h4>
                        <p style="margin:0.25rem 0 0; font-size:1.5rem; font-weight:bold;">${performance.overallGpa || 'N/A'}</p>
                    </div>
                    <div class="metric-card" style="background:#f8fafc; padding:1rem; border-radius:8px; flex:1;">
                        <h4 style="margin:0; font-size:0.875rem; color:#64748b;">Credits</h4>
                        <p style="margin:0.25rem 0 0; font-size:1.5rem; font-weight:bold;">${performance.creditsCompleted || 0}</p>
                    </div>
                    <div class="metric-card" style="background:#f8fafc; padding:1rem; border-radius:8px; flex:1;">
                        <h4 style="margin:0; font-size:0.875rem; color:#64748b;">Standing</h4>
                        <p style="margin:0.25rem 0 0; font-size:1.125rem; font-weight:bold; color:#10b981;">${performance.overallStanding || 'N/A'}</p>
                    </div>
                `;
            }

            // Remove loading states from charts
            document
                .querySelectorAll('#chart-quiz .loading-state, #chart-assignment .loading-state')
                .forEach(el => el.remove());

            const quizContainer = document.querySelector('#chart-quiz .chart-container');
            if (quizContainer) {
                quizContainer.innerHTML += `
                    <div style="display:flex; flex-direction:column; gap:0.5rem; padding-top:1rem;">
                        ${
                            grades
                                ?.map(
                                    g => `
                            <div style="display:flex; justify-content:space-between; padding:0.5rem; background:#f1f5f9; border-radius:4px;">
                                <span>${g.course} - ${g.type}</span>
                                <strong>${g.score}%</strong>
                            </div>
                        `
                                )
                                .join('') || 'No grades available.'
                        }
                    </div>
                `;
            }
        },
        /**
         *
         */
        onError: _err => {
            // Handle error state
            const header = document.querySelector('.grades-header');
            if (header) {
                header.insertAdjacentHTML(
                    'afterend',
                    '<div class="error-state" style="padding:2rem; text-align:center; color:#ef4444;">Failed to load grades data.</div>'
                );
            }
        },
    });

    /**
     *
     */
    const fetchGrades = async () => {
        if (isFetching) return;
        isFetching = true;
        try {
            await gradesHook.fetch(AuthContext.getCurrentUserId());
        } finally {
            isFetching = false;
        }
    };

    document.addEventListener('pathway:route', event => {
        if (event.detail.route === 'grades') {
            fetchGrades();
        }
    });

    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'grades') {
        fetchGrades();
    }
}
