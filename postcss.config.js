/* eslint global-require: "off" */
const path = require('path');
const URL = require('url');

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
            require('postcss-focus')(),
            require('pleeease-filters')(),
            require('postcss-image-set-polyfill')(),
            require('postcss-url')({
                filter: (asset) => {
                    if (/(inline)/.test(asset.search)) return false;
                    const ext = path.extname(asset.pathname).toLowerCase();
                    return ['.png', '.jpeg', '.jpg', '.gif', '.svg'].includes(ext);
                },
                assetsPath: (asset) => {
                    const url = new URL(asset);
                    url.searchParams.set('inline', 'inline');
                    return url.toString();
                },
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
