const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const cacheMap = {};

/**
 * Calculates the md5 hash of a given file.
 * @param {string} filename - file path
 * @param {boolean} nocache - disable cache
 * @returns {string} - md5 hash string
 */
function helperMd5File(filename, nocache = false) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    if (!(fullpath in cacheMap) || nocache) {
        cacheMap[fullpath] = crypto.createHash('md5').update(fs.readFileSync(fullpath)).digest('hex');
    }
    return cacheMap[fullpath];
}
module.exports = helperMd5File;
