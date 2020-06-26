/* eslint-env node */
/* eslint "compat/compat": "off" */

const uniqueId = require('lodash.uniqueid');

const ENV = require('./app.env.js');

const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: !ENV.PROD || ENV.DEBUG },
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
    ],
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;

const SvgoDefaultConfig = SvgoCreateConfig({ prefix: 'svgo-' });
const SvgoNoPrefixConfig = SvgoCreateConfig(false);

module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
module.exports.SvgoNoPrefixConfig = SvgoNoPrefixConfig;
