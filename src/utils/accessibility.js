let announceTimeout = null;

/**
 *
 */
export function announce(message, politeness = 'polite') {
    const existing = document.getElementById('sr-live-region');
    if (existing) {
        existing.remove();
    }

    const region = document.createElement('div');
    region.id = 'sr-live-region';
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');

    Object.assign(region.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
    });

    region.textContent = message;
    document.body.appendChild(region);

    if (announceTimeout) clearTimeout(announceTimeout);
    announceTimeout = setTimeout(() => {
        if (region.parentNode) {
            region.parentNode.removeChild(region);
        }
    }, 3000);
}

/**
 *
 */
export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 *
 */
export function setReducedMotionClass() {
    if (prefersReducedMotion()) {
        document.documentElement.classList.add('reduced-motion');
    }
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
        document.documentElement.classList.toggle('reduced-motion', e.matches);
    });
}
