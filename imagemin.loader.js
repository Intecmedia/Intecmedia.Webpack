const path = require('path');
const imagemin = require('imagemin');
const loaderUtils = require('loader-utils');

module.exports = function imageminLoader(content) {
    this.cacheable && this.cacheable();

    const callback = this.async();
    const plugins = loaderUtils.getOptions(this).plugins;
    const resourcePath = path.relative(__dirname, this.resourcePath);

    imagemin.buffer(content, {
        plugins,
    }).then((data) => {
        let delta = data.length - content.length;
        if (delta > 0) {
            this.emitWarning(`Imagemin NOT processed: ${resourcePath} \t +${delta} bytes`);
            callback(null, content);
        } else if (delta === 0) {
            console.log(`Imagemin NOT processed: ${resourcePath} already optimized`);
            callback(null, content);
        } else {
            console.log(`Imagemin processed: ${resourcePath} \t ${delta} bytes`);
            callback(null, data);
        }
    }).catch((err) => {
        console.log(`Imagemin error: ${resourcePath}`);
        callback(err);
    });
};

module.exports.raw = true;
