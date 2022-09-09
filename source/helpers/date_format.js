const dataFns = require('date-fns');

module.exports = function helper(date, format) {
    return dataFns.format(date ? new Date(date) : new Date(), format);
};
