const path = require('path');
const ImageSize = require('image-size');

const cacheMap = {};

module.exports = function helper(filename, nocache = false) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    if (!(fullpath in cacheMap) || nocache) {
        cacheMap[fullpath] = ImageSize(fullpath);
        cacheMap[fullpath].intrinsicsize = `${cacheMap[fullpath].width}x${cacheMap[fullpath].height}`;
        if (cacheMap[fullpath].type === 'jpg') {
            cacheMap[fullpath].type = 'jpeg';
        }
    }

    return cacheMap[fullpath];
};
