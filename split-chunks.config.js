module.exports = {
    cacheGroups: {
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
