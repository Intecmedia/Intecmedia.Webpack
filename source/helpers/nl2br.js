const nunjucksRuntime = require('nunjucks/src/runtime');

const NEWLINE_PATTERN = /\r\n|\n/g;

module.exports = function helper(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return nunjucksRuntime.markSafe(str.replace(NEWLINE_PATTERN, '<br>\n'));
};
