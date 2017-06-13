const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

module.exports = function imageminLoader(content) {
    this.cacheable && this.cacheable();

    let callback = this.async();
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

    imagemin.buffer(content, {
        plugins,
    }).then((data) => {
        callback(null, data);
    }).catch((err) => {
        callback(err);
    });
};

module.exports.raw = true;
