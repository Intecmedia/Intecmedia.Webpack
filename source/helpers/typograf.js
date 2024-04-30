const Typograf = require('typograf');
const nunjucksRuntime = require('nunjucks/src/runtime');

const options = require('../../.typografrc.json');

/**
 * Typografy string.
 * @param {string} str - input string
 * @returns {string} - ouput string
 */
function helperTypograf(str) {
    const instance = new Typograf(options);
    instance.addSafeTag('{{', '}}');
    instance.addSafeTag('{%', '%}');
    instance.addSafeTag('{#', '#}');
    instance.addSafeTag('<%', '%>');
    instance.addSafeTag('<!-- typograf ignore:start -->', '<!-- typograf ignore:end -->');

    return nunjucksRuntime.markSafe(instance.execute(str));
}
module.exports = helperTypograf;
