import { useProfile } from '../hooks/useProfile.js';

/**
 *
 */
export function initProfilePage() {
    const pageContent = document.querySelector('[data-page-content]');
    if (!pageContent) return;

    let cleanup = null;
    const { subscribe, fetchProfile, updateProfile } = useProfile();

    /**
     *
     */
    function render(state) {
        if (state.loading) {
            pageContent.innerHTML = `
                <div class="profile-page" role="region" aria-label="Student Profile">
                    <header class="page-header" style="margin-bottom: 2rem;">
                        <h1 class="page-title">Profile</h1>
                        <p class="page-subtitle">Loading your academic identity...</p>
                    </header>
                    <div class="skeleton-loader" style="height: 300px; border-radius: 12px; margin-bottom: 1.5rem;"></div>
                </div>
            `;
            return;
        }

        if (state.error) {
            pageContent.innerHTML = `
                <div class="profile-page" role="region" aria-label="Student Profile">
                    <header class="page-header" style="margin-bottom: 2rem;">
                        <h1 class="page-title">Profile</h1>
                    </header>
                    <div class="error-state" style="padding: 2rem; text-align: center; color: var(--color-danger); background: var(--bg-surface); border-radius: 12px;">
                        ${state.error}
                    </div>
                </div>
            `;
            return;
        }

        const student = state.data || {};

        pageContent.innerHTML = `
            <div class="profile-page" role="region" aria-label="Student Profile">
                <header class="page-header" style="margin-bottom: 2rem;">
                    <h1 class="page-title">Profile & Academic Identity</h1>
                    <p class="page-subtitle">Manage your personal information and view academic standing.</p>
                </header>

                <div class="dashboard-grid" style="display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem;">
                    <!-- Academic Identity Card -->
                    <div class="settings-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem;">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <img src="${student.avatarUrl || 'https://via.placeholder.com/150'}" alt="${student.name}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 3px solid var(--primary-color);">
                            <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.25rem 0;">${student.name}</h2>
                            <p style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">${student.studentId}</p>
                        </div>
                        
                        <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                            <div style="margin-bottom: 0.75rem;">
                                <small style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Program</small>
                                <span style="font-size: 0.9375rem; color: var(--text-primary);">${student.program || 'N/A'}</span>
                            </div>
                            <div style="margin-bottom: 0.75rem;">
                                <small style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Department</small>
                                <span style="font-size: 0.9375rem; color: var(--text-primary);">${student.department || 'N/A'}</span>
                            </div>
                            <div style="margin-bottom: 0.75rem;">
                                <small style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Semester & Batch</small>
                                <span style="font-size: 0.9375rem; color: var(--text-primary);">Semester ${student.semester || '-'} (${student.batch || 'N/A'})</span>
                            </div>
                            <div>
                                <small style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Academic Advisor</small>
                                <span style="font-size: 0.9375rem; color: var(--text-primary);">${student.academicAdvisor || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Editable Profile Info -->
                    <div class="settings-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 16px; padding: 1.5rem;">
                        <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem;">Personal Information</h3>
                        <form id="profile-form">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                <div class="form-group">
                                    <label for="profileEmail" style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.5rem;">Email Address (Read-only)</label>
                                    <input type="email" id="profileEmail" value="${student.email || ''}" disabled style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-body); color: var(--text-secondary);">
                                </div>
                                <div class="form-group">
                                    <label for="profilePhone" style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.5rem;">Phone Number</label>
                                    <input type="tel" id="profilePhone" name="phone" value="${student.phone || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 1.5rem;">
                                <label for="profileAddress" style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.5rem;">Home Address</label>
                                <input type="text" id="profileAddress" name="address" value="${student.address || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                            </div>

                            <div style="margin-bottom: 1.5rem;">
                                <label for="profileEmergency" style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.5rem;">Emergency Contact</label>
                                <input type="text" id="profileEmergency" name="emergencyContact" value="${student.emergencyContact || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary);">
                            </div>

                            <div style="margin-bottom: 1.5rem;">
                                <label for="profileBio" style="display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 0.5rem;">Bio</label>
                                <textarea id="profileBio" name="bio" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-surface); color: var(--text-primary); resize: vertical;">${student.bio || ''}</textarea>
                            </div>
                            
                            <div style="display: flex; justify-content: flex-end; align-items: center; gap: 1rem;">
                                <span id="profile-save-status" style="font-size: 0.875rem; color: var(--color-success); opacity: 0; transition: opacity 0.3s ease;">Saved successfully!</span>
                                <button type="submit" class="btn btn-primary" style="padding: 0.75rem 1.5rem; background: var(--primary-color); color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">
                                    ${state.saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', async e => {
                e.preventDefault();
                const formData = new FormData(form);
                const updates = Object.fromEntries(formData.entries());

                const res = await updateProfile(updates);
                if (res.success) {
                    const status = document.getElementById('profile-save-status');
                    if (status) {
                        status.style.opacity = '1';
                        setTimeout(() => (status.style.opacity = '0'), 3000);
                    }
                }
            });
        }
    }

    /**
     *
     */
    function handleRoute(e) {
        if (e.detail.route === 'profile') {
            cleanup = subscribe(render);
            fetchProfile();
        } else {
            if (cleanup) {
                cleanup();
                cleanup = null;
            }
        }
    }

    document.addEventListener('pathway:route', handleRoute);
}
