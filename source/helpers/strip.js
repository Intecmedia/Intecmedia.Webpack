const nunjucksRuntime = require('nunjucks/src/runtime');

const STRIP_PATTERN = /\s+/g;

/**
 * Strip all whitespace from string.
 * @param {string} str - input string
 * @param {boolean} safe - mark as safe string
 * @returns {string} - output string
 */
function helperStrip(str, safe = false) {
    const result = str.replace(STRIP_PATTERN, ' ').trim();
    return safe ? nunjucksRuntime.markSafe(result) : result;
}
module.exports = helperStrip;
