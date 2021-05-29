/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const { SvgoNoPrefixConfig } = require('./svgo.config');

// https://web.dev/use-imagemin-to-compress-images
module.exports = {
    plugins: [
        ['mozjpeg', { // lossy
            quality: 90,
            progressive: true,
        }],
        ['optipng', { // lossless
            optimizationLevel: 1,
        }],
        ['gifsicle', { // lossless
            optimizationLevel: 1,
        }],
        ['svgo', { // lossy
            ...SvgoNoPrefixConfig,
        }],
    ],
};

module.exports.webp = {
    quality: 85, // 0 - 100, or 100 for lossless
    define: [],
};

module.exports.avif = {
    quality: 85, // 0 - 100, or 100 for lossless
    define: [],
};
