/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const fs = require('fs');

module.exports = (filename) => {
    const fullpath = path.join(process.cwd(), 'source', filename);
    return fs.readFileSync(fullpath);
};
