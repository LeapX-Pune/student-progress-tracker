const config = {
    ci: {
        collect: {
            url: ['http://localhost:4173'],
            numberOfRuns: 3,
            settings: {
                onlyCategories: ['performance', 'accessibility'],
                emulatedFormFactor: 'mobile',
                throttling: {
                    rttMs: 150,
                    throughputKbps: 1638.4,
                    cpuSlowdownMultiplier: 1,
                },
            },
        },
        assert: {
            assertions: {
                'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
                'largest-contentful-paint': ['warn', { maxNumericValue: 3500 }],
                'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
                'total-blocking-time': ['warn', { maxNumericValue: 300 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:performance': ['warn', { minScore: 0.8 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};

export default config;
