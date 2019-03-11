/* global NODE_ENV DEBUG */
require('../css/app.scss');

require('~/polyfills.js');

require('~/components/bootstrap.js');

jQuery(($) => {
    $(document.documentElement).addClass('ready-js');
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);
    // Your code here
});
