/* global NODE_ENV DEBUG */
require('../css/app.scss');
require('./polyfills.js');
require('./bootstrap.js');

jQuery(($) => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);
    // Your code here
});
