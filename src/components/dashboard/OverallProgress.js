/**
 * @fileoverview OverallProgress — Dashboard Completion Ring — Part 5.
 *
 * Displays the student's aggregate completion as an animated SVG circular
 * progress ring with ARIA attributes, numeric label, X/Y subtitle, and
 * prefers-reduced-motion support.
 *
 * @module components/dashboard/OverallProgress
 */

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates an overall progress component showing completion percentage.
 *
 * @param {Object} data - Progress data
 * @param {number} data.completed - Number of completed modules
 * @param {number} data.total - Total number of modules
 * @param {Object} [options] - Additional options
 * @param {string} [options.size='md'] - Size variant: 'sm', 'md', 'lg'
 * @returns {HTMLElement} The progress component element
 */
export function createOverallProgress(data, { size = 'md' } = {}) {
    const { completed = 0, total = 0 } = data;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const container = document.createElement('div');
    container.className = `overall-progress overall-progress--${size}`;
    container.setAttribute('role', 'progressbar');
    container.setAttribute('aria-valuenow', percentage);
    container.setAttribute('aria-valuemin', '0');
    container.setAttribute('aria-valuemax', '100');
    container.setAttribute('aria-label', `Overall progress: ${percentage}% complete`);

    const svg = _createSVG(percentage, size);
    const label = _createLabel(percentage, completed, total);

    container.appendChild(svg);
    container.appendChild(label);

    return container;
}

/**
 * Creates a skeleton variant of the progress component for loading states.
 *
 * @param {Object} [options] - Additional options
 * @param {string} [options.size='md'] - Size variant
 * @returns {HTMLElement} The skeleton progress element
 */
export function createProgressSkeleton({ size = 'md' } = {}) {
    const container = document.createElement('div');
    container.className = `overall-progress overall-progress--${size} overall-progress--skeleton`;
    container.setAttribute('role', 'status');
    container.setAttribute('aria-label', 'Loading progress');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading progress...';
    container.appendChild(srOnly);

    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton skeleton--circle';
    skeleton.setAttribute('aria-hidden', 'true');
    skeleton.style.width = size === 'sm' ? '64px' : size === 'lg' ? '160px' : '120px';
    skeleton.style.height = skeleton.style.width;
    container.appendChild(skeleton);

    return container;
}

/**
 * Creates an error state variant of the progress component.
 *
 * @param {Object} [options] - Additional options
 * @param {string} [options.message='Unable to load progress'] - Error message
 * @param {Function} [options.onRetry] - Retry callback
 * @returns {HTMLElement} The error state progress element
 */
export function createProgressError({ message = 'Unable to load progress', onRetry } = {}) {
    const container = document.createElement('div');
    container.className = 'overall-progress overall-progress--error';
    container.setAttribute('role', 'alert');

    const errorIcon = document.createElement('div');
    errorIcon.className = 'overall-progress__error-icon';
    errorIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    container.appendChild(errorIcon);

    const errorMsg = document.createElement('p');
    errorMsg.className = 'overall-progress__error-message';
    errorMsg.textContent = message;
    container.appendChild(errorMsg);

    if (onRetry) {
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn--secondary btn--sm';
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', onRetry);
        container.appendChild(retryBtn);
    }

    return container;
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Creates the SVG circular progress ring.
 *
 * @param {number} percentage - Progress percentage (0-100)
 * @param {string} size - Size variant
 * @returns {HTMLElement} The SVG element
 * @private
 */
function _createSVG(percentage, size) {
    const sizeMap = { sm: 64, md: 120, lg: 160 };
    const px = sizeMap[size] ?? sizeMap.md;
    const strokeWidth = size === 'sm' ? 4 : size === 'lg' ? 8 : 6;
    const radius = (px - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const wrapper = document.createElement('div');
    wrapper.className = 'overall-progress__ring';
    wrapper.setAttribute('aria-hidden', 'true');

    wrapper.innerHTML = `
    <svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">
      <circle
        class="overall-progress__ring-bg"
        cx="${px / 2}"
        cy="${px / 2}"
        r="${radius}"
        fill="none"
        stroke-width="${strokeWidth}"
      />
      <circle
        class="overall-progress__ring-bar"
        cx="${px / 2}"
        cy="${px / 2}"
        r="${radius}"
        fill="none"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"
        stroke-linecap="round"
        transform="rotate(-90 ${px / 2} ${px / 2})"
      />
    </svg>
  `;

    // Apply animation after a small delay to trigger CSS transition
    requestAnimationFrame(() => {
        const bar = wrapper.querySelector('.overall-progress__ring-bar');
        if (bar) {
            bar.style.strokeDashoffset = offset;
        }
    });

    return wrapper;
}

/**
 * Creates the label section with percentage and counts.
 *
 * @param {number} percentage - Progress percentage
 * @param {number} completed - Completed modules count
 * @param {number} total - Total modules count
 * @returns {HTMLElement} The label element
 * @private
 */
function _createLabel(percentage, completed, total) {
    const label = document.createElement('div');
    label.className = 'overall-progress__label';

    const percentText = document.createElement('span');
    percentText.className = 'overall-progress__percent';
    percentText.textContent = `${percentage}%`;
    label.appendChild(percentText);

    const countText = document.createElement('span');
    countText.className = 'overall-progress__count';
    countText.textContent = `${completed}/${total} modules`;
    label.appendChild(countText);

    return label;
}

export default {
    createOverallProgress,
    createProgressSkeleton,
    createProgressError,
};
