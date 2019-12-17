/* eslint-env node */

const SpriteLoaderPluginOriginal = require('svg-sprite-loader/plugin');

const NODE_PLACEHOLDER = '%__SVG_SPRITE_NODE__%';

module.exports = class SpriteLoaderPlugin extends SpriteLoaderPluginOriginal {
    apply(compiler) {
        super.apply(compiler);
        compiler.hooks.compilation.tap('SpriteLoaderPlugin', (compilation) => {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
                'SpriteLoaderPlugin',
                (htmlPluginData, callback) => {
                    const { sprites } = htmlPluginData.assets;
                    const html = htmlPluginData.html.replace(NODE_PLACEHOLDER, Object.values(sprites).join('\n'));
                    callback(null, Object.assign(htmlPluginData, { html }));
                },
            );
        });
    }
};
