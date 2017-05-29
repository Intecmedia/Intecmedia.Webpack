const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

    entry: [
        "./app/app.js",
    ],

    output: {
        path: __dirname,
        filename: "./js/app.min.js",
    },

    resolve: {
        alias: {
        },
        extensions: ["*", ".js"],
    },

    plugins: [
        new ExtractTextPlugin({
            filename: "./css/app.min.css",
            allChunks: true,
        }),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
        }),
    ],

    module: {
        rules: [
            { test: /\.js/, use: "imports-loader?jQuery=jquery" },
            { test: /\.css/, loader: ExtractTextPlugin.extract({use: ["css-loader", "postcss-loader"]}) },
            { test: /\.scss/, loader: ExtractTextPlugin.extract({use: ["css-loader", "sass-loader", "postcss-loader"]}) },
            { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[ext]?v=[hash]" },
        ],
    },

};