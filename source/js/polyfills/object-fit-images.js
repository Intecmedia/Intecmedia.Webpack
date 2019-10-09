/* eslint 'compat/compat': 'off' */

// for polyfill use only require
const objectFitImages = require('object-fit-images');

jQuery(($) => {
    objectFitImages(null, { watchMQ: true });

    $(window).on('pushState replaceState', () => {
        // Barba events
        setTimeout(() => {
            objectFitImages(null, { watchMQ: true });
        }, 0);
    });
});
