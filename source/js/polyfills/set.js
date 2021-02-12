if (!window.Set) {
    // eslint-disable-next-line global-require -- conditinal polyfill
    window.Set = require('core-js/stable/set');
}
