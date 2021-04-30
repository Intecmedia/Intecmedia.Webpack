/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        ['@babel/plugin-proposal-optional-chaining', {}],
        ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', {}],
        ['@babel/plugin-proposal-logical-assignment-operators', {}],
    ],
    presets: [
        ['@babel/preset-env', {
            corejs: 3,
            modules: false,
            useBuiltIns: 'usage',
            forceAllTransforms: ENV.PROD, // UglifyJS support only es5
            debug: ENV.DEBUG || !ENV.PROD,
            targets: { browsers: ENV.BROWSERS },
            ignoreBrowserslistConfig: true,
        }],
        ['@babel/preset-typescript', {
        }],
    ],
};
