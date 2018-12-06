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
                remove: false,
                prefix: new SvgIdPrefix('svgo-'),
            },
        },
        { collapseGroups: false },
        { convertShapeToPath: false },
        { removeViewBox: false },
    ],
};
