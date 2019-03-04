/* global NODE_ENV DEBUG */

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require
    require('picturefill');
    // eslint-disable-next-line global-require
    require('@babel/polyfill');
    // eslint-disable-next-line global-require
    const focusWithin = require('focus-within');
    focusWithin(document);
    // eslint-disable-next-line global-require
    const objectFitImages = require('object-fit-images');
    objectFitImages(null, { watchMQ: true });
}

if ((NODE_ENV === 'production' || DEBUG) && !Object.assign) {
    // eslint-disable-next-line global-require
    Object.assign = require('object-assign');
}
