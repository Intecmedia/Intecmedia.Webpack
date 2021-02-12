/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!window.Symbol) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Symbol = require('core-js/stable/symbol');
}
