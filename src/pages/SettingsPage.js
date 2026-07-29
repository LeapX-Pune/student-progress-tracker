import { useSettings } from '../hooks/useSettings.js';

/**
 *
 */
export function initSettingsPage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    let cleanup = null;
    const { subscribe, fetchSettings, updateSettings } = useSettings();

    /**
     *
     */
    function render(state) {
        if (state.loading) {
            pageContent.innerHTML = `
                <div class="settings-page" role="region" aria-label="Settings dashboard">
                    <header class="page-header" style="margin-bottom: 2rem;">
                        <h1 class="page-title">Settings</h1>
                        <p class="page-subtitle">Loading your preferences...</p>
                    </header>
                    <div class="skeleton-loader" style="height: 200px; border-radius: 12px; margin-bottom: 1.5rem;"></div>
                </div>
            `;
            return;
        }

        if (state.error) {
            pageContent.innerHTML = `
                <div class="settings-page" role="region" aria-label="Settings dashboard">
                    <header class="page-header" style="margin-bottom: 2rem;">
                        <h1 class="page-title">Settings</h1>
                    </header>
                    <div class="error-state" style="padding: 2rem; text-align: center; color: var(--color-danger); background: var(--bg-surface); border-radius: 12px;">
                        ${state.error}
                    </div>
                </div>
            `;
            return;
        }

        const data = state.data || {};

        pageContent.innerHTML = `
            <div class="settings-page" role="region" aria-label="Settings dashboard">
                <header class="page-header" style="margin-bottom: 2rem;">
                    <h1 class="page-title">Settings</h1>
                    <p class="page-subtitle">Manage your account preferences and application settings.</p>
                </header>
                
                <div class="settings-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem; color: var(--text-primary);">Appearance</h2>
                    <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h3 style="font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); margin: 0 0 0.25rem 0;">Dark Mode</h3>
                            <p style="font-size: 0.8125rem; color: var(--text-secondary); margin: 0;">Switch between light and dark appearance.</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="themeToggle" ${data.theme === 'dark' ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); margin: 0 0 0.25rem 0;">Compact View</h3>
                            <p style="font-size: 0.8125rem; color: var(--text-secondary); margin: 0;">Reduce padding and spacing to show more content.</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="compactViewToggle" ${data.compactView ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="settings-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem; color: var(--text-primary);">Notifications</h2>
                    <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h3 style="font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); margin: 0 0 0.25rem 0;">Email Notifications</h3>
                            <p style="font-size: 0.8125rem; color: var(--text-secondary); margin: 0;">Receive important updates and announcements via email.</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="emailNotifToggle" ${data.emailNotifications ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-row" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); margin: 0 0 0.25rem 0;">Notification Sounds</h3>
                            <p style="font-size: 0.8125rem; color: var(--text-secondary); margin: 0;">Play a sound when a new notification arrives.</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="soundToggle" ${data.notificationSound ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;

        // Attach listeners
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', async e => {
                const isDark = e.target.checked;
                if (isDark) {
                    document.body.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }
                await updateSettings({ theme: isDark ? 'dark' : 'light' });
            });
        }

        const compactViewToggle = document.getElementById('compactViewToggle');
        if (compactViewToggle) {
            compactViewToggle.addEventListener('change', async e => {
                await updateSettings({ compactView: e.target.checked });
            });
        }

        const emailNotifToggle = document.getElementById('emailNotifToggle');
        if (emailNotifToggle) {
            emailNotifToggle.addEventListener('change', async e => {
                await updateSettings({ emailNotifications: e.target.checked });
            });
        }

        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', async e => {
                await updateSettings({ notificationSound: e.target.checked });
            });
        }
    }

    /**
     *
     */
    function handleRoute(e) {
        if (e.detail.route === 'settings') {
            cleanup = subscribe(render);
            fetchSettings();
        } else {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }
        }
    }

    document.addEventListener('pathway:route', handleRoute);
}
