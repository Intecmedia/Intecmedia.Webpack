module.exports = function helper(obj, key) {
    const result = { ...obj };
    if (key in result) {
        delete result[key];
    }
    return result;
};
