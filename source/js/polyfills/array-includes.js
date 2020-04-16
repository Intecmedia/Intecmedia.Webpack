if (!('includes' in Array.prototype)) {
    // eslint-disable-next-line global-require, no-extend-native
    Array.prototype.includes = require('core-js/stable/array/includes');
}
