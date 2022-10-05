const path = require('path');
const ENV = require('./app.env');

module.exports = {
    resolve: {
        alias: {
            '~': path.join(ENV.SOURCE_PATH, 'js'),
            'bootstrap/js/src': path.join(__dirname, 'node_modules', 'bootstrap/js/dist'),
            // jquery: require.resolve('jquery/dist/jquery.slim.js'),
            // three: require.resolve('three/src/Three.js'),
        },
    },
};
