const path = require('node:path');

module.exports = {
    excludeTransform: [
        // disable babel transform
        path.join(__dirname, 'node_modules'),
        path.join(__dirname, 'node_modules', 'core-js'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    includeTransform: [
        // enable babel transform
        path.join(__dirname, 'source'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
};
