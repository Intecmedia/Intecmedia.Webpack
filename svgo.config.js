/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", "compat/compat": "off" -- webpack is node env */

const SVGO = require('svgo');
const uniqueId = require('lodash.uniqueid');

const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: (!!config.pretty) },
    plugins: SVGO.extendDefaultPlugins([
        {
            name: 'cleanupIDs',
            active: !!config.prefix,
            params: (config.prefix ? {

                prefix: {
                    toString() {
                        return uniqueId(config.prefix);
                    },
                },
                preserve: [], // ignore ids
                preservePrefixes: [], // ignore prefix ids
            } : {}),
        },
        { name: 'convertShapeToPath', active: false },
        { name: 'convertStyleToAttrs', active: false },
        { name: 'convertTransform', active: false },
        { name: 'removeDimensions', active: false },
        { name: 'removeViewBox', active: false },
        { name: 'removeUselessDefs', active: false },
        { name: 'noDataURL', ...require('./svgo.no-data-url.js') },
    ]),
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;

const SvgoDefaultConfig = SvgoCreateConfig({ prefix: 'svgo-' });
const SvgoNoPrefixConfig = SvgoCreateConfig(false);

module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
module.exports.SvgoNoPrefixConfig = SvgoNoPrefixConfig;
