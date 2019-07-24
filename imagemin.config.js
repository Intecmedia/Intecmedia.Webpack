const { SvgoDefaultConfig } = require('./svgo.config.js');

module.exports = {
    plugins: [
        ['mozjpeg', {
            quality: 85,
            progressive: true,
        }],
        ['optipng', {
            optimizationLevel: 3,
        }],
        ['pngquant', {
            speed: 3,
            quality: [0.85, 1.0],
        }],
        ['svgo', SvgoDefaultConfig],
        ['gifsicle', {
            optimizationLevel: 3,
        }],
        ['jpegtran', {
            progressive: true,
        }],
    ],
};
