/* global NODE_ENV DEBUG */
require('../css/app.scss');

require('modernizr');
require('picturefill');
require('bootstrap');

jQuery(($) => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);
    // Your code here
});
