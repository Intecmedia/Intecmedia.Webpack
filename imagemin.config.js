/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const { SvgoNoPrefixConfig } = require('./svgo.config.js');

// https://web.dev/use-imagemin-to-compress-images
module.exports = {
    plugins: [
        ['mozjpeg', { // lossy
            quality: 85,
            progressive: true,
        }],
        ['optipng', { // lossless
            optimizationLevel: 3,
        }],
        ['gifsicle', { // lossless
            optimizationLevel: 3,
        }],
        ['svgo', { // lossy
            ...SvgoNoPrefixConfig,
        }],
    ],
};

module.exports.webp = {
    quality: 85, // 0 - 100
};

module.exports.avif = {
    quality: 85, // 0 - 60
};
