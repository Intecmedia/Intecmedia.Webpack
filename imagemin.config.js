const path = require('node:path');
const weblog = require('webpack-log');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const imageminIgnore = UTILS.readIgnoreFile('./.imageminignore');
const imageminLogger = weblog({ name: 'imagemin' });

// https://sharp.pixelplumbing.com/api-output#gif
module.exports = {
    implementation: ImageMinimizerPlugin.sharpMinify,
    encodeOptions: {
        jpeg: {
            // https://sharp.pixelplumbing.com/api-output#jpeg
            quality: 90,
            effort: 1,
            chromaSubsampling: '4:4:4',
        },
        png: {
            // https://sharp.pixelplumbing.com/api-output#png
            quality: 90,
            effort: 1,
            palette: false,
        },
        gif: {
            // https://sharp.pixelplumbing.com/api-output#gif
            quality: 90,
            effort: 1,
        },
    },
};
module.exports.encodeOptions.jpg = module.exports.encodeOptions.jpeg;

module.exports.webp = {
    quality: 90, // 0 - 100, or 100 for lossless
    lossless: false, // null -- auto
    options: {
        // https://sharp.pixelplumbing.com/api-output#webp
        effort: 1,
        chromaSubsampling: '4:4:4',
    },
};

module.exports.avif = {
    quality: 90, // 0 - 100, or 100 for lossless
    lossless: false, // null -- auto
    options: {
        // https://sharp.pixelplumbing.com/api-output#avif
        effort: 1,
        chromaSubsampling: '4:4:4',
    },
};

module.exports.jpeg = {
    quality: 90, // 0 - 100
    options: {
        // https://sharp.pixelplumbing.com/api-output#jpeg
        effort: 1,
        chromaSubsampling: '4:4:4',
    },
};
module.exports.jpg = module.exports.jpeg;

module.exports.png = {
    quality: 90, // 0 - 100, or 100 for lossless
    options: {
        // https://sharp.pixelplumbing.com/api-output#png
        effort: 1,
        palette: false,
    },
};

module.exports.testIgnore = (filepath) => {
    const relpath = UTILS.slash(path.relative(__dirname, path.normalize(filepath)));
    const ignores = imageminIgnore.ignores(relpath);
    if (ENV.DEBUG || ENV.ARGV.verbose) {
        imageminLogger.info(`${JSON.stringify(relpath)} ${ignores ? 'ignores' : 'minified'}`);
    }
    return ignores;
};
