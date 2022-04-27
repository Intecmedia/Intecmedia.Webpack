/* eslint-env node -- webpack is node env */

module.exports = {
    watchFiles: [
        // '../include/template/**/*.{php,phtml,svg}',
    ],
    historyApiFallback: {
        rewrites: [
            // { from: /^\/example\/(.+)/, to: '/example/index.html' },
        ],
    },
};
