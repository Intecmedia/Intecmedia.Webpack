/* eslint 'compat/compat': 'off' */

// for polyfill use only require
const objectFitImages = require('object-fit-images');

jQuery(($) => {
    objectFitImages(null, { watchMQ: true });

    // SPA events
    $(window).on('pushState replaceState', () => {
        // wait side effects changes
        setTimeout(() => {
            objectFitImages(null, { watchMQ: true });
        }, 0);
    });
});
