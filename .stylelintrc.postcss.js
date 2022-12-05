/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared');

const ENV = require('./app.env');

module.exports = deepMerge({}, sharedConfig, {
    'defaultSeverity': ENV.PROD || ENV.DEBUG ? 'error' : 'warning',
    'extends': [...sharedConfig.extends],
    'plugins': [
        'stylelint-csstree-validator',
        // 'stylelint-no-nested-media',
        ...sharedConfig.plugins,
    ],
    'rules': {
        'csstree/validator': {
            'ignore': [],
            // 'properties': {
            // 'content-visibility': 'visible | hidden | auto | initial | unset',
            // },
        },
        // 'pitcher/no-nested-media': true,
    },
});
