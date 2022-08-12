/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const Typograf = require('typograf');
const nunjucksRuntime = require('nunjucks/src/runtime');

const options = require('../../.typografrc.json');

module.exports = function helper(str) {
    const instance = new Typograf(options);
    instance.addSafeTag('{{', '}}');
    instance.addSafeTag('{%', '%}');
    instance.addSafeTag('{#', '#}');
    instance.addSafeTag('<%', '%>');
    instance.addSafeTag('<!-- typograf ignore:start -->', '<!-- typograf ignore:end -->');

    return nunjucksRuntime.markSafe(instance.execute(str));
};
