/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", import/no-dynamic-require: "off", "compat/compat": "off" -- webpack is node env */

const path = require('path');
const glob = require('glob');
const slash = require('slash');

module.exports = new Map(glob.sync(slash(path.join(__dirname, '*.js')), {
    ignore: slash(path.join(__dirname, 'index.js')),
}).map((filename) => {
    const helper = require(filename);
    helper.filename = slash(filename);
    return [path.basename(filename, '.js'), helper];
}));
