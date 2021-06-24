/* global NODE_ENV DEBUG */

// import '~/components/aquilon-validator';
import '~/components/bootstrap';
import '~/components/viewport-height';
import '~/components/network-information';
import '~/components/scrollbar-width';

jQuery(($) => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);

    const $html = $(document.documentElement);
    $html.addClass('ready-js');

    // Your code here
});
