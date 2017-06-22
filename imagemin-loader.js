/* eslint global-require: "off" */
const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js');
const imagemin = require('imagemin');
const imageminCache = require('flat-cache').load('imagemin', path.resolve('./node_modules/.cache/imagemin-loader'));

const imageminPlugins = [
    require('imagemin-gifsicle')({
    // https://github.com/imagemin/imagemin-gifsicle
    }),
    require('imagemin-jpegtran')({
    // https://github.com/imagemin/imagemin-jpegtran
    }),
    require('imagemin-svgo')({
    // https://github.com/imagemin/imagemin-svgo
    }),
    require('imagemin-optipng')({
    // https://github.com/imagemin/imagemin-optipng
    }),
    require('imagemin-pngquant')({
    // https://github.com/imagemin/imagemin-pngquant
    }),
];

let firstCall = true;

module.exports = function imageminLoader(content) {
    if (this.cacheable) {
        this.cacheable();
    }
    const callback = this.async();

    const stat = fs.statSync(this.resourcePath);
    const url = path.relative(__dirname, this.resourcePath).replace(/\\/g, '/');
    const cacheKey = `${this.resourcePath}?${JSON.stringify(stat)}`;

    if (firstCall) {
        firstCall = false;
        console.log('\nImagemin loader:');
    }

    const cached = imageminCache.getKey(cacheKey);
    if (cached !== undefined && cached.type === 'Buffer' && cached.data) {
        const data = new Buffer(cached.data);
        const delta = data.length - content.length;
        if (delta > 0) {
            console.log(sprintf.sprintf('  [cached]   %60s  %6d bytes saved [skipped]', url, delta));
        } else if (delta === 0) {
            console.log(sprintf.sprintf('  [cached]   %60s  %6d bytes saved [equal]', url, 0));
        } else {
            console.log(sprintf.sprintf('  [cached]   %60s  %6d bytes saved [ok]', url, delta));
        }
        callback(null, data);
        return;
    }

    imagemin.buffer(content, {
        plugins: imageminPlugins,
    }).then((data) => {
        const delta = data.length - content.length;
        if (delta > 0) {
            console.log(sprintf.sprintf('  [minified] %60s  %6d bytes saved [skipped]', url, delta));
            imageminCache.setKey(cacheKey, content.toJSON());
            callback(null, content);
        } else if (delta === 0) {
            console.log(sprintf.sprintf('  [minified] %60s  %6d bytes saved [equal]', url, 0));
            imageminCache.setKey(cacheKey, content.toJSON());
            callback(null, content);
        } else {
            console.log(sprintf.sprintf('  [minified] %60s  %6d bytes saved [ok]', url, delta));
            imageminCache.setKey(cacheKey, data.toJSON());
            callback(null, data);
        }
        imageminCache.save(true);
    }).catch((err) => {
        callback(err);
    });
};

module.exports.raw = true;
module.exports.imageminCache = imageminCache;
module.exports.imageminPlugins = imageminPlugins;
