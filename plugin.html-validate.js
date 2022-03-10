/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const { rules: imgRules } = require('./plugin.html-validate.img');
const { rules: bootstrapRules } = require('./plugin.html-validate.bootstrap');
const { rules: iframeRules } = require('./plugin.html-validate.iframe');
const { rules: videoRules } = require('./plugin.html-validate.video');
const { rules: commonRules } = require('./plugin.html-validate.common');

module.exports = {
    name: 'pitcher',
    rules: {
        ...commonRules,
        ...imgRules,
        ...bootstrapRules,
        ...iframeRules,
        ...videoRules,
    },
};
