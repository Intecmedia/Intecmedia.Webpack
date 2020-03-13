/* eslint-env node */
/* eslint "compat/compat": "off" */

const stylelint = require('stylelint');

const ruleName = 'intecmedia/no-nested-media';
const messages = stylelint.utils.ruleMessages(ruleName, {
    error: (media) => [
        `Partial support nested media queries: ${media}.`,
        '[https://caniuse.com/#feat=mdn-css_at-rules_media_nested-queries]',
    ].join(' '),
});

module.exports = stylelint.createPlugin(ruleName, (actual) => ((postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(postcssResult, ruleName, { actual });
    if (!validOptions) return undefined;

    return postcssRoot.walkAtRules(/^media$/i, (atRule) => {
        const { parent } = atRule;

        if (!parent) return undefined;
        if (!(parent.type === 'atrule' && parent.name === 'media')) return undefined;

        const source = atRule.source || parent.source;
        const media = `@media (${parent.params}) { @media (${atRule.params}) { … } }`;

        return stylelint.utils.report({
            ruleName,
            message: messages.error(media),
            node: parent,
            result: postcssResult,
            line: source.start.line,
            column: source.start.column,
        });
    });
}));

module.exports.ruleName = ruleName;
module.exports.messages = messages;
