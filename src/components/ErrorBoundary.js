/**
 *
 */
export function createErrorBoundary({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    onRetry = null,
} = {}) {
    const container = document.createElement('div');
    container.className = 'error-boundary';
    container.setAttribute('role', 'alert');

    container.innerHTML = `
    <div class="error-boundary__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    </div>
    <h2 class="error-boundary__title">${title}</h2>
    <p class="error-boundary__message">${message}</p>
  `;

    if (onRetry) {
        const actions = document.createElement('div');
        actions.className = 'error-boundary__actions';

        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn--primary';
        retryBtn.textContent = 'Try again';
        retryBtn.addEventListener('click', async () => {
            retryBtn.disabled = true;
            retryBtn.innerHTML =
                '<span class="spinner spinner--sm"><svg class="spinner__circle" viewBox="0 0 24 24"><circle class="spinner__path" cx="12" cy="12" r="10" fill="none" stroke-width="3"/></svg></span> Retrying...';
            try {
                await onRetry();
            } finally {
                retryBtn.disabled = false;
                retryBtn.textContent = 'Try again';
            }
        });

        actions.appendChild(retryBtn);
        container.appendChild(actions);
    }

    return container;
}

/**
 *
 */
export function withErrorBoundary(container, { title, message, onRetry } = {}) {
    const errorUI = createErrorBoundary({ title, message, onRetry });
    container.innerHTML = '';
    container.appendChild(errorUI);
    return errorUI;
}
