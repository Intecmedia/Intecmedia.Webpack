/* eslint-env node */
/* eslint global-require: 'off', 'compat/compat': 'off' */

const stylelintrc = require('./.stylelintrc.postcss.json');

module.exports = () => require('stylelint')(stylelintrc);
