/* eslint global-require: "off" */
const sortCSSmq = require('sort-css-media-queries');

const APP = require('./app.config.js');
const { browserslist: BROWSERS } = require('./package.json');

const DEBUG = process.env.DEBUG || false;
const PROD = (process.env.NODE_ENV === 'production');

module.exports = {
    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        require('postcss-quantity-queries')(),
        require('postcss-responsive-type')(),
        ...(PROD || DEBUG ? [
            require('pixrem')(),
            require('postcss-focus')(),
            require('pleeease-filters')(),
            require('postcss-image-set-polyfill')(),
            ...(APP.CSS_INLINE_URL ? [require('./postcss.inline-url.js')()] : []),
            require('postcss-custom-properties')(),
            require('postcss-font-display')({ display: 'swap' }),
            require('postcss-object-fit-images')(),
            require('postcss-color-rgba-fallback')(),
            require('postcss-flexbugs-fixes')(),
            require('postcss-will-change')(),
            require('css-mqpacker')({ sort: sortCSSmq.desktopFirst }),
            require('autoprefixer')({ browsers: BROWSERS }), // this always last
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
