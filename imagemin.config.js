const svgoConfig = require('./svgo.config.js');
const imageminMozjpeg = require('imagemin-mozjpeg');

module.exports = {
    svgo: svgoConfig,
    optipng: {
        optimizationLevel: 9,
    },
    pngquant: {
        speed: 3,
        quality: '80-100',
    },
    gifsicle: {
        optimizationLevel: 3,
    },
    jpegtran: {
        progressive: true,
    },
    plugins: [
        imageminMozjpeg({
            quality: 85,
            progressive: true,
        }),
    ],
};
