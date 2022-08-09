/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const nunjucksRuntime = require('nunjucks/src/runtime');

const SPACELESS_PATTERN = />\s+</g;

module.exports = function helper(str) {
    return nunjucksRuntime.copySafeness(str, str.replace(SPACELESS_PATTERN, '><').trim());
};
