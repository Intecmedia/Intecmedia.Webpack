const HtmlWebpackPlugin = require('html-webpack-plugin');
const deepMerge = require('lodash.merge');
const beautify = require('js-beautify');

class HtmlBeautifyPlugin {
    constructor(options = {}) {
        this.pluginName = 'BeautifyPlugin';
        this.options = deepMerge({}, options);
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(this.pluginName, (compilation) =>
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(this.pluginName, (htmlPluginData) => {
                if (htmlPluginData.outputName && htmlPluginData.outputName.endsWith('.html')) {
                    htmlPluginData.html = beautify.html(htmlPluginData.html, this.options);
                }
            })
        );
    }
}
module.exports = HtmlBeautifyPlugin;
