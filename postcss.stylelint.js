/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

module.exports = () => require('stylelint')({
    config: {
        plugins: [
            'stylelint-csstree-validator',
        ],
        rules: {
            'csstree/validator': {
                ignore: ['font-display'],
            },
        },
    },
});
