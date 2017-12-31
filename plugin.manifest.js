const fs = require('fs');
const deepAssign = require('deep-assign');
const weblog = require('webpack-log');

const logger = weblog({ name: 'manifest.json' });

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
                let manifestOriginal;
                try {
                    // eslint-disable-next-line import/no-dynamic-require,global-require
                    manifestOriginal = require(this.options.path);
                } catch (exception) {
                    logger.error(exception.message);
                } finally {
                    const manifestReplaced = deepAssign({}, manifestOriginal, this.options.replace);
                    fs.writeFileAsync(this.options.path, JSON.stringify(manifestReplaced, null, 4));
                    logger.info(`processing '${this.options.path}'`);
                }
            }
        });
    }
};
