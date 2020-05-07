/* eslint-env node */

const HtmlWebpackPlugin = require('./plugin.html.js');
const deepMerge = require('lodash.merge');
const beautify = require('js-beautify');

class HtmlBeautifyPlugin {
    constructor(userOptions = {}) {
        this.pluginName = 'BeautifyPlugin';

        const defaultOptions = {
            config: {
                indent_size: 4,
                indent_with_tabs: false,
                html: {
                    end_with_newline: true,
                    indent_inner_html: true,
                    preserve_newlines: true,
                },
            },
        };

        this.options = deepMerge({}, defaultOptions, userOptions);
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(this.pluginName, (compilation) => HtmlWebpackPlugin.getHooks(
            compilation,
        ).beforeEmit.tapPromise(this.pluginName, async (htmlPluginData) => {
            htmlPluginData.html = beautify.html(htmlPluginData.html, this.options);
        }));
    }
}
module.exports = HtmlBeautifyPlugin;
