/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!window.Promise) {
    // eslint-disable-next-line global-require
    require('core-js/stable/promise');
}

if (window.Promise && !window.Promise.finally) {
    // eslint-disable-next-line global-require
    require('core-js/stable/promise/finally');
}
