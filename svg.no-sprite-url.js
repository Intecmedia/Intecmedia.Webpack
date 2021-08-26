/* eslint-env node  -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');

const URL_PATTERN = /url\((.+)\)/i;

module.exports = function noSpriteURL(filename) {
    const content = fs.readFileSync(filename).toString();

    if (URL_PATTERN.test(content)) {
        const [url] = content.match(URL_PATTERN);
        const relativePath = slash(path.relative(__dirname, path.normalize(filename)));
        throw new Error(`[svg-sprite] external content (${url}) not allowed in: ${relativePath}`);
    }
};
