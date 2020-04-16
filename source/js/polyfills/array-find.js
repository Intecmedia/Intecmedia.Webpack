if (!('find' in Array.prototype)) {
    // eslint-disable-next-line global-require, no-extend-native
    Array.prototype.from = require('core-js/stable/array/find');
}
