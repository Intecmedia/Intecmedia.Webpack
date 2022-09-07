/* global NODE_ENV APP DEBUG VERBOSE */
if ((NODE_ENV === 'production' || DEBUG) && APP.SENTRY.dsn) {
    const IGNORE_HOSTS = /(\.|^)localhost$/i;

    const sentryCheckIgnore = (event) => {
        // ignore dev host
        if (document.location.hostname.match(IGNORE_HOSTS)) {
            return true;
        }
        // Detect if we got a ReportingObserver event
        if (event?.message?.indexOf('ReportingObserver') === 0) {
            // And check whether sourceFile points to chrome-extension.
            if (event?.extra?.body?.sourceFile?.indexOf('chrome-extension') === 0) {
                return true;
            }
        }
        return false;
    };

    const sentryImport = async () => {
        const Sentry = await import(/* webpackChunkName: "vendor.sentry" */ '@sentry/browser');
        const { Integrations } = await import(/* webpackChunkName: "vendor.sentry" */ '@sentry/tracing');
        Sentry.init({
            debug: DEBUG || false,
            dsn: APP.SENTRY.dsn,
            beforeSend(event) {
                if (sentryCheckIgnore(event)) {
                    if (VERBOSE) {
                        console.log('[sentry]', event);
                    }
                    return null;
                }
                return event;
            },
            ignoreErrors: APP.SENTRY.ignoreErrors || [],
            blacklistUrls: APP.SENTRY.blacklistUrls || [],
            whitelistUrls: APP.SENTRY.whitelistUrls || [],
            integrations: [new Integrations.BrowserTracing()],
            tracesSampleRate: 1.0,
        });
    };
    sentryImport();
}
