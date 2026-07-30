(function () {
    'use strict';

    var instances = [];

    function destroyCharts() {
        instances.forEach(function (c) {
            if (c && typeof c.destroy === 'function') c.destroy();
        });
        instances = [];
    }

    function render() {
        var container = document.querySelector('[data-page-content]');
        if (!container) return;

        destroyCharts();

        var template = document.getElementById('attendance-template');
        if (!template) return;

        var clone = template.content.cloneNode(true);
        container.innerHTML = '';
        container.appendChild(clone);

        if (typeof createIcons === 'function') {
            createIcons({
                icons:
                    typeof iconsAndAliases_exports !== 'undefined'
                        ? iconsAndAliases_exports
                        : undefined,
            });
        }

        loadChartJS(function () {
            createDonutChart();
        });
    }

    function loadChartJS(callback) {
        if (typeof Chart !== 'undefined') {
            callback();
            return;
        }

        var existing = document.querySelector('script[data-chartjs-loader]');
        if (existing) {
            existing.addEventListener('load', callback);
            return;
        }

        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js';
        script.crossOrigin = 'anonymous';
        script.dataset.chartjsLoader = 'true';
        script.onload = callback;
        script.onerror = function () {
            console.error('[Attendance] Failed to load Chart.js');
        };
        document.head.appendChild(script);
    }

    function createDonutChart() {
        var ctx = document.getElementById('attendanceDonutChart');
        if (!ctx) return;

        var chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Late'],
                datasets: [
                    {
                        data: [94.2, 3.8, 2.0],
                        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                        borderWidth: 0,
                        hoverOffset: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                animation: { duration: 600, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleFont: { family: 'Inter, system-ui, sans-serif', size: 12 },
                        bodyFont: {
                            family: 'Inter, system-ui, sans-serif',
                            size: 13,
                            weight: '600',
                        },
                        padding: { x: 12, y: 8 },
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            /** @param {import('chart.js').TooltipContext} ctx */
                            label: function (ctx) {
                                return ctx.parsed + '%';
                            },
                        },
                    },
                },
            },
        });

        instances.push(chart);

        var legendContainer = document.getElementById('donutLegend');
        if (!legendContainer) return;

        var items = [
            { label: 'Present', value: '94.2%', color: '#10b981' },
            { label: 'Absent', value: '3.8%', color: '#ef4444' },
            { label: 'Late', value: '2.0%', color: '#f59e0b' },
        ];

        legendContainer.innerHTML = items
            .map(function (item) {
                return (
                    '<div class="donut-legend-item">' +
                    '<div class="donut-legend-left">' +
                    '<span class="donut-legend-dot" style="background:' +
                    item.color +
                    '"></span>' +
                    '<span class="donut-legend-label">' +
                    item.label +
                    '</span>' +
                    '</div>' +
                    '<span class="donut-legend-value">' +
                    item.value +
                    '</span>' +
                    '</div>'
                );
            })
            .join('');
    }

    document.addEventListener('pathway:route', function (e) {
        if (e.detail && e.detail.route === 'attendance') {
            render();
        }
    });
})();
