const nunjucksRuntime = require('nunjucks/src/runtime');

const NEWLINE_PATTERN = /(\r\n|\n){2,}/g;

/**
 * Inserts HTML <p> before all newlines in a string
 * @param {string} str - input string
 * @param {string} open - open tag
 * @param {string} close - close tag
 * @returns {string} - html string
 */
function helperPara(str, open = '<p>', close = '</p>') {
    if (str === null || str === undefined) {
        return '';
    }
    return nunjucksRuntime.markSafe(open + str.trim().replace(NEWLINE_PATTERN, close + open) + close);
}
module.exports = helperPara;
