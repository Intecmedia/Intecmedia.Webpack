module.exports = function helper(object, key) {
    const result = { ...object };
    if (key in result) {
        delete result[key];
    }
    return result;
};
