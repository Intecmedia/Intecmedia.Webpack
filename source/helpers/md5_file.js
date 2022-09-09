const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const cacheMap = {};

module.exports = function helper(filename, nocache = false) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    if (!(fullpath in cacheMap) || nocache) {
        cacheMap[fullpath] = crypto.createHash('md5').update(fs.readFileSync(fullpath)).digest('hex');
    }
    return cacheMap[fullpath];
};
