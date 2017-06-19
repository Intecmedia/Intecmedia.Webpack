const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const sprintf = require('sprintf-js');

const flatCache = require('flat-cache');
const imageCache = flatCache.load('imagemin', path.resolve(__dirname, 'node_modules', '.cache', 'imagemin'));
const plugins = [
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


module.exports = function imageminLoader(content) {
    this.cacheable && this.cacheable();
    const callback = this.async();

    const stat = fs.statSync(this.resourcePath);
    const resourcePath = path.relative(__dirname, this.resourcePath).replace(/\\/g, '/');
    const cacheKey = `${this.resourcePath}?mtime=${stat.mtime.getTime()}&size=${stat.size}`;

    const cached = imageCache.getKey(cacheKey);
    if (cached !== undefined && cached.type == 'Buffer' && cached.data) {
        let data = new Buffer(cached.data);
        let delta = data.length - content.length;
        if (delta > 0) {
            console.log(sprintf.sprintf('imagemin: cached %60s  %6d bytes minified [skipped]', resourcePath, delta));
        } else if (delta === 0) {
            console.log(sprintf.sprintf('imagemin: cached %60s  %6d bytes minified [equal]', resourcePath, 0));
        } else {
            console.log(sprintf.sprintf('imagemin: cached %60s  %6d bytes minified [ok]', resourcePath, delta));
        }
        callback(null, data);
        return;
    }

    imagemin.buffer(content, {
        plugins: plugins,
    }).then((data) => {
        let delta = data.length - content.length;
        if (delta > 0) {
            console.log(sprintf.sprintf('imagemin: minified %60s  %6d bytes minified [skipped]', resourcePath, delta));
            imageCache.setKey(cacheKey, content);
            callback(null, content);
        } else if (delta === 0) {
            console.log(sprintf.sprintf('imagemin: minified %60s  %6d bytes minified [equal]', resourcePath, 0));
            imageCache.setKey(cacheKey, content);
            callback(null, content);
        } else {
            console.log(sprintf.sprintf('imagemin: minified %60s  %6d bytes minified [ok]', resourcePath, delta));
            imageCache.setKey(cacheKey, data);
            callback(null, data);
        }
        imageCache.save(true);
    }).catch((err) => {
        callback(err);
    });
};

module.exports.raw = true;
module.exports.imageCache = imageCache;
module.exports.plugins = plugins;

