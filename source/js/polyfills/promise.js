/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!window.Promise) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Promise = require('core-js/stable/promise');
}

if (window.Promise && !('any' in window.Promise.prototype)) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Promise.prototype.any = require('core-js/stable/promise/any');
}

if (window.Promise && !('finally' in window.Promise.prototype)) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Promise.prototype.finally = require('core-js/stable/promise/finally');
}

if (window.Promise && !('allSettled' in window.Promise.prototype)) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Promise.prototype.allSettled = require('core-js/stable/promise/all-settled');
}
