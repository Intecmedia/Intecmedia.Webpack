/* eslint global-require: "off", max-lines: "off" */
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const slash = require('slash');
const webpack = require('webpack');
const md5File = require('md5-file');
const weblog = require('webpack-log');

const logger = weblog({ name: 'webpack-config' });

const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const PROD = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'production') || process.argv.indexOf('-p') !== -1;
const NODE_ENV = PROD ? 'production' : 'development';

const USE_SOURCE_MAP = DEBUG && !PROD;
const USE_LINTERS = PROD || DEBUG;

const { name: PACKAGE_NAME, browserslist: BROWSERS } = require('./package.json');

const OUTPUT_PATH = path.resolve(__dirname, 'build');
const APP = require('./app.config.js');

logger.info(`Name: ${PACKAGE_NAME}`);
logger.info(`Output: ${OUTPUT_PATH}`);
logger.info(`Public: ${APP.PUBLIC_PATH}`);
logger.info(`Enviroment: ${NODE_ENV}`);
logger.info(`Debug: ${DEBUG ? 'enabled' : 'disabled'}`);
logger.info(`Linters: ${USE_LINTERS ? 'enabled' : 'disabled'}`);
logger.info(`Source maps: ${USE_SOURCE_MAP ? 'enabled' : 'disabled'}`);
logger.info(`App config: ${JSON.stringify(APP, null, '    ')}`);

if (PROD && DEBUG) {
    throw new Error(`Dont use NODE_ENV=${NODE_ENV} and DEBUG=${DEBUG} together`);
}

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const { default: ImageminPlugin } = require('imagemin-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');

const FaviconsPlugin = require('./plugin.favicons.js');
const PrettyPlugin = require('./plugin.pretty.js');
const ManifestPlugin = require('./plugin.manifest.js');

const SERVICE_WORKER_BASE = slash(path.relative(APP.PUBLIC_PATH, '/'));
const SERVICE_WORKER_PATH = path.join(OUTPUT_PATH, SERVICE_WORKER_BASE, '/service-worker.js');
const SERVICE_WORKER_HASH = () => {
    if (APP.USE_SERVICE_WORKER && fs.existsSync(SERVICE_WORKER_PATH)) {
        return md5File.sync(SERVICE_WORKER_PATH);
    }
    return null;
};

const SITEMAP = glob.sync('./source/**/*.html').filter(filename => !/partials/.test(filename));

const resourceName = (prefix, hash = false) => {
    const basename = path.basename(prefix);
    const suffix = (hash ? '?[hash]' : '');
    return (resourcePath) => {
        const url = slash(path.relative(path.join(__dirname, 'source'), resourcePath));
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
        open: true,
        overlay: true,
        compress: false,
        setup(app) {
            app.get('/service-worker.js', (req, res) => {
                const content = fs.existsSync(SERVICE_WORKER_PATH) ? fs.readFileSync(SERVICE_WORKER_PATH) : '';
                res.set({ 'Content-Type': 'application/javascript; charset=utf-8' });
                res.send(content);
            });
        },
    },

    entry: {
        app: './source/js/app.js',
    },

    output: {
        path: OUTPUT_PATH,
        publicPath: APP.PUBLIC_PATH,
        filename: 'js/app.min.js',
    },

    performance: {
        hints: PROD && !DEBUG ? 'error' : false,
        maxAssetSize: 512 * 1024,
        maxEntrypointSize: 512 * 1024,
        assetFilter: (uri) => {
            const [filename] = uri.split('?', 2);
            const ignore = /(\.map|\.LICENSE|\.eot|\.ttf|manifest\.json|service-worker\.js)$/;
            return !(ignore.test(filename));
        },
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'css/app.min.css',
            allChunks: true,
        }),
        ...(PROD ? [
            new CaseSensitivePathsPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new BabelMinifyPlugin(
                { mangle: { topLevel: true } },
                { comments: false },
            ),
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
            contentImage: path.resolve('./.favicons-source-512x512.png'),
            title: APP.TITLE,
        }),
        ...(USE_LINTERS ? [new StyleLintPlugin({
            configFile: '.stylelintrc',
            files: ['**/*.scss'],
            fix: !DEV_SERVER,
            syntax: 'scss',
            quiet: PROD,
        })] : []),
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                title: APP.TITLE,
                logo: './.favicons-source-512x512.png',
                prefix: 'img/favicon/',
                background: APP.BACKGROUND_COLOR,
                theme_color: APP.THEME_COLOR,
                persistentCache: !(PROD || DEBUG),
            }),
            new FaviconsPlugin.FavIcon({
                title: APP.TITLE,
                logo: './.favicons-source-32x32.png',
                prefix: 'img/favicon/',
                background: APP.BACKGROUND_COLOR,
                theme_color: APP.THEME_COLOR,
                persistentCache: !(PROD || DEBUG),
            }),
            new ManifestPlugin({
                path: path.join(OUTPUT_PATH, '/img/favicon/manifest.json'),
                replace: {
                    lang: APP.LANGUAGE,
                    start_url: APP.START_URL,
                    theme_color: APP.THEME_COLOR,
                    background_color: APP.BACKGROUND_COLOR,
                },
            }),
        ] : []),
        ...(SITEMAP.map(filename => new HtmlWebpackPlugin({
            filename: path.basename(filename),
            template: filename,
            inject: true,
            minify: APP.HTML_PRETTY ? false : {
                html5: true,
                collapseWhitespace: true,
                conservativeCollapse: false,
                removeComments: true,
                decodeEntities: true,
                minifyCSS: false,
                minifyJS: false,
            },
            hash: true,
            cache: !(PROD || DEBUG),
            title: APP.TITLE,
        }))),
        ...(APP.HTML_PRETTY ? [new PrettyPlugin()] : []),
        ...(APP.USE_SERVICE_WORKER ? [new SWPrecacheWebpackPlugin({
            minify: PROD,
            handleFetch: true,
            filename: (SERVICE_WORKER_BASE ? `${SERVICE_WORKER_BASE}/service-worker.js` : 'service-worker.js'),
            staticFileGlobs: [
                slash(path.join(OUTPUT_PATH, '/js/*.min.js')),
                slash(path.join(OUTPUT_PATH, '/css/*.min.css')),
                slash(path.join(OUTPUT_PATH, '/fonts/*.woff2')),
            ],
            runtimeCaching: [{
                urlPattern: /^chrome-extension:\/\//,
                handler: 'networkOnly',
                options: { debug: !PROD },
            }, {
                urlPattern: /(.*)/,
                handler: 'networkFirst',
                options: { debug: !PROD },
            }, {
                urlPattern: new RegExp(`${APP.PUBLIC_PATH}(js|css|fonts|img)/(.*)`),
                handler: 'cacheFirst',
                options: { debug: !PROD },
            }],
            staticFileGlobsIgnorePatterns: [/\.map$/, /\.LICENSE$/],
            ignoreUrlParametersMatching: [/^utm_/, /^[a-fA-F0-9]{32}$/],
        })] : []),
        new CopyWebpackPlugin([{
            context: './source',
            from: 'img/**/*.{png,svg,ico,gif,xml,jpeg,jpg,json}',
            copyUnmodified: !(PROD || DEBUG),
            to: OUTPUT_PATH,
        }], {
            debug: (DEBUG ? 'debug' : 'info'),
        }),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            svgo: {
                plugins: [
                    { removeViewBox: false },
                    { removeAttrs: { attrs: 'data\\-.*' } },
                ],
            },
            disable: !(PROD || DEBUG),
        }),
        ...(DEV_SERVER || !PROD ? [new BundleAnalyzerPlugin({
            analyzerMode: (DEV_SERVER ? 'server' : 'static'),
            reportFilename: path.join(__dirname, 'node_modules/.cache/bundle-analyzer-report.html'),
        })] : []),
    ],

    devtool: USE_SOURCE_MAP ? 'eval-source-map' : 'nosources-source-map',

    resolve: {
        alias: {
            modernizr$: path.resolve(__dirname, '.modernizrrc'),
        },
    },

    module: {
        rules: [
            // html loaders
            {
                test: /\.html$/i,
                loader: './loader.html.js',
                options: {
                    noCache: PROD,
                    context: {
                        ...APP.HTML_CONTEXT, APP: { ...APP, SERVICE_WORKER_HASH }, DEBUG, NODE_ENV,
                    },
                    searchPath: path.join(__dirname, 'source'),
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
            {
                test: /\.modernizrrc$/,
                loader: 'modernizr-loader!json-loader',
            },
            {
                test: /\.js$/i,
                include: /node_modules/,
                loader: 'imports-loader',
                options: {
                    $: 'jquery',
                    jQuery: 'jquery',
                },
            },
            ...(USE_LINTERS ? [{
                enforce: 'pre',
                test: /\.js$/i,
                exclude: /(node_modules|external)/,
                loader: 'eslint-loader',
                options: { fix: true, cache: !PROD, quiet: PROD },
            }] : []),
            {
                test: /\.js$/i,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: [['airbnb', {
                        debug: DEBUG || PROD,
                        targets: { browsers: BROWSERS },
                    }]],
                    forceEnv: NODE_ENV,
                    cacheDirectory: !PROD,
                },
            },
            // image loaders
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                exclude: /(fonts|font|partials)/i,
                loaders: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 32 * 1024,
                            name: resourceName('img', false),
                        },
                    },
                ],
            },
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/i,
                exclude: /(img|images|partials)/i,
                loader: 'file-loader',
                options: {
                    name: resourceName('fonts', true),
                },
            },
            // css loaders
            {
                test: /\.(css|scss)$/i,
                loaders: (DEBUG || DEV_SERVER ? ['css-hot-loader'] : []).concat(ExtractTextPlugin.extract({
                    fallback: [
                        {
                            loader: 'style-loader',
                            options: { sourceMap: USE_SOURCE_MAP },
                        },
                    ],
                    use: [
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
                                plugins: [
                                    require('postcss-input-style')(),
                                    require('postcss-quantity-queries')(),
                                    require('postcss-responsive-type')(),
                                    ...(PROD || DEBUG ? [
                                        require('pixrem')(),
                                        require('pleeease-filters')(),
                                        require('postcss-image-set-polyfill')(),
                                        require('postcss-color-rgba-fallback')(),
                                        require('postcss-flexbugs-fixes')(),
                                        require('css-mqpacker')(),
                                        require('autoprefixer')({ browsers: BROWSERS }), // this always last
                                    ] : []),
                                    require('postcss-reporter')(), // this always last
                                ],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                data: [
                                    `$DEBUG: ${DEBUG ? 'true' : 'false'};\n`,
                                    `$NODE_ENV: '${NODE_ENV}';\n`,
                                    `$PACKAGE_NAME: '${PACKAGE_NAME}';\n`,
                                ].join(''),
                                indentWidth: 4,
                                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                                sourceMapEmbed: USE_SOURCE_MAP,
                                sourceComments: USE_SOURCE_MAP,
                            },
                        },
                        ...(USE_LINTERS ? [{
                            loader: 'stylefmt-loader',
                            options: {
                                config: '.stylelintrc',
                            },
                        }] : []),
                    ],
                })),
            },
        ],
    },

};
