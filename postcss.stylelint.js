/* eslint-env node -- webpack is node env */
/* eslint global-require: 'off', 'compat/compat': 'off' -- webpack is node env */

const stylelintrc = require('./.stylelintrc.postcss');

module.exports = () => require('stylelint')(stylelintrc);
