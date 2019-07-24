const uniqueId = require('lodash.uniqueid');

class SvgoIdPrefix {
    constructor(prefix) {
        this.prefix = prefix;
    }

    toString() {
        return uniqueId(this.prefix);
    }
}

const SvgoPrefixConfig = prefix => ({
    js2svg: { pretty: true },
    plugins: [
        {
            cleanupIDs: {
                prefix,
                preserve: [], // ignore ids
                preservePrefixes: [], // ignore prefix ids
            },
        },
        { convertShapeToPath: false },
        { removeViewBox: false },
    ],
});

const SvgoDefaultConfig = SvgoPrefixConfig('svgo-');

module.exports.SvgoIdPrefix = SvgoIdPrefix;
module.exports.SvgoPrefixConfig = SvgoPrefixConfig;
module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
