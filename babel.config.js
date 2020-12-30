/* eslint-env node */
/* eslint "compat/compat": "off" */

const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        ['@babel/transform-runtime', {}],
        ['@babel/plugin-proposal-optional-chaining', { loose: false }],
        ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-logical-assignment-operators', {}],
    ],
    presets: [
        ['@babel/preset-env', {
            corejs: false,
            modules: false,
            useBuiltIns: false,
            forceAllTransforms: ENV.PROD, // UglifyJS support only es5
            debug: ENV.DEBUG || !ENV.PROD,
            targets: { browsers: ENV.BROWSERS },
            ignoreBrowserslistConfig: true,
        }],
    ],
};
