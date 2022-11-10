module.exports = function helper(arr, ...args) {
    Array.prototype.push.call(arr, ...args);
    return arr;
};
