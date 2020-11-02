/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');

module.exports = {
    excludeTransform: [
        // disable babel transform
        path.join(__dirname, 'node_modules'),
    ],
    includeTransform: [
        // enable babel transform
        path.join(__dirname, 'node_modules', 'focus-within'),
        path.join(__dirname, 'node_modules', 'gsap'),
        path.join(__dirname, 'node_modules', 'three'),
    ],
};
