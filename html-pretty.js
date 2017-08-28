const pretty = require('pretty');

function HtmlPrettyPlugin(options) {
    this.options = Object.assign({}, { ocd: false }, options);
}

HtmlPrettyPlugin.prototype.apply = function HtmlPrettyPluginApply(compiler) {
    compiler.plugin('compilation', (compilation) => {
        compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData, callback) => {
            const result = htmlPluginData;
            const content = result.html;
            result.html = content.replace(content, pretty(content, this.options));
            callback(null, result);
        });
    });
};

module.exports = HtmlPrettyPlugin;
