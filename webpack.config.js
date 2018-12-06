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

const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const STANDALONE = ['webpack', 'webpack-dev-server'].includes(path.basename(require.main.filename, '.js'));
const WATCH = (process.argv.indexOf('--watch') !== -1) || (process.argv.indexOf('-w') !== -1);
const PROD = (process.env.NODE_ENV === 'production');
const NODE_ENV = PROD ? 'production' : 'development';
const USE_SOURCE_MAP = (DEBUG && !PROD) || DEV_SERVER;
const USE_LINTERS = PROD || DEBUG;

process.env.DEBUG = DEBUG;
process.env.NODE_ENV = NODE_ENV;
process.env.USE_SOURCE_MAP = USE_SOURCE_MAP;
process.env.USE_LINTERS = USE_LINTERS;

if (!['production', 'development'].includes(process.env.NODE_ENV)) {
    throw new Error(`Unknow NODE_ENV=${JSON.stringify(process.env.NODE_ENV)}`);
}

const { name: PACKAGE_NAME, browserslist: BROWSERS } = require('./package.json');

const SOURCE_PATH = path.resolve(__dirname, 'source');
const OUTPUT_PATH = path.resolve(__dirname, 'build');
const APP = require('./app.config.js');
const HTML_DATA = require('./source/html.data.js');

if (STANDALONE) {
    logger.info(`Name: ${PACKAGE_NAME}`);
    logger.info(`Enviroment: ${NODE_ENV}`);
    logger.info(`Debug: ${DEBUG ? 'enabled' : 'disabled'}`);
    logger.info(`Linters: ${USE_LINTERS ? 'enabled' : 'disabled'}`);
    logger.info(`Source maps: ${USE_SOURCE_MAP ? 'enabled' : 'disabled'}`);
    logger.info(`App config: ${JSON.stringify(APP, null, '    ')}`);
}

if (PROD && DEBUG) {
    throw new Error(`Dont use NODE_ENV=${NODE_ENV} and DEBUG=${DEBUG} together`);
}

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const WorkboxPlugin = (APP.USE_SERVICE_WORKER ? require('workbox-webpack-plugin') : () => {});
const { default: ImageminPlugin } = require('imagemin-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = (PROD ? require('uglifyjs-webpack-plugin') : () => {});
const BrowserSyncPlugin = (WATCH ? require('browser-sync-webpack-plugin') : () => {});
const StyleLintPlugin = (USE_LINTERS ? require('stylelint-webpack-plugin') : () => {});
const BrotliPlugin = (PROD ? require('brotli-webpack-plugin') : () => {});
const CompressionPlugin = (PROD ? require('compression-webpack-plugin') : () => {});

const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons.js') : () => {});
const PrettyPlugin = (APP.HTML_PRETTY ? require('./plugin.pretty.js') : () => {});
const SvgoPlugin = require('./plugin.svgo.js');

const SERVICE_WORKER_BASE = slash(path.relative(APP.PUBLIC_PATH, '/'));
const SERVICE_WORKER_PATH = path.join(OUTPUT_PATH, SERVICE_WORKER_BASE, '/service-worker.js');
const SERVICE_WORKER_HASH = () => (fs.existsSync(SERVICE_WORKER_PATH) ? md5File.sync(SERVICE_WORKER_PATH) : '');

const SITEMAP = glob.sync(`${slash(SOURCE_PATH)}/**/*.html`, {
    ignore: [
        `${slash(SOURCE_PATH)}/partials/**/*.html`,
        `${slash(SOURCE_PATH)}/google*.html`,
        `${slash(SOURCE_PATH)}/yandex_*.html`,
    ],
});

const resourceName = (prefix, hash = false) => {
    const basename = path.basename(prefix);
    const suffix = (hash ? '?[hash]' : '');
    return (resourcePath) => {
        const url = slash(path.relative(SOURCE_PATH, resourcePath));
        if (url.startsWith(`${basename}/`)) {
            return url + suffix;
        }
        if (url.startsWith('../node_modules/')) {
            const [, , modulename] = url.split('/', 3);
            return slash(path.join(basename, modulename, `[name].[ext]${suffix}`));
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
        app: `${SOURCE_PATH}/js/app.js`,
    },

    output: {
        filename: 'js/app.min.js',
        path: OUTPUT_PATH,
        publicPath: APP.PUBLIC_PATH,
    },

    performance: (PROD && !DEBUG ? {
        assetFilter: (asset) => {
            const [filename] = asset.split('?', 2);
            const ignore = /(\.(css|js)\.map|\.LICENSE|\.eot|\.ttf|manifest\.json|service-worker\.js|@resize-.+)$/;
            return !(ignore.test(filename));
        },
        hints: 'warning',
        maxAssetSize: 3 * 1024 * 1024,
        maxEntrypointSize: 512 * 1024,
    } : false),

    plugins: [
        ...(WATCH ? [new BrowserSyncPlugin()] : []),
        new MiniCssExtractPlugin({
            filename: 'css/app.min.css',
            allChunks: true,
        }),
        ...(PROD ? [
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                extractComments: true,
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
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
            banner: `NODE_ENV=${NODE_ENV} | DEBUG=${DEBUG} | chunkhash=[chunkhash]`,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
        }),
        new webpack.DefinePlugin({
            DEBUG: JSON.stringify(DEBUG),
            NODE_ENV: JSON.stringify(NODE_ENV),
        }),
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            contentImage: path.resolve('./.favicons-source-1024x1024.png'),
            title: APP.TITLE,
        }),
        ...(USE_LINTERS ? [
            new StyleLintPlugin({
                syntax: 'scss',
                files: '**/*.scss',
                configFile: './.stylelintrc',
                ignorePath: './.stylelintignore',
                emitErrors: false,
                failOnError: false,
                lintDirtyModulesOnly: DEV_SERVER || WATCH,
                fix: !DEV_SERVER,
            }),
        ] : []),
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                title: APP.TITLE,
                logo: './.favicons-source-1024x1024.png',
                prefix: 'img/favicon/',
                background: APP.BACKGROUND_COLOR,
                theme_color: APP.THEME_COLOR,
                persistentCache: !(PROD || DEBUG),
            }),
            new FaviconsPlugin.FavIcon({
                title: APP.TITLE,
                logo: './.favicons-source-64x64.png',
                prefix: 'img/favicon/',
                background: APP.BACKGROUND_COLOR,
                theme_color: APP.THEME_COLOR,
                persistentCache: !(PROD || DEBUG),
            }),
        ] : []),
        ...(SITEMAP.map((template) => {
            const basename = path.basename(template);
            const filename = (basename === 'index.html' ? path.join(
                OUTPUT_PATH,
                path.relative(SOURCE_PATH, template),
            ) : path.join(
                OUTPUT_PATH,
                path.relative(SOURCE_PATH, path.dirname(template)),
                path.basename(template, '.html'),
                'index.html',
            ));
            if (STANDALONE) {
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
                cache: !(PROD || DEBUG),
                title: APP.TITLE,
            });
        })),
        new SvgoPlugin({ enabled: true }),
        ...(APP.HTML_PRETTY ? [new PrettyPlugin()] : []),
        ...(APP.USE_SERVICE_WORKER ? [new WorkboxPlugin.GenerateSW({
            cacheId: PACKAGE_NAME,
            swDest: SERVICE_WORKER_PATH,
            importWorkboxFrom: 'local',
            clientsClaim: true,
            skipWaiting: true,
            precacheManifestFilename: slash(path.join(SERVICE_WORKER_BASE, 'service-worker-precache.js?[manifestHash]')),
            globDirectory: slash(OUTPUT_PATH),
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
                    cacheName: `${PACKAGE_NAME}-assets`,
                    networkTimeoutSeconds: 10,
                },
            }, {
                urlPattern: /\/upload\//,
                handler: 'networkFirst',
                options: {
                    cacheName: `${PACKAGE_NAME}-upload`,
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
                    cacheName: `${PACKAGE_NAME}-html`,
                    networkTimeoutSeconds: 10,
                },
            }],
            ignoreUrlParametersMatching: [/^utm_/, /^[a-fA-F0-9]{32}$/],
        })] : []),
        new CopyWebpackPlugin([
            ...[
                '**/.htaccess',
                'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json,webp}',
                'google*.html',
                'yandex_*.html',
                '*.txt',
            ].map(from => ({
                from,
                to: OUTPUT_PATH,
                context: SOURCE_PATH,
                ignore: SITEMAP,
            })),
        ], {
            copyUnmodified: !(PROD || DEBUG),
            debug: (DEBUG ? 'debug' : 'info'),
        }),
        new ImageminPlugin({
            test: /\.(jpeg|jpg|png|gif|svg)$/i,
            ...require('./imagemin.config.js'),
            cacheFolder: path.join(__dirname, 'node_modules', '.cache', 'imagemin-plugin'),
            disable: !(PROD || DEBUG),
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: (DEV_SERVER ? 'server' : 'static'),
            openAnalyzer: DEV_SERVER,
            reportFilename: path.join(__dirname, 'node_modules', '.cache', `bundle-analyzer-${NODE_ENV}.html`),
        }),
    ],

    devtool: USE_SOURCE_MAP ? 'eval-source-map' : 'nosources-source-map',

    resolve: {
        alias: {
            '~': path.join(SOURCE_PATH, 'js'),
        },
    },

    module: {
        rules: [
            // html loaders
            {
                test: /\.html$/i,
                loader: './loader.html.js',
                options: {
                    context: Object.assign(
                        {},
                        HTML_DATA,
                        APP,
                        {
                            DEBUG,
                            NODE_ENV,
                            SERVICE_WORKER_HASH,
                        },
                    ),
                    searchPath: SOURCE_PATH,
                },
            },
            // javascript loaders
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery',
                }, {
                    loader: 'expose-loader',
                    options: '$',
                }],
            },
            ...(USE_LINTERS ? [{
                enforce: 'pre',
                test: /\.js$/i,
                exclude: [
                    path.join(__dirname, 'node_modules'),
                    path.join(SOURCE_PATH, 'js', 'external'),
                ],
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    cache: !PROD,
                    quiet: PROD,
                    emitError: false,
                    emitWarning: false,
                },
            }] : []),
            {
                test: /\.js$/i,
                exclude: {
                    test: path.join(__dirname, 'node_modules'),
                    exclude: path.join(__dirname, 'node_modules', 'gsap'),
                },
                loaders: [
                    {
                        loader: 'imports-loader',
                        options: {
                            $: 'jquery',
                            jQuery: 'jquery',
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/transform-runtime',
                            ],
                            presets: [
                                ['@babel/preset-env', {
                                    modules: 'commonjs',
                                    useBuiltIns: 'entry',
                                    targets: { browsers: BROWSERS },
                                }],
                                ['airbnb', {
                                    modules: true,
                                    targets: { browsers: BROWSERS },
                                }],
                            ],
                            envName: NODE_ENV,
                        },
                    },
                ],
            },
            // image loaders
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/i,
                exclude: /(fonts|font)/i,
                oneOf: [
                    {
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
                test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/i,
                exclude: /(img|images)/i,
                loader: 'file-loader',
                options: {
                    name: resourceName('fonts', true),
                },
            },
            // css loaders
            {
                test: /\.(css|scss)$/i,
                loaders: (DEV_SERVER ? ['css-hot-loader'] : []).concat([
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: USE_SOURCE_MAP,
                            minimize: (PROD ? {
                                discardComments: { removeAll: true },
                            } : false),
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                            config: { path: './postcss.config.js' },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            data: [
                                ['$DEBUG', DEBUG],
                                ['$NODE_ENV', NODE_ENV],
                                ['$PACKAGE_NAME', PACKAGE_NAME],
                            ].map(i => ((k, v) => `${k}: ${JSON.stringify(v)};`)(...i)).join('\n'),
                            indentWidth: 4,
                            sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                            sourceMapEmbed: USE_SOURCE_MAP,
                            sourceComments: USE_SOURCE_MAP,
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
