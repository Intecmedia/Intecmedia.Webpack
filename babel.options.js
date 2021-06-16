/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');

module.exports = {
    excludeTransform: [
        // disable babel transform
        path.join(__dirname, 'node_modules'),
    ],
    includeTransform: [
        // enable babel transform
        /\.(ts|mjs|cjs)(\?.*)?$/i,
        /\.module(\.min)?\.js(\?.*)?$/i,
        path.join(__dirname, 'source'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    excludeJquery: [
        // disable jquery global
        path.join(__dirname, 'node_modules', 'core-js'),
        path.join(__dirname, 'node_modules', '@babel'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    includeJquery: [
        // enable jquery global
        path.join(__dirname, 'source'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
};
