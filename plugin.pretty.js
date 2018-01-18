const fs = require('fs');
const pretty = require('pretty');
const deepAssign = require('deep-assign');
const validateOptions = require('schema-utils');
const weblog = require('webpack-log');

const logger = weblog({ name: 'plugin-pretty' });

const { 'tag-self-close': tagSelfClose } = JSON.parse(fs.readFileSync('./.htmllintrc', 'utf8'));

const DEFAULT_OPTIONS = {
    ocd: false,
    unformatted: ['code', 'pre', 'em', 'strong', 'span'].concat(tagSelfClose),
    indent_inner_html: false,
    indent_char: ' ',
    indent_size: 4,
    wrap_line_length: Number.MAX_SAFE_INTEGER,
    preserve_newlines: true,
    max_preserve_newlines: 1,
    sep: '\n',
};

const OPTIONS_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    properties: {
        ocd: { type: 'boolean' },
        unformatted: { type: 'array' },
        indent_inner_html: { type: 'boolean' },
        indent_char: { type: 'string' },
        indent_size: { type: 'integer' },
        wrap_line_length: { type: 'integer' },
        preserve_newlines: { type: 'boolean' },
        max_preserve_newlines: { type: 'integer' },
        sep: { type: 'string' },
    },
};

module.exports = class PrettyPlugin {
    constructor(options) {
        this.options = deepAssign({}, DEFAULT_OPTIONS, options);
        validateOptions(OPTIONS_SCHEMA, this.options, 'manifest.json');
    }

    apply(compiler) {
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData, callback) => {
                logger.info(`processing '${htmlPluginData.plugin.options.filename}'`);
                const html = pretty(htmlPluginData.html, this.options);
                callback(null, Object.assign(htmlPluginData, { html }));
            });
        });
    }
};
