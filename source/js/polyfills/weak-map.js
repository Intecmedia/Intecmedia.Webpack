if (!window.WeakMap) {
    // eslint-disable-next-line global-require, no-extend-native -- conditinal polyfill
    window.WeakMap = require('core-js/stable/weak-map');
}
