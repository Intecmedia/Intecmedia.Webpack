/**
 * --------------------------------------------------------------------------
 * Resize images webpack-entry
 * --------------------------------------------------------------------------
 */

/* globals APP */
const requireCache = {};

/**
 * Require all modules from context
 * @param {object} context -- input context
 */
function requireAll(context) {
    context.keys().forEach((key) => (requireCache[key] = context(key)));
}

if (APP.RESIZE) {
    if (APP.WEBP) {
        requireAll(require.context('../img/?resize=&format=webp', true, /\.(png|jpg|jpeg)$/));
        requireAll(require.context('../upload/?resize=&format=webp', true, /\.(png|jpg|jpeg)$/));
    }

    if (APP.AVIF) {
        requireAll(require.context('../img/?resize=&format=avif', true, /\.(png|jpg|jpeg)$/));
        requireAll(require.context('../upload/?resize=&format=avif', true, /\.(png|jpg|jpeg)$/));
    }
}
