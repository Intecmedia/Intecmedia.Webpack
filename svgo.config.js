const uniqueId = require('lodash.uniqueid');

const SvgoPrefixConfig = prefix => ({
    js2svg: { pretty: true },
    plugins: [
        {
            cleanupIDs: {
                prefix: {
                    toString() {
                        return uniqueId(prefix);
                    },
                },
                preserve: [], // ignore ids
                preservePrefixes: [], // ignore prefix ids
            },
        },
        { convertShapeToPath: false },
        { removeViewBox: false },
    ],
});

const SvgoDefaultConfig = SvgoPrefixConfig('svgo-');

module.exports.SvgoPrefixConfig = SvgoPrefixConfig;
module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
