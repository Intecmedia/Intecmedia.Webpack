/* eslint-env node */
/* eslint "compat/compat": "off" */

const deepMerge = require('lodash.merge');
const ImageSize = require('image-size');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const APP = require('./app.config.js');

const DEFAULT_FAVICON = {
    mode: 'webapp',
    devMode: 'webapp',
    logo: './.favicons-source-64x64.png',
    publicPath: '/',
    outputPath: 'img/favicons',
    prefix: 'img/favicons',
    appName: APP.TITLE,
    appDescription: APP.DESCRIPTION,
    background: APP.BACKGROUND_COLOR,
    theme_color: APP.THEME_COLOR,
    favicons: {
        lang: APP.LANGUAGE,
        appShortName: APP.SHORT_NAME,
        appDescription: APP.DESCRIPTION,
        start_url: APP.START_URL,
        background: APP.BACKGROUND_COLOR,
        theme_color: APP.THEME_COLOR,
        manifestRelativePaths: true,
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
    },
};

module.exports.FavIcon = function FavIcon(options) {
    const mergedOptions = deepMerge({}, DEFAULT_FAVICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type === 'png')) {
        throw new Error(`FavIcon '${mergedOptions.logo}': the file is not a valid image`);
    } else if (!(logoSize.width === 64 && logoSize.height === 64)) {
        throw new Error(`FavIcon '${mergedOptions.logo}': image size is not than (64 x 64)`);
    }
    return new FaviconsWebpackPlugin(mergedOptions);
};

const DEFAULT_APPICON = {
    mode: 'webapp',
    devMode: 'webapp',
    logo: './.favicons-source-1024x1024.png',
    publicPath: '/',
    outputPath: 'img/favicons',
    prefix: 'img/favicons',
    appName: APP.TITLE,
    appDescription: APP.DESCRIPTION,
    background: APP.BACKGROUND_COLOR,
    theme_color: APP.THEME_COLOR,
    favicons: {
        lang: APP.LANGUAGE,
        appShortName: APP.SHORT_NAME,
        appDescription: APP.DESCRIPTION,
        start_url: APP.START_URL,
        background: APP.BACKGROUND_COLOR,
        theme_color: APP.THEME_COLOR,
        manifestRelativePaths: true,
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
            windows: true,
        },
    },
};

module.exports.AppIcon = function AppIcon(options) {
    const mergedOptions = deepMerge({}, DEFAULT_APPICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type === 'png')) {
        throw new Error(`AppIcon '${mergedOptions.logo}': the file is not a valid image`);
    } else if (!(logoSize.width === 1024 && logoSize.height === 1024)) {
        throw new Error(`AppIcon '${mergedOptions.logo}': image size is not than (1024 x 1024)`);
    }
    return new FaviconsWebpackPlugin(mergedOptions);
};
