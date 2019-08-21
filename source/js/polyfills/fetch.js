// for polyfill use only require
if (!window.fetch) {
    // eslint-disable-next-line global-require
    window.fetch = require('whatwg-fetch');
}
