/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        ...(ENV.PROD || ENV.DEBUG ? [
            require('postcss-focus')(),
            require('postcss-focus-visible')(),
            require('postcss-focus-within')(),
            require('postcss-image-set-polyfill')(),
            require('postcss-custom-properties')(),
            require('postcss-font-display')([
                { display: 'swap' },
                { test: 'FontAwesome', display: 'block' },
            ]),
            require('postcss-object-fit-images')(),
            require('postcss-flexbugs-fixes')(),
            require('./postcss.webp.js')(),
            require('./postcss.stylelint.js')(),
            require('autoprefixer')({ overrideBrowserslist: ENV.BROWSERS }), // this always last
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
