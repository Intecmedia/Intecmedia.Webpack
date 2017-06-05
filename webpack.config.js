const util = require("util");
const path = require("path");

const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PROD = process.argv.indexOf("-p") !== -1;

console.log("Config enviroment: " + (PROD ? "production" : "development"));

const extractCSS = new ExtractTextPlugin("./assets/app.min.css");

const banner = new String;
banner.toString = () => {
    return util.format("Generated by Intecmedia.Webpack: %s | %s | [hash]", new Date().toISOString(), PROD ? "production" : "development");
};

module.exports = {

    entry: [
        "./app/app.js",
    ],

    output: {
        path: __dirname,
        filename: "./assets/app.min.js",
    },

    plugins: (PROD ? [
        // prod-only
        new webpack.optimize.UglifyJsPlugin({
            banner: banner,
            beautify: false,
            comments: false,
        }),
    ] : [
        // dev-only
    ]).concat([
        // dev-and-prod
        new webpack.BannerPlugin({
            banner: banner,
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": (PROD ? "production" : "development"),
            }
        }),
        extractCSS,
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.$": "jquery",
            "window.jQuery": "jquery",
        }),
    ]),

    devtool: (PROD ? "" : "inline-source-map"),

    resolve: {
        alias: {
            "bootstrap": "bootstrap-sass/assets/javascripts/bootstrap",
        }
    },

    module: {
        rules: [
            // javascript loaders
            { test: /\.js/, use: "imports-loader?jQuery=jquery" },
            // image loaders
            { test: /\.(jpe?g|png|gif|svg)$/i, exclude: /fonts/, loaders: [
                "url-loader?limit=" + (32 * 1024), // IE8 cannot handle a data-uri larger than 32KB
                "file-loader?name=assets/img/[name].[ext]?v=[hash]",
                "image-webpack-loader",
            ] },
            // font loaders
            { test: /\.(eot|woff|woff2|ttf|svg)(\?v=.+)?$/, loaders: [
                "file-loader?prefix=font/&name=assets/fonts/[name].[ext]?v=[hash]",
            ] },
            // css loaders
            { test: /\.(css|scss)/, loader: extractCSS.extract({
                fallback: [
                    { loader: "style-loader", options: {
                        sourceMap: !PROD,
                    }  },
                ],
                use: [
                    { loader: "css-loader", options: {
                        importLoaders: true,
                        sourceMap: !PROD,
                    } },
                    { loader: "sass-loader", options: {
                        data: "$NODE_ENV: " + (PROD ? "production" : "development") + ";",
                        indentWidth: 4,
                        includePaths: [ path.resolve("./node_modules/bootstrap-sass/assets/stylesheets") ],
                        sourceMapEmbed: !PROD,
                        sourceMapContents: !PROD,
                    } },
                    { loader: "postcss-loader", options: {
                        sourceMap: !PROD,
                        plugins: [
                            require("postcss-cssnext")({
                                warnForDuplicates: false,
                            }),
                            require("css-mqpacker")({
                                sort: true,
                            }),
                            require("cssnano")({
                                discardComments: {removeAll: true},
                            }),
                        ]
                    } },
                ],
            }) },
        ],
    },

};