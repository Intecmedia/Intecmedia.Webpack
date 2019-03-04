/* global NODE_ENV DEBUG */

if (NODE_ENV === 'production' || DEBUG) {
    // eslint-disable-next-line global-require
    require('./polyfills/focus-within.js');

    // eslint-disable-next-line global-require
    require('./polyfills/object-fit-images.js');

    // eslint-disable-next-line global-require
    require('./polyfills/picturefill.js');

    // eslint-disable-next-line global-require
    require('./polyfills/object-assign');
}
