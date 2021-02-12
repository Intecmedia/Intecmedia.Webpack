/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", max-lines: "off", import/no-dynamic-require: "off", max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');

const realcwd = fs.realpathSync(process.cwd());
if (process.cwd() !== realcwd) process.chdir(realcwd);

const ignore = require('ignore');
const path = require('path');
const slash = require('slash');
const webpack = require('webpack');
const weblog = require('webpack-log');

const logger = weblog({ name: 'webpack-config' });
const imageminConfig = require('./imagemin.config.js');

const imageminLogger = weblog({ name: 'imagemin' });

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
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const BrowserSyncPlugin = (ENV.WATCH ? require('browser-sync-webpack-plugin') : () => {});
const StyleLintPlugin = (ENV.USE_LINTERS ? require('stylelint-webpack-plugin') : () => {});
const ESLintPlugin = (ENV.USE_LINTERS ? require('eslint-webpack-plugin') : () => {});
const CompressionPlugin = (ENV.PROD && !ENV.DEBUG ? require('compression-webpack-plugin') : () => {});
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = (ENV.PROD && !ENV.DEBUG ? require('terser-webpack-plugin') : () => {});
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const ImageminIgnore = ignore().add(fs.readFileSync('./.imageminignore').toString());
const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons.js') : () => {});
const HtmlBeautifyPlugin = (APP.HTML_PRETTY ? require('./plugin.html-beautify.js') : () => {});
const BabelOptions = require('./babel.options.js');

const BANNER_STRING = [
    `ENV.NODE_ENV=${ENV.NODE_ENV} | ENV.DEBUG=${ENV.DEBUG}`,
    fs.readFileSync(path.join(ENV.SOURCE_PATH, 'humans.txt')),
].join('\n');

module.exports = {
    mode: ENV.PROD ? 'production' : 'development',

    ...(ENV.DEBUG ? { stats: 'detailed' } : { stats: true }),

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
        port: 9000,
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
        concatenateModules: false,
        ...(!ENV.PROD || ENV.DEBUG ? {
            chunkIds: 'named',
            moduleIds: 'named',
        } : {}),
        emitOnErrors: ENV.PROD && !ENV.DEBUG,
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
            new TerserPlugin({
                test: /\.(js)(\?.*)?$/i,
                parallel: true,
                extractComments: {
                    condition: 'some',
                    filename: (fileData) => `${fileData.filename}.LICENSE`,
                    banner: (licenseFile) => [`License information can be found in ${licenseFile}`, BANNER_STRING].join('\n'),
                },
                terserOptions: {
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
            cleanAfterEveryBuildPatterns: (!ENV.PROD || ENV.DEBUG ? ['**/*.br', '**/*.gz'] : []),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/app.min.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                '**/.htaccess',
                'img/**/*.*',
                'upload/**/*.*',
                '*.txt',
                '*.php',
            ].map((from) => ({
                from,
                to: ENV.OUTPUT_PATH,
                context: ENV.SOURCE_PATH,
                globOptions: {
                    ignore: [
                        '**/img/svg-sprite/**',
                    ],
                },
                noErrorOnMissing: true,
                force: true,
            })),
        }),
        ...(ENV.PROD && !ENV.DEBUG ? [
            new CaseSensitivePathsPlugin(),
            new CompressionPlugin({
                test: /\.(js|css|svg|json|lottie)(\?.*)?$/i,
                exclude: ['assets-manifest.json'],
                filename: '[path][base].br[query]',
                compressionOptions: {
                    level: 11,
                },
                algorithm: 'brotliCompress',
            }),
            new CompressionPlugin({
                test: /\.(js|css|svg|json|lottie)(\?.*)?$/i,
                exclude: ['assets-manifest.json'],
                filename: '[path][base].gz[query]',
                compressionOptions: {
                    numiterations: 15,
                },
                algorithm(input, compressionOptions, callback) {
                    const zopfli = require('@gfx/zopfli');
                    return zopfli.gzip(input, compressionOptions, callback);
                },
            }),
        ] : []),
        new webpack.BannerPlugin({
            banner: BANNER_STRING,
            include: /\.(css|js)(\?.*)?$/i,
        }),
        new webpack.ProvidePlugin({
            ...(APP.USE_JQUERY ? {
                $: 'jquery',
                jQuery: 'jquery',
                'window.$': 'jquery',
                'window.jQuery': 'jquery',
            } : {}),
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
                emitError: false,
                failOnError: false,
                lintDirtyModulesOnly: ENV.DEV_SERVER || ENV.WATCH,
                fix: !ENV.DEV_SERVER,
            }),
            new ESLintPlugin({
                files: [ENV.SOURCE_PATH],
                fix: true,
                quiet: ENV.PROD,
                emitError: false,
                emitWarning: false,
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
            hash: true,
            cache: !ENV.DEBUG,
            title: APP.TITLE,
        }))),
        ...(APP.USE_FAVICONS ? [
            new FaviconsPlugin.AppIcon({
                logo: path.join(__dirname, '.favicons-source-1024x1024.png'),
                publicPath: APP.PUBLIC_PATH,
                outputPath: 'img/favicons/',
                prefix: 'img/favicons/',
                cache: ENV.DEBUG ? false : UTILS.cacheDir('favicons-webpack-plugin-1024'),
            }),
            new FaviconsPlugin.FavIcon({
                logo: path.join(__dirname, '.favicons-source-64x64.png'),
                publicPath: APP.PUBLIC_PATH,
                outputPath: 'img/favicons/',
                prefix: 'img/favicons/',
                cache: ENV.DEBUG ? false : UTILS.cacheDir('favicons-webpack-plugin-64'),
            }),
        ] : []),
        ...(APP.HTML_PRETTY ? [new HtmlBeautifyPlugin({
            config: {
                indent_char: ' ',
                indent_size: 4,
                html: {
                    unformatted: ['code', 'pre', 'textarea'],
                    wrap_line_length: 120,
                    max_preserve_newlines: 1,
                },
            },
        })] : []),
        new SVGSpritemapPlugin([
            'source/img/svg-sprite/*.svg',
        ], {
            output: {
                filename: 'img/svg-sprite.svg',
                svg4everybody: false,
                svgo: false,
            },
            sprite: {
                prefix: (filename) => {
                    const svgContent = fs.readFileSync(filename).toString();
                    const URL_PATTERN = /url\((.+)\)/i;
                    if (URL_PATTERN.test(svgContent)) {
                        const [svgUrl] = svgContent.match(URL_PATTERN);
                        const relativePath = slash(path.relative(__dirname, path.normalize(filename)));
                        throw new Error(`[svg-sprite] external content (${svgUrl}) not allowed in: ${relativePath}`);
                    }
                    return 'icon-';
                },
                generate: {
                    title: false,
                },
            },
        }),
        ...(ENV.PROD || ENV.DEBUG ? [
            new ImageMinimizerPlugin({
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                exclude: [
                    /(fonts|font)/i,
                    path.join(ENV.SOURCE_PATH, 'img/svg-sprite'),
                ],
                filter: (input, name) => {
                    const relativePath = slash(path.relative(__dirname, path.normalize(name)));
                    const ignores = ImageminIgnore.ignores(relativePath);
                    imageminLogger.info(`${JSON.stringify(relativePath)} ${ignores ? 'ignores' : 'minified'}`);
                    return !ignores;
                },
                minimizerOptions: { plugins: imageminConfig.plugins },
                loader: true,
            }),
        ] : []),
        ...(ENV.PROD || ENV.DEBUG ? [
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
        ...(ENV.DEV_SERVER ? [
            webpack.HotModuleReplacementPlugin(),
        ] : []),
    ],

    ...(!ENV.USE_SOURCE_MAP ? {
        devtool: 'nosources-source-map',
    } : {
        devtool: false,
    }),

    resolve: require('./resolve.config.js').resolve,

    module: {
        rules: [
            // html loaders
            {
                test: /\.(html)(\?.*)?$/i,
                loader: './loader.html.js',
                exclude: [
                    path.join(ENV.SOURCE_PATH, 'upload'),
                ],
                options: {
                    context: APP,
                    searchPath: ENV.SOURCE_PATH,
                },
            },
            // javascript loaders
            ...(APP.USE_JQUERY ? [{
                test: require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                    exposes: ['$', 'jQuery'],
                },
            }] : []),
            {
                type: 'javascript/auto',
                test: /\.(js|mjs|cjs)(\?.*)?$/i,
                exclude: {
                    and: [
                        // disable babel transform
                        ...BabelOptions.excludeTransform,
                    ],
                    not: [
                        // enable babel transform
                        ...BabelOptions.includeTransform,
                        path.join(ENV.SOURCE_PATH, 'upload'),
                    ],
                },
                rules: [
                    ...(APP.USE_JQUERY ? [{
                        // global jQuery import
                        loader: 'imports-loader',
                        options: {
                            imports: [
                                'default jquery $',
                                'default jquery jQuery',
                            ],
                        },
                    }] : []),
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: './babel.config.js',
                            envName: ENV.NODE_ENV,
                            cacheCompression: false,
                            cacheDirectory: ENV.DEBUG ? false : UTILS.cacheDir('babel-loader'),
                        },
                    },
                ],
            },
            // file loaders
            {
                include: [
                    path.join(ENV.SOURCE_PATH, 'upload'),
                ],
                oneOf: [
                    {
                        include: /\.(jpeg|jpg|png|gif)(\?.*)?$/i,
                        exclude: /\.(svg)$/i,
                        resourceQuery: /[&?]resize=.+/,
                        loader: './loader.resize.js',
                        options: {
                            cacheDirectory: ENV.DEBUG ? false : UTILS.cacheDir('loader-resize'),
                            name: UTILS.resourceName('upload'),
                            limit: 32 * 1024,
                            esModule: false,
                            hashType: 'md5',
                        },
                    },
                    {
                        loader: 'file-loader',
                        options: {
                            name: UTILS.resourceName('upload'), esModule: false, hashType: 'md5',
                        },
                    },
                ],
            },
            // image loaders
            {
                test: /\.(svg)(\?.*)?$/i,
                issuer: /\.(html)(\?.*)?$/i,
                include: [
                    path.join(ENV.SOURCE_PATH, 'partials'),
                ],
                exclude: [
                    /(fonts|font)/i,
                    path.join(ENV.SOURCE_PATH, 'img/svg-sprite'),
                    path.join(ENV.SOURCE_PATH, 'upload'),
                ],
                loader: './loader.svgo.js',
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                exclude: [
                    /(fonts|font)/i,
                    path.join(ENV.SOURCE_PATH, 'img/svg-sprite'),
                    path.join(ENV.SOURCE_PATH, 'upload'),
                    path.join(ENV.SOURCE_PATH, 'partials'),
                ],
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
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?.*)?$/i,
                exclude: [
                    /(img|images)/i,
                    path.join(ENV.SOURCE_PATH, 'img/svg-sprite'),
                    path.join(ENV.SOURCE_PATH, 'upload'),
                    path.join(ENV.SOURCE_PATH, 'partials'),
                ],
                loader: 'file-loader',
                options: { name: UTILS.resourceName('fonts'), esModule: false, hashType: 'md5' },
            },
            // css loaders
            {
                test: /\.(css|scss)(\?.*)?$/i,
                exclude: [
                    path.join(ENV.SOURCE_PATH, 'upload'),
                ],
                rules: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            importLoaders: 2,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
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
                            sourceMap: true,
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
