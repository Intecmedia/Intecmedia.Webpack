module.exports = function helper(arr, ...args) {
    const result = [...arr];
    Array.prototype.push.call(result, ...args);
    return result;
};
