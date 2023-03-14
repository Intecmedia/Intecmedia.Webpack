/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared');

const ENV = require('./app.env');

module.exports = deepMerge({}, sharedConfig, {
    'defaultSeverity': ENV.PROD || ENV.DEBUG ? 'error' : 'warning',
    'extends': [...sharedConfig.extends],
    'plugins': [
        // 'stylelint-no-nested-media',
        ...sharedConfig.plugins,
    ],
    'rules': {
        'declaration-property-value-no-unknown': true,
        // 'pitcher/no-nested-media': true,
    },
});
