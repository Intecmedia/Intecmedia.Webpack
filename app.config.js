/* eslint max-len: "off" */
const ENV = require('./app.env.js');

module.exports = {
    TITLE: '$APP.TITLE$',
    SHORT_NAME: '$APP.SHORT_NAME$',
    DESCRIPTION: '$APP.DESCRIPTION$',
    PUBLIC_PATH: '/',
    USE_FAVICONS: true,
    USE_SERVICE_WORKER: false,
    LANGUAGE: 'ru',
    START_URL: '/?utm_source=app_manifest',
    THEME_COLOR: '#fff',
    BACKGROUND_COLOR: '#fff',
    HTML_PRETTY: true,
    FONTS_SUBSETS: true,
    SENTRY_DSN: '',
    ENV,
};
