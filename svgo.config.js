const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: !!config.pretty, eol: '\n', indent: 4 },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // customize options for plugins included in preset
                    convertColors: { shortname: false },
                    // or disable plugins
                    cleanupIds: false,
                    convertShapeToPath: false,
                    convertTransform: false,
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
        { name: 'removeRasterImages' },
        // configure builtin plugin not included in preset
        { name: 'noDataURL', ...require('./svgo.no-data-url') },
        { name: 'noSpriteURL', ...require('./svgo.no-sprite-url') },
    ],
    multipass: true,
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;
