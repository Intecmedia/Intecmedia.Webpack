const stylelintrc = require('./.stylelintrc.postcss');

module.exports = () => require('stylelint')(stylelintrc);
