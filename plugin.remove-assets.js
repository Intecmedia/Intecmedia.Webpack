/**
 * @typedef { import('webpack').Compiler } Compiler
 */

/**
 * Remove assets from compilation.
 */
class RemoveAssetsPlugin {
    /**
     * @param {object} options - plugin options
     */
    constructor(options) {
        this.options = { ...options };
    }

    /**
     * Apply the plugin to the compiler.
     * @param {Compiler} compiler - webpack compiler object
     */
    apply(compiler) {
        compiler.hooks.compilation.tap('RemoveAssetsPlugin', (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: 'RemoveAssetsPlugin',
                    stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
                },
                (assets) => {
                    const pattern = this.options.test;
                    Object.keys(assets)
                        .filter((name) => pattern.test(name))
                        .forEach((name) => {
                            compilation.deleteAsset(name);
                        });
                },
            );
        });
    }
}

module.exports = RemoveAssetsPlugin;
