const dataFns = require('date-fns');

/**
 * Format date.
 * @param {string} date - date object
 * @param {string} format - date format
 * @returns {string} - date formated
 */
function helperDateFormat(date = null, format = null) {
    return dataFns.format(date ? new Date(date) : new Date(), format || 'yyyy-MM-dd');
}
module.exports = helperDateFormat;
