/* eslint-env node */
/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off", "compat/compat": "off" */

const fs = require('fs');

const realcwd = fs.realpathSync(process.cwd());
if (process.cwd() !== realcwd) process.chdir(realcwd);

const path = require('path');
const slash = require('slash');
const webpack = require('webpack');
const weblog = require('webpack-log');

const logger = weblog({ name: 'webpack-config' });

const ENV = require('./app.env.js');
const APP = require('./app.config.js');
const UTILS = require('./webpack.utils.js');

ENV.SITEMAP = ENV.SITEMAP.map((i) => Object.assign(i, {
    path: path.posix.join(APP.PUBLIC_PATH, i.url, 'index.html'),
}));

if (ENV.PROD && ENV.STANDALONE) {
    require('./script.app-lint.js');
}

if (ENV.STANDALONE) {
    logger.info('Name:', ENV.PACKAGE_NAME);
    logger.info('Enviroment:', ENV.NODE_ENV);
    logger.info('Debug:', ENV.DEBUG ? 'enabled' : 'disabled');
    logger.info('Config:', APP);
}

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const ImageminPlugin = require('imagemin-webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const BrowserSyncPlugin = (ENV.WATCH ? require('browser-sync-webpack-plugin') : () => {});
const StyleLintPlugin = (ENV.USE_LINTERS ? require('stylelint-webpack-plugin') : () => {});
const CompressionPlugin = (ENV.PROD && !ENV.DEBUG ? require('compression-webpack-plugin') : () => {});
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = (ENV.PROD && !ENV.DEBUG ? require('uglifyjs-webpack-plugin') : () => {});
const SvgSpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const JsonpScriptSrcPlugin = require('./plugin.jsonp-script-src.js');

const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons.js') : () => {});
const HtmlBeautifyPlugin = (APP.HTML_PRETTY ? require('./plugin.html-beautify.js') : () => {});
const BabelConfig = require('./babel.config.js');

const BANNER_STRING = [
    `ENV.NODE_ENV=${ENV.NODE_ENV} | ENV.DEBUG=${ENV.DEBUG}`,
    fs.readFileSync(path.join(ENV.SOURCE_PATH, 'humans.txt')),
].join('\n');

module.exports = {
    mode: ENV.PROD ? 'production' : 'development',

    ...(ENV.DEBUG ? { stats: 'detailed' } : {}),

    watchOptions: {
        ignored: /node_modules/,
    },

    devServer: {
        compress: false,
        contentBase: path.resolve(__dirname, 'source'),
        hot: true,
        overlay: { warnings: false, errors: true },
        publicPath: path.posix.resolve(APP.PUBLIC_PATH, '/'),
        watchContentBase: true,
    },

    entry: {
        app: [
            `${ENV.SOURCE_PATH}/js/polyfills.js`, // this always first
            ...(APP.SENTRY.dsn ? [`${ENV.SOURCE_PATH}/js/sentry.js`] : []),
            `${ENV.SOURCE_PATH}/css/app.scss`,
            `${ENV.SOURCE_PATH}/js/app.js`,
        ],
    },

    output: {
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[name].min.js',
        path: ENV.OUTPUT_PATH,
        publicPath: APP.PUBLIC_PATH,
        hashFunction: 'md5',
    },

    optimization: {
        ...(!ENV.PROD || ENV.DEBUG ? {
            namedChunks: true,
            namedModules: true,
            chunkIds: 'named',
            moduleIds: 'named',
        } : {}),
        splitChunks: {
            maxAsyncRequests: Infinity,
            maxInitialRequests: Infinity,
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    enforce: true,
                    test: /(node_modules)(.+)\.(js|mjs|cjs)(\?.*)?$/,
                    name: 'vendor',
                },
            },
        },
        minimizer: (ENV.PROD && !ENV.DEBUG ? [
            new UglifyJsPlugin({
                cache: !ENV.DEBUG,
                test: /\.(js)(\?.*)?$/i,
                parallel: true,
                sourceMap: ENV.USE_SOURCE_MAP,
                extractComments: {
                    condition: 'some',
                    filename: (file) => `${file}.LICENSE`,
                    banner: (file) => [`License information can be found in ${file}`, BANNER_STRING].join('\n'),
                },
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ] : []),
    },

    performance: (ENV.PROD && !ENV.DEBUG ? {
        assetFilter: (asset) => {
            const [filename] = asset.split('?', 2);
            const assetFilter = /\.(css|js)(\?.*)?$/;
            return assetFilter.test(filename);
        },
        hints: 'warning',
        maxAssetSize: Number.MAX_SAFE_INTEGER,
        maxEntrypointSize: 512 * 1024,
    } : false),

    plugins: [
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 14 * 1024,
        }),
        ...(ENV.WATCH ? [
            new BrowserSyncPlugin({
                ...APP.BROWSERSYNC,
            }),
        ] : []),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep', '!.htaccess'],
            cleanAfterEveryBuildPatterns: ['**/*.br', '**/*.gz'],
        }),
        new MiniCssExtractPlugin({
            filename: 'css/app.min.css',
            allChunks: true,
        }),
        ...(ENV.PROD && !ENV.DEBUG ? [new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {
                    minifyFontValues: { removeQuotes: false },
                    discardComments: { removeAll: true },
                }],
            },
            canPrint: true,
        })] : []),
        new CopyWebpackPlugin({
            patterns: [
                '**/.htaccess',
                'img/**/*.*',
                '*.txt',
                '*.php',
            ].map((from) => ({
                from,
                to: ENV.OUTPUT_PATH,
                context: ENV.SOURCE_PATH,
                globOptions: { ignore: ENV.SITEMAP.map((i) => i.template) },
                noErrorOnMissing: true,
                force: true,
            })),
        }),
        new JsonpScriptSrcPlugin(),
        ...(ENV.PROD && !ENV.DEBUG ? [
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new CompressionPlugin({
                test: /\.(js|css|json|lottie)(\?.*)?$/i,
                filename: '[path].br[query]',
                compressionOptions: {
                    level: 11,
                },
                algorithm: 'brotliCompress',
                cache: ENV.DEBUG ? false : UTILS.cacheDir('compression-webpack-plugin-br'),
            }),
            new CompressionPlugin({
                test: /\.(js|css|json|lottie)(\?.*)?$/i,
                filename: '[path].gz[query]',
                compressionOptions: {
                    numiterations: 15,
                },
                algorithm(input, compressionOptions, callback) {
                    const zopfli = require('@gfx/zopfli');
                    return zopfli.gzip(input, compressionOptions, callback);
                },
                cache: ENV.DEBUG ? false : UTILS.cacheDir('compression-webpack-plugin-gz'),
            }),
        ] : []),
        new webpack.BannerPlugin({
            banner: BANNER_STRING,
            include: /\.(css|js)(\?.*)?$/i,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.DefinePlugin({
            DEBUG: JSON.stringify(ENV.DEBUG),
            NODE_ENV: JSON.stringify(ENV.NODE_ENV),
            VERBOSE: JSON.stringify(ENV.VERBOSE),
            PACKAGE_NAME: JSON.stringify(ENV.PACKAGE_NAME),
            ...Object.assign({}, ...Object.entries(APP).map(([k, v]) => ({
                [`APP.${k}`]: JSON.stringify(v),
            }))),
        }),
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            contentImage: path.resolve('./.favicons-source-1024x1024.png'),
            title: APP.TITLE,
        }),
        ...(ENV.USE_LINTERS ? [
            new StyleLintPlugin({
                syntax: 'scss',
                files: '**/*.scss',
                configFile: './.stylelintrc.json',
                ignorePath: './.stylelintignore',
                emitErrors: false,
                failOnError: false,
                lintDirtyModulesOnly: ENV.DEV_SERVER || ENV.WATCH,
                fix: !ENV.DEV_SERVER,
            }),
        ] : []),
        ...(ENV.SITEMAP.map(({ template, filename }) => new HtmlWebpackPlugin({
            filename,
            template,
            inject: !path.basename(template).startsWith('_'),
            minify: (ENV.PROD || ENV.DEBUG ? ({
                html5: true,
                collapseBooleanAttributes: true,
                collapseWhitespace: !APP.HTML_PRETTY,
                removeComments: !APP.HTML_PRETTY,
                decodeEntities: !APP.HTML_PRETTY,
                minifyCSS: !APP.HTML_PRETTY,
                minifyJS: !APP.HTML_PRETTY,
            }) : false),
            hash: ENV.PROD || ENV.DEBUG,
            cache: !ENV.DEBUG,
            title: APP.TITLE,
        }))),
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                logo: path.join(__dirname, '.favicons-source-1024x1024.png'),
                publicPath: APP.PUBLIC_PATH,
                outputPath: 'img/favicons',
                prefix: 'img/favicons',
                cache: ENV.DEBUG ? false : UTILS.cacheDir('favicons-webpack-plugin-1024'),
            }),
            new FaviconsPlugin.FavIcon({
                logo: path.join(__dirname, '.favicons-source-64x64.png'),
                publicPath: APP.PUBLIC_PATH,
                outputPath: 'img/favicons',
                prefix: 'img/favicons',
                cache: ENV.DEBUG ? false : UTILS.cacheDir('favicons-webpack-plugin-64'),
            }),
        ] : []),
        ...(APP.HTML_PRETTY ? [new HtmlBeautifyPlugin({
            config: {
                indent_char: ' ',
                indent_size: 4,
                html: {
                    unformatted: ['code', 'pre', 'textarea'],
                    wrap_line_length: Number.MAX_SAFE_INTEGER,
                    max_preserve_newlines: 1,
                },
            },
        })] : []),
        new SvgSpriteLoaderPlugin({
            plainSprite: true,
        }),
        ...(ENV.PROD || ENV.DEBUG ? [
            new ImageminPlugin({
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                exclude: /(fonts|font|svg-sprite)/i,
                name: UTILS.resourceName('img'),
                imageminOptions: require('./imagemin.config.js'),
                cache: !ENV.DEBUG,
                loader: true,
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: (ENV.DEV_SERVER ? 'server' : 'static'),
                openAnalyzer: ENV.DEV_SERVER,
                reportFilename: path.join(UTILS.cacheDir('bundle-analyzer'), 'bundle-analyzer.html'),
            }),
        ] : []),
        ...(ENV.USE_SOURCE_MAP ? [
            new webpack.SourceMapDevToolPlugin({
                test: /\.(js|mjs|cjs|ts|css|scss)(\?.*)?$/i,
            }),
        ] : []),
    ],

    ...(!ENV.USE_SOURCE_MAP ? {
        devtool: 'nosources-source-map',
    } : {}),

    resolve: require('./resolve.config.js').resolve,

    module: {
        rules: [
            // html loaders
            {
                test: /\.(html)(\?.*)?$/i,
                loader: './loader.html.js',
                options: {
                    context: APP,
                    searchPath: ENV.SOURCE_PATH,
                },
            },
            // javascript loaders
            {
                test: require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                    exposes: ['$', 'jQuery'],
                },
            },
            ...(ENV.USE_LINTERS ? [{
                enforce: 'pre',
                test: /\.(js|mjs|cjs)(\?.*)?$/i,
                exclude: [
                    path.join(__dirname, 'node_modules'),
                    path.join(ENV.SOURCE_PATH, 'js', 'external'),
                ],
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    quiet: ENV.PROD,
                    emitError: false,
                    emitWarning: false,
                },
            }] : []),
            {
                type: 'javascript/auto',
                test: /\.(js|mjs|cjs)(\?.*)?$/i,
                exclude: {
                    test: [
                        // disable babel transform
                        ...BabelConfig.excludeTransform,
                    ],
                    exclude: [
                        // enable babel transform
                        ...BabelConfig.includeTransform,
                    ],
                },
                loaders: [
                    {
                        // global jQuery import
                        loader: 'imports-loader',
                        options: {
                            imports: [
                                'default jquery $',
                                'default jquery jQuery',
                            ],
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: false,
                            envName: ENV.NODE_ENV,
                            cacheCompression: false,
                            cacheDirectory: ENV.DEBUG ? false : UTILS.cacheDir('babel-loader'),
                            ...BabelConfig.options,
                        },
                    },
                ],
            },
            // image loaders
            {
                test: /\.(svg)(\?.*)?$/i,
                issuer: /\.(html)(\?.*)?$/i,
                include: /(partials)/i,
                exclude: /(fonts|font|svg-sprite)/i,
                loader: './loader.svgo.js',
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                exclude: /(fonts|font|partials|svg-sprite)/i,
                oneOf: [
                    {
                        exclude: /\.(svg)$/i,
                        resourceQuery: /[&?]resize=.+/,
                        loader: './loader.resize.js',
                        options: {
                            cacheDirectory: ENV.DEBUG ? false : UTILS.cacheDir('loader-resize'),
                            name: UTILS.resourceName('img'),
                            limit: 32 * 1024,
                            esModule: false,
                            hashType: 'md5',
                        },
                    },
                    {
                        resourceQuery: /[&?]inline=inline/,
                        loader: 'url-loader',
                        options: {
                            name: UTILS.resourceName('img'), limit: 32 * 1024, esModule: false, hashType: 'md5',
                        },
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: UTILS.resourceName('img'), esModule: false, hashType: 'md5',
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                include: /(svg-sprite)/i,
                exclude: /(fonts|font|partials)/i,
                loader: 'svg-sprite-loader',
                options: {
                    extract: true,
                    spriteFilename: 'img/svg-sprite.svg',
                    symbolId: (filePath) => {
                        const spriteDir = path.join(ENV.SOURCE_PATH, 'img/svg-sprite');
                        const relativePath = slash(path.relative(spriteDir, path.normalize(filePath)));
                        const symbolId = path.basename(relativePath, '.svg').replace(path.posix.sep, '-');
                        return symbolId;
                    },
                },
            },
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?.*)?$/i,
                exclude: /(img|images|partials|svg-sprite)/i,
                loader: 'file-loader',
                options: { name: UTILS.resourceName('fonts'), esModule: false, hashType: 'md5' },
            },
            // css loaders
            {
                test: /\.(css|scss)(\?.*)?$/i,
                loaders: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: ENV.DEV_SERVER,
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            importLoaders: 2,
                            sourceMap: ENV.USE_SOURCE_MAP,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: ENV.USE_SOURCE_MAP,
                            postcssOptions: { config: './postcss.config.js' },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: UTILS.toScssVars({
                                DEBUG: ENV.DEBUG,
                                NODE_ENV: ENV.NODE_ENV,
                                PACKAGE_NAME: ENV.PACKAGE_NAME,
                                ...Object.assign({}, ...Object.entries(APP).map(([k, v]) => ({
                                    [`APP-${k}`]: v,
                                }))),
                            }),
                            sourceMap: ENV.USE_SOURCE_MAP,
                            implementation: require('sass'),
                            sassOptions: {
                                indentWidth: 4,
                                outputStyle: 'expanded',
                                fiber: require('fibers'),
                            },
                        },
                    },
                ],
            },
        ],
    },
};
