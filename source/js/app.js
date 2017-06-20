/* global NODE_ENV */

require('../css/app.scss');

jQuery(() => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG};`);
});
