const fs = require('node:fs');
const path = require('node:path');
const ImageSize = require('image-size');

const cacheMap = {};

/**
 * Get the size of an image.
 * @param {string} filename - image file name
 * @param {boolean} nocache - disable cache flag
 * @returns {object} - image size object
 */
function helperImageSize(filename, nocache = false) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    if (!(fullpath in cacheMap) || nocache) {
        cacheMap[fullpath] = ImageSize.imageSize(fs.readFileSync(fullpath));
        cacheMap[fullpath].intrinsicsize = `${cacheMap[fullpath].width}x${cacheMap[fullpath].height}`;
        if (cacheMap[fullpath].type === 'jpg') {
            cacheMap[fullpath].type = 'jpeg';
        }
    }

    return cacheMap[fullpath];
}

module.exports = helperImageSize;
