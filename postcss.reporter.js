/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

const lineEllipsis = 80;
const lineColumn = require('line-column');
const reporterFormatter = require('postcss-reporter/lib/formatter.js')({});

module.exports = () => require('postcss-reporter')({
    formatter: (input) => {
        input.messages.forEach((message) => {
            const { css } = message.node.source.input;
            const index = lineColumn(css).toIndex({ line: message.line, col: message.column });
            const ellipsis = css.substring(index - lineEllipsis, index + lineEllipsis);
            message.text += `:\n...\n${ellipsis}...\n`;
        });
        return reporterFormatter(input);
    },
});
