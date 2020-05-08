/* eslint-env node */
/* eslint "compat/compat": "off" */

const { rules: imgRules } = require('./plugin.html-validate.img.js');
const { rules: bootstrapRules } = require('./plugin.html-validate.bootstrap.js');

module.exports = {
    name: 'intecmedia',
    rules: {
        ...imgRules,
        ...bootstrapRules,
    },
};
