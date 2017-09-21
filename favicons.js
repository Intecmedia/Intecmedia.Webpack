const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const DEFAULT_FAVICON = {
    logo: './.favicons-source-32x32.png',
    prefix: 'img/favicon/',
    icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
    },
};

module.exports.FavIcon = function FavIcon(options) {
    return new FaviconsWebpackPlugin(Object.assign({}, DEFAULT_FAVICON, options));
};

const DEFAULT_APPICON = {
    logo: './.favicons-source-32x32.png',
    prefix: 'img/favicon/',
    icons: {
        android: true,
        appleIcon: true,
        appleStartup: false,
        coast: false,
        favicons: false,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
    },
};

module.exports.AppIcon = function AppIcon(options) {
    return new FaviconsWebpackPlugin(Object.assign({}, DEFAULT_APPICON, options));
};
