/* eslint-env node */
/* eslint "compat/compat": "off" */

const stylelint = require('stylelint');

const ruleName = 'pitcher/max-lines';
const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: (maxLines, countLines) => [
        `Expected no more than ${maxLines} lines.`,
        `Found ${countLines} lines.`,
    ].join(' '),
});

module.exports = stylelint.createPlugin(ruleName, (maxLines) => ((postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName, {
        actual: maxLines,
        possible: Number.isInteger,
    });
    if (!validOptions) return undefined;

    const countLines = postcssRoot.source.input.css.split(/\r\n|\n/).length;
    if (countLines <= maxLines) return undefined;

    return stylelint.utils.report({
        message: messages.expected(maxLines, countLines),
        node: postcssRoot,
        result: postcssResult,
        ruleName,
    });
}));

module.exports.ruleName = ruleName;
module.exports.messages = messages;
