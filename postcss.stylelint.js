/* eslint-env node -- webpack is node env */
/* eslint global-require: 'off', 'compat/compat': 'off' -- webpack is node env */

const ENV = require('./app.env.js');
const stylelintrc = require('./.stylelintrc.postcss.js');

stylelintrc.rules['plugin/no-unsupported-browser-features'][1].browsers = ENV.BROWSERS;

module.exports = () => require('stylelint')(stylelintrc);
