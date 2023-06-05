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
                    convertShapeToPath: false,
                    convertTransform: false,
                    removeViewBox: false,
                    removeUselessDefs: false,
                    sortAttrs: false,
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
    ],
    floatPrecision: 6,
    transformPrecision: 6,
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;

const SvgoDefaultConfig = SvgoCreateConfig({ prefix: 'svgo' });
const SvgoNoPrefixConfig = SvgoCreateConfig({ prefix: false });

module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
module.exports.SvgoNoPrefixConfig = SvgoNoPrefixConfig;
