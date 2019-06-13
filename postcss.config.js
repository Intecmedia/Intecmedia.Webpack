/* eslint global-require: "off" */
const ENV = require('./app.env.js');
const { URLSearchParams } = require('url');

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
            require('webpcss').default({
                webpClass: '.webp',
                noWebpClass: '',
                replace_from: /.(png|jpg|jpeg)(\?.*)?$/i,
                replace_to: ({ url }) => {
                    const [urlPath, searchPath = ''] = url.split('?', 2);
                    const searchParams = new URLSearchParams(searchPath);
                    searchParams.set('resize', '');
                    searchParams.set('format', 'webp');
                    return [urlPath, searchParams].join('?');
                },
            }),
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
