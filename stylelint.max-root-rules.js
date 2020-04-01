/* eslint-env node */
/* eslint "compat/compat": "off" */

const stylelint = require('stylelint');

const ruleName = 'pitcher/max-root-rules';
const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: (maxRootRules, countRootRules) => [
        `Expected no more than ${maxRootRules} root rules.`,
        `Found ${countRootRules} root rules.`,
    ].join(' '),
});

module.exports = stylelint.createPlugin(ruleName, (maxRootRules) => ((postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName, {
        actual: maxRootRules,
        possible: Number.isInteger,
    });
    if (!validOptions) return undefined;

    let lastRootRule;
    let countRootRules = 0;
    postcssRoot.walk((rule) => {
        if (rule.parent === postcssRoot && (rule.type === 'rule'
            || (rule.type === 'atrule' && rule.name === 'media')
        )) {
            countRootRules += 1;
            lastRootRule = rule;
        }
    });

    if (countRootRules <= maxRootRules) return undefined;

    return stylelint.utils.report({
        message: messages.expected(maxRootRules, countRootRules),
        node: lastRootRule || postcssRoot,
        result: postcssResult,
        ruleName,
    });
}));

module.exports.ruleName = ruleName;
module.exports.messages = messages;
