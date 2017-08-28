/* global NODE_ENV DEBUG */

require('../css/app.scss');

require('./vendor.js');

jQuery(() => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG};`);
});
