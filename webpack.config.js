/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off" */
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
const STANDALONE = ['webpack', 'webpack-dev-server'].includes(path.basename(require.main.filename, '.js'));
const PROD = (process.env.NODE_ENV === 'production');
const NODE_ENV = PROD ? 'production' : 'development';

if (!['production', 'development'].includes(process.env.NODE_ENV)) {
    throw new Error(`Unknow NODE_ENV=${JSON.stringify(process.env.NODE_ENV)}`);
}

const USE_SOURCE_MAP = (DEBUG && !PROD) || DEV_SERVER;
const USE_LINTERS = PROD || DEBUG;

const { name: PACKAGE_NAME, browserslist: BROWSERS } = require('./package.json');

const SOURCE_PATH = path.resolve(__dirname, 'source');
const OUTPUT_PATH = path.resolve(__dirname, 'build');
const APP = require('./app.config.js');

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
const SERVICE_WORKER_HASH = () => fs.existsSync(SERVICE_WORKER_PATH) && md5File.sync(SERVICE_WORKER_PATH);

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
        open: true,
        overlay: { warnings: false, errors: true },
    },

    entry: {
        app: `${SOURCE_PATH}/js/app.js`,
    },

    output: {
        filename: 'js/app.min.js',
        path: OUTPUT_PATH,
        publicPath: APP.PUBLIC_PATH,
    },

    performance: {
        assetFilter: (uri) => {
            const [filename] = uri.split('?', 2);
            const ignore = /(\.map|\.LICENSE|\.eot|\.ttf|manifest\.json|service-worker\.js|@resize\-)$/;
            return !(ignore.test(filename));
        },
        hints: PROD && !DEBUG ? 'error' : false,
        maxAssetSize: 1024 * 1024,
        maxEntrypointSize: 512 * 1024,
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
        new StyleLintPlugin({
            configFile: './.stylelintrc',
            context: SOURCE_PATH,
            emitErrors: PROD,
            failOnError: !PROD,
            files: ['css/**/*.scss'],
            syntax: 'scss',
            quiet: PROD,
        }),
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
                logo: './.favicons-source-64x64.png',
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
            if (STANDALONE) logger.info(`${template} --> ${filename}`);
            return new HtmlWebpackPlugin({
                filename,
                template,
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
            });
        })),
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
        new CopyWebpackPlugin([
            ...[
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
            ...(require(path.join(SOURCE_PATH, 'js', 'resolve.alias.js'))),
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
                        APP.HTML_CONTEXT,
                        APP,
                        {
                            DEBUG,
                            NODE_ENV,
                            SERVICE_WORKER_HASH,
                        },
                    ),
                    searchPath: SOURCE_PATH,
                    svgoEnabled: DEBUG || PROD,
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
                exclude: [
                    path.join(__dirname, 'node_modules'),
                    path.join(SOURCE_PATH, 'js', 'external'),
                ],
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
                            presets: [['airbnb', {
                                debug: DEBUG || PROD,
                                targets: { browsers: BROWSERS },
                            }]],
                            forceEnv: NODE_ENV,
                            cacheDirectory: !PROD,
                        },
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                            cache: !PROD,
                            quiet: PROD,
                            emitError: !PROD,
                            emitWarning: !PROD,
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
                        resourceQuery: /resize/,
                        loader: './loader.resize.js',
                        options: { name: resourceName('img', false) },
                    },
                    {
                        resourceQuery: /inline/,
                        loader: 'url-loader',
                        options: { name: resourceName('img', false) },
                    },
                    {
                        loader: 'file-loader',
                        options: { name: resourceName('img', false) },
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
                loaders: (DEV_SERVER ? ['css-hot-loader'] : []).concat(ExtractTextPlugin.extract({
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
                                ].map(i => `${i[0]}: ${JSON.stringify(i[1])};`).join('\n'),
                                indentWidth: 4,
                                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                                sourceMapEmbed: USE_SOURCE_MAP,
                                sourceComments: USE_SOURCE_MAP,
                            },
                        },
                        {
                            loader: 'stylefmt-loader',
                            options: { config: './.stylelintrc' },
                        },
                    ],
                })),
            },
        ],
    },

};
