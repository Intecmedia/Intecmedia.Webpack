/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const dataFns = require('date-fns');

module.exports = (date, format) => dataFns.format(new Date(date), format);
