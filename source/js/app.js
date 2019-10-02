/* global NODE_ENV DEBUG */
require('../css/app.scss');

require('~/components/sentry.js');
require('~/components/bootstrap.js');

jQuery(($) => {
    $(document.documentElement).addClass('ready-js');
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);

    const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const {
                left, top, width, height,
            } = entry.contentRect;

            console.log('Element:', entry.target);
            console.log(`Element's size: ${width}px x ${height}px`);
            console.log(`Element's paddings: ${top}px ; ${left}px`);
        }
    });

    ro.observe(document.body);

    // Your code here
});
