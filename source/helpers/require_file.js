const fs = require('node:fs');
const path = require('node:path');

module.exports = function helper(filename) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    return fs.readFileSync(fullpath);
};
