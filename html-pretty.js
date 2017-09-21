const pretty = require('pretty');
const deepAssign = require('deep-assign');

const DEFAULT_OPTIONS = {
    ocd: false,
    unformatted: ['code', 'pre', 'em', 'strong', 'span'],
    indent_inner_html: true,
    indent_char: ' ',
    indent_size: 4,
    sep: '\n',
};

module.exports = class HtmlPrettyPlugin {
    constructor(options) {
        this.options = deepAssign({}, DEFAULT_OPTIONS, options);
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData, callback) => {
                /* eslint no-param-reassign: "off" */
                htmlPluginData.html = pretty(htmlPluginData.html, this.options);
                callback(null, htmlPluginData);
            });
        });
    }
};
