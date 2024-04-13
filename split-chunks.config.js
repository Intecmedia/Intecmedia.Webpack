module.exports = {
    cacheGroups: {
        polyfills: {
            chunks: 'all',
            enforce: true,
            test: /[\\/]node_modules[\\/](core-js|whatwg-fetch|focus-visible|focus-within|intersection-observer|resize-observer-polyfill)[\\/](.+)\.(js|mjs|cjs|ts)(\?.*)?$/,
            name: 'vendor.polyfills',
            priority: -10,
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
