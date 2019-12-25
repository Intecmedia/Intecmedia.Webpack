/* eslint 'compat/compat': 'off' */

// for polyfill use only require
const objectFitImages = require('object-fit-images');

jQuery(($) => {
    objectFitImages(null, { watchMQ: true });

    // SPA events
    $(window).on('pushState replaceState', () => {
        setTimeout(() => {
            objectFitImages(null, { watchMQ: true });
        }, 0);
    });
});
