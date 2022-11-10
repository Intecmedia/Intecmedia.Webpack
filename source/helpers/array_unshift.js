module.exports = function helper(arr, ...args) {
    Array.prototype.unshift.call(arr, ...args);
    return arr;
};
