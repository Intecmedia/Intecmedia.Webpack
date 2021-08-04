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
const imageminConfig = require('./imagemin.config');

const imageminLogger = weblog({ name: 'imagemin' });

const ENV = require('./app.env');
const APP = require('./app.config');
const UTILS = require('./webpack.utils');

ENV.SITEMAP = ENV.SITEMAP.map((i) => Object.assign(i, {
    path: path.posix.join(APP.PUBLIC_PATH, i.url, 'index.html'),
}));

if (ENV.STANDALONE) {
    logger.info('Argv:', ENV.ARGV);
    logger.info('Name:', ENV.PACKAGE_NAME);
    logger.info('Enviroment:', ENV.NODE_ENV);
    logger.info('Debug:', ENV.DEBUG ? 'enabled' : 'disabled');
}

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const BrowserSyncPlugin = (ENV.WATCH ? require('browser-sync-webpack-plugin') : () => {});
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CompressionPlugin = (ENV.PROD && !ENV.DEBUG ? require('compression-webpack-plugin') : () => {});
const TerserPlugin = (ENV.PROD && !ENV.DEBUG ? require('terser-webpack-plugin') : () => {});
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const ImageminIgnore = ignore().add(fs.readFileSync('./.imageminignore').toString());
const FaviconsPlugin = (APP.USE_FAVICONS ? require('./plugin.favicons') : () => {});
const HtmlBeautifyPlugin = (APP.HTML_PRETTY ? require('./plugin.html-beautify') : () => {});
const BabelOptions = require('./babel.options');

module.exports = {
    mode: ENV.PROD ? 'production' : 'development',

    stats: {
        preset: (ENV.DEBUG ? 'detailed' : 'normal'),
        children: true,
    },

    target: 'browserslist',

    cache: (ENV.DEBUG ? false : {
        name: 'webpack',
        type: 'filesystem',
        cacheDirectory: UTILS.cacheDir('webpack'),
    }),

    experiments: {
        topLevelAwait: false,
    },

    watchOptions: {
        ignored: /node_modules/,
    },

    devServer: {
        allowedHosts: ['.localhost', 'localhost'],
        compress: false,
        contentBase: path.resolve(__dirname, 'source'),
        hot: true,
        overlay: { warnings: false, errors: true },
        inline: true,
        injectClient: true,
        clientLogLevel: 'warn',
        publicPath: path.posix.resolve(APP.PUBLIC_PATH, '/'),
        port: 8888,
        stats: (ENV.DEBUG ? 'detailed' : 'normal'),
        writeToDisk: true,
    },

    entry: {
        app: [
            `${ENV.SOURCE_PATH}/js/public-path.js`, // this always first
            `${ENV.SOURCE_PATH}/js/polyfills.js`, // this always first
            ...(APP.SENTRY.dsn ? [`${ENV.SOURCE_PATH}/js/sentry.js`] : []),
            `${ENV.SOURCE_PATH}/css/app.scss`,
            `${ENV.SOURCE_PATH}/js/app.js`,
        ],
    },

    output: {
        clean: { keep: /\.gitkeep/ },
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[name].min.js?[chunkhash]',
        hotUpdateChunkFilename: 'js/[name].hot-update.js?[fullhash]',
        hotUpdateMainFilename: 'js/[runtime].hot-update.json?[fullhash]',
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
        emitOnErrors: !(ENV.PROD && !ENV.DEBUG),
        splitChunks: {
            cacheGroups: {
                ...(require('./split-chunks.config').cacheGroups),
                defaultVendors: {
                    chunks: 'initial',
                    enforce: true,
                    test: /[\\/](node_modules)[\\/](.+)\.(js|mjs|cjs|ts)(\?.*)?$/,
                    name: 'vendor',
                    priority: 0,
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
                    banner: (licenseFile) => [`License information can be found in ${licenseFile}`, ENV.BANNER_STRING].join('\n'),
                },
                terserOptions: {
                    ecma: 2015,
                    safari10: true,
                    output: {
                        ecma: 2015,
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
        maxEntrypointSize: 1024 * 1024,
    } : false),

    plugins: [
        ...(ENV.WATCH ? [
            new BrowserSyncPlugin({
                ...APP.BROWSERSYNC,
            }),
        ] : []),
        new MiniCssExtractPlugin({
            filename: 'css/app.min.css',
            experimentalUseImportModule: true,
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
                algorithm: 'brotliCompress',
            }),
            new CompressionPlugin({
                test: /\.(js|css|svg|json|lottie)(\?.*)?$/i,
                exclude: ['assets-manifest.json'],
                filename: '[path][base].gz[query]',
                algorithm(input, compressionOptions, callback) {
                    const zopfli = require('@gfx/zopfli');
                    return zopfli.gzip(input, compressionOptions, callback);
                },
            }),
        ] : []),
        new webpack.BannerPlugin({
            banner: ENV.BANNER_STRING,
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
            BANNER_STRING: JSON.stringify(ENV.BANNER_STRING),
        }),
        new StyleLintPlugin({
            syntax: 'scss',
            files: '**/*.scss',
            configFile: './.stylelintrc.js',
            ignorePath: './.stylelintignore',
            lintDirtyModulesOnly: ENV.DEV_SERVER || ENV.WATCH,
            quiet: ENV.PROD || ENV.DEBUG,
            fix: APP.LINT_FIX,
        }),
        new ESLintPlugin({
            files: '**/*.js',
            overrideConfigFile: './.eslintrc.js',
            ignorePath: './.eslintignore',
            lintDirtyModulesOnly: ENV.DEV_SERVER || ENV.WATCH,
            quiet: ENV.PROD || ENV.DEBUG,
            fix: APP.LINT_FIX,
        }),
        ...(ENV.SITEMAP.map(({ template, filename }) => new HtmlWebpackPlugin({
            filename,
            template,
            inject: path.basename(template).startsWith('_') ? false : 'body',
            scriptLoading: 'blocking',
            minify: (ENV.PROD || ENV.DEBUG ? ({
                html5: true,
                collapseBooleanAttributes: true,
                collapseWhitespace: !APP.HTML_PRETTY,
                removeComments: !APP.HTML_PRETTY,
                decodeEntities: false,
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
                cache: !ENV.DEBUG,
            }),
            new FaviconsPlugin.FavIcon({
                logo: path.join(__dirname, '.favicons-source-64x64.png'),
                publicPath: APP.PUBLIC_PATH,
                outputPath: 'img/favicons/',
                prefix: 'img/favicons/',
                cache: !ENV.DEBUG,
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
                ],
                filter: (input, name) => {
                    const relativePath = slash(path.relative(__dirname, path.normalize(name)));
                    const ignores = ImageminIgnore.ignores(relativePath);
                    if (ENV.DEBUG) {
                        imageminLogger.info(`${JSON.stringify(relativePath)} ${ignores ? 'ignores' : 'minified'}`);
                    }
                    return !ignores;
                },
                minimizerOptions: { plugins: imageminConfig.plugins },
                loader: false,
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
    ],

    ...(!ENV.USE_SOURCE_MAP ? {
        devtool: 'nosources-source-map',
    } : {
        devtool: false,
    }),

    resolve: require('./resolve.config').resolve,

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
                    verbose: ENV.DEBUG || ENV.ARGV.verbose,
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
            ...(APP.USE_JQUERY ? [{
                test: /\.(js|mjs|cjs)(\?.*)?$/i,
                include: [
                    // enable jquery global
                    ...BabelOptions.includeJquery,
                ],
                exclude: [
                    // disable jquery global
                    ...BabelOptions.excludeJquery,
                ],
                loader: 'imports-loader',
                options: {
                    imports: [
                        'default jquery $',
                        'default jquery jQuery',
                    ],
                },
            }] : []),
            {
                type: 'javascript/auto',
                test: /\.(js|mjs|cjs|ts)(\?.*)?$/i,
                exclude: {
                    and: [
                        // disable babel transform
                        ...BabelOptions.excludeTransform,
                    ],
                    not: [
                        // enable babel transform
                        ...BabelOptions.includeTransform,
                    ],
                },
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    configFile: './babel.config.js',
                    envName: ENV.NODE_ENV,
                    cacheCompression: false,
                    cacheDirectory: UTILS.cacheDir('babel-loader'),
                    highlightCode: false,
                },
            },
            // file loaders
            {
                test: /\.(lottie|json|mpeg|mpg|mp3|mp4|webm|weba|wav|m4a|m4v|aac|oga|ogg|ogm|ogv|rar|zip|7z|gz)(\?.*)?$/i,
                include: [
                    path.join(ENV.SOURCE_PATH, 'upload'),
                ],
                loader: 'file-loader',
                options: { name: UTILS.resourceName('upload'), esModule: false },
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                include: [
                    path.join(ENV.SOURCE_PATH, 'upload'),
                ],
                loader: './loader.resize.js',
                options: {
                    cacheDirectory: UTILS.cacheDir('loader-resize', true),
                    name: UTILS.resourceName('upload'),
                    limit: 32 * 1024,
                    esModule: false,
                    verbose: ENV.DEBUG || ENV.ARGV.verbose,
                },
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
                options: { verbose: ENV.DEBUG || ENV.ARGV.verbose },
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                exclude: [
                    /(fonts|font)/i,
                    path.join(ENV.SOURCE_PATH, 'img/svg-sprite'),
                    path.join(ENV.SOURCE_PATH, 'upload'),
                    path.join(ENV.SOURCE_PATH, 'partials'),
                ],
                loader: './loader.resize.js',
                options: {
                    cacheDirectory: UTILS.cacheDir('loader-resize', true),
                    name: UTILS.resourceName('img'),
                    limit: 32 * 1024,
                    esModule: false,
                    verbose: ENV.DEBUG || ENV.ARGV.verbose,
                },
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
                options: { name: UTILS.resourceName('fonts'), esModule: false },
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
                            publicPath: 'auto',
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
                            webpackImporter: false,
                        },
                    },
                ],
            },
        ],
    },
};
