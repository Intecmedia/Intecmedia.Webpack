const SvgoCreateConfig = (config) => ({
    js2svg: { pretty: !!config.pretty, eol: '\n', indent: 4 },
    plugins: [
        {
            name: 'preset-default',
            params: {
                overrides: {
                    // customize options for plugins included in preset
                    cleanupIds: config.prefix
                        ? {
                              prefix: config.prefix,
                              preserve: [], // ignore ids
                              preservePrefixes: [], // ignore prefix ids
                          }
                        : false,
                    convertColors: { shortname: false },
                    // or disable plugins
                    convertShapeToPath: false,
                    convertTransform: false,
                    removeViewBox: false,
                    removeUselessDefs: false,
                },
            },
        },
        // configure builtin plugin not included in preset
        { name: 'noDataURL', ...require('./svgo.no-data-url') },
    ],
});

module.exports.SvgoCreateConfig = SvgoCreateConfig;

const SvgoDefaultConfig = SvgoCreateConfig({ prefix: 'svgo-' });
const SvgoNoPrefixConfig = SvgoCreateConfig({ prefix: false });

module.exports.SvgoDefaultConfig = SvgoDefaultConfig;
module.exports.SvgoNoPrefixConfig = SvgoNoPrefixConfig;
