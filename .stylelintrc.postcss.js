/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared.js');

module.exports = deepMerge({}, sharedConfig, {
    'extends': [
        ...sharedConfig.extends,
    ],
    'plugins': [
        'stylelint-no-nested-media',
        ...sharedConfig.plugins,
    ],
    'rules': {
        'pitcher/no-nested-media': true,
    },
});
