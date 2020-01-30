/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!Element.prototype.classList) {
    // eslint-disable-next-line global-require
    require('classlist.js');
}
