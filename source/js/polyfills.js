/* global NODE_ENV DEBUG */

// for polyfill use only require
require('~/polyfills/history-events.js');

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require
    require('~/polyfills/object-assign.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/object-values.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/promise.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/fetch.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/symbol.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/array-from.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/weak-map.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/array-includes.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/string-includes.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/matchmedia-polyfill.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/intersection-observer.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/resize-observer.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/focus-within.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/focus-visible.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/object-fit-images.js');

    // eslint-disable-next-line global-require
    require('~/polyfills/picturefill.js');
}
