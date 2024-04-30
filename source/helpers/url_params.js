/**
 * Create URL search string from params object.
 * @param {object} params - url params
 * @returns {string} - URL search string
 */
function helperUrlParams(params) {
    return new URLSearchParams(params).toString();
}
module.exports = helperUrlParams;
