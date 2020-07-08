/* eslint-env node */
/* eslint "compat/compat": "off" */

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
