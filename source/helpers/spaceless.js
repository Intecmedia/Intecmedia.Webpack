const nunjucksRuntime = require('nunjucks/src/runtime');

const SPACELESS_PATTERN = />\s+</g;

module.exports = function helper(str, safe = true) {
    const result = str.replace(SPACELESS_PATTERN, '><').trim();
    return safe ? nunjucksRuntime.markSafe(result) : result;
};
