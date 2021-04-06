/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const ENV = require('./app.env.js');

module.exports = {
    resolve: {
        alias: {
            '~': path.join(ENV.SOURCE_PATH, 'js'),
            // jquery: require.resolve('jquery/dist/jquery.slim.js'),
        },
    },
};
