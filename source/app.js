/* global NODE_ENV */

require('./app.scss');

jQuery(() => {
    console.log(`Enviroment: ${NODE_ENV}`);
});
