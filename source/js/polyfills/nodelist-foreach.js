/* eslint 'compat/compat': 'off' -- useless for polyfill */

if (!('forEach' in NodeList.prototype)) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
