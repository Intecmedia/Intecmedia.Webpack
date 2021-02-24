/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

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
        }],
        'property-no-unknown': [true, {
            'ignoreProperties': [
                'content-visibility',
            ],
        }],
    },
};
