const nunjucksRuntime = require('nunjucks/src/runtime');

const STRIP_PATTERN = /\s+/g;

module.exports = function helper(str, safe = false) {
    const result = str.replace(STRIP_PATTERN, ' ').trim();
    return safe ? nunjucksRuntime.markSafe(result) : result;
};
