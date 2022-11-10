module.exports = function helper(arr, ...args) {
    arr.push.call(null, args);
    return arr;
};
