const path = require('path');

module.exports = {
    excludeTransform: [
        // disable babel transform
        path.join(__dirname, 'node_modules'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    includeTransform: [
        // enable babel transform
        path.join(__dirname, 'source'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    excludeJquery: [
        // disable jquery global
        path.join(__dirname, 'node_modules'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
    includeJquery: [
        // enable jquery global
        path.join(__dirname, 'source'),
        // path.join(__dirname, 'node_modules', 'example-package-name'),
    ],
};
