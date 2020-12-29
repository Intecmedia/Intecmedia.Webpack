if (!('replaceAll' in String.prototype)) {
    // eslint-disable-next-line global-require, no-extend-native
    String.prototype.replaceAll = require('core-js/stable/string/replace-all');
}
