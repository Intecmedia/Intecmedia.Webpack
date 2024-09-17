const path = require('node:path');
const ENV = require('./app.env');

module.exports = {
    resolve: {
        alias: {
            '~': path.join(ENV.SOURCE_PATH, 'js'),
            'bootstrap/js/dist': path.join(__dirname, 'node_modules', 'bootstrap/js/src'),
            // three: require.resolve('three/src/Three.js'),
        },
    },
};
