/* global NODE_ENV SENTRY_DSN */
import { init } from '@sentry/browser';

if (NODE_ENV === 'production' && SENTRY_DSN) {
    init({
        dsn: SENTRY_DSN,
    });
}
