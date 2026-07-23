/**
 *
 */
export function createRetryButton({ onClick, label = 'Retry', className = '' } = {}) {
    const button = document.createElement('button');
    button.className = `btn btn--primary ${className}`.trim();
    button.type = 'button';
    button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
    ${label}
  `;

    if (onClick) {
        button.addEventListener('click', async e => {
            button.disabled = true;
            const originalContent = button.innerHTML;
            button.innerHTML =
                '<span class="spinner spinner--sm spinner--inside-btn"><svg class="spinner__circle" viewBox="0 0 24 24"><circle class="spinner__path" cx="12" cy="12" r="10" fill="none" stroke-width="3"/></svg></span>';
            button.classList.add('btn--loading');

            try {
                await onClick(e);
            } finally {
                button.disabled = false;
                button.innerHTML = originalContent;
                button.classList.remove('btn--loading');
            }
        });
    }

    return button;
}
