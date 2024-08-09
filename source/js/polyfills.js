/**
 * --------------------------------------------------------------------------
 * Polyfills webpack-entry
 * --------------------------------------------------------------------------
 */

/* global NODE_ENV DEBUG */

// for polyfill use only require
require('~/polyfills/history-events');
require('~/polyfills/focus-visible');

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/resize-observer');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/event-submitter');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/formdata-submitter');
}
