/* eslint-env node */
/* eslint global-require: 'off', 'compat/compat': 'off' */

const ENV = require('./app.env.js');
const stylelintrc = require('./.stylelintrc.postcss.json');

stylelintrc.rules['plugin/no-unsupported-browser-features'][1].browsers = ENV.BROWSERS;

module.exports = () => require('stylelint')(stylelintrc);
