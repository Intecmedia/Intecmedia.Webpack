/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const ignore = require('ignore');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');

const ENV = require('./app.env');
const { SvgoNoPrefixConfig } = require('./svgo.config');

const imageminIgnore = ignore().add(fs.readFileSync('./.imageminignore').toString());
const imageminLogger = weblog({ name: 'imagemin' });

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
    quality: 90, // 0 - 100, or 100 for lossless
    options: {}, // https://sharp.pixelplumbing.com/api-output#webp
};

module.exports.avif = {
    quality: 90, // 0 - 100, or 100 for lossless
    options: {}, // https://sharp.pixelplumbing.com/api-output#avif
};

module.exports.jpeg = {
    quality: 90, // 0 - 100
    options: {}, // https://sharp.pixelplumbing.com/api-output#jpeg
};
module.exports.jpg = module.exports.jpeg;

module.exports.png = {
    quality: 100, // 0 - 100, or 100 for lossless
    options: {}, // https://sharp.pixelplumbing.com/api-output#png
};

module.exports.testIgnore = (filepath) => {
    const relpath = slash(path.relative(__dirname, path.normalize(filepath)));
    const ignores = imageminIgnore.ignores(relpath);
    if (ENV.DEBUG) {
        imageminLogger.info(`${JSON.stringify(relpath)} ${ignores ? 'ignores' : 'minified'}`);
    }
    return ignores;
};
