/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const SPACELESS_PATTERN = />\s+</g;

module.exports = function helper(string) {
    return string.replace(SPACELESS_PATTERN, '><').trim();
};
