/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!Object.assign) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    Object.assign = require('core-js/stable/object/assign');
}
