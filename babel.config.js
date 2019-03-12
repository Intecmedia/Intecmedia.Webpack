const path = require('path');
const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        '@babel/transform-runtime',
    ],
    presets: [
        ['@babel/preset-env', {
            modules: 'commonjs',
            useBuiltIns: 'entry',
            targets: { browsers: ENV.BROWSERS },
        }],
        ['airbnb', {
            modules: true,
            targets: { browsers: ENV.BROWSERS },
        }],
    ],
    exclude: [
        // disable babel transform
        path.join(__dirname, 'node_modules'),
    ],
    include: [
        // enable babel transform
        path.join(__dirname, 'node_modules', 'focus-within'),
        path.join(__dirname, 'node_modules', 'gsap'),
    ],
};
