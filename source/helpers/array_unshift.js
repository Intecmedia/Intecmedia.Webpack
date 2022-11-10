module.exports = function helper(arr, ...args) {
    const result = [...arr];
    Array.prototype.unshift.call(result, ...args);
    return result;
};
