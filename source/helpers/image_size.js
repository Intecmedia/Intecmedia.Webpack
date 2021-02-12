/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const ImageSize = require('image-size');

module.exports = (filename) => {
    const fullpath = path.join(process.cwd(), 'source', filename);
    return ImageSize(fullpath);
};
