/* global NODE_ENV */

require('../css/app.scss');
window.Modernizr = require('modernizr');

jQuery(() => {
    console.log(`Enviroment: ${NODE_ENV}`);
});
