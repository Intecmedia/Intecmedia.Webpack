class RemoveAssetsPlugin {
    constructor(options) {
        this.options = { ...options };
    }

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
