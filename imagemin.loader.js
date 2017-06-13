const path = require('path');
const util = require('util');
const imagemin = require('imagemin');
const loaderUtils = require('loader-utils');

module.exports = function imageminLoader(content) {
    this.cacheable && this.cacheable();

    const padSize = 60;
    const callback = this.async();
    const plugins = loaderUtils.getOptions(this).plugins;
    const resourcePath = path.relative(__dirname, this.resourcePath).replace(/\\/g, '/');

    imagemin.buffer(content, {
        plugins,
    }).then((data) => {
        let delta = data.length - content.length;
        if (delta > 0) {
            this.emitWarning(util.format('Imagemin: %s\t+%d [skipped]', resourcePath.padStart(padSize), delta));
            callback(null, content);
        } else if (delta === 0) {
            console.log(util.format('Imagemin: %s\t[already]', resourcePath.padStart(padSize)));
            callback(null, content);
        } else {
            console.log(util.format('Imagemin: %s\t%d bytes', resourcePath.padStart(padSize), delta));
            callback(null, data);
        }
    }).catch((err) => {
        console.log(util.format('Imagemin: %s\terror', resourcePath.padStart(padSize)));
        callback(err);
    });
};

module.exports.raw = true;
