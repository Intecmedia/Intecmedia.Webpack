/* eslint global-require: "off" */
const glob = require('glob');
const path = require('path');
const slash = require('slash');
const webpack = require('webpack');

const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const PROD = ('NODE_ENV' in process.env && process.env.NODE_ENV === 'production') || process.argv.indexOf('-p') !== -1;
const NODE_ENV = PROD ? 'production' : 'development';

const USE_SOURCE_MAP = DEBUG && !PROD;
const USE_LINTERS = PROD || DEBUG;

const OUTPUT_PATH = path.resolve(__dirname, 'build');

console.log(`Output: ${OUTPUT_PATH}`);
console.log(`Enviroment: ${NODE_ENV}`);
console.log(`Debug: ${DEBUG ? 'enabled' : 'disabled'}`);
console.log(`Linters: ${USE_LINTERS ? 'enabled' : 'disabled'}`);
console.log(`Source maps: ${USE_SOURCE_MAP ? 'enabled' : 'disabled'}`);

if (PROD && DEBUG) {
    throw new Error(`Dont use NODE_ENV=${NODE_ENV} and DEBUG=${DEBUG} together`);
}

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = (USE_LINTERS ? require('stylelint-webpack-plugin') : () => {});
const WebpackNotifierPlugin = require('webpack-notifier');

const banner = new String(''); // eslint-disable-line no-new-wrappers
banner.toString = () => `${new Date().toISOString()} | NODE_ENV=${NODE_ENV} | DEBUG=${DEBUG} | chunkhash=[chunkhash]`;

const browserslist = require('./package.json').browserslist;

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
        overlay: true,
        compress: false,
    },

    entry: {
        vendor: [
            'jquery',
            'babel-polyfill',
            './source/js/vendor.js',
        ],
        app: './source/js/app.js',
    },

    output: {
        path: OUTPUT_PATH,
        filename: 'js/app.min.js',
    },

    performance: {
        hints: PROD && !DEBUG ? 'error' : false,
        maxAssetSize: 512 * 1024,
        maxEntrypointSize: 512 * 1024,
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.min.js',
        }),
        new ExtractTextPlugin({
            filename: 'css/app.min.css',
            allChunks: true,
        }),
        new webpack.BannerPlugin({
            banner,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new webpack.DefinePlugin({
            DEBUG: JSON.stringify(DEBUG),
            NODE_ENV: JSON.stringify(NODE_ENV),
        }),
        new WebpackNotifierPlugin({
            alwaysNotify: true,
            contentImage: path.resolve('./source/img/ico/apple-touch-icon.png'),
            title: 'Webpack',
        }),
        ...(USE_LINTERS ? [new StyleLintPlugin({
            configFile: '.stylelintrc',
            files: ['**/*.scss'],
            fix: !DEV_SERVER,
            syntax: 'scss',
        })] : []),
        ...(glob.sync('./source/*.html').map(template => new HtmlWebpackPlugin({
            filename: path.basename(template),
            template,
            inject: false,
            minify: false,
            title: 'Intecmedia.Webpack',
            DEBUG: JSON.stringify(DEBUG),
            NODE_ENV: JSON.stringify(NODE_ENV),
        }))),
    ],

    devtool: USE_SOURCE_MAP ? 'eval-source-map' : '',

    resolve: {
        alias: {
            modernizr$: path.resolve(__dirname, '.modernizrrc'),
        },
    },
    resolveLoader: {
        alias: {
            'imagemin-loader': path.resolve(__dirname, 'imagemin-loader.js'),
            'cssurl-loader': path.resolve(__dirname, 'cssurl-loader.js'),
        },
    },

    module: {
        rules: [
            // html loaders
            {
                test: /\.html$/i,
                loader: 'handlebars-loader',
                options: {
                    inlineRequires: '/img/',
                },
            },
            // javascript loaders
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
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['airbnb', {
                                debug: DEBUG || PROD,
                                targets: {
                                    browsers: browserslist,
                                },
                            }]],
                            forceEnv: NODE_ENV,
                            cacheDirectory: !PROD,
                        },
                    },
                    ...(USE_LINTERS ? [{
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                            cache: !PROD,
                        },
                    }] : []),
                ],
            },
            // image loaders
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                exclude: /(fonts|font)/i,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: resourceName('img', false),
                        },
                    },
                    ...(PROD || DEBUG ? [{
                        loader: 'imagemin-loader',
                    }] : []),
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
                test: /\.s?css$/i,
                loaders: (DEBUG || DEV_SERVER ? ['css-hot-loader'] : []).concat(ExtractTextPlugin.extract({
                    publicPath: '../',
                    fallback: [
                        {
                            loader: 'style-loader',
                            options: {
                                sourceMap: USE_SOURCE_MAP,
                            },
                        },
                    ],
                    use: [
                        ...(PROD || DEBUG ? [{
                            loader: 'cssurl-loader',
                            options: {
                                test: /\.(jpe?g|png|gif|svg)$/i,
                                exclude: /(fonts|font)/i,
                                limit: 32 * 1024,
                                name: resourceName('img', false),
                            },
                        }] : []),
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: USE_SOURCE_MAP,
                                minimize: (PROD ? {
                                    discardComments: {
                                        removeAll: true,
                                    },
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
                                        require('css-mqpacker')(),
                                        require('autoprefixer')(), // this always last
                                    ] : []),
                                    require('postcss-reporter')(), // this always last
                                ],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                data: `$NODE_ENV: '${NODE_ENV}';\n$DEBUG: ${DEBUG ? 'true' : false};\n`,
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
