/* global NODE_ENV SENTRY_DSN */
if (NODE_ENV === 'production' && SENTRY_DSN) {
    // eslint-disable-next-line global-require
    const { init } = require('@sentry/browser');

    init({
        dsn: SENTRY_DSN,
    });
}
