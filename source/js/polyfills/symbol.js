/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!window.Symbol) {
    // eslint-disable-next-line global-require
    window.Symbol = require('core-js/stable/symbol');
}
