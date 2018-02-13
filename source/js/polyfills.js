/* global NODE_ENV */

if (NODE_ENV === 'production') {
    // eslint-disable-next-line global-require
    require('picturefill');
    // eslint-disable-next-line global-require
    require('babel-polyfill');
}

if (NODE_ENV === 'production' && !Object.assign) {
    // eslint-disable-next-line global-require
    Object.assign = require('object-assign');
}
