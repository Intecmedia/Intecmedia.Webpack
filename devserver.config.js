module.exports = {
    watchFiles: [
        // '../include/template/**/*.{php,phtml,svg}',
    ],
    historyApiFallback: {
        index: '/',
        disableDotRule: true,
        rewrites: [
            { from: /./, to: '/404' },
            // { from: /^\/from-example\/(.+)/, to: '/to-example' },
        ],
    },
};
