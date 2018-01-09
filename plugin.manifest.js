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
            const existsSync = compiler.outputFileSystem.existsSync || fs.existsSync;
            if (existsSync(this.options.path)) {
                let manifestOriginal;
                try {
                    const readFileSync = compiler.outputFileSystem.readFileSync || fs.readFileSync;
                    manifestOriginal = JSON.parse(readFileSync(this.options.path));
                } catch (exception) {
                    logger.error(exception.message);
                    throw exception;
                } finally {
                    const manifestReplaced = deepAssign({}, manifestOriginal, this.options.replace);
                    const writeFileSync = compiler.outputFileSystem.writeFileSync || fs.writeFileSync;
                    writeFileSync(this.options.path, JSON.stringify(manifestReplaced, null, 4));
                    logger.info(`processing '${this.options.path}'`);
                }
            }
        });
    }
};
