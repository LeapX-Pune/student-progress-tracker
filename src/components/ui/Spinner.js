/**
 * @fileoverview Spinner — Accessible Loading Indicator — Part 3 / Part 10.
 *
 * Renders a CSS-animated spinner inside any DOM container.
 * Used by Button (loading state) and as a standalone page/section indicator.
 *
 * @module components/ui/Spinner
 */

// ─── Size map ─────────────────────────────────────────────────────────────────

/** @type {Record<string, { size: number, stroke: number }>} */
const SIZE_MAP = {
    sm: { size: 16, stroke: 2 },
    md: { size: 24, stroke: 2.5 },
    lg: { size: 40, stroke: 3 },
};

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates an accessible SVG spinner element.
 *
 * The spinner respects `prefers-reduced-motion`: when the user has requested
 * reduced motion, the animation is paused via CSS (handled in `main.css` —
 * `@media (prefers-reduced-motion: reduce) { .spinner { animation: none } }`).
 *
 * @param {Object}  [opts={}]              - Configuration options
 * @param {'sm'|'md'|'lg'} [opts.size='md'] - Visual size variant
 * @param {string}  [opts.label='Loading'] - ARIA label for screen readers
 * @param {string}  [opts.color='currentColor'] - SVG stroke colour
 * @param {string}  [opts.className='']   - Extra CSS classes on the wrapper
 * @returns {SVGElement} The spinner SVG element, ready to insert into the DOM
 *
 * @example
 * const spinner = createSpinner({ size: 'sm', label: 'Signing in…' });
 * buttonEl.append(spinner);
 */
export function createSpinner({
    size = 'md',
    label = 'Loading',
    color = 'currentColor',
    className = '',
} = {}) {
    const { size: px, stroke } = SIZE_MAP[size] ?? SIZE_MAP.md;
    const r = (px - stroke) / 2; // radius leaving room for stroke
    const cx = px / 2;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `spinner spinner--${size}${className ? ` ${className}` : ''}`);
    svg.setAttribute('width', String(px));
    svg.setAttribute('height', String(px));
    svg.setAttribute('viewBox', `0 0 ${px} ${px}`);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('role', 'status');
    svg.setAttribute('aria-live', 'polite');
    svg.setAttribute('aria-label', label);

    // Track circle (background)
    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('cx', String(cx));
    track.setAttribute('cy', String(cx));
    track.setAttribute('r', String(r));
    track.setAttribute('stroke', color);
    track.setAttribute('stroke-width', String(stroke));
    track.setAttribute('opacity', '0.2');
    svg.appendChild(track);

    // Animated arc
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    arc.setAttribute('class', 'spinner__arc');
    arc.setAttribute('cx', String(cx));
    arc.setAttribute('cy', String(cx));
    arc.setAttribute('r', String(r));
    arc.setAttribute('stroke', color);
    arc.setAttribute('stroke-width', String(stroke));
    arc.setAttribute('stroke-linecap', 'round');

    const circumference = 2 * Math.PI * r;
    arc.setAttribute('stroke-dasharray', String(circumference));
    arc.setAttribute('stroke-dashoffset', String(circumference * 0.75));

    svg.appendChild(arc);
    return svg;
}
