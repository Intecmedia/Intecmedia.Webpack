/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const path = require('path');
const ENV = require('./app.env');

const corejsDir = path.dirname(require.resolve('core-js'));
const polyfillsDir = path.normalize(`${ENV.SOURCE_PATH}/js/polyfills`);

module.exports = {
    cacheGroups: {
        polyfills: {
            chunks: 'initial',
            enforce: true,
            test: ({ resource, resourceResolveData }) => {
                if ((
                    resourceResolveData
                    && resourceResolveData.context
                    && resourceResolveData.context.issuer
                    && resourceResolveData.context.issuer.indexOf(polyfillsDir) === 0
                ) || (
                    resource
                    && resource.indexOf(corejsDir) === 0
                )) {
                    return true;
                }
                return false;
            },
            name: 'vendor.polyfills',
            priority: 10,
        },
        sentry: {
            chunks: 'all',
            enforce: true,
            test: /[\\/]node_modules[\\/]@sentry[\\/](.+)\.(js|mjs|cjs|ts)(\?.*)?$/,
            name: 'vendor.sentry',
            priority: 10,
        },
        /*
        three: {
            chunks: 'all',
            enforce: true,
            test: /[\\/]node_modules[\\/]three[\\/](.+)\.(js|mjs|cjs|ts)(\?.*)?$/,
            name: 'vendor.three',
            priority: 10,
        },
        */
    },
};
