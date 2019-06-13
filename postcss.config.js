/* eslint global-require: "off" */
const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        require('postcss-quantity-queries')(),
        require('postcss-responsive-type')(),
        ...(ENV.PROD || ENV.DEBUG ? [
            require('postcss-focus')(),
            require('postcss-focus-visible')(),
            require('postcss-focus-within')(),
            require('pleeease-filters')(),
            require('postcss-image-set-polyfill')(),
            require('postcss-custom-properties')(),
            require('postcss-font-display')({ display: 'swap' }),
            require('postcss-object-fit-images')(),
            require('postcss-flexbugs-fixes')(),
            require('postcss-will-change')(),
            require('./postcss.webp.js')(),
            require('autoprefixer')({ overrideBrowserslist: ENV.BROWSERS }), // this always last
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
