/**
 * Push one or more elements onto the end of array.
 * @param {Array} arr - input array
 * @param {...any} args - args to push
 * @returns {Array} - new array
 */
function helperArrayPush(arr, ...args) {
    const result = [...arr];
    Array.prototype.push.call(result, ...args);
    return result;
}

module.exports = helperArrayPush;
