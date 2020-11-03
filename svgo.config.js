/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

const uniqueId = require('lodash.uniqueid');

const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: (!!config.pretty) },
    plugins: [
        {
            cleanupIDs: (config.prefix ? {
                prefix: {
                    toString() {
                        return uniqueId(config.prefix);
                    },
                },
                preserve: [], // ignore ids
                preservePrefixes: [], // ignore prefix ids
            } : false),
        },
        { convertShapeToPath: false },
        { convertStyleToAttrs: false },
        { convertTransform: false },
        { removeDimensions: false },
        { removeViewBox: false },
        { removeUselessDefs: false },
        { noDataURL: require('./svgo.no-data-url.js') },
    ],
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;

const SvgoDefaultConfig = SvgoCreateConfig({ prefix: 'svgo-' });
const SvgoNoPrefixConfig = SvgoCreateConfig(false);

module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
module.exports.SvgoNoPrefixConfig = SvgoNoPrefixConfig;
