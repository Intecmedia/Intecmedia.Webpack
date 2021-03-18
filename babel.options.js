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
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    excludeJquery: [
        // disable jquery global
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    includeJquery: [
        // enable jquery global
    ],
};
