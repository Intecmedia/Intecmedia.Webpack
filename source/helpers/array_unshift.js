module.exports = function helper(arr, ...args) {
    arr.unshift.call(null, args);
    return arr;
};
