const objectFitImages = require('object-fit-images');

jQuery(($) => {
    objectFitImages(null, { watchMQ: true });

    $(window).on('newPageReady', () => {
        // Barba events
        objectFitImages(null, { watchMQ: true });
    });
});
