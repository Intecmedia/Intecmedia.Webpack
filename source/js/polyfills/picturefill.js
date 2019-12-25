/* eslint 'compat/compat': 'off' */

// for polyfill use only require
const picturefill = require('picturefill');

jQuery(($) => {
    picturefill();

    // SPA events
    $(window).on('pushState replaceState', () => {
        // wait side effects changes
        setTimeout(() => {
            picturefill({ reevaluate: true });
        }, 0);
    });
});
