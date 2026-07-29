/**
 * @fileoverview Charts Service — Dashboard Grade Visualizations — Part 7.
 *
 * Provides factory functions for creating Chart.js charts with proper
 * cleanup, loading states, error handling, and accessibility support.
 * Includes legend toggle and keyboard navigation features.
 *
 * @module services/charts
 */

// ─── Chart Instance Registry ──────────────────────────────────────────────────

/** @type {Map<string, import('chart.js').Chart>} Active chart instances */
const chartInstances = new Map();

// ─── Theme Helpers ────────────────────────────────────────────────────────────

/**
 * Gets the current theme colors based on dark/light mode.
 *
 * @returns {Object} Theme colors object
 */
function _getThemeColors() {
    const isDark = document.body.classList.contains('dark');
    return {
        isDark,
        gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(226, 232, 240, 0.8)',
        textColor: isDark ? '#94a3b8' : '#64748b',
        tooltipBg: isDark ? '#1e293b' : '#121824',
        tooltipText: '#fff',
    };
}

// ─── Chart Factory Functions ──────────────────────────────────────────────────

/**
 * Creates a bar chart with proper configuration.
 *
 * @param {string|HTMLElement} canvas - Canvas element or ID
 * @param {Object} data - Chart data
 * @param {string[]} data.labels - X-axis labels
 * {number[]} data.values - Y-axis values
 * @param {Object} [options] - Additional chart options
 * @returns {Object} Chart instance and container
 */
export function createBarChart(canvas, data, options = {}) {
    const ctx = _getCanvasContext(canvas);
    if (!ctx) return null;

    const colors = _getThemeColors();
    const chartId = `bar_${Date.now()}`;

    // Destroy existing chart with same ID
    _destroyChart(chartId);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: options.label || 'Score',
                    data: data.values,
                    backgroundColor: options.backgroundColor || 'rgba(59, 130, 246, 0.8)',
                    borderColor: options.borderColor || '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: options.showLegend ?? false,
                    position: 'top',
                    labels: {
                        color: colors.textColor,
                        usePointStyle: true,
                        padding: 16,
                    },
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipText,
                    bodyColor: colors.tooltipText,
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: options.tooltipCallbacks || {},
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: colors.gridColor },
                    ticks: {
                        color: colors.textColor,
                        font: { family: 'Inter' },
                        /**
                         * Formats tick value as percentage.
                         * @param {number} value - Tick value
                         * @returns {string} Formatted percentage string
                         */
                        callback: value => `${value}%`,
                    },
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: colors.textColor,
                        font: { family: 'Inter' },
                    },
                },
            },
            ...options.chartOptions,
        },
    });

    chartInstances.set(chartId, chart);

    return {
        chart,
        id: chartId,
        /**
         * Destroys the chart instance.
         */
        destroy: () => _destroyChart(chartId),
        /**
         * Updates chart data.
         * @param {Object} newData - New data to apply
         */
        update: newData => _updateChartData(chart, newData),
    };
}

/**
 * Creates a doughnut chart with proper configuration.
 *
 * @param {string|HTMLElement} canvas - Canvas element or ID
 * @param {Object} data - Chart data
 * @param {string[]} data.labels - Segment labels
 * @param {number[]} data.values - Segment values
 * @param {string[]} [data.colors] - Segment colors
 * @param {Object} [options] - Additional chart options
 * @returns {Object} Chart instance and container
 */
export function createDoughnutChart(canvas, data, options = {}) {
    const ctx = _getCanvasContext(canvas);
    if (!ctx) return null;

    const colors = _getThemeColors();
    const chartId = `doughnut_${Date.now()}`;

    _destroyChart(chartId);

    const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [
                {
                    data: data.values,
                    backgroundColor: data.colors || defaultColors.slice(0, data.values.length),
                    borderWidth: 0,
                    hoverOffset: 4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: options.cutout || '60%',
            plugins: {
                legend: {
                    display: options.showLegend ?? true,
                    position: 'bottom',
                    labels: {
                        color: colors.textColor,
                        usePointStyle: true,
                        padding: 16,
                        /** @param {Object} chart - Chart instance */
                        generateLabels: chart => _generateLegendLabels(chart, colors),
                    },
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipText,
                    bodyColor: colors.tooltipText,
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        /**
                         * Formats tooltip label with percentage.
                         * @param {Object} tooltipItem - Tooltip item
                         * @returns {string} Formatted label
                         */
                        label: tooltipItem => {
                            const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
                            const value = tooltipItem.raw;
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${tooltipItem.label}: ${value} (${percentage}%)`;
                        },
                        ...options.tooltipCallbacks,
                    },
                },
            },
            ...options.chartOptions,
        },
    });

    chartInstances.set(chartId, chart);

    return {
        chart,
        id: chartId,
        /**
         * Destroys the chart instance.
         */
        destroy: () => _destroyChart(chartId),
        /**
         * Updates chart data.
         * @param {Object} newData - New data to apply
         */
        update: newData => _updateChartData(chart, newData),
        /**
         * Toggles dataset visibility.
         * @param {number} index - Dataset index
         */
        toggleDataset: index => _toggleDataset(chart, index),
    };
}

/**
 * Creates a line chart with proper configuration.
 *
 * @param {string|HTMLElement} canvas - Canvas element or ID
 * @param {Object} data - Chart data
 * @param {string[]} data.labels - X-axis labels
 * @param {number[]} data.values - Y-axis values
 * @param {Object} [options] - Additional chart options
 * @returns {Object} Chart instance and container
 */
export function createLineChart(canvas, data, options = {}) {
    const ctx = _getCanvasContext(canvas);
    if (!ctx) return null;

    const colors = _getThemeColors();
    const chartId = `line_${Date.now()}`;

    _destroyChart(chartId);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: options.label || 'Progress',
                    data: data.values,
                    borderColor: options.borderColor || '#3b82f6',
                    backgroundColor: options.backgroundColor || 'rgba(59, 130, 246, 0.08)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: options.pointColor || '#3b82f6',
                    pointHoverRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: options.showLegend ?? false,
                    position: 'top',
                    labels: {
                        color: colors.textColor,
                        usePointStyle: true,
                        padding: 16,
                    },
                },
                tooltip: {
                    backgroundColor: colors.tooltipBg,
                    titleColor: colors.tooltipText,
                    bodyColor: colors.tooltipText,
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: options.tooltipCallbacks || {},
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: colors.gridColor },
                    ticks: {
                        color: colors.textColor,
                        font: { family: 'Inter' },
                    },
                    title: {
                        display: true,
                        text: options.yAxisLabel || 'Progress',
                        color: colors.textColor,
                    },
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: colors.textColor,
                        font: { family: 'Inter' },
                    },
                },
            },
            ...options.chartOptions,
        },
    });

    chartInstances.set(chartId, chart);

    return {
        chart,
        id: chartId,
        /**
         * Destroys the chart instance.
         */
        destroy: () => _destroyChart(chartId),
        /**
         * Updates chart data.
         * @param {Object} newData - New data to apply
         */
        update: newData => _updateChartData(chart, newData),
    };
}

// ─── State Components ─────────────────────────────────────────────────────────

/**
 * Creates a loading skeleton for charts.
 *
 * @param {Object} [options] - Additional options
 * @param {string} [options.type='bar'] - Chart type for styling
 * @returns {HTMLElement} The skeleton element
 */
export function createChartSkeleton({ type = 'bar' } = {}) {
    const container = document.createElement('div');
    container.className = `chart-container chart-container--${type} chart-container--skeleton`;
    container.setAttribute('role', 'status');
    container.setAttribute('aria-label', 'Loading chart');

    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Loading chart...';
    container.appendChild(srOnly);

    const skeleton = document.createElement('div');
    skeleton.className = 'chart-skeleton';
    skeleton.setAttribute('aria-hidden', 'true');

    if (type === 'doughnut') {
        skeleton.innerHTML =
            '<div class="skeleton skeleton--circle" style="width: 120px; height: 120px;"></div>';
    } else {
        skeleton.innerHTML = `
      <div class="chart-skeleton__bars">
        ${Array(5).fill('<div class="chart-skeleton__bar-item"></div>').join('')}
      </div>
    `;
    }

    container.appendChild(skeleton);
    return container;
}

/**
 * Creates an error state for charts with retry option.
 *
 * @param {Object} [options] - Additional options
 * @param {string} [options.message='Unable to load chart'] - Error message
 * @param {Function} [options.onRetry] - Retry callback
 * @returns {HTMLElement} The error state element
 */
export function createChartError({ message = 'Unable to load chart', onRetry } = {}) {
    const container = document.createElement('div');
    container.className = 'chart-container chart-container--error';
    container.setAttribute('role', 'alert');

    const errorIcon = document.createElement('div');
    errorIcon.className = 'chart-container__error-icon';
    errorIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    container.appendChild(errorIcon);

    const errorMsg = document.createElement('p');
    errorMsg.className = 'chart-container__error-message';
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

/**
 * Creates an empty state for charts when no data is available.
 *
 * @param {Object} [options] - Additional options
 * @param {string} [options.message='No grade data available'] - Empty message
 * @returns {HTMLElement} The empty state element
 */
export function createChartEmpty({ message = 'No grade data available' } = {}) {
    const container = document.createElement('div');
    container.className = 'chart-container chart-container--empty';
    container.setAttribute('role', 'status');

    const emptyIcon = document.createElement('div');
    emptyIcon.className = 'chart-container__empty-icon';
    emptyIcon.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>';
    container.appendChild(emptyIcon);

    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'chart-container__empty-message';
    emptyMsg.textContent = message;
    container.appendChild(emptyMsg);

    return container;
}

// ─── Keyboard Navigation ──────────────────────────────────────────────────────

/**
 * Adds keyboard navigation to a chart container.
 *
 * @param {HTMLElement} container - Chart container element
 * @param {Object} chartInstance - Chart.js instance
 * @returns {Function} Cleanup function
 */
export function addChartKeyboardNavigation(container, chartInstance) {
    if (!container || !chartInstance) return () => {};

    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'application');
    container.setAttribute('aria-label', 'Chart. Use arrow keys to navigate data points.');

    let currentIndex = -1;

    /**
     * Handles keyboard events for chart navigation.
     */
    const handleKeyDown = event => {
        const dataset = chartInstance.data.datasets[0];
        if (!dataset || !dataset.data) return;

        const dataLength = dataset.data.length;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                currentIndex = Math.min(currentIndex + 1, dataLength - 1);
                _highlightDataPoint(chartInstance, currentIndex);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                _highlightDataPoint(chartInstance, currentIndex);
                break;
            case 'Home':
                event.preventDefault();
                currentIndex = 0;
                _highlightDataPoint(chartInstance, currentIndex);
                break;
            case 'End':
                event.preventDefault();
                currentIndex = dataLength - 1;
                _highlightDataPoint(chartInstance, currentIndex);
                break;
        }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
        container.removeEventListener('keydown', handleKeyDown);
        container.removeAttribute('tabindex');
        container.removeAttribute('role');
    };
}

// ─── Private Helpers ──────────────────────────────────────────────────────────

/**
 * Gets the canvas context from an element or ID.
 *
 * @param {string|HTMLElement} canvas - Canvas element or ID
 * @returns {CanvasRenderingContext2D|null} Canvas context
 * @private
 */
function _getCanvasContext(canvas) {
    let canvasEl;
    if (typeof canvas === 'string') {
        canvasEl = document.getElementById(canvas);
    } else {
        canvasEl = canvas;
    }

    if (!canvasEl || canvasEl.tagName !== 'CANVAS') {
        console.error('[Charts] Invalid canvas element:', canvas);
        return null;
    }

    return canvasEl.getContext('2d');
}

/**
 * Destroys a chart instance by ID.
 *
 * @param {string} chartId - Chart ID to destroy
 * @private
 */
function _destroyChart(chartId) {
    const existing = chartInstances.get(chartId);
    if (existing) {
        existing.destroy();
        chartInstances.delete(chartId);
    }
}

/**
 * Updates chart data.
 *
 * @param {Object} chart - Chart.js instance
 * @param {Object} newData - New data to apply
 * @private
 */
function _updateChartData(chart, newData) {
    if (newData.labels) chart.data.labels = newData.labels;
    if (newData.values) chart.data.datasets[0].data = newData.values;
    chart.update();
}

/**
 * Toggles dataset visibility for legend toggle feature.
 *
 * @param {Object} chart - Chart.js instance
 * @param {number} index - Dataset index to toggle
 * @private
 */
function _toggleDataset(chart, index) {
    const meta = chart.getDatasetMeta(index);
    meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
    chart.update();
}

/**
 * Generates legend labels with click handlers for toggling.
 *
 * @param {Object} chart - Chart.js instance
 * @param {Object} colors - Theme colors
 * @returns {Array} Legend label items
 * @private
 */
function _generateLegendLabels(chart, colors) {
    const { data } = chart;
    return data.labels.map((label, i) => {
        const meta = chart.getDatasetMeta(0);
        const isHidden = meta.data[i] && meta.data[i].hidden;

        return {
            text: label,
            fillStyle: isHidden ? 'transparent' : data.datasets[0].backgroundColor[i],
            strokeStyle: 'transparent',
            lineWidth: 0,
            hidden: isHidden,
            index: i,
            pointStyle: 'rectRounded',
            fontColor: colors.textColor,
        };
    });
}

/**
 * Highlights a specific data point for keyboard navigation.
 *
 * @param {Object} chart - Chart.js instance
 * @param {number} index - Data point index
 * @private
 */
function _highlightDataPoint(chart, index) {
    chart.setActiveElements([{ datasetIndex: 0, index }]);
    chart.tooltip.setActiveElements([{ datasetIndex: 0, index }], { x: 0, y: 0 });
    chart.update();
}

/**
 * Cleans up all chart instances.
 */
export function destroyAllCharts() {
    chartInstances.forEach(chart => {
        chart.destroy();
    });
    chartInstances.clear();
}

export default {
    createBarChart,
    createDoughnutChart,
    createLineChart,
    createChartSkeleton,
    createChartError,
    createChartEmpty,
    addChartKeyboardNavigation,
    destroyAllCharts,
};
