/* globals APP */
const requireCache = {};

function requireAll(r) {
    /* eslint-disable-next-line no-return-assign -- https://webpack.js.org/guides/dependency-management/#requirecontext */
    r.keys().forEach((key) => (requireCache[key] = r(key)));
}

if (APP.WEBP) {
    requireAll(require.context('../img/?resize=&format=webp', true, /\.(png|jpg|jpeg)$/));
    requireAll(require.context('../upload/?resize=&format=webp', true, /\.(png|jpg|jpeg)$/));
}

if (APP.AVIF) {
    requireAll(require.context('../img/?resize=&format=avif', true, /\.(png|jpg|jpeg)$/));
    requireAll(require.context('../upload/?resize=&format=avif', true, /\.(png|jpg|jpeg)$/));
}
