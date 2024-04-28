/**
 * --------------------------------------------------------------------------
 * Resize images webpack-entry
 * --------------------------------------------------------------------------
 */

/* globals APP */
const requireCache = {};
const IMAGE_PATTERN = /\.(png|jpg|jpeg)$/;

/**
 * Require all modules from context
 * @param {object} context -- input context
 */
function requireAll(context) {
    /* eslint-disable-next-line no-return-assign -- https://webpack.js.org/guides/dependency-management/#requirecontext */
    context.keys().forEach((key) => (requireCache[key] = context(key)));
}

if (APP.RESIZE) {
    if (APP.WEBP) {
        requireAll(require.context('../img/?resize=&format=webp', true, IMAGE_PATTERN));
        requireAll(require.context('../upload/?resize=&format=webp', true, IMAGE_PATTERN));
    }

    if (APP.AVIF) {
        requireAll(require.context('../img/?resize=&format=avif', true, IMAGE_PATTERN));
        requireAll(require.context('../upload/?resize=&format=avif', true, IMAGE_PATTERN));
    }
}
