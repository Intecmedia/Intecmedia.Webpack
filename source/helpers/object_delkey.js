module.exports = function helper(obj, key) {
    const result = { ...obj };
    delete result[key];
    return result;
};
