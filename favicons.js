const ImageSize = require('image-size');
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
    const mergedOptions = Object.assign({}, DEFAULT_FAVICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type == 'png')) {
        throw new Error('FavIcon \'' + mergedOptions.logo + '\': the file is not a valid image');
    }
    if (!(logoSize.width == 32 && logoSize.height == 32)) {
        throw new Error('FavIcon \'' + mergedOptions.logo + '\': image size is not than (32 x 32)');
    }
    return new FaviconsWebpackPlugin(mergedOptions);
};

const DEFAULT_APPICON = {
    logo: './.favicons-source-512x512.png',
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
    const mergedOptions = Object.assign({}, DEFAULT_APPICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type == 'png')) {
        throw new Error('AppIcon \'' + mergedOptions.logo + '\': the file is not a valid image');
    }
    if (!(logoSize.width == 512 && logoSize.height == 512)) {
        throw new Error('AppIcon \'' + mergedOptions.logo + '\': image size is not than (512 x 512)');
    }
    return new FaviconsWebpackPlugin(mergedOptions);
};
