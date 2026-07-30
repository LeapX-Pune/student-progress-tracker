export default {
    'src/**/*.{js,jsx}': ['eslint --fix', 'prettier --write'],
    '*.{js,jsx}': ['prettier --write'],
    '*.{json,css,md}': ['prettier --write'],
};
