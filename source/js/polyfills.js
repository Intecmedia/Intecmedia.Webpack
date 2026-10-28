/**
 * --------------------------------------------------------------------------
 * Polyfills webpack-entry
 * --------------------------------------------------------------------------
 */

/* global NODE_ENV DEBUG */

// Use require only for polyfills.
require('~/polyfills/history-events');

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require -- conditional polyfill
    require('~/polyfills/event-submitter');

    // eslint-disable-next-line global-require -- conditional polyfill
    require('~/polyfills/formdata-submitter');
}
