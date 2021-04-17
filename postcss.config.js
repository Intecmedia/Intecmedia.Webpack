/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", "compat/compat": "off" -- webpack is node env */

const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        ...(ENV.PROD || ENV.DEBUG ? [
            require('postcss-focus')(),
            require('postcss-focus-visible')(),
            require('postcss-focus-within')(),
            require('postcss-font-display')([
                { display: 'swap' },
                { test: 'FontAwesome', display: 'block' },
            ]),
            require('postcss-flexbugs-fixes')(),
            require('./postcss.stylelint.js')(),
            require('./postcss.avif.js')(),
            require('./postcss.webp.js')(),
            require('autoprefixer')({ overrideBrowserslist: ENV.BROWSERS }), // this always last
            ...(!ENV.DEBUG ? [require('cssnano')({
                preset: ['default', {
                    minifyFontValues: { removeQuotes: false },
                    discardComments: { removeAll: true },
                }],
            })] : []), // this always last
        ] : []),
        require('./postcss.resolve-absolute.js')({
            silent: !(ENV.PROD || ENV.DEBUG),
        }),
        require('postcss-browser-reporter')(),
        require('./postcss.reporter.js')(), // this always last
        ...(!(ENV.DEV_SERVER || ENV.WATCH) && !ENV.DEBUG ? [
            require('postcss-fail-on-warn')(),
        ] : []), // this always last
    ],
};
