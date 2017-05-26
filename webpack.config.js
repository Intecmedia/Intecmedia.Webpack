const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const outup = "./public"

module.exports = {

    entry: [
        "bootstrap-loader/extractStyles",
        "./app/app.js",
    ],

    output: {
        path: __dirname,
        filename: "./js/app.min.js",
    },

    resolve: { extensions: ["*", ".js"] },

    plugins: [
        new ExtractTextPlugin({
            filename: "./css/app.min.css",
            allChunks: true,
        }),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
        }),
        new webpack.LoaderOptionsPlugin({
            postcss: [autoprefixer],
        }),
    ],

    module: {
        rules: [
            { test: /\.css$/, use: ExtractTextPlugin.extract({
                fallback: "style-loader", use: "css-loader!postcss-loader",
            }) },
            { test: /\.scss$/, use: ExtractTextPlugin.extract({
                fallback: "style-loader", use: "css-loader!postcss-loader!sass-loader",
            }) },
            { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[ext]?v=[hash]" },
            { test: /bootstrap-sass\/assets\/javascripts\//, use: "imports-loader?jQuery=jquery" },
        ],
    },

};