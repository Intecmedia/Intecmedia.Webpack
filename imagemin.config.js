const svgoConfig = require('./svgo.config.js');

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
};
