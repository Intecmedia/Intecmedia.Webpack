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

    const stat = fs.statSync(fullpath);
    const cacheKey = `${fullpath}:${stat.mtimeMs}`;

    if (!(cacheKey in cacheMap) || nocache) {
        cacheMap[cacheKey] = ImageSize.imageSize(fs.readFileSync(fullpath));
        if (cacheMap[cacheKey].type === 'jpg') {
            cacheMap[cacheKey].type = 'jpeg';
        }
    }

    return cacheMap[cacheKey];
}

module.exports = helperImageSize;
