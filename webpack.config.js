var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./js/app.js",
    output: {
        path: __dirname,
        filename: "./js/app.bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
            { test: /\.less$/, loader: ExtractTextPlugin.extract("css-loader!less-loader") },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[hash].[ext]" },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[hash].[ext]" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[hash].[ext]" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[hash].[ext]" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?prefix=font/&name=fonts/[name].[hash].[ext]" }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/style.css",
            allChunks: true
        })
    ]
};
