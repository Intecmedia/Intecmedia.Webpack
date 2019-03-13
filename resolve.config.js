const path = require('path');
const ENV = require('./app.env.js');

module.exports = {
    alias: {
        '~': path.join(ENV.SOURCE_PATH, 'js'),
    },
};
