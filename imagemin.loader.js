const path = require('path');
const util = require('util');
const imagemin = require('imagemin');
const loaderUtils = require('loader-utils');

module.exports = function imageminLoader(content) {
    this.cacheable && this.cacheable();

    const callback = this.async();
    const plugins = loaderUtils.getOptions(this).plugins;
    const resourcePath = path.relative(__dirname, this.resourcePath).replace(/\\/g, '/');

    imagemin.buffer(content, {
        plugins,
    }).then((data) => {
        let delta = data.length - content.length;
        if (delta > 0) {
            this.emitWarning(util.format('Imagemin: %s\t+%d [skipped]', resourcePath.padStart(80), delta));
            callback(null, content);
        } else if (delta === 0) {
            console.log(util.format('Imagemin: %s\t[already]', resourcePath.padStart(80)));
            callback(null, content);
        } else {
            console.log(util.format('Imagemin: %s\t%d bytes', resourcePath.padStart(80), delta));
            callback(null, data);
        }
    }).catch((err) => {
        console.log(util.format('Imagemin: %s\terror', resourcePath.padStart(80)));
        callback(err);
    });
};

module.exports.raw = true;
