/* eslint 'compat/compat': 'off' -- useless for polyfill */

// for polyfill use only require
if (!window.fetch) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    const { fetch } = require('whatwg-fetch');
    window.fetch = fetch;
}
