const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PROD = process.argv.indexOf("-p") !== -1;

console.log("Config enviroment: " + (PROD ? "production" : "development"));

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
                "NODE_ENV": JSON.stringify(PROD ? "production" : "development"),
            }
        }),
        new ExtractTextPlugin({
            filename: "./css/app.min.css",
            allChunks: true,
        }),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
        }),
    ]),

    devtool: (PROD ? "" : "inline-source-map"),

    module: {
        rules: [
            { test: /\.js/, use: "imports-loader?jQuery=jquery" },
            { test: /\.css/, loader: ExtractTextPlugin.extract({ use: ["css-loader", "postcss-loader"] }) },
            { test: /\.scss/, loader: ExtractTextPlugin.extract({ use: ["css-loader", "sass-loader", "postcss-loader"] }) },
            { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[ext]?v=[hash]" },
        ],
    },

};