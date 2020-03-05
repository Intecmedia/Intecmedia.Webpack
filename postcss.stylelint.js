/* eslint-env node */
/* eslint global-require: 'off', 'compat/compat': 'off' */

const stylelintrc = require('./.stylelintrc.json');

module.exports = () => require('stylelint')({
    config: {
        plugins: [
            'stylelint-csstree-validator',
            'stylelint-use-nesting',
        ],
        rules: {
            'no-duplicate-selectors': true,
            'csstree/validator': stylelintrc.rules['csstree/validator'],
            'csstools/use-nesting': [true, {
                severity: 'error',
            }],
        },
    },
});
