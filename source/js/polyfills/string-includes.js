if (!('includes' in String.prototype)) {
    // eslint-disable-next-line global-require, no-extend-native
    String.prototype.includes = require('core-js/stable/string/includes');
}
