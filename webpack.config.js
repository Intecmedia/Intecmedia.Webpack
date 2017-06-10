/* eslint global-require: "off" */
const path = require('path');
const webpack = require('webpack');

const DEBUG = 'DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0;
const PROD = process.argv.indexOf('-p') !== -1;
const NODE_ENV = PROD ? 'production' : 'development';
const USE_SOURCE_MAP = DEBUG;
const USE_LINTERS = DEBUG;

const BUILD_DIR = path.resolve(__dirname, 'build');

console.log(`Build dir: ${BUILD_DIR}`);
console.log(`Enviroment: ${NODE_ENV}`);
console.log(`Debug: ${DEBUG ? 'enabled' : 'disabled'}`);
console.log(`Linters: ${USE_LINTERS ? 'enabled' : 'disabled'}`);
console.log(`Source maps: ${USE_SOURCE_MAP ? 'enabled' : 'disabled'}`);
console.log('---\nWebpack running...');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const banner = new String(''); // eslint-disable-line no-new-wrappers
banner.toString = () => {
    return `Generated by Intecmedia.Webpack: ${new Date().toISOString()} | ${NODE_ENV} | [file]?v=[chunkhash]`;
};

const htmlOptions = {
    inject: false,
    minify: false,
};

module.exports = {

    entry: {
        vendor: [
            'jquery',
            'modernizr',
            './source/js/vendor.js',
        ],
        app: './source/js/app.js',
    },

    output: {
        path: BUILD_DIR,
        filename: 'js/app.min.js',
    },

    performance: {
        hints: PROD && !DEBUG ? 'error' : false,
        maxAssetSize: 512 * 1024,
        maxEntrypointSize: 256 * 1024,
    },

    plugins: (PROD ? [
        // prod-only
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify('production'),
            'process.env': {
                NODE_ENV: 'production',
                DEBUG: false,
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            banner,
            beautify: false,
            comments: false,
        }),
        new CleanWebpackPlugin(['*.html', 'js/*.js', 'css/*.css', 'img/*', 'fonts/*'], {
            root: BUILD_DIR,
            verbose: true,
            exclude: ['.gitkeep'],
        }),
    ] : [
        // dev-only
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify('development'),
            'process.env': {
                NODE_ENV: 'development',
                DEBUG: true,
            },
        }),
    ]).concat([
        // dev-and-prod
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.min.js',
        }),
        new ExtractTextPlugin({
            filename: 'css/app.min.css',
        }),
        new webpack.BannerPlugin({
            banner,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new HtmlWebpackPlugin(Object.assign(htmlOptions, {
            filename: 'index.html',
            template: './source/index.html',
        })),
    ]).concat(USE_LINTERS ? [
        new StyleLintPlugin({
            fix: true,
            files: ['**/*.scss'],
            syntax: 'scss',
        }),
    ] : []),

    devtool: USE_SOURCE_MAP ? 'eval-source-map' : '',

    resolve: {
        alias: {
            modernizr: path.resolve(__dirname, '.modernizrrc'),
        },
    },

    module: {
        rules: [
            // html loaders
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    interpolate: true,
                    minimize: false,
                    removeComments: false,
                    collapseWhitespace: false,
                    attrs: ['img:src', 'img:srcset', 'source:srcset'],
                },
            },
            // javascript loaders
            {
                test: /\.modernizrrc$/,
                loader: 'modernizr-loader!json-loader',
            },
            {
                test: /\.js$/,
                include: /node_modules/,
                loader: 'imports-loader',
                options: {
                    $: 'jquery',
                    jQuery: 'jquery',
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env'],
                            forceEnv: NODE_ENV,
                            cacheDirectory: !PROD,
                        },
                    },
                ].concat(USE_LINTERS ? [
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                            cache: !PROD,
                        },
                    },
                ] : []),
            },
            // image loaders
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /fonts/,
                loaders: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 32 * 1024,
                            useRelativePath: true,
                            name: '[name].[ext]?[hash]',
                            outputPath: 'img/',
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                quality: undefined,
                            },
                            bypassOnDebug: false,
                        },
                    },
                ],
            },
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]?[hash]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
            // css loaders
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: [
                        {
                            loader: 'style-loader',
                            options: {
                                sourceMap: USE_SOURCE_MAP,
                            },
                        },
                    ],
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2, // index of 'sass-loader'
                                sourceMap: USE_SOURCE_MAP,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                                plugins: [
                                    // dev-and-prod
                                    require('postcss-cssnext')({
                                        features: {},
                                    }),
                                ].concat(PROD ? [
                                    // prod-only
                                    require('css-mqpacker')({
                                        sort: true,
                                    }),
                                    require('cssnano')({
                                        autoprefixer: false,
                                        discardComments: {
                                            removeAll: true,
                                        },
                                    }),
                                ] : [
                                    // dev-only
                                ]),
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                data: `$NODE_ENV: ${NODE_ENV};`,
                                indentWidth: 4,
                                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                                sourceMapEmbed: USE_SOURCE_MAP,
                                sourceMapContents: USE_SOURCE_MAP,
                                sourceMapRoot: '..',
                                sourceComments: USE_SOURCE_MAP,
                            },
                        },
                    ],
                }),
            },
        ],
    },

};
