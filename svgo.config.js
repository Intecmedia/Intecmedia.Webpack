const uniqueId = require('lodash.uniqueid');

class SvgIdPrefix {
    toString() {
        return uniqueId('svgo-');
    }
}

module.exports = {
    plugins: [
        {
            cleanupIDs: {
                remove: false,
                prefix: new SvgIdPrefix(0),
            },
        },
        { collapseGroups: false },
        { convertShapeToPath: false },
        { removeViewBox: false },
    ],
};
