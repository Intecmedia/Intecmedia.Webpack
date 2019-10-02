/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const md5File = require('md5-file');

const cacheMap = {};

module.exports = (filename) => {
    const fullpath = path.join(process.cwd(), 'source', filename);
    if (!(fullpath in cacheMap)) {
        cacheMap[fullpath] = md5File.sync(fullpath);
    }
    return cacheMap[fullpath];
};
