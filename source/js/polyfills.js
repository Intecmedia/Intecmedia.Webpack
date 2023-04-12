/* global NODE_ENV DEBUG */

// for polyfill use only require
require('~/polyfills/history-events');

// eslint-disable-next-line global-require -- conditinal polyfill
require('~/polyfills/focus-visible');

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/fetch');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/intersection-observer');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/resize-observer');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/focus-within');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/event-submitter');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/formdata-submitter');
}
