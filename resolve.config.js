const path = require('node:path');
const ENV = require('./app.env');

module.exports = {
    resolve: {
        mainFields: ['module', 'main'],
        alias: {
            '~': path.join(ENV.SOURCE_PATH, 'js'),
            'bootstrap/js/dist': path.join(__dirname, 'node_modules', 'bootstrap/js/src'),
            'gsap': path.join(__dirname, 'node_modules', 'gsap/src'),
            '@barba/core': path.join(__dirname, 'node_modules', '@barba/core/dist/barba.mjs'),
            '@barba/prefetch': path.join(__dirname, 'node_modules', '@barba/prefetch/dist/barba-prefetch.mjs'),
            // three: require.resolve('three/src/Three.js'),
        },
    },
};
