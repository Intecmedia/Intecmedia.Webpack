/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const { rules: imgRules } = require('./plugin.html-validate.img');
const { rules: bootstrapRules } = require('./plugin.html-validate.bootstrap');

module.exports = {
    name: 'pitcher',
    rules: {
        ...imgRules,
        ...bootstrapRules,
    },
};
