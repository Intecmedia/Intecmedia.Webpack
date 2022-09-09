const nunjucksRuntime = require('nunjucks/src/runtime');

const NEWLINE_PATTERN = /(\r\n|\n){2,}/g;

module.exports = function helper(str, open = '<p>', close = '</p>') {
    if (str === null || str === undefined) {
        return '';
    }
    return nunjucksRuntime.markSafe(open + str.trim().replace(NEWLINE_PATTERN, close + open) + close);
};
