/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const ImageSize = require('image-size');

module.exports = (filename) => {
    const fullpath = path.join(process.cwd(), 'source', filename);
    return ImageSize(fullpath);
};
