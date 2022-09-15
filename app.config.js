module.exports = {
    TITLE: '',
    SHORT_NAME: '',
    DESCRIPTION: '',
    PUBLIC_PATH: '/', // for relative use './'
    OUTPUT_PATH: './build',
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
    AVIF: false,
    BROTLI: true,
    GZIP: true,
    STYLELINT: true,
    ESLINT: true,
    IMAGEMIN: true,
    get ENV() {
        return require('./app.env');
    },
};
