/* global NODE_ENV DEBUG */

// for polyfill use only require
require('~/polyfills/history-events.js');

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/classlist.js');
}

// eslint-disable-next-line global-require -- conditinal polyfill
require('~/polyfills/focus-visible.js');

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/object-assign.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/object-values.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/promise.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/map.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/set.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/fetch.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/symbol.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/array-from.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/array-find.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/element-remove.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/element-matches.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/element-closest.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/nodelist-foreach.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/weak-map.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/array-includes.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/string-includes.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/string-replace-all.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/matchmedia-polyfill.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/intersection-observer.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/resize-observer.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/focus-within.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/object-fit-images.js');

    // eslint-disable-next-line global-require -- conditinal polyfill
    require('~/polyfills/picturefill.js');
}
