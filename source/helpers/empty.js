module.exports = function helper(value, empty = true) {
    if (Array.isArray(value)) {
        return value.length > 0 ? value : empty;
    }
    if (value && value.constructor === Object) {
        return Object.keys(value).length > 0 ? value : empty;
    }
    return value || empty;
};
