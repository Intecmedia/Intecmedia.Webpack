/* global NODE_ENV DEBUG */
import('~/components/sentry.js');
import('~/components/bootstrap.js');

jQuery(($) => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);

    const $html = $(document.documentElement);
    $html.addClass('ready-js');

    // Your code here
});
