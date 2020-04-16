/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!window.Promise) {
    // eslint-disable-next-line global-require
    window.Promise = require('core-js/stable/promise');
}

if (window.Promise && !('finally' in window.Promise.prototype)) {
    // eslint-disable-next-line global-require
    window.Promise.prototype.finally = require('core-js/stable/promise/finally');
}
