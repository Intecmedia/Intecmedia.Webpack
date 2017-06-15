const fs = require('fs');
const path = require('path');
const util = require('util');
const imagemin = require('imagemin');
const imageCache = {};

module.exports = function imageminLoader(content) {
    this.cacheable && this.cacheable();

    const padSize = 60;
    const callback = this.async();

    const stat = fs.statSync(this.resourcePath);
    const resourcePath = path.relative(__dirname, this.resourcePath).replace(/\\/g, '/');
    const cacheKey = `${this.resourcePath}?mtime=${stat.mtime.getTime()}&size=${stat.size}`;

    if (cacheKey in imageCache) {
        let data = imageCache[cacheKey];
        console.log(util.format('Imagemin:\t%s    %d [cache]', resourcePath.padStart(padSize), data.length));
        callback(null, data);
        return;
    }

    imagemin.buffer(content, {
        plugins: [
            require('imagemin-gifsicle')({
                // https://github.com/imagemin/imagemin-gifsicle
            }),
            require('imagemin-jpegtran')({
                // https://github.com/imagemin/imagemin-jpegtran
            }),
            require('imagemin-svgo')({
                // https://github.com/imagemin/imagemin-svgo
            }),
            require('imagemin-pngquant')({
                // https://github.com/imagemin/imagemin-pngquant
            }),
        ],
    }).then((data) => {
        let delta = data.length - content.length;
        if (delta > 0) {
            this.emitWarning(util.format('Imagemin:\t%s    +%d bytes', resourcePath.padStart(padSize), delta));
            imageCache[cacheKey] = content;
            callback(null, content);
        } else if (delta === 0) {
            console.log(util.format('Imagemin:\t%s    %d bytes', resourcePath.padStart(padSize), 0));
            imageCache[cacheKey] = content;
            callback(null, content);
        } else {
            console.log(util.format('Imagemin:\t%s    %d bytes', resourcePath.padStart(padSize), delta));
            imageCache[cacheKey] = data;
            callback(null, data);
        }
    }).catch((err) => {
        console.log(util.format('Imagemin:\t%s    error', resourcePath.padStart(padSize)));
        callback(err);
    });
};

module.exports.raw = true;
module.exports.imageCache = imageCache;
