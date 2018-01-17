const pretty = require('pretty');
const deepAssign = require('deep-assign');
const weblog = require('webpack-log');

const logger = weblog({ name: 'plugin-pretty' });

const DEFAULT_OPTIONS = {
    ocd: false,
    indent_inner_html: false,
    indent_char: ' ',
    indent_size: 4,
    sep: '\n',
};

module.exports = class PrettyPlugin {
    constructor(options) {
        this.options = deepAssign({}, DEFAULT_OPTIONS, options);
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData, callback) => {
                logger.info(`processing '${htmlPluginData.plugin.options.filename}'`);
                const html = pretty(htmlPluginData.html, this.options);
                callback(null, Object.assign(htmlPluginData, {html}));
            });
        });
    }
};
