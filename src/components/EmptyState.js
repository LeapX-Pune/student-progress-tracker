export function createEmptyState({ title, description, illustration, actions = [] } = {}) {
    const container = document.createElement('div');
    container.className = 'empty-state';
    container.setAttribute('role', 'status');

    if (illustration) {
        const img = document.createElement('div');
        img.className = 'empty-state__illustration';
        img.setAttribute('aria-hidden', 'true');
        img.innerHTML = illustration;
        container.appendChild(img);
    }

    if (title) {
        const titleEl = document.createElement('h2');
        titleEl.className = 'empty-state__title';
        titleEl.textContent = title;
        container.appendChild(titleEl);
    }

    if (description) {
        const descEl = document.createElement('p');
        descEl.className = 'empty-state__description';
        descEl.textContent = description;
        container.appendChild(descEl);
    }

    if (actions.length > 0) {
        const actionsEl = document.createElement('div');
        actionsEl.className = 'empty-state__actions';
        actions.forEach(action => {
            if (typeof action === 'string') {
                actionsEl.insertAdjacentHTML('beforeend', action);
            } else if (action instanceof HTMLElement) {
                actionsEl.appendChild(action);
            }
        });
        container.appendChild(actionsEl);
    }

    return container;
}

export const EMPTY_ILLUSTRATIONS = {
    search: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    data: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    course: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    grade: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
};
