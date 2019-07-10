const uniqueId = require('lodash.uniqueid');

class SvgIdPrefix {
    constructor(prefix) {
        this.prefix = prefix;
    }

    toString() {
        return uniqueId(this.prefix);
    }
}

module.exports = {
    plugins: [
        {
            cleanupIDs: {
                prefix: new SvgIdPrefix('svgo-'),
                preserve: [], // ignore ids
                preservePrefixes: [], // ignore prefix ids
            },
        },
        { collapseGroups: false },
        { convertShapeToPath: false },
        { removeViewBox: false },
    ],
};
