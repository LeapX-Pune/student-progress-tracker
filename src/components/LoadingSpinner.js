/**
 *
 */
export function createLoadingSpinner({ size = 'md', label = 'Loading...' } = {}) {
    const container = document.createElement('div');
    container.className = `spinner spinner--${size}`;
    container.setAttribute('role', 'status');
    container.setAttribute('aria-label', label);

    container.innerHTML = `
    <svg class="spinner__circle" viewBox="0 0 24 24" aria-hidden="true">
      <circle class="spinner__path" cx="12" cy="12" r="10" fill="none" stroke-width="3"/>
    </svg>
  `;

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = label;
    container.appendChild(srOnly);

    return container;
}
