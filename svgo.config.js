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
    plugins: [
        {
            cleanupIDs: {
                prefix,
                preserve: [], // ignore ids
                preservePrefixes: [], // ignore prefix ids
            },
        },
        { collapseGroups: false },
        { convertShapeToPath: false },
        { removeViewBox: false },
    ],
});

module.exports = SvgoPrefixConfig(new SvgoIdPrefix('svgo-'));

module.exports.SvgoIdPrefix = SvgoIdPrefix;

module.exports.SvgoPrefixConfig = SvgoPrefixConfig;
