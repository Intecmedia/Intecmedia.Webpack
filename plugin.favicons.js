const fs = require('node:fs');
const deepMerge = require('lodash.merge');
const ImageSize = require('image-size');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const APP = require('./app.config');

const DEFAULT_OPTIONS = {
    mode: 'webapp',
    devMode: 'webapp',
    logo: './.favicons-source.svg',
    publicPath: '/',
    outputPath: 'img/favicons/',
    prefix: 'img/favicons/',
    favicons: {
        lang: APP.LANGUAGE,
        appShortName: APP.SHORT_NAME,
        appDescription: APP.DESCRIPTION,
        start_url: APP.START_URL,
        background: APP.BACKGROUND_COLOR,
        theme_color: APP.THEME_COLOR,
        manifestRelativePaths: true,
        icons: {
            favicons: ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png', 'favicon.ico', 'favicon.svg'],
            appleStartup: false,
            windows: false,
            yandex: false,
        },
        files: {
            android: { manifestFileName: 'manifest.json' },
        },
    },
};

module.exports.FavIcon = function FavIcon(options) {
    const mergedOptions = deepMerge({}, DEFAULT_OPTIONS, options);
    const logoSize = ImageSize.imageSize(fs.readFileSync(mergedOptions.logo));
    if (!(logoSize && logoSize.type === 'svg')) {
        throw new Error(`FavIcon '${mergedOptions.logo}': the file is not a valid image (allowed only svg).`);
    }
    if (!(logoSize.width === 64 && logoSize.height === 64)) {
        throw new Error(`FavIcon '${mergedOptions.logo}': image size (${logoSize.width}x${logoSize.height}) is not than (64x64).`);
    }

    return new FaviconsWebpackPlugin(mergedOptions);
};
