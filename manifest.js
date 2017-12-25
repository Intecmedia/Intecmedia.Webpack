const fs = require('fs');
const deepAssign = require('deep-assign');

const DEFAULT_OPTIONS = {
    path: './build/img/favicon/manifest.json',
    replace: {},
};

module.exports = class ManifestPlugin {
    constructor(options) {
        this.options = deepAssign({}, DEFAULT_OPTIONS, options);
    }

    apply(compiler) {
        const { options } = this;
        compiler.plugin('done', () => {
            if (fs.existsSync(options.path)) {
                // eslint-disable-next-line import/no-dynamic-require,global-require
                const manifestOriginal = require(options.path);
                const manifestReplaced = deepAssign({}, manifestOriginal, options.replace);
                fs.writeFileAsync(options.path, JSON.stringify(manifestReplaced, null, 4));
            }
        });
    }
};
