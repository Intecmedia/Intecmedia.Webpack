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
    quality: 85, // 0 - 100, or 100 for lossless
    options: {},
};

module.exports.avif = {
    quality: 85, // 0 - 100, or 100 for lossless
    options: {},
};

module.exports.testIgnore = (filepath) => {
    const relativePath = slash(path.relative(__dirname, path.normalize(filepath)));
    const ignores = imageminIgnore.ignores(relativePath);
    if (ENV.DEBUG) {
        imageminLogger.info(`${JSON.stringify(relativePath)} ${ignores ? 'ignores' : 'minified'}`);
    }
    return ignores;
};
