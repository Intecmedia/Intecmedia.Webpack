/* globals APP */
const requireCache = {};

function requireAll(context) {
    /* eslint-disable-next-line no-return-assign -- https://webpack.js.org/guides/dependency-management/#requirecontext */
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
