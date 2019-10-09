/* eslint 'compat/compat': 'off' */

// for polyfill use only require
if (!window.fetch) {
    // eslint-disable-next-line global-require
    const { fetch } = require('whatwg-fetch');
    window.fetch = fetch;
}
