export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'subject-case': [0],
        'scope-enum': [0],
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'chore',
                'ci',
                'revert',
                'wip',
            ],
        ],
    },
};
