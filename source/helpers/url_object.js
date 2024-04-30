/**
 * Create URL object from string.
 * @param {string} url - url string
 * @returns {URL} - url object
 */
function helperUrlObject(url) {
    return new URL(url);
}
module.exports = helperUrlObject;
