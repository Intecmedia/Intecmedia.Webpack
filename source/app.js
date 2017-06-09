/* global NODE_ENV */

require('./app.scss');
window.Modernizr = require('modernizr');

jQuery(() => {
    console.log(`Enviroment: ${NODE_ENV}`);
});
