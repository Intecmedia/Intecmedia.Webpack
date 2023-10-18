const ENV = require('./app.env');

module.exports = {
    sourceType: 'unambiguous',
    plugins: [
        ['@babel/plugin-transform-optional-chaining', {}],
        ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-transform-class-properties', {}],
        ['@babel/plugin-transform-logical-assignment-operators', {}],
        ['@babel/plugin-syntax-top-level-await', {}],
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: 3,
                modules: false,
                useBuiltIns: 'usage',
                forceAllTransforms: ENV.PROD, // UglifyJS support only es5
                debug: ENV.DEBUG || !ENV.PROD || ENV.ARGV.verbose,
                targets: { browsers: ENV.BROWSERS },
                ignoreBrowserslistConfig: true,
                shippedProposals: true,
            },
        ],
        ['@babel/preset-typescript', {}],
    ],
};
