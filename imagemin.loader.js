const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

module.exports = function imageminLoader(content) {
    this.cacheable && this.cacheable();

    let plugins = [];

    plugins.push(imageminJpegtran({
        // https://github.com/imagemin/imagemin-jpegtran
    }));
    plugins.push(imageminSvgo({
        // https://github.com/imagemin/imagemin-svgo
    }));
    plugins.push(imageminPngquant({
        // https://github.com/imagemin/imagemin-pngquant
    }));

    const callback = this.async();
    const resourcePath = path.relative(__dirname, this.resourcePath);

    imagemin.buffer(content, {
        plugins,
    }).then((data) => {
        let delta = data.length - content.length;
        if (delta > 0) {
            console.warn(`Imagemin NOT processed: ${resourcePath}\t`, (delta >= 0 ? '+' + delta : delta) + ' bytes');
            callback(null, content);
        } else {
            console.log(`Imagemin processed: ${resourcePath}\t`, (delta >= 0 ? '+' + delta : delta) + ' bytes');
            callback(null, data);
        }
    }).catch((err) => {
        console.log(`Imagemin error: ${resourcePath}`);
        callback(err);
    });
};

module.exports.raw = true;
