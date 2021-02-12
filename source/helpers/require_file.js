/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const fs = require('fs');

module.exports = (filename) => {
    const fullpath = path.join(process.cwd(), 'source', filename);
    return fs.readFileSync(fullpath);
};
