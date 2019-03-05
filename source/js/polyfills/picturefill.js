const picturefill = require('picturefill');

jQuery(($) => {
    picturefill();

    $(window).on('newPageReady', () => {
        // Barba events
        picturefill({ reevaluate: true });
    });
});
