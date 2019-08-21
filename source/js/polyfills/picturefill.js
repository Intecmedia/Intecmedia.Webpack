// for polyfill use only require
const picturefill = require('picturefill');

jQuery(($) => {
    picturefill();

    $(window).on('pushState replaceState', () => {
        // Barba events
        setTimeout(() => {
            picturefill({ reevaluate: true });
        }, 0);
    });
});
