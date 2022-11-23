const deepMerge = require('lodash.merge');
const ImageSize = require('image-size');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPluginOriginal = require('favicons-webpack-plugin');

const APP = require('./app.config');

const ICO_PATTERN = /<link rel="shortcut icon" href="[^"]+favicon.ico">/;

class FaviconsWebpackPlugin extends FaviconsWebpackPluginOriginal {
    apply(compiler) {
        super.apply(compiler);

        compiler.hooks.compilation.tap('FaviconsWebpackPlugin', (compilation) =>
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap('FaviconsWebpackPlugin', (htmlPluginData) => {
                htmlPluginData.html = htmlPluginData.html.replace(ICO_PATTERN, '');
            })
        );
    }
}

// https://github.com/jantimon/favicons-webpack-plugin/issues/46
const fixWebpackConfig = (obj) =>
    Object.fromEntries(
        Object.entries(obj).map(([k, v]) => {
            if (typeof v === 'string') {
                return [k, v.replace('!', 'ǃ')];
            }
            if (typeof v === 'object') {
                return [k, fixWebpackConfig(v)];
            }
            return [k, v];
        })
    );

const DEFAULT_FAVICON = {
    mode: 'webapp',
    devMode: 'webapp',
    logo: './.favicons-source-64x64.png',
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
    manifest: false,
};

module.exports.FavIcon = function FavIcon(options) {
    const mergedOptions = deepMerge({}, DEFAULT_FAVICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type === 'png')) {
        throw new Error(`FavIcon '${mergedOptions.logo}': the file is not a valid image (allowed only png).`);
    } else if (!(logoSize.width === 64 && logoSize.height === 64)) {
        throw new Error(
            `FavIcon '${mergedOptions.logo}': image size (${logoSize.width}x${logoSize.height}) is not than (64x64).`
        );
    }
    return new FaviconsWebpackPlugin(fixWebpackConfig(mergedOptions));
};

const DEFAULT_APPICON = {
    mode: 'webapp',
    devMode: 'webapp',
    logo: './.favicons-source-1024x1024.png',
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
        files: {
            android: { manifestFileName: 'manifest.json' },
        },
    },
};

module.exports.AppIcon = function AppIcon(options) {
    const mergedOptions = deepMerge({}, DEFAULT_APPICON, options);
    const logoSize = ImageSize(mergedOptions.logo);
    if (!(logoSize && logoSize.type === 'png')) {
        throw new Error(`AppIcon '${mergedOptions.logo}': the file is not a valid image (allowed only png).`);
    } else if (!(logoSize.width === 1024 && logoSize.height === 1024)) {
        throw new Error(
            `AppIcon '${mergedOptions.logo}': image size (${logoSize.width}x${logoSize.height}) is not than (1024x1024).`
        );
    }
    return new FaviconsWebpackPluginOriginal(fixWebpackConfig(mergedOptions));
};
