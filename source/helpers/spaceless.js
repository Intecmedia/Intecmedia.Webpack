const nunjucksRuntime = require('nunjucks/src/runtime');

const SPACELESS_PATTERN = />\s+</g;

/**
 * Strip tags whitespace from string.
 * @param {string} str - input string
 * @param {boolean} safe - mark as safe string
 * @returns {string} - output string
 */
function helperSpaceless(str, safe = true) {
    const result = str.replace(SPACELESS_PATTERN, '><').trim();
    return safe ? nunjucksRuntime.markSafe(result) : result;
}
module.exports = helperSpaceless;
