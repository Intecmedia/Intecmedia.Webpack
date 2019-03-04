/* eslint global-require: "off" */
const sortCSSmq = require('sort-css-media-queries');

const APP = require('./app.config.js');
const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        require('postcss-quantity-queries')(),
        require('postcss-responsive-type')(),
        ...(ENV.PROD || ENV.DEBUG ? [
            require('pixrem')(),
            require('postcss-focus')(),
            require('postcss-focus-visible')(),
            require('postcss-focus-within')(),
            require('pleeease-filters')(),
            require('postcss-image-set-polyfill')(),
            ...(APP.CSS_INLINE_URL ? [require('./postcss.inline-url.js')()] : []),
            require('postcss-custom-properties')(),
            require('postcss-font-display')({ display: 'swap' }),
            require('postcss-object-fit-images')(),
            require('postcss-flexbugs-fixes')(),
            require('postcss-will-change')(),
            require('css-mqpacker')({ sort: sortCSSmq.desktopFirst }),
            require('autoprefixer')({ browsers: ENV.BROWSERS }), // this always last
            require('cssnano')({
                preset: ['default', {
                    discardComments: { removeAll: true },
                }],
            }), // this always last
        ] : []),
        require('postcss-browser-reporter')(),
        require('postcss-reporter')(), // this always last
    ],
};
