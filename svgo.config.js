/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", "compat/compat": "off" -- webpack is node env */

const uniqueId = require('lodash.uniqueid');

const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: (!!config.pretty) },
    plugins: [
        {
            name: 'cleanupIDs',
            ...(config.prefix ? {
                active: true,
                prefix: {
                    toString() {
                        return uniqueId(config.prefix);
                    },
                },
                preserve: [], // ignore ids
                preservePrefixes: [], // ignore prefix ids
            } : {
                active: false,
            }),
        },
        { name: 'convertShapeToPath', active: false },
        { name: 'convertStyleToAttrs', active: false },
        { name: 'convertTransform', active: false },
        { name: 'removeDimensions', active: false },
        { name: 'removeViewBox', active: false },
        { name: 'removeUselessDefs', active: false },
        { name: 'noDataURL', ...require('./svgo.no-data-url.js') },
    ],
    multipass: true,
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;

const SvgoDefaultConfig = SvgoCreateConfig({ prefix: 'svgo-' });
const SvgoNoPrefixConfig = SvgoCreateConfig(false);

module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
module.exports.SvgoNoPrefixConfig = SvgoNoPrefixConfig;
