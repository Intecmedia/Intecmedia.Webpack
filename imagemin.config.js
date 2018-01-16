const svgoConfig = require('./svgo.config.js');

module.exports = {
    svgo: svgoConfig,
    optipng: {
        optimizationLevel: 3,
    },
    gifsicle: {
        optimizationLevel: 1,
    },
    jpegtran: {
        progressive: false,
    },
};
