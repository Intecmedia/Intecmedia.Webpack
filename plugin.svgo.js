const deepAssign = require('deep-assign');

const posthtml = require('posthtml');
const posthtmlRender = require('posthtml-render');

const SVGO = require('svgo');
const svgoConfig = require('./svgo.config.js');
const deasync = require('deasync');

const DEFAULT_OPTIONS = {
    svgo: svgoConfig,
    enabled: true,
};

module.exports = class SvgoPlugin {
    constructor(options) {
        this.options = deepAssign({}, DEFAULT_OPTIONS, options);
    }

    processHtml(html, callback) {
        const parser = posthtml();
        const svgoInstance = new SVGO(this.options.svgo);

        parser.use((tree) => {
            tree.match({ tag: 'svg' }, (node) => {
                if ('data-svgo-ignore' in node.attrs) return node;

                let minifiedSvg;
                const originalSvg = posthtmlRender(node);

                svgoInstance.optimize(originalSvg).then((result) => {
                    minifiedSvg = result;
                }).catch((error) => {
                    minifiedSvg = { data: originalSvg };
                    return callback(error);
                });
                deasync.loopWhile(() => minifiedSvg === undefined);

                node.attrs = {};
                node.content = minifiedSvg.data;
                node.tag = false;

                return node;
            });
            return tree;
        });

        parser.process(html).then((result) => {
            callback(null, result.html);
        }).catch(callback);
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
                if (this.options.enabled) {
                    htmlPluginData.html = this.processHtml(htmlPluginData.html, (error, html) => {
                        callback(error, Object.assign(htmlPluginData, { html }));
                    });
                }
                callback(null, htmlPluginData);
            });
        });
    }
};

