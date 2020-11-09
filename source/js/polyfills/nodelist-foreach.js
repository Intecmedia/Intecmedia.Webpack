/* eslint 'compat/compat': 'off' */

if (!('forEach' in NodeList.prototype)) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}
