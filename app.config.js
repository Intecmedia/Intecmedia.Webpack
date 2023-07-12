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
    RESIZE: false,
    GZIP: true,
    STYLELINT: true,
    ESLINT: true,
    IMAGEMIN: true,
    SORT_MEQIA_QUERIES: 'mobile-first',
    RESOLVE_URL: true,
    get ENV() {
        return require('./app.env');
    },
};
