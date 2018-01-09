const fs = require('fs');
const deepAssign = require('deep-assign');
const weblog = require('webpack-log');

const logger = weblog({ name: 'manifest.json' });

const DEFAULT_OPTIONS = {
    path: './build/img/favicon/manifest.json',
    replace: {},
    indent: 4,
};

module.exports = class ManifestPlugin {
    constructor(options) {
        this.options = deepAssign({}, DEFAULT_OPTIONS, options);
    }

    apply(compiler) {
        compiler.plugin('done', () => {
            [fs, compiler.outputFileSystem].forEach((filesystem) => {
                if (filesystem.existsSync && filesystem.existsSync(this.options.path)) {
                    let src;
                    try {
                        src = JSON.parse(filesystem.readFileSync(this.options.path));
                    } catch (exception) {
                        logger.error(exception.message);
                        throw exception;
                    } finally {
                        const dist = deepAssign({}, src, this.options.replace);
                        filesystem.writeFileSync(this.options.path, JSON.stringify(dist, null, this.options.indent));
                        logger.info(`processing '${this.options.path}'`);
                    }
                }
            });
        });
    }
};
