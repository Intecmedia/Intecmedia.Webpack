const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: !!config.pretty, eol: '\n', indent: 4 },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // customize options for plugins included in preset
                    convertColors: { shortname: false },
                    removeRasterImages: true,
                    // or disable plugins
                    cleanupIds: false,
                    convertShapeToPath: false,
                    convertTransform: false,
                    removeViewBox: false,
                    removeUselessDefs: false,
                    removeHiddenElems: false,
                    mergePaths: false,
                    mergeStyles: false,
                },
            },
        },
        {
            name: 'prefixIds',
            params: {
                delim: '-',
                prefix: config.prefix ? config.prefix : false,
                prefixIds: !!config.prefix,
                prefixClassNames: false,
            },
        },
        // configure builtin plugin not included in preset
        { name: 'noDataURL', ...require('./svgo.no-data-url') },
        { name: 'noSpriteURL', ...require('./svgo.no-sprite-url') },
    ],
    floatPrecision: 6,
    transformPrecision: 6,
    multipass: true,
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;
