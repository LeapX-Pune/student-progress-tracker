/**
 * @fileoverview 403 Access Denied Component
 *
 * Renders an unauthorized access screen for routes protected by RBAC.
 * Integrates visually with the existing dashboard layout.
 *
 * @module components/common/403
 */

/**
 * Creates the 403 Access Denied UI component.
 *
 * @returns {HTMLElement} The constructed DOM element
 */
export function create403State() {
    const container = document.createElement('div');
    container.className =
        'empty-state flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-[#E2E8F0] min-h-[400px] w-full';

    const iconContainer = document.createElement('div');
    iconContainer.className =
        'w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm';
    // Lucide shield-alert icon SVG
    iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            <path d="M12 8v4"/>
            <path d="M12 16h.01"/>
        </svg>
    `;

    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-[#0F172A] mb-2 tracking-tight';
    title.textContent = 'Access Denied';

    const description = document.createElement('p');
    description.className = 'text-[#64748B] text-base mb-8 max-w-md mx-auto leading-relaxed';
    description.textContent =
        'You do not have permission to view this module. Please contact your administrator if you believe this is an error.';

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className =
        'retry-btn inline-flex items-center gap-2 px-6 py-3 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0F172A] text-sm font-semibold rounded-lg transition-colors border border-[#CBD5E1] shadow-sm';
    backButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
        </svg>
        Return to Dashboard
    `;
    backButton.addEventListener('click', () => {
        window.location.hash = '#/overview';
    });

    container.append(iconContainer, title, description, backButton);

    return container;
}

/**
 * Mounts the 403 state into the specified route placeholder.
 *
 * @param {HTMLElement} mountNode - The DOM node to attach the 403 state to
 */
export function render403Unauthorized(mountNode) {
    if (!mountNode) return;
    mountNode.innerHTML = '';
    const errorNode = create403State();
    mountNode.appendChild(errorNode);
}
