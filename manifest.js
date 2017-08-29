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
    compiler.plugin('done', () => {
        /* eslint import/no-dynamic-require: "off" */
        if (fs.existsSync(this.options.path)) {
            let manifest = require(filename);
            manifest = Object.assign({}, manifest, this.options.replace);
            fs.writeFileSync(this.options.path, JSON.stringify(manifest, null, 4));
        }
    });
};

module.exports = ManifestPlugin;
