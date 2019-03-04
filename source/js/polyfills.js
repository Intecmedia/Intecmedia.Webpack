/* global NODE_ENV DEBUG */

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require
    require('picturefill');
    // eslint-disable-next-line global-require
    require('@babel/polyfill');
    // eslint-disable-next-line global-require
    window.focusWithin = require('focus-within');
    window.focusWithin(document);
}

if ((NODE_ENV === 'production' || DEBUG) && !Object.assign) {
    // eslint-disable-next-line global-require
    Object.assign = require('object-assign');
}
