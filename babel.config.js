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
        ['@babel/plugin-proposal-optional-chaining-assign', { version: '2023-07' }],
        ['@babel/plugin-transform-nullish-coalescing-operator', {}],
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: { version: '3', proposals: true },
                modules: false,
                useBuiltIns: 'usage',
                debug: ENV.DEBUG || !ENV.PROD || ENV.ARGV.verbose,
                targets: { browsers: ENV.BROWSERS },
                ignoreBrowserslistConfig: true,
                shippedProposals: true,
            },
        ],
        ['@babel/preset-typescript', {}],
    ],
};
