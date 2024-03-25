/* eslint "sort-keys": "error" -- more readability keys */
const imageminConfig = require('./imagemin.config');

module.exports = {
    'colorspace': ['srgb', 'gray', 'b-w'],
    'jpeg': { ...imageminConfig.jpg.options, 'quality': 95 },
    'maxheight': 1920,
    'maxwidth': 1920,
    'png': { ...imageminConfig.png.options, 'quality': 95 },
};
