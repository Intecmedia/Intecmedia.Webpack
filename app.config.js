/* eslint-env node -- webpack is node env */
/* eslint max-len: "off" -- webpack is node env */

const ENV = require('./app.env');
const BROWSERSYNC = require('./browsersync.config');
const IMAGEMIN = require('./imagemin.config');

module.exports = {
    TITLE: '$APP.TITLE$',
    SHORT_NAME: '$APP.SHORT_NAME$',
    DESCRIPTION: '$APP.DESCRIPTION$',
    PUBLIC_PATH: '/', // for relative use './'
    USE_FAVICONS: true,
    LANGUAGE: 'ru',
    START_URL: '/?utm_source=app_manifest',
    THEME_COLOR: '#fff',
    BACKGROUND_COLOR: '#fff',
    HTML_PRETTY: true,
    SENTRY: {
        dsn: '',
        ignoreErrors: [],
        blacklistUrls: [],
        whitelistUrls: [],
    },
    USE_JQUERY: false,
    LINT_FIX: true,
};

module.exports.ENV = ENV;
module.exports.BROWSERSYNC = BROWSERSYNC;
module.exports.IMAGEMIN = IMAGEMIN;
