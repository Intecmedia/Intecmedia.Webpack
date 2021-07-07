/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const ImageSize = require('image-size');

const cacheMap = {};

module.exports = function helper(filename, nocache = false) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    if (!(fullpath in cacheMap) || nocache) {
        cacheMap[fullpath] = ImageSize(fullpath);
    }
    return cacheMap[fullpath];
};
