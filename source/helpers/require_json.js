const fs = require('node:fs');
const path = require('node:path');

/**
 * Read json from file.
 * @param {string} filename - file path
 * @returns {object} - json data
 */
function helperRequireJson(filename) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    return JSON.parse(fs.readFileSync(fullpath));
}
module.exports = helperRequireJson;
