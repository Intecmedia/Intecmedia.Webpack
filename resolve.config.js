/* eslint-env node */
/* eslint "compat/compat": "off" */

const path = require('path');
const ENV = require('./app.env.js');

module.exports = {
    resolve: {
        alias: {
            '~': path.join(ENV.SOURCE_PATH, 'js'),
        },
    },
};
