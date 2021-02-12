/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!('classList' in Element.prototype)) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    require('classlist.js');
}
