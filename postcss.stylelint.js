/* eslint-env node */
/* eslint global-require: "off", "compat/compat": "off" */

const stylelintrc = require('./.stylelintrc.json');

module.exports = () => require('stylelint')({
    config: {
        plugins: [
            'stylelint-csstree-validator',
        ],
        rules: {
            'csstree/validator': stylelintrc.rules['csstree/validator'],
        },
    },
});
