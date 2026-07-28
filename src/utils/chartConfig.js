/**
 * @fileoverview Centralized Chart.js configuration and utilities.
 *
 * Provides chart defaults, color palettes, shared tooltip/legend config,
 * and instance lifecycle management. Re-exports chart constants from
 * utils/constants.js for convenience.
 *
 * @module utils/chartConfig
 */

import {
    CHART_COLORS,
    PALETTE_5,
    PALETTE_3,
    CHART_ANIMATION,
    CHART_TOOLTIP_DEFAULTS,
    CHARTJS_CDN_URL,
} from './constants.js';

export {
    CHART_COLORS,
    PALETTE_5,
    PALETTE_3,
    CHART_ANIMATION as ANIMATION,
    CHART_TOOLTIP_DEFAULTS as TOOLTIP_DEFAULTS,
};

// ---------------------------------------------------------------------------
// Shared scale config helpers
// ---------------------------------------------------------------------------

/**
 * Creates a standard percentage Y-axis config.
 * @param {string} [titleText]
 * @returns {object}
 */
export function percentageYAxis(titleText) {
    return {
        beginAtZero: true,
        max: 100,
        ticks: {
            font: { size: 11 },
            /** @param {number} value */
            callback(value) {
                return value + '%';
            },
        },
        title: titleText ? { display: true, text: titleText } : { display: false },
    };
}

/**
 * Creates a standard X-axis config.
 * @param {string} [titleText]
 * @returns {object}
 */
export function defaultXAxis(titleText) {
    return {
        ticks: { font: { size: 11 }, maxRotation: 0, minRotation: 0 },
        title: titleText ? { display: true, text: titleText } : { display: false },
    };
}

// ---------------------------------------------------------------------------
// Responsive defaults (shared across all charts)
// ---------------------------------------------------------------------------

/**
 * Base options merged into every chart for consistent responsive behaviour
 * and retina-quality rendering.
 */
export const RESPONSIVE_DEFAULTS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: CHART_ANIMATION,
};

// ---------------------------------------------------------------------------
// Chart instance lifecycle manager
// ---------------------------------------------------------------------------

/** @type {Map<string, import('chart.js').Chart>} */
const instances = new Map();

/**
 * Destroy any existing chart attached to `key` and return the canvas context.
 * Call this before creating a new chart to prevent memory leaks.
 *
 * @param {string} key   - Unique identifier for the chart instance.
 * @param {string} canvasId - The canvas element ID.
 * @returns {CanvasRenderingContext2D | null}
 */
export function getCleanContext(key, canvasId) {
    destroyChart(key);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    return canvas.getContext('2d');
}

/**
 * Register a chart instance under `key`.
 * Automatically destroys any previous instance with the same key.
 *
 * @param {string} key
 * @param {import('chart.js').Chart} chart
 */
export function registerChart(key, chart) {
    if (instances.has(key)) {
        const prev = instances.get(key);
        if (prev && typeof prev.destroy === 'function') prev.destroy();
    }
    instances.set(key, chart);
}

/**
 * Destroy a single chart by key.
 * @param {string} key
 */
export function destroyChart(key) {
    const chart = instances.get(key);
    if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
    }
    instances.delete(key);
}

/**
 * Destroy all tracked chart instances. Useful on page teardown.
 */
export function destroyAllCharts() {
    for (const [key] of instances) {
        destroyChart(key);
    }
}

// ---------------------------------------------------------------------------
// Dynamic Chart.js loader
// ---------------------------------------------------------------------------

/**
 * Ensures Chart.js is loaded. Resolves immediately if already available,
 * otherwise dynamically injects the CDN script.
 *
 * @returns {Promise<void>}
 */
export function ensureChartJS() {
    if (typeof Chart !== 'undefined') return Promise.resolve();

    return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-chartjs-loader]');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Chart.js load failed')));
            return;
        }

        const script = document.createElement('script');
        script.src = CHARTJS_CDN_URL;
        script.dataset.chartjsLoader = 'true';
        /** @returns {void} */
        script.onload = () => resolve();
        /** @returns {void} */
        script.onerror = () => reject(new Error('Chart.js load failed'));
        document.head.appendChild(script);
    });
}
