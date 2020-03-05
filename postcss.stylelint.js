/* eslint-env node */
/* eslint global-require: 'off', 'compat/compat': 'off' */

module.exports = () => require('stylelint')({
    config: {
        plugins: [
            'stylelint-csstree-validator',
            'stylelint-use-nesting',
        ],
        rules: {
            'no-duplicate-selectors': true,
            'csstree/validator': {
                ignore: ['font-display'],
            },
            'csstools/use-nesting': [true, {
                severity: 'error',
            }],
        },
    },
});
