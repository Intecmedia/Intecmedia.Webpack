/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", "compat/compat": "off" -- webpack is node env */

const lineEllipsis = 80;
const lineColumn = require('line-column');
const reporterFormatter = require('postcss-reporter/lib/formatter.js')({});

module.exports = () => {
    const plugin = require('postcss-reporter')({
        formatter: (input) => {
            input.messages.forEach((message) => {
                if (!(message.node && message.node.source && message.node.source.input)) return;
                const { css } = message.node.source.input;
                const index = lineColumn(css).toIndex({ line: message.line, col: message.column });
                const ellipsis = css.substring(index - lineEllipsis, index + lineEllipsis).trim();
                message.text += `:\n…\n${ellipsis}\n…\n`;
            });
            return reporterFormatter(input);
        },
    });
    plugin.postcssPlugin = 'postcss.reporter.js';
    return plugin;
};
