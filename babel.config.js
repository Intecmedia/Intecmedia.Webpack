const ENV = require('./app.env');

module.exports = {
    sourceType: 'unambiguous',
    plugins: [
        ['@babel/plugin-transform-optional-chaining', {}],
        ['@babel/plugin-transform-class-properties', {}],
        ['@babel/plugin-transform-logical-assignment-operators', {}],
        ['@babel/plugin-transform-nullish-coalescing-operator', {}],
        [
            'babel-plugin-polyfill-corejs3',
            {
                method: 'usage-global',
                version: require('./package.json').dependencies['core-js'],
            },
        ],
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                debug: ENV.DEBUG || !ENV.PROD || ENV.ARGV.verbose,
                targets: { browsers: ENV.BROWSERS },
                ignoreBrowserslistConfig: true,
            },
        ],
        ['@babel/preset-typescript', {}],
        ['@babel/preset-react', {}],
    ],
};
