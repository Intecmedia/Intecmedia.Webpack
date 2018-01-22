/* eslint global-require: "off" */
const path = require('path');

const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const PROD = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'production') || process.argv.indexOf('-p') !== -1;
const { browserslist: BROWSERS } = require('./package.json');

const SOURCE_PATH = path.resolve(__dirname, 'source');
const { output: { path: BUILD_PATH } } = require('./webpack.config.js');

module.exports = {
    plugins: [
        require('postcss-devtools')({ precise: true }),
        require('postcss-input-style')(),
        require('postcss-quantity-queries')(),
        require('postcss-responsive-type')(),
        require('postcss-font-magician')({ display: 'swap', foundries: '' }),
        ...(PROD || DEBUG ? [
            require('pixrem')(),
            require('pleeease-filters')(),
            require('postcss-image-set-polyfill')(),
            require('postcss-url')({
                url: 'inline',
                maxSize: 32,
                basePath: [path.join(BUILD_PATH, 'css'), path.join(SOURCE_PATH, 'css')],
            }),
            require('postcss-color-rgba-fallback')(),
            require('postcss-flexbugs-fixes')(),
            require('postcss-will-change')(),
            require('css-mqpacker')(),
            require('autoprefixer')({ browsers: BROWSERS }), // this always last
        ] : []),
        require('postcss-browser-reporter')(),
        require('postcss-reporter')(), // this always last
    ],
};
