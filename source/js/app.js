/* global NODE_ENV DEBUG */
import('~/components/sentry.js');
import('~/components/bootstrap.js');

jQuery(($) => {
    $(document.documentElement).addClass('ready-js');
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);
    // Your code here
});
