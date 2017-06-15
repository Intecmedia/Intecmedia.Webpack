/* eslint global-require: "off" */
const glob = require('glob');
const path = require('path');
const slash = require('slash');
const webpack = require('webpack');

const DEBUG = 'DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0;
const PROD = process.argv.indexOf('-p') !== -1;
const NODE_ENV = PROD ? 'production' : 'development';
const USE_SOURCE_MAP = DEBUG && !PROD;
const USE_LINTERS = DEBUG;

const BUILD_DIR = path.resolve(__dirname, 'build');

console.log(`Output dir: ${BUILD_DIR}`);
console.log(`Enviroment: ${NODE_ENV}`);
console.log(`Debug: ${DEBUG ? 'enabled' : 'disabled'}`);
console.log(`Linters: ${USE_LINTERS ? 'enabled' : 'disabled'}`);
console.log(`Source maps: ${USE_SOURCE_MAP ? 'enabled' : 'disabled'}`);
console.log('---\nWebpack running...');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const banner = new String(''); // eslint-disable-line no-new-wrappers
banner.toString = () => {
    return `Generated by Intecmedia.Webpack: ${new Date().toISOString()} | ${NODE_ENV} | [file]?v=[chunkhash]`;
};


const resourceUrl = (prefix) => {
    prefix = path.basename(prefix) + '/';
    return (resourcePath) => {
        let modulename = '';
        let url = slash(path.relative(path.join(__dirname, 'source'), resourcePath));
        if (url.indexOf(prefix) === 0) {
            return url + '?[hash]';
        } else if (url.indexOf('../node_modules/') === 0) {
            modulename = url.split('/', 3)[2];
        }
        return slash(path.join(prefix, modulename, '[name].[ext]?[hash]'));
    };
};

module.exports = {

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
        path: BUILD_DIR,
        filename: 'js/app.min.js',
    },

    performance: {
        hints: PROD && !DEBUG ? 'error' : false,
        maxAssetSize: 512 * 1024,
        maxEntrypointSize: 512 * 1024,
    },

    plugins: [
        // dev-and-prod
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.min.js',
        }),
        new ExtractTextPlugin({
            filename: 'css/app.min.css',
        }),
        new webpack.BannerPlugin({
            banner: banner,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'underscore',
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(NODE_ENV),
        }),
    ].concat(glob.sync('./source/*.html').map((template) => {
        return new HtmlWebpackPlugin({
            filename: path.basename(template),
            template: template,
            inject: false,
            minify: false,
        });
    })).concat(USE_LINTERS ? [
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
    resolveLoader: {
        alias: {
            'intecmedia-imagemin-loader': path.resolve(__dirname, 'imagemin.loader.js'),
            'intecmedia-cssurl-loader': path.resolve(__dirname, 'cssurl.loader.js'),
        },
    },

    module: {
        rules: [
            // html loaders
            {
                test: /\.html$/,
                loader: 'underscore-template-loader',
                options: {
                    attributes: ['img:src'],
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
                exclude: /(fonts|font)/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: resourceUrl('img'),
                        },
                    },
                    {
                        loader: 'intecmedia-imagemin-loader',
                    },
                ],
            },
            // font loaders
            {
                test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/,
                exclude: /(img|images)/,
                loader: 'file-loader',
                options: {
                    name: resourceUrl('fonts'),
                },
            },
            // css loaders
            {
                test: /\.s?css$/,
                loaders: (PROD ? [] : ['css-hot-loader']).concat(ExtractTextPlugin.extract({
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
                        {
                            loader: 'intecmedia-cssurl-loader',
                            options: {
                                test: /\.(jpe?g|png|gif|svg)$/i,
                                exclude: /fonts/,
                                limit: 32 * 1024,
                                name: resourceUrl('img'),
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2, // Number of loaders applied before CSS loader
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
                                    require('postcss-cssnext')(),
                                    require('css-mqpacker')(),
                                ],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                data: `$NODE_ENV: ${NODE_ENV};`,
                                indentWidth: 4,
                                sourceMap: USE_SOURCE_MAP ? 'inline' : false,
                                sourceMapEmbed: USE_SOURCE_MAP,
                                sourceComments: USE_SOURCE_MAP,
                            },
                        },
                    ],
                })),
            },
        ],
    },

};
