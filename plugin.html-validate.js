const { rules: imgRules } = require('./plugin.html-validate.img');
const { rules: bootstrapRules } = require('./plugin.html-validate.bootstrap');
const { rules: iframeRules } = require('./plugin.html-validate.iframe');
const { rules: videoRules } = require('./plugin.html-validate.video');
const { rules: commonRules } = require('./plugin.html-validate.common');
const { rules: bemRules } = require('./plugin.html-validate.bem');

module.exports = {
    name: 'pitcher',
    rules: {
        ...commonRules,
        ...imgRules,
        ...bootstrapRules,
        ...iframeRules,
        ...videoRules,
        ...bemRules,
    },
};
