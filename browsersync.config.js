/* eslint-env node -- webpack is node env */

module.exports = {
    port: 3000,
    files: [
        '../include/module/**/*.{php,phtml}',
        '../include/template/**/*.{php,phtml,svg}',
    ],
    reloadDelay: 1000,
    reloadDebounce: 1000,
    watchEvents: ['add', 'change', 'unlink'],
};
