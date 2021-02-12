/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", import/no-dynamic-require: "off", "compat/compat": "off" -- webpack is node env */

const path = require('path');
const glob = require('glob');

module.exports = new Map(glob.sync(path.join(__dirname, '*.js'), {
    ignore: 'index.js',
}).map((filename) => [path.basename(filename, '.js'), require(filename)]));
