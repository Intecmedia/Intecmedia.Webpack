/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const ENV = require('./app.env.js');

module.exports = {
    options: {
        plugins: [
            '@babel/transform-runtime',
            '@babel/plugin-proposal-optional-chaining',
        ],
        presets: [
            ['@babel/preset-env', {
                corejs: 3,
                modules: false,
                useBuiltIns: 'entry',
                debug: ENV.DEBUG || !ENV.PROD,
                targets: { browsers: ENV.BROWSERS },
            }],
            ['airbnb', {
                modules: false,
                debug: ENV.DEBUG || !ENV.PROD,
                targets: { browsers: ENV.BROWSERS },
            }],
        ],
    },
    excludeTransform: [
        // disable babel transform
        path.join(__dirname, 'node_modules'),
    ],
    includeTransform: [
        // enable babel transform
        path.join(__dirname, 'node_modules', 'core-js'),
        path.join(__dirname, 'node_modules', '@babel', 'polyfill'),
        path.join(__dirname, 'node_modules', 'focus-within'),
        path.join(__dirname, 'node_modules', 'gsap'),
        path.join(__dirname, 'node_modules', 'three'),
    ],
};
