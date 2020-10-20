/* eslint-env node */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SvgSpriteLoaderPluginOriginal = require('svg-sprite-loader/plugin');

const APP = require('./app.config.js');

const NODE_PLACEHOLDER = '%__SVG_SPRITE_NODE__%';

module.exports = class SvgSpriteLoaderPlugin extends SvgSpriteLoaderPluginOriginal {
    apply(compiler) {
        super.apply(compiler);
        compiler.hooks.compilation.tap('SpriteLoaderPlugin', (compilation) => HtmlWebpackPlugin.getHooks(
            compilation,
        ).afterTemplateExecution.tapPromise('SpriteLoaderPlugin', async (htmlPluginData) => {
            const sprites = this.beforeHtmlGeneration(compilation);
            const inner = Object.keys(sprites).map((filename) => [
                `<!-- ${JSON.stringify(APP.PUBLIC_PATH + filename)} -->`,
                sprites[filename],
                `<!-- /${JSON.stringify(APP.PUBLIC_PATH + filename)} -->`,
            ].join('\n')).join('\n');
            htmlPluginData.html = htmlPluginData.html.replace(NODE_PLACEHOLDER, inner);
        }));
    }
};
