const path = require('node:path');
const webpack = require('webpack');
const weblog = require('webpack-log');

const logger = weblog({ name: 'webpack-config' });
const imageminConfig = require('./imagemin.config');
const { SvgoCreateConfig } = require('./svgo.config');

const ENV = require('./app.env');
const APP = require('./app.config');
const UTILS = require('./webpack.utils');

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
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CompressionPlugin = ENV.PROD && !ENV.DEBUG ? require('compression-webpack-plugin') : () => {};
const TerserPlugin = ENV.PROD && !ENV.DEBUG ? require('terser-webpack-plugin') : () => {};
const SVGSpritemapPlugin = import('svg-spritemap-webpack-plugin');
const { WebpackAssetsManifest } = require('webpack-assets-manifest');

const FaviconsPlugin = APP.FAVICONS ? require('./plugin.favicons') : () => {};
const HtmlBeautifyPlugin = APP.HTML_PRETTY ? require('./plugin.html-beautify') : () => {};
const RemoveAssetsPlugin = require('./plugin.remove-assets');
const BabelOptions = require('./babel.options');

const cleanIgnore = UTILS.readIgnoreFile('./.cleanignore');

module.exports = async () => ({
    mode: ENV.PROD ? 'production' : 'development',

    stats: {
        preset: ENV.DEBUG || ENV.ARGV.verbose ? 'verbose' : 'normal',
        children: true,
    },

    target: 'browserslist',

    cache: ENV.DEBUG
        ? false
        : {
              name: 'webpack',
              type: 'filesystem',
              cacheDirectory: UTILS.cacheDir('webpack'),
              memoryCacheUnaffected: true,
              hashAlgorithm: 'xxhash64',
              buildDependencies: {
                  config: [__filename],
                  defaultWebpack: ['webpack/lib/'],
              },
          },

    infrastructureLogging: {
        level: ENV.DEBUG || ENV.ARGV.verbose ? 'verbose' : 'info',
        debug: ENV.DEBUG || ENV.ARGV.verbose,
        stream: process.stdout,
    },

    experiments: {
        topLevelAwait: true,
        backCompat: false,
    },

    watchOptions: {
        ignored: /node_modules/,
    },

    devServer: {
        allowedHosts: ['localhost', '.localhost', ...(ENV.ARGV.allowedHosts ? ENV.ARGV.allowedHosts.split(',') : [])],
        hot: false,
        port: ENV.ARGV.port || 8888,
        host: ENV.ARGV.host || '0.0.0.0',
        static: {
            directory: ENV.OUTPUT_PATH,
            publicPath: path.posix.resolve(APP.PUBLIC_PATH, '/'),
            watch: false,
        },
        client: {
            logging: 'info',
            overlay: {
                errors: true,
                warnings: false,
                runtimeErrors: true,
            },
            progress: true,
        },
        devMiddleware: {
            stats: ENV.DEBUG ? 'detailed' : 'normal',
            publicPath: path.posix.resolve(APP.PUBLIC_PATH, '/'),
            writeToDisk: true,
            serverSideRender: true,
        },
        ...require('./devserver.config'),
    },

    entry: {
        app: [
            `${ENV.SOURCE_PATH}/js/webpack-internals.js`, // this always first
            `${ENV.SOURCE_PATH}/js/polyfills.js`, // this always first
            ...(APP.SENTRY.dsn ? [`${ENV.SOURCE_PATH}/js/sentry.js`] : []),
            `${ENV.SOURCE_PATH}/css/app.scss`,
            `${ENV.SOURCE_PATH}/js/app.js`,
        ],
        /*
        example: [
            `${ENV.SOURCE_PATH}/css/example.scss`,
        ],
        */
        ...(APP.RESIZE && (ENV.PROD || ENV.DEBUG) ? { 'webpack-resize': `${ENV.SOURCE_PATH}/js/webpack-resize.js` } : {}),
    },

    output: {
        clean: {
            keep: (filepath) => {
                const relativePath = UTILS.slash(path.relative(ENV.OUTPUT_PATH, filepath));
                return cleanIgnore.ignores(relativePath);
            },
        },
        filename: 'js/[name].min.js',
        chunkFilename: 'js/[name].min.js?[chunkhash]',
        hotUpdateChunkFilename: 'js/[name].hot-update.js?[fullhash]',
        hotUpdateMainFilename: 'js/[runtime].hot-update.json?[fullhash]',
        path: ENV.OUTPUT_PATH,
        publicPath: APP.PUBLIC_PATH,
        hashFunction: 'xxhash64',
        devtoolModuleFilenameTemplate: UTILS.moduleFilenameTemplate,
        devtoolFallbackModuleFilenameTemplate: UTILS.moduleFilenameTemplate,
    },

    optimization: {
        concatenateModules: false,
        ...(!ENV.PROD || ENV.DEBUG
            ? {
                  chunkIds: 'named',
                  moduleIds: 'named',
              }
            : {}),
        splitChunks: {
            cacheGroups: {
                ...require('./split-chunks.config').cacheGroups,
                defaultVendors: {
                    chunks: 'initial',
                    enforce: true,
                    test: /[\\/](node_modules)[\\/](.+)\.(js|mjs|cjs|ts|jsx)(\?.*)?$/,
                    name: APP.SPLIT_CHUNKS
                        ? (module) => {
                              const packageName = UTILS.packageName(module.context);
                              return `vendor.${packageName.replace('@', '').replace('/', '-')}`;
                          }
                        : 'vendor',
                    minSize: 20000,
                    priority: 0,
                },
            },
        },
        minimize: ENV.PROD && !ENV.DEBUG,
        minimizer:
            ENV.PROD && !ENV.DEBUG
                ? [
                      ...(APP.IMAGEMIN
                          ? [
                                new ImageMinimizerPlugin({
                                    test: /\.(jpeg|jpg|png|gif)(\?.*)?$/i,
                                    exclude: [/@resize-/, /(\?|&)resize=/],
                                    minimizer: {
                                        implementation: imageminConfig.implementation,
                                        options: { encodeOptions: imageminConfig.encodeOptions },
                                        filter: (input, name) => !imageminConfig.testIgnore(name),
                                    },
                                }),
                                new ImageMinimizerPlugin({
                                    test: /\.(svg)(\?.*)?$/i,
                                    exclude: [/@resize-/, /(\?|&)resize=/],
                                    minimizer: {
                                        implementation: ImageMinimizerPlugin.svgoMinify,
                                        options: { encodeOptions: SvgoCreateConfig({ prefix: false, pretty: false }) },
                                        filter: (input, name) => !imageminConfig.testIgnore(name),
                                    },
                                }),
                            ]
                          : []),
                      new TerserPlugin({
                          test: /\.(js)(\?.*)?$/i,
                          parallel: true,
                          extractComments: {
                              condition: 'some',
                              filename: (fileData) => `${fileData.filename}.LICENSE`,
                              banner: (licenseFile) => [`License information can be found in ${licenseFile}`, ENV.BANNER_STRING].join('\n'),
                          },
                      }),
                  ]
                : [],
    },

    performance:
        ENV.PROD && !ENV.DEBUG
            ? {
                  assetFilter: (asset) => {
                      const [filename] = asset.split('?', 2);
                      const assetFilter = /\.(js)(\?.*)?$/;
                      const webpackFilter = /webpack-\w+\.min\.js/i;
                      return assetFilter.test(filename) && !webpackFilter.test(filename);
                  },
                  hints: 'warning',
                  maxAssetSize: Number.MAX_SAFE_INTEGER,
                  maxEntrypointSize: 1024 * 1024 * 1.5,
              }
            : false,

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
            experimentalUseImportModule: true,
        }),
        new CopyWebpackPlugin({
            patterns: ['**/.htaccess', 'img/**/*.*', 'upload/**/*.*', '*.txt'].map((from) => ({
                from,
                to: ENV.OUTPUT_PATH,
                context: ENV.SOURCE_PATH,
                globOptions: {
                    ignore: ['**/img/svg-sprite/**', '**/jsconfig.json'],
                },
                noErrorOnMissing: true,
            })),
        }),
        ...(ENV.PROD && !ENV.DEBUG
            ? [
                  new CaseSensitivePathsPlugin(),
                  new RemoveAssetsPlugin({
                      test: /webpack-\w+\.min\.js/i,
                  }),
                  ...(APP.BROTLI
                      ? [
                            new CompressionPlugin({
                                test: /\.(js|css|svg|json|lottie|gltf|glb|hdr|wasm)(\?.*)?$/i,
                                exclude: ['assets-manifest.json'],
                                filename: '[path][base].br[query]',
                                algorithm: 'brotliCompress',
                                minRatio: Number.MAX_SAFE_INTEGER,
                            }),
                        ]
                      : []),
                  ...(APP.GZIP
                      ? [
                            new CompressionPlugin({
                                test: /\.(js|css|svg|json|lottie|gltf|glb|hdr|wasm)(\?.*)?$/i,
                                exclude: ['assets-manifest.json'],
                                filename: '[path][base].gz[query]',
                                algorithm: 'gzip',
                                minRatio: Number.MAX_SAFE_INTEGER,
                            }),
                        ]
                      : []),
              ]
            : []),
        new webpack.BannerPlugin({
            banner: ENV.BANNER_STRING,
            include: /\.(css|js)(\?.*)?$/i,
        }),
        new webpack.DefinePlugin({
            DEBUG: JSON.stringify(ENV.DEBUG),
            NODE_ENV: JSON.stringify(ENV.NODE_ENV),
            VERBOSE: JSON.stringify(ENV.VERBOSE),
            PACKAGE_NAME: JSON.stringify(ENV.PACKAGE_NAME),
            ...Object.assign(
                {},
                ...Object.entries(APP).map(([k, v]) => ({
                    [`APP.${k}`]: JSON.stringify(v),
                })),
            ),
            BANNER_STRING: JSON.stringify(ENV.BANNER_STRING),
        }),
        ...(APP.STYLELINT
            ? [
                  new StyleLintPlugin({
                      cache: !ENV.DEBUG,
                      cacheLocation: UTILS.cacheDir('stylelint', ENV.PROD),
                      customSyntax: 'postcss-scss',
                      files: '**/*.scss',
                      configFile: './.stylelintrc.js',
                      ignorePath: './.stylelintignore',
                      lintDirtyModulesOnly: ENV.DEV_SERVER || ENV.WATCH,
                      quiet: ENV.PROD || ENV.DEBUG,
                      fix: APP.LINT_FIX,
                  }),
              ]
            : []),
        ...(APP.ESLINT
            ? [
                  new ESLintPlugin({
                      cache: !ENV.DEBUG,
                      cacheLocation: UTILS.cacheDir('eslint', ENV.PROD),
                      files: '**/*.js',
                      overrideConfigFile: './.eslintrc.js',
                      configType: 'flat',
                      lintDirtyModulesOnly: ENV.DEV_SERVER || ENV.WATCH,
                      quiet: ENV.PROD || ENV.DEBUG,
                      failOnError: ENV.PROD || ENV.DEBUG,
                      fix: APP.LINT_FIX,
                  }),
              ]
            : []),
        ...ENV.SITEMAP.map(
            ({ template, filename, ignored, extension }) =>
                new HtmlWebpackPlugin({
                    filename,
                    template,
                    chunks: ['app', 'vendor'],
                    inject: ignored || extension !== 'html' ? false : 'body',
                    scriptLoading: 'defer',
                    minify:
                        (ENV.PROD || ENV.DEBUG) && extension === 'html'
                            ? {
                                  html5: true,
                                  collapseBooleanAttributes: true,
                                  collapseWhitespace: !APP.HTML_PRETTY,
                                  removeComments: !APP.HTML_PRETTY,
                                  decodeEntities: false,
                                  minifyCSS: !APP.HTML_PRETTY,
                                  minifyJS: !APP.HTML_PRETTY,
                              }
                            : false,
                    hash: ENV.PROD,
                    cache: !ENV.DEBUG,
                    title: APP.TITLE,
                    excludeChunks: ['webpack-resize'],
                }),
        ),
        ...(APP.FAVICONS
            ? [
                  new FaviconsPlugin.FavIcon({
                      logo: path.join(__dirname, '.favicons-source.svg'),
                      publicPath: APP.PUBLIC_PATH,
                      outputPath: 'img/favicons/',
                      prefix: 'img/favicons/',
                      favicons: APP.FAVICONS_OPTIONS || {},
                      cache: !ENV.DEBUG,
                  }),
              ]
            : []),
        ...(APP.HTML_PRETTY
            ? [
                  new HtmlBeautifyPlugin({
                      ...UTILS.readJsonFile('./.jsbeautifyrc'),
                  }),
              ]
            : []),
        new ((await SVGSpritemapPlugin).default)(['source/img/svg-sprite/*.svg'], {
            output: {
                filename: 'img/svg-sprite.svg',
                svg4everybody: false,
                svgo: false,
            },
            sprite: {
                gutter: 5,
                prefix: 'icon-',
                generate: { title: false, use: true },
            },
        }),
        ...(ENV.PROD || ENV.DEBUG
            ? [
                  new BundleAnalyzerPlugin({
                      analyzerMode: ENV.DEV_SERVER ? 'server' : 'static',
                      openAnalyzer: ENV.DEV_SERVER,
                      reportFilename: path.join(UTILS.cacheDir('bundle-analyzer'), 'bundle-analyzer.html'),
                  }),
              ]
            : []),
        ...(ENV.SOURCE_MAP
            ? [
                  new webpack.SourceMapDevToolPlugin({
                      test: /\.(js|mjs|cjs|ts|jsx|css|scss)(\?.*)?$/i,
                      moduleFilenameTemplate: UTILS.moduleFilenameTemplate,
                      fallbackModuleFilenameTemplate: UTILS.moduleFilenameTemplate,
                  }),
              ]
            : []),
        new WebpackAssetsManifest({
            entrypoints: true,
            entrypointsKey: 'entrypoints',
            entrypointsUseAssets: true,
            writeToDisk: true,
            output: 'assets-manifest.json',
            customize: (entry) => (!entry.key.match(/\.(js|css)$/) ? false : entry),
            replacer: (key, value) => (key.match(/webpack-\w+/i) ? undefined : value),
            transform: (assets) => ({ publicPath: APP.PUBLIC_PATH, entrypoints: assets.entrypoints }),
            space: 4,
            publicPath: true,
            integrity: true,
            integrityHashes: ['sha256'],
        }),
    ],

    ...(!ENV.SOURCE_MAP
        ? {
              devtool: 'nosources-source-map',
          }
        : {
              devtool: false,
          }),

    resolve: require('./resolve.config').resolve,

    module: {
        rules: [
            // html loaders
            {
                test: /\.(html|njk)(\?.*)?$/i,
                loader: './loader.html.js',
                exclude: [path.join(ENV.SOURCE_PATH, 'upload')],
                options: {
                    context: { ...APP, ENV },
                    searchPath: ENV.SOURCE_PATH,
                    verbose: ENV.DEBUG || ENV.ARGV.verbose,
                },
            },
            // javascript loaders
            {
                type: 'javascript/auto',
                test: /\.(js|mjs|cjs|ts|jsx)(\?.*)?$/i,
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
                test: /\.(lottie|gltf|glb|hdr|json|mpeg|mpg|mp3|mp4|webm|weba|wav|m4a|m4v|aac|oga|ogg|ogm|ogv|rar|zip|7z|gz)(\?.*)?$/i,
                include: [path.join(ENV.SOURCE_PATH, 'upload')],
                loader: 'file-loader',
                options: { name: UTILS.resourceName('upload'), esModule: false },
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)(\?.*)?$/i,
                include: [path.join(ENV.SOURCE_PATH, 'upload')],
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
                include: [path.join(ENV.SOURCE_PATH, 'partials')],
                exclude: [/(fonts|font)/i, path.join(ENV.SOURCE_PATH, 'img/svg-sprite'), path.join(ENV.SOURCE_PATH, 'upload')],
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
                include: [/(fonts|font)/i],
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
                exclude: [path.join(ENV.SOURCE_PATH, 'upload')],
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
                            importLoaders: APP.RESOLVE_URL ? 3 : 2,
                            sourceMap: true,
                            import: {
                                filter(url) {
                                    if (url.endsWith('.css') && !(url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'))) {
                                        this.loaderContext.emitError(
                                            [`Unexpected file extension in @import ${JSON.stringify(url)};.`, `Please import without file extension.`].join(
                                                ' ',
                                            ),
                                        );
                                        return false;
                                    }
                                    return true;
                                },
                            },
                        },
                    },
                    ...(APP.RESOLVE_URL
                        ? [
                              {
                                  loader: 'resolve-url-loader',
                                  options: {
                                      sourceMap: true,
                                  },
                              },
                          ]
                        : []),
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
                            api: 'modern-compiler',
                            additionalData: UTILS.toScssVars({
                                DEBUG: ENV.DEBUG,
                                NODE_ENV: ENV.NODE_ENV,
                                PACKAGE_NAME: ENV.PACKAGE_NAME,
                                ...Object.assign(
                                    {},
                                    ...Object.entries({ ...APP, ENV: {} }).map(([k, v]) => ({
                                        [`APP-${k}`]: v,
                                    })),
                                ),
                            }),
                            sourceMap: true,
                            implementation: require('sass-embedded'),
                            sassOptions: {
                                charset: true,
                                style: 'expanded',
                                verbose: ENV.DEBUG || ENV.ARGV.verbose,
                                quietDeps: true,
                                silenceDeprecations: ['mixed-decls'],
                                loadPaths: [__dirname],
                                ...(ENV.DEBUG
                                    ? {}
                                    : {
                                          logger: {
                                              warn: () => {}, // force silence deprecations
                                          },
                                      }),
                            },
                            webpackImporter: false,
                        },
                    },
                ],
            },
        ],
    },
});
