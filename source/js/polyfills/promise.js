/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!window.Promise) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Promise = require('core-js/stable/promise');
}

if (window.Promise && !('finally' in window.Promise.prototype)) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Promise.prototype.finally = require('core-js/stable/promise/finally');
}
