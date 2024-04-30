/**
 * @typedef { import('webpack').Compiler } Compiler
 */

/**
 * Remove assets from complidation.
 */
class RemoveAssetsPlugin {
    /**
     * @param {object} options - plugin options
     */
    constructor(options) {
        this.options = { ...options };
    }

    /**
     * @param {Compiler} compiler - webpack complier object
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
                }
            );
        });
    }
}

module.exports = RemoveAssetsPlugin;
