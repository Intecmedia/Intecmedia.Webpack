if (!('from' in Array.prototype)) {
    // eslint-disable-next-line global-require, no-extend-native -- conditinal polyfill
    Array.prototype.from = require('core-js/stable/array/from');
}
