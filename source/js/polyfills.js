/* global NODE_ENV DEBUG */

// for polyfill use only require
require('~/polyfills/history-events.js');

// eslint-disable-next-line global-require -- conditinal polyfill
require('~/polyfills/focus-visible.js');

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/fetch.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/element-remove.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/element-matches.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/element-closest.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/intersection-observer.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/resize-observer.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/focus-within.js');
}
