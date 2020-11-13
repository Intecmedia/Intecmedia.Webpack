/* eslint-env node */
/* eslint "compat/compat": "off" */

const dataFns = require('date-fns');

module.exports = (date, format) => dataFns.format(new Date(date), format);
