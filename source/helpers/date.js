/**
 * Create a date object from a string, or use the current date if the string is empty.
 * @param {string} date - date value
 * @returns {Date} - date object
 */
function helperDate(date = null) {
    return date ? new Date(date) : new Date();
}

module.exports = helperDate;
