/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", "compat/compat": "off" -- webpack is node env */

const uniqueId = require('lodash.uniqueid');

const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: (!!config.pretty), eol: '\n' },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // customize options for plugins included in preset
                    cleanupIDs: (config.prefix ? {
                        prefix: {
                            toString() {
                                return uniqueId(config.prefix);
                            },
                        },
                        preserve: [], // ignore ids
                        preservePrefixes: [], // ignore prefix ids
                    } : false),
                    // or disable plugins
                    convertShapeToPath: false,
                    convertStyleToAttrs: false,
                    convertTransform: false,
                    removeDimensions: false,
                    removeViewBox: false,
                    removeUselessDefs: false,
                },
            },
        },
        // configure builtin plugin not included in preset
        { name: 'noDataURL', ...require('./svgo.no-data-url') },
    ],
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;

const SvgoDefaultConfig = SvgoCreateConfig({ prefix: 'svgo-' });
const SvgoNoPrefixConfig = SvgoCreateConfig(false);

module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
module.exports.SvgoNoPrefixConfig = SvgoNoPrefixConfig;
