const ENV = require('./app.env');

module.exports = {
    sourceType: 'unambiguous',
    plugins: [
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
