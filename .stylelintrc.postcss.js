/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared');

module.exports = deepMerge({}, sharedConfig, {
    'extends': [
        ...sharedConfig.extends,
    ],
    'plugins': [
        'stylelint-csstree-validator',
        'stylelint-no-nested-media',
        ...sharedConfig.plugins,
    ],
    'rules': {
        'csstree/validator': {
            'ignore': [],
            'properties': {
                'content-visibility': 'visible | hidden | auto | initial | unset',
                'font-display': 'auto | block | swap | fallback | optional',
            },
            'severity': 'warning',
        },
        'pitcher/no-nested-media': true,
    },
});
