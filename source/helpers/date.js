/**
 * Create date object from string or current date if empty
 * @param {string} date - date value
 * @returns {Date} - date object
 */
function helperDate(date = null) {
    return date ? new Date(date) : new Date();
}

module.exports = helperDate;
