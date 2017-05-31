const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PROD = process.argv.indexOf("-p") !== -1;

console.log("Config enviroment: " + (PROD ? "production" : "development"));

const extractCSS = new ExtractTextPlugin("./css/app.min.css");

module.exports = {

    entry: [
        "./app/app.js",
    ],

    output: {
        path: __dirname,
        filename: "./js/app.min.js",
    },

    plugins: (PROD ? [
        // prod-only
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
        }),
    ] : [
        // dev-only
    ]).concat([
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": (PROD ? "production" : "development"),
            }
        }),
        extractCSS,
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
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
            { test: /\.js/, use: "imports-loader?jQuery=jquery" },
            { test: /\.(css|scss)/, loader: extractCSS.extract([
                { loader: "css-loader", options: { importLoaders: true, sourceMap: !PROD } },
                { loader: "sass-loader", options: {
                    indentWidth: 4,
                    sourceMapEmbed: !PROD,
                    sourceMapContents: !PROD,
                    data: "$ENV: " + (PROD ? "production" : "development") + ";",
                } },
                { loader: "postcss-loader", options: {
                    sourceMap: (PROD ? false : "inline"),
                } },
            ]) },
            { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[ext]?v=[hash]" },
        ],
    },

};