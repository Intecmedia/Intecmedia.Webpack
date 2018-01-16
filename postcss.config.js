/* eslint global-require: "off" */
const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const PROD = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'production') || process.argv.indexOf('-p') !== -1;

const { browserslist: BROWSERS } = require('./package.json');

module.exports = {

    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        require('postcss-quantity-queries')(),
        require('postcss-responsive-type')(),
        ...(PROD || DEBUG ? [
            require('pixrem')(),
            require('pleeease-filters')(),
            require('postcss-image-set-polyfill')(),
            require('postcss-url')({ url: 'inline', maxSize: 32 }),
            require('postcss-color-rgba-fallback')(),
            require('postcss-flexbugs-fixes')(),
            require('css-mqpacker')(),
            require('autoprefixer')({ browsers: BROWSERS }), // this always last
        ] : []),
        require('postcss-browser-reporter')(),
        require('postcss-reporter')(), // this always last
    ],
};
