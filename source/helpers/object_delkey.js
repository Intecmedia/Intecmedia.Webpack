/**
 * Delete key from object.
 * @param {object} obj - input object
 * @param {string} key - delete key
 * @returns {object} - new object
 */
function helperObjectDelKey(obj, key) {
    const result = { ...obj };
    delete result[key];
    return result;
}
module.exports = helperObjectDelKey;
