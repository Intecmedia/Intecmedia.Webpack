/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "require-await": "off" -- webpack is node env */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const deepMerge = require('lodash.merge');
const beautify = require('js-beautify');

class HtmlBeautifyPlugin {
    constructor(userOptions = {}) {
        this.pluginName = 'BeautifyPlugin';

        const defaultOptions = {
            config: {
                indent_char: ' ',
                indent_size: 4,
                html: {
                    unformatted: ['code', 'pre', 'textarea'],
                    wrap_line_length: 120,
                    max_preserve_newlines: 1,
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
