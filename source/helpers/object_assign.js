/**
 * Assign object with values.
 * @param {...any} args - values
 * @returns {object} - new object
 */
function helperObjectAssign(...args) {
    return Object.assign(...args);
}
module.exports = helperObjectAssign;
