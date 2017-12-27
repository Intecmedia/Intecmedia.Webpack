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
        compiler.plugin('done', () => {
            if (fs.existsSync(this.options.path)) {
                // eslint-disable-next-line import/no-dynamic-require,global-require
                const manifestOriginal = require(this.options.path);
                const manifestReplaced = deepAssign({}, manifestOriginal, this.options.replace);
                fs.writeFileAsync(this.options.path, JSON.stringify(manifestReplaced, null, 4));
                console.log(`[manifest.json] processing '${this.options.path}'`);
            }
        });
    }
};
