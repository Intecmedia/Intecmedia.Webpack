/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!Object.values) {
    // eslint-disable-next-line global-require
    Object.values = require('core-js/stable/object/values');
}
