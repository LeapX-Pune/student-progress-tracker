import { expect } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe/matchers';
import { axe, configureAxe } from 'vitest-axe';

expect.extend({ toHaveNoViolations });

const configuredAxe = configureAxe({
    globalOptions: {
        branding: { application: 'Student Progress Tracker' },
    },
    runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
    },
});

export { configuredAxe };
export { axe };
