/* eslint-env node -- webpack is node env */
/* eslint max-len: "off" -- webpack is node env */

module.exports = {
    TITLE: '$APP.TITLE$',
    SHORT_NAME: '$APP.SHORT_NAME$',
    DESCRIPTION: '$APP.DESCRIPTION$',
    PUBLIC_PATH: '/', // for relative use './'
    FAVICONS: true,
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
    JQUERY: false,
    LINT_FIX: true,
    WEBP: true,
    AVIF: true,
    BROTLI: true,
    GZIP: true,
    STYLELINT: true,
    ESLINT: true,
};
