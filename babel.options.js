/* eslint-env node */
/* eslint "compat/compat": "off" */

const BabelConfig = require('./babel.config.js');

module.exports = {
    ...BabelConfig.options,
};
