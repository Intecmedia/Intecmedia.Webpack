/* global NODE_ENV APP */
if (NODE_ENV === 'production' && APP.SENTRY.dsn) {
    // eslint-disable-next-line global-require
    const { init: sentryInit } = require('@sentry/browser');

    sentryInit({
        dsn: APP.SENTRY.dsn,
        beforeSend(event) {
            // Detect if we got a ReportingObserver event
            if (event?.message?.indexOf('ReportingObserver') === 0) {
                // And check whether sourceFile points to chrome-extension.
                if (event?.extra?.body?.sourceFile?.indexOf('chrome-extension') === 0) {
                    return null;
                }
            }
            // Otherwise, just let it through
            return event;
        },
        ignoreErrors: APP.SENTRY.ignoreErrors || [],
        blacklistUrls: APP.SENTRY.blacklistUrls || [],
        whitelistUrls: APP.SENTRY.whitelistUrls || [],
    });
}
