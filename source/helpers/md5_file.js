/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const md5File = require('md5-file');

const cacheMap = {};

module.exports = function helper(filename) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    if (!(fullpath in cacheMap)) {
        cacheMap[fullpath] = md5File.sync(fullpath);
    }
    return cacheMap[fullpath];
};
