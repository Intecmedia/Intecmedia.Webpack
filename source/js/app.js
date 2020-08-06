/* global NODE_ENV DEBUG */
import('~/components/network-information');
import('~/components/bootstrap');
import('~/components/svg-sprite');
import('~/components/validator');

jQuery(($) => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);

    const $html = $(document.documentElement);
    $html.addClass('ready-js');

    // Your code here
});
