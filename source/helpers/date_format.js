const dataFns = require('date-fns');

/**
 * Format date.
 * @param {string} date - date string
 * @param {string} format - date format
 * @returns {string} - formatted date
 */
function helperDateFormat(date = null, format = null) {
    return dataFns.format(date ? new Date(date) : new Date(), format || 'yyyy-MM-dd');
}
module.exports = helperDateFormat;
