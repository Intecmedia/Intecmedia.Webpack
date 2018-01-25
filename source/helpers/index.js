/* eslint global-require: "off", import/no-dynamic-require: "off" */

const path = require('path');
const glob = require('glob');

const requireHelpers = () => new Map(glob.sync(path.join(__dirname, '*.js'), {
    ignore: 'index.js',
}).map(filename => [path.basename(filename, '.js'), require(filename)]));

module.exports = requireHelpers();
