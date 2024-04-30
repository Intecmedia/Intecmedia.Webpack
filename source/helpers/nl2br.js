const nunjucksRuntime = require('nunjucks/src/runtime');

const NEWLINE_PATTERN = /\r\n|\n/g;

/**
 * Inserts HTML line breaks before all newlines in a string.
 * @param {string} str - input string
 * @returns {string} - html string
 */
function helperNl2Br(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return nunjucksRuntime.markSafe(str.replace(NEWLINE_PATTERN, '<br>\n'));
}
module.exports = helperNl2Br;
