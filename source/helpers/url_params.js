module.exports = function helper(params) {
    return new URLSearchParams(params).toString();
};
