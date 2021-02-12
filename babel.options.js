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
        path.join(__dirname, 'node_modules', 'focus-within'),
        path.join(__dirname, 'node_modules', 'gsap'),
        path.join(__dirname, 'node_modules', 'three'),
    ],
};
