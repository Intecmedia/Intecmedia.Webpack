/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off" */
const fs = require('fs');

const realcwd = fs.realpathSync(process.cwd());
if (process.cwd() !== realcwd) process.chdir(realcwd);

const glob = require('glob');
const path = require('path');
const slash = require('slash');
const webpack = require('webpack');
const md5File = require('md5-file');
const weblog = require('webpack-log');
const zopfli = require('@gfx/zopfli');

const logger = weblog({ name: 'webpack-config' });

const ENV = require('./app.env.js');
const APP = require('./app.config.js');
const HTML_DATA = require('./source/html.data.js');

if (ENV.STANDALONE) {
    logger.info(`Name: ${ENV.PACKAGE_NAME}`);
    logger.info(`Enviroment: ${ENV.NODE_ENV}`);
    logger.info(`Debug: ${ENV.DEBUG ? 'enabled' : 'disabled'}`);
    logger.info(`Linters: ${ENV.USE_LINTERS ? 'enabled' : 'disabled'}`);
    logger.info(`Source maps: ${ENV.USE_SOURCE_MAP ? 'enabled' : 'disabled'}`);
    logger.info(`App config: ${JSON.stringify(APP, null, '    ')}`);
}

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const WorkboxPlugin = (APP.USE_SERVICE_WORKER ? require('workbox-webpack-plugin') : () => {});
const ImageminPlugin = require('imagemin-webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const BrowserSyncPlugin = (ENV.WATCH ? require('browser-sync-webpack-plugin') : () => {});
const StyleLintPlugin = (ENV.USE_LINTERS ? require('stylelint-webpack-plugin') : () => {});
const BrotliPlugin = (ENV.PROD ? require('brotli-webpack-plugin') : () => {});
const CompressionPlugin = (ENV.PROD ? require('compression-webpack-plugin') : () => {});
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = (ENV.PROD ? require('uglifyjs-webpack-plugin') : () => {});

const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons.js') : () => {});
const PrettyPlugin = (APP.HTML_PRETTY ? require('./plugin.pretty.js') : () => {});
const SvgoPlugin = require('./plugin.svgo.js');
const BabelConfig = require('./babel.config.js');

const SERVICE_WORKER_BASE = slash(path.relative(APP.PUBLIC_PATH, '/'));
const SERVICE_WORKER_PATH = path.join(ENV.OUTPUT_PATH, SERVICE_WORKER_BASE, '/service-worker.js');
const SERVICE_WORKER_HASH = () => (fs.existsSync(SERVICE_WORKER_PATH) ? md5File.sync(SERVICE_WORKER_PATH) : '');

const SITEMAP = glob.sync(`${slash(ENV.SOURCE_PATH)}/**/*.html`, {
    ignore: [
        `${slash(ENV.SOURCE_PATH)}/partials/**/*.html`,
    ],
});

const resourceName = (prefix, hash = false) => {
    const basename = path.basename(prefix);
    const suffix = (hash ? '?[contenthash]' : '');
    return (resourcePath) => {
        const url = slash(path.relative(ENV.SOURCE_PATH, resourcePath)).replace(/^(\.\.\/)+/g, '');
        if (url.startsWith('partials/')) {
            return slash(url + suffix);
        }
        if (url.startsWith(`${basename}/`)) {
            return url + suffix;
        }
        if (url.startsWith('node_modules/')) {
            return slash(path.join(basename, url + suffix));
        }
        return slash(path.join(basename, `[name].[ext]${suffix}`));
    };
};

module.exports = {

    watchOptions: {
        ignored: /node_modules/,
    },

    devServer: {
        before(app) {
            app.get('/service-worker.js', (request, response) => response.sendFile(SERVICE_WORKER_PATH));
        },
        compress: false,
        contentBase: path.resolve(__dirname, 'source'),
        open: true,
        overlay: { warnings: false, errors: true },
        watchContentBase: true,
    },

    entry: {
        app: `${ENV.SOURCE_PATH}/js/app.js`,
    },

    output: {
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[name].min.js',
        path: ENV.OUTPUT_PATH,
        publicPath: APP.PUBLIC_PATH,
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true,
                },
            },
        },
        minimizer: (ENV.PROD ? [
            new UglifyJsPlugin({
                cache: !ENV.DEBUG,
                test: /\.(js)(\?.*)?$/i,
                parallel: true,
                sourceMap: true,
                extractComments: true,
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
            const ignore = /(\.(css|js)\.map|\.LICENSE|\.eot|\.ttf|manifest\.json|service-worker\.js|@resize-.+|favicon|workbox)$/;
            return !(ignore.test(filename));
        },
        hints: 'warning',
        maxAssetSize: 3 * 1024 * 1024,
        maxEntrypointSize: 512 * 1024,
    } : false),

    plugins: [
        ...(ENV.WATCH ? [new BrowserSyncPlugin()] : []),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep', '!.htaccess'],
            cleanAfterEveryBuildPatterns: ['**/*.br', '**/*.gz'],
        }),
        new MiniCssExtractPlugin({
            filename: 'css/app.min.css',
            allChunks: true,
        }),
        ...(ENV.PROD ? [
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new BrotliPlugin({
                asset: '[path].br[query]',
                test: /\.(js|css)$/,
            }),
            new CompressionPlugin({
                test: /\.(css|js)(\?.*)?$/i,
                filename: '[path].gz[query]',
                compressionOptions: {
                    numiterations: 15,
                },
                algorithm(input, compressionOptions, callback) {
                    return zopfli.gzip(input, compressionOptions, callback);
                },
            }),
        ] : []),
        new webpack.BannerPlugin({
            banner: `ENV.NODE_ENV=${ENV.NODE_ENV} | ENV.DEBUG=${ENV.DEBUG} | chunkhash=[chunkhash]`,
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
            SENTRY_DSN: JSON.stringify(APP.SENTRY_DSN),
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
                configFile: './.stylelintrc',
                ignorePath: './.stylelintignore',
                emitErrors: false,
                failOnError: false,
                lintDirtyModulesOnly: ENV.DEV_SERVER || ENV.WATCH,
                fix: !ENV.DEV_SERVER,
            }),
        ] : []),
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                logo: path.join(__dirname, '.favicons-source-1024x1024.png'),
                prefix: 'img/favicon/',
            }),
            new FaviconsPlugin.FavIcon({
                logo: path.join(__dirname, '.favicons-source-64x64.png'),
                prefix: 'img/favicon/',
            }),
        ] : []),
        ...(SITEMAP.map((template) => {
            const basename = path.basename(template);
            const filename = (basename === 'index.html' ? path.join(
                ENV.OUTPUT_PATH,
                path.relative(ENV.SOURCE_PATH, template),
            ) : path.join(
                ENV.OUTPUT_PATH,
                path.relative(ENV.SOURCE_PATH, path.dirname(template)),
                path.basename(template, '.html'),
                'index.html',
            ));
            if (ENV.STANDALONE) {
                logger.info(`${path.relative(__dirname, template)} --> ${path.relative(__dirname, filename)}`);
            }
            return new HtmlWebpackPlugin({
                filename,
                template,
                inject: true,
                minify: (APP.HTML_PRETTY ? {
                    html5: true,
                    collapseWhitespace: false,
                    conservativeCollapse: false,
                    removeComments: false,
                    decodeEntities: false,
                    minifyCSS: false,
                    minifyJS: false,
                    removeScriptTypeAttributes: true,
                } : {
                    html5: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false,
                    removeComments: true,
                    decodeEntities: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeScriptTypeAttributes: true,
                }),
                hash: true,
                cache: !ENV.DEBUG,
                title: APP.TITLE,
            });
        })),
        new SvgoPlugin({ enabled: true }),
        ...(APP.HTML_PRETTY ? [new PrettyPlugin()] : []),
        ...(APP.USE_SERVICE_WORKER ? [new WorkboxPlugin.GenerateSW({
            cacheId: ENV.PACKAGE_NAME,
            swDest: SERVICE_WORKER_PATH,
            importWorkboxFrom: 'local',
            clientsClaim: true,
            skipWaiting: true,
            precacheManifestFilename: slash(path.join(SERVICE_WORKER_BASE, 'service-worker-precache.js?[manifestHash]')),
            globDirectory: slash(ENV.OUTPUT_PATH),
            globPatterns: [
                'js/*.min.js',
                'css/*.min.css',
                'fonts/*.woff2',
            ],
            globIgnores: [
                '*.map', '*.LICENSE',
            ],
            include: [],
            runtimeCaching: [{
                urlPattern: new RegExp(`${APP.PUBLIC_PATH}(css|js|fonts)/`),
                handler: 'networkFirst',
                options: {
                    cacheName: `${ENV.PACKAGE_NAME}-assets`,
                    networkTimeoutSeconds: 10,
                },
            }, {
                urlPattern: /\/upload\//,
                handler: 'networkFirst',
                options: {
                    cacheName: `${ENV.PACKAGE_NAME}-upload`,
                    networkTimeoutSeconds: 10,
                    expiration: {
                        maxEntries: 100,
                        purgeOnQuotaError: true,
                    },
                },
            }, {
                urlPattern: /\//,
                handler: 'networkFirst',
                options: {
                    cacheName: `${ENV.PACKAGE_NAME}-html`,
                    networkTimeoutSeconds: 10,
                },
            }],
            ignoreUrlParametersMatching: [/^utm_/, /^[a-fA-F0-9]{32}$/],
        })] : []),
        new CopyWebpackPlugin([
            ...[
                '**/.htaccess',
                'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp}',
                'partials/**/*.svg',
                '*.txt',
            ].map(from => ({
                from,
                to: ENV.OUTPUT_PATH,
                context: ENV.SOURCE_PATH,
                ignore: SITEMAP,
            })),
        ], {
            copyUnmodified: !(ENV.PROD || ENV.DEBUG),
            debug: (ENV.DEBUG ? 'debug' : 'info'),
            force: true,
        }),
        ...(ENV.PROD ? [new ImageminPlugin({
            test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
            exclude: /(fonts|font)/i,
            name: resourceName('img', true),
            imageminOptions: require('./imagemin.config.js'),
            cache: !ENV.DEBUG,
            loader: true,
        })] : []),
        new BundleAnalyzerPlugin({
            analyzerMode: (ENV.DEV_SERVER ? 'server' : 'static'),
            openAnalyzer: ENV.DEV_SERVER,
            reportFilename: path.join(__dirname, 'node_modules', '.cache', `bundle-analyzer-${ENV.NODE_ENV}.html`),
        }),
    ],

    devtool: ENV.USE_SOURCE_MAP ? 'eval-source-map' : 'nosources-source-map',

    resolve: {
        ...require('./resolve.config.js'),
    },

    module: {
        rules: [
            // html loaders
            {
                test: /\.html(\?.*)?$/i,
                loader: './loader.html.js',
                options: {
                    context: Object.assign(
                        {},
                        HTML_DATA,
                        APP,
                        {
                            ENV,
                            SERVICE_WORKER_HASH,
                            DEBUG: ENV.DEBUG,
                            NODE_ENV: ENV.NODE_ENV,
                        },
                    ),
                    searchPath: ENV.SOURCE_PATH,
                },
            },
            // javascript loaders
            {
                test: require.resolve('jquery'),
                exclude: {
                    test: [
                        // disable jquery expose
                        path.join(__dirname, 'node_modules'),
                    ],
                    exclude: [
                        // enable jquery expose
                    ],
                },
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery',
                }, {
                    loader: 'expose-loader',
                    options: '$',
                }],
            },
            ...(ENV.USE_LINTERS ? [{
                enforce: 'pre',
                test: /\.(js|mjs)(\?.*)?$/i,
                exclude: [
                    path.join(__dirname, 'node_modules'),
                    path.join(ENV.SOURCE_PATH, 'js', 'external'),
                ],
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    cache: !ENV.DEBUG,
                    quiet: ENV.PROD,
                    emitError: false,
                    emitWarning: false,
                },
            }] : []),
            {
                type: 'javascript/auto',
                test: /\.(js|mjs)(\?.*)?$/i,
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
                            $: 'jquery',
                            jQuery: 'jquery',
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: false,
                            envName: ENV.NODE_ENV,
                            ...BabelConfig.options,
                        },
                    },
                ],
            },
            // image loaders
            {
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                exclude: /(fonts|font)/i,
                oneOf: [
                    {
                        exclude: /\.(svg)$/i,
                        resourceQuery: /[&?]resize=.+/,
                        loader: './loader.resize.js',
                        options: { name: resourceName('img', true), limit: 32 * 1024 },
                    },
                    {
                        resourceQuery: /[&?]inline=inline/,
                        loader: 'url-loader',
                        options: { name: resourceName('img', true), limit: 32 * 1024 },
                    },
                    {
                        loader: 'file-loader',
                        options: { name: resourceName('img', true) },
                    },
                ],
            },
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?.*)?$/i,
                exclude: /(img|images)/i,
                loader: 'file-loader',
                options: {
                    name: resourceName('fonts', true),
                },
            },
            // css loaders
            {
                test: /\.(css|scss)$/i,
                loaders: (ENV.DEV_SERVER ? ['css-hot-loader'] : []).concat([
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: ENV.USE_SOURCE_MAP,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: ENV.USE_SOURCE_MAP ? 'inline' : false,
                            config: { path: './postcss.config.js' },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            data: [
                                ['$DEBUG', ENV.DEBUG],
                                ['$NODE_ENV', ENV.NODE_ENV],
                                ['$PACKAGE_NAME', ENV.PACKAGE_NAME],
                            ].map(i => ((k, v) => `${k}: ${JSON.stringify(v)};`)(...i)).join('\n'),
                            indentWidth: 4,
                            sourceMap: ENV.USE_SOURCE_MAP ? 'inline' : false,
                            sourceMapEmbed: ENV.USE_SOURCE_MAP,
                            sourceComments: ENV.USE_SOURCE_MAP,
                        },
                    },
                ]),
            },
        ],
    },
    // Some libraries import Node modules but don't use them in the browser.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
