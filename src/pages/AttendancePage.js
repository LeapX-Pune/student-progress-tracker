import AuthContext from '../context/AuthContext.js';
import { useAttendance } from '../hooks/useAttendance.js';

/**
 *
 */
export function initAttendancePage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    let isFetching = false;

    const attendanceHook = useAttendance({
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
        <div class="grades-dashboard" role="region" aria-label="Attendance dashboard">
            <header class="grades-header">
                <h1 id="grades-heading">Attendance</h1>
                <p>Track your attendance across all registered courses.</p>
                <div id="attendance-summary" class="metrics-grid" style="margin-top:1.5rem; display:flex; gap:1rem;">
                    <!-- dynamic summary -->
                </div>
            </header>

            <div class="charts-grid" role="list" aria-labelledby="grades-heading" style="margin-top:2rem;">

                <article class="chart-card chart-card--full" role="listitem" id="chart-attendance" tabindex="0">
                    <h3 class="chart-title">Attendance Details</h3>
                    <p class="chart-subtitle">Your attendance records per course.</p>
                    <div class="chart-container" role="img" aria-label="Attendance details">
                        <div class="loading-state" role="status" aria-live="polite">
                            <span class="sr-only">Loading attendance</span>
                            <div class="skeleton skeleton-title" aria-hidden="true"></div>
                            <div class="skeleton skeleton-subtitle" aria-hidden="true"></div>
                            <div class="skeleton skeleton-chart" aria-hidden="true"></div>
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
        onSuccess: attendance => {
            const summary = document.getElementById('attendance-summary');
            if (summary) {
                summary.innerHTML = `
                    <div class="metric-card" style="background:#f8fafc; padding:1rem; border-radius:8px; flex:1; border: 1px solid ${attendance.isAtRisk ? '#fca5a5' : '#e2e8f0'}">
                        <h4 style="margin:0; font-size:0.875rem; color:#64748b;">Overall Attendance</h4>
                        <p style="margin:0.25rem 0 0; font-size:1.5rem; font-weight:bold; color:${attendance.isAtRisk ? '#ef4444' : 'inherit'};">${attendance.overallPercentage || 0}%</p>
                        ${attendance.isAtRisk ? '<span style="color:#ef4444; font-size:0.75rem; font-weight:bold;">AT RISK</span>' : ''}
                    </div>
                `;
            }

            const container = document.querySelector('#chart-attendance .chart-container');
            if (container) {
                document.querySelector('#chart-attendance .loading-state')?.remove();
                container.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:0.5rem; padding-top:1rem;">
                        ${
                            attendance.courses
                                ?.map(
                                    c => `
                            <div style="display:flex; justify-content:space-between; padding:1rem; background:#f1f5f9; border-radius:8px;">
                                <div>
                                    <strong style="display:block;">${c.courseName}</strong>
                                    <span style="font-size:0.875rem; color:#64748b;">Conducted: ${c.conducted} | Attended: ${c.attended} | Missed: ${c.missed}</span>
                                </div>
                                <div style="text-align:right;">
                                    <strong style="font-size:1.25rem; color:${c.percentage < c.required ? '#ef4444' : '#10b981'}">${c.percentage}%</strong>
                                    <span style="display:block; font-size:0.75rem; color:#64748b;">Required: ${c.required}%</span>
                                </div>
                            </div>
                        `
                                )
                                .join('') || 'No attendance records found.'
                        }
                    </div>
                `;
            }
        },
        /**
         *
         */
        onError: _err => {
            const header = document.querySelector('.grades-header');
            if (header) {
                header.insertAdjacentHTML(
                    'afterend',
                    '<div class="error-state" style="padding:2rem; text-align:center; color:#ef4444;">Failed to load attendance data.</div>'
                );
            }
        },
    });

    /**
     *
     */
    const fetchAttendance = async () => {
        if (isFetching) return;
        isFetching = true;
        try {
            await attendanceHook.fetch(AuthContext.getCurrentUserId());
        } finally {
            isFetching = false;
        }
    };

    document.addEventListener('pathway:route', event => {
        if (event.detail.route === 'attendance') {
            fetchAttendance();
        }
    });

    const currentHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].trim();
    if (currentHash === 'attendance') {
        fetchAttendance();
    }
}
