/* eslint global-require: "off" */
const fs = require('fs');

const DEFAULT_OPTIONS = {
    path: './build/img/favicon/manifest.json',
    replace: {},
};

function ManifestPlugin(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
}

ManifestPlugin.prototype.apply = function ManifestPluginApply(compiler) {
    const options = this.options;
    compiler.plugin('done', () => {
        /* eslint import/no-dynamic-require: "off" */
        if (fs.existsSync(options.path)) {
            const manifestOriginal = require(options.path);
            const manifestReplaced = Object.assign({}, manifestOriginal, options.replace);
            fs.writeFileAsync(options.path, JSON.stringify(manifestReplaced, null, 4));
        }
    });
};

module.exports = ManifestPlugin;
