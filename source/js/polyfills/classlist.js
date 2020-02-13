/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!('classList' in Element.prototype)) {
    // eslint-disable-next-line global-require
    require('classlist.js');
}
