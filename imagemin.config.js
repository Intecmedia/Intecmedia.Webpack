/* eslint-env node */
/* eslint "compat/compat": "off" */

const { SvgoDefaultConfig } = require('./svgo.config.js');

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
        ['pngquant', { // lossy
            speed: 3,
            quality: [0.85, 1.0],
        }],
        ['svgo', { // lossy
            ...SvgoDefaultConfig,
        }],
        ['gifsicle', { // lossless
            optimizationLevel: 3,
        }],
        ['jpegtran', { // lossless
            progressive: true,
        }],
    ],
};
