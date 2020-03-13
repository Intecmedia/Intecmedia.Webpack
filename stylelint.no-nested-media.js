/* eslint-env node */
/* eslint "compat/compat": "off" */

const stylelint = require('stylelint');

const ruleName = 'intecmedia/no-nested-media';
const messages = stylelint.utils.ruleMessages(ruleName, {
    error: `Partial support nested media queries: https://caniuse.com/#feat=mdn-css_at-rules_media_nested-queries`,
});

module.exports = stylelint.createPlugin(ruleName, (actual) => ((postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName, { actual });
    if (!validOptions) return undefined;

    return postcssRoot.walkAtRules(/^media$/i, (atRule) => {
        const { parent } = atRule;
        if (!parent) return undefined;
        if (!(parent.type === 'atrule' && parent.name === 'media')) return undefined;

        return stylelint.utils.report({
            message: messages.error,
            node: parent,
            result: postcssResult,
            ruleName,
        });
    });
}));

module.exports.ruleName = ruleName;
module.exports.messages = messages;
