/* eslint "compat/compat": "off" */

// for polyfill use only require
if (!window.Promise) {
    // eslint-disable-next-line global-require
    require('promise/lib/rejection-tracking').enable();

    // eslint-disable-next-line global-require
    window.Promise = require('promise/lib/es6-extensions.js');
}
