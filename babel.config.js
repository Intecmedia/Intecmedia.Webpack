const path = require('path');
const ENV = require('./app.env.js');

module.exports = {
    options: {
        plugins: [
            '@babel/transform-runtime',
        ],
        presets: [
            ['@babel/preset-env', {
                modules: 'commonjs',
                useBuiltIns: 'usage',
                debug: ENV.DEBUG || !ENV.PROD,
                targets: { browsers: ENV.BROWSERS },
            }],
            ['airbnb', {
                modules: true,
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
        path.join(__dirname, 'node_modules', 'focus-within'),
        path.join(__dirname, 'node_modules', 'gsap'),
    ],
};
