/**
 * Prepend one or more elements to the beginning of an array.
 * @param {Array} arr - input array
 * @param {...any} args - args to prepend
 * @returns {Array} - new array
 */
function helperArrayUnshift(arr, ...args) {
    const result = [...arr];
    Array.prototype.unshift.call(result, ...args);
    return result;
}
module.exports = helperArrayUnshift;
