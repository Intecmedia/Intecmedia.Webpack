const HtmlWebpackPluginOriginal = require('html-webpack-plugin');

const SCRIPT_TYPES = ['text/javascript', 'application/javascript'];

const scriptTypeRemove = (tag) => {
    if (tag.tagName === 'script' && tag.attributes) {
        if (tag.attributes.type && SCRIPT_TYPES.includes(tag.attributes.type.toLowerCase())) {
            delete tag.attributes.type;
        }
    }
    return tag;
};

class HtmlWebpackPlugin extends HtmlWebpackPluginOriginal {
    generateHtmlTags(assets) {
        const result = HtmlWebpackPluginOriginal.prototype.generateHtmlTags.apply(this, [assets]);
        result.head = result.head.map(scriptTypeRemove);
        result.body = result.body.map(scriptTypeRemove);
        return result;
    }
}

module.exports = HtmlWebpackPlugin;
