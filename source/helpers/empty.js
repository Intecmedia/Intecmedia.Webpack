/**
 * Return object if not empty or result empty variant.
 * @param {object|Array} value - input object or array
 * @param {boolean} empty - empty variant
 * @returns {boolean} - checked result
 */
function helperEmpty(value, empty = true) {
    if (Array.isArray(value)) {
        return value.length > 0 ? value : empty;
    }
    if (value && value.constructor === Object) {
        return Object.keys(value).length > 0 ? value : empty;
    }
    return value || empty;
}
module.exports = helperEmpty;
