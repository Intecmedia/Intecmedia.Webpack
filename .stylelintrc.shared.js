/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const ENV = require('./app.env.js');

module.exports = {
    'plugins': [
        'stylelint-csstree-validator',
        'stylelint-no-unsupported-browser-features',
    ],
    'rules': {
        'csstree/validator': {
            'ignore': [],
            'properties': {
                'content-visibility': 'visible | hidden | auto | initial | unset',
                'font-display': 'auto | block | swap | fallback | optional',
            },
        },
        'declaration-block-no-duplicate-properties': [true, {
            'ignore': [
                'consecutive-duplicates-with-different-values',
            ],
        }],
        'no-duplicate-selectors': [
            true,
            {},
        ],
        'plugin/no-unsupported-browser-features': [true, {
            'browsers': ENV.BROWSERS,
            'ignore': [
                'calc',
                'css-featurequeries',
                'css-gradients',
                'flexbox',
                'font-unicode-range',
                'object-fit',
                'outline',
                'pointer-events',
                'rem',
                'transforms3d',
                'viewport-units',
                'will-change',
            ],
            'ignorePartialSupport': true,
            'severity': 'warning',
        }],
        'property-no-unknown': [true, {
            'ignoreProperties': [
                'content-visibility',
            ],
        }],
    },
};
