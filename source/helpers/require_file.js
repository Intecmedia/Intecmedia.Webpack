const fs = require('node:fs');
const path = require('node:path');

/**
 * Read contents from file.
 * @param {string} filename - file path
 * @returns {string} - file contents
 */
function helperRequireFile(filename) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    return fs.readFileSync(fullpath);
}
module.exports = helperRequireFile;
