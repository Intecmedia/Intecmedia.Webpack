/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!Object.values) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    Object.values = require('core-js/stable/object/values');
}
