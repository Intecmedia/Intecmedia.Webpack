/* global NODE_ENV SENTRY_DSN */
if (NODE_ENV === 'production' && SENTRY_DSN) {
    // eslint-disable-next-line global-require
    const { init: sentryInit } = require('@sentry/browser');

    sentryInit({
        dsn: SENTRY_DSN,
        beforeSend(event) {
            // Detect if we got a ReportingObserver event
            if (event.message && event.message.indexOf('ReportingObserver') === 0) {
                // And check whether sourceFile points to chrome-extension.
                if (
                    event.extra
                    && event.extra.body
                    && event.extra.body.sourceFile
                    && event.extra.body.sourceFile.indexOf('chrome-extension') === 0
                ) {
                    return null;
                }
            }
            // Otherwise, just let it through
            return event;
        },
    });
}
