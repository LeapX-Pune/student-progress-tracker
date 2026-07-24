import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import promise from 'eslint-plugin-promise';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.{js,jsx}'],
        plugins: {
            'import-x': importX,
            jsdoc,
            promise,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { modules: true },
            },
            globals: {
                // browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                AbortController: 'readonly',
                FormData: 'readonly',
                Headers: 'readonly',
                Request: 'readonly',
                Response: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                matchMedia: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                HTMLElement: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLTemplateElement: 'readonly',
                HTMLImageElement: 'readonly',
                Image: 'readonly',
                IntersectionObserver: 'readonly',
                customElements: 'readonly',
                import: 'readonly',
                // node globals
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
            },
        },
        rules: {
            indent: ['error', 4, { SwitchCase: 1 }],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
            ],
            'no-console': [
                'warn',
                { allow: ['warn', 'error', 'log', 'info', 'debug', 'table', 'time', 'timeEnd'] },
            ],
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-arrow-callback': 'error',
            'arrow-spacing': 'error',
            'no-duplicate-imports': 'error',

            // import-x rules (replaces eslint-plugin-import)
            'import-x/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    pathGroups: [{ pattern: '@/**', group: 'internal' }],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    alphabetize: { order: 'asc' },
                },
            ],
            'import-x/no-unresolved': 'error',
            'import-x/no-cycle': 'error',

            // promise rules
            'promise/always-return': 'error',
            'promise/no-return-wrap': 'error',
            'promise/param-names': 'error',
            'promise/catch-or-return': 'error',

            // jsdoc rules
            'jsdoc/require-jsdoc': [
                'warn',
                {
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                        ClassDeclaration: true,
                        ArrowFunctionExpression: true,
                        FunctionExpression: true,
                    },
                },
            ],
            'jsdoc/check-values': 'error',
            'jsdoc/check-param-names': 'error',
        },
    },
    // Test files - relax rules, add jsdom/vitest globals
    {
        files: ['**/*.test.js', '**/*.spec.js', 'tests/**'],
        languageOptions: {
            globals: {
                // vitest globals
                vi: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                // jsdom / browser globals
                document: 'readonly',
                window: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                HTMLElement: 'readonly',
                HTMLTemplateElement: 'readonly',
                customElements: 'readonly',
                MouseEvent: 'readonly',
                KeyboardEvent: 'readonly',
                Event: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                fetch: 'readonly',
                Request: 'readonly',
                Response: 'readonly',
                URL: 'readonly',
                AbortController: 'readonly',
                console: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
            'jsdoc/require-jsdoc': 'off',
        },
    },
    // Build scripts — allow console, Node.js globals
    {
        files: ['scripts/**'],
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                AbortController: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
        },
    },
    // Ignore patterns
    {
        ignores: ['dist/', 'node_modules/', 'public/', '*.config.js', '*.config.mjs'],
    },
];
