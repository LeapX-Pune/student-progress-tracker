import { createIcons } from 'lucide';

/**
 *
 */
export function createErrorState({ title = 'Something went wrong', message, onRetry }) {
    const container = document.createElement('div');
    container.className = 'course-progress-grid__error';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.padding = '4rem 2rem';
    container.style.textAlign = 'center';
    container.style.gap = '1rem';
    container.style.gridColumn = '1 / -1';

    const iconWrapper = document.createElement('div');
    iconWrapper.style.color = 'var(--error-default, #ef4444)';
    iconWrapper.style.marginBottom = '1rem';
    iconWrapper.innerHTML =
        '<i data-lucide="alert-triangle" style="width: 48px; height: 48px;"></i>';

    const heading = document.createElement('h3');
    heading.textContent = title;
    heading.style.fontSize = '1.25rem';
    heading.style.fontWeight = '600';
    heading.style.margin = '0';
    heading.style.color = 'var(--text-primary, #f8fafc)';

    const desc = document.createElement('p');
    desc.textContent = message || 'There was an error loading the data. Please try again.';
    desc.style.color = 'var(--text-secondary, #94a3b8)';
    desc.style.margin = '0 0 1rem 0';
    desc.style.maxWidth = '400px';

    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Retry';
    retryBtn.className = 'btn btn-primary'; // assuming standard btn styles exist
    retryBtn.style.padding = '0.5rem 1.5rem';
    retryBtn.style.borderRadius = 'var(--radius-md, 8px)';
    retryBtn.style.backgroundColor = 'var(--primary-main, #3b82f6)';
    retryBtn.style.color = '#fff';
    retryBtn.style.border = 'none';
    retryBtn.style.cursor = 'pointer';
    retryBtn.style.fontWeight = '500';

    if (onRetry) {
        retryBtn.addEventListener('click', onRetry);
    }

    container.append(iconWrapper, heading, desc, retryBtn);

    // Initialize icons if Lucide is available
    // eslint-disable-next-line no-undef
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        // eslint-disable-next-line no-undef
        lucide.createIcons({ icons: lucide.icons, root: container });
    } else {
        createIcons({ root: container });
    }

    return container;
}
