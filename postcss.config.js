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
        ...(PROD || DEBUG ? [
            require('pixrem')(),
            require('postcss-focus')(),
            require('pleeease-filters')(),
            require('postcss-image-set-polyfill')(),
            require('postcss-url')({
                filter: (url) => {
                    if (/(resize|inline)/.test(url.search)) return false;
                    const ext = path.extname(url.pathname).toLowerCase();
                    return ['png', 'jpeg', 'jpg', 'gif', 'svg'].includes(ext);
                },
                url: 'inline',
                maxSize: 32,
                basePath: [path.join(BUILD_PATH, 'css'), path.join(SOURCE_PATH, 'css')],
            }),
            require('postcss-font-magician')({ display: 'swap', foundries: '' }),
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
