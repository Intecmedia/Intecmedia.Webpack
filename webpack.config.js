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

    devtool: (PROD ? "" : "source-map"),

    resolve: {
        alias: {
            "bootstrap": "bootstrap-sass/assets/javascripts/bootstrap",
        }
    },

    module: {
        rules: [
            { test: /\.js/, use: "imports-loader?jQuery=jquery" },
            { test: /\.css/, loader: extractCSS.extract([
                "css-loader?importLoaders=1",
                "postcss-loader",
            ]) },
            { test: /\.scss/, loader: extractCSS.extract([
                "css-loader?sourceMap=" + (PROD ? 1 : 0),
                "sass-loader?" + JSON.stringify({
                    "indentWidth": 4,
                    "data": "$ENV: " + (PROD ? "production" : "development") + ";",
                }),
                "postcss-loader",
            ]) },
            { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[ext]?v=[hash]" },
        ],
    },

};