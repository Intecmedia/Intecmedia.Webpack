/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!Object.assign) {
    // eslint-disable-next-line global-require
    Object.assign = require('core-js/stable/object/assign');
}
