/* eslint-env node */

module.exports = {
    files: [
        '../include/module/**/*.{php,phtml}',
        '../include/template/**/*.{php,phtml}',
    ],
    reloadDelay: 1000,
    reloadDebounce: 1000,
    watchEvents: ['add', 'change', 'unlink'],
};
