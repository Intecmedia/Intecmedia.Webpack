/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const ENV = require('./app.env');

module.exports = {
    'extends': [],
    'plugins': [
        'stylelint-no-unsupported-browser-features',
    ],
    'rules': {
        'declaration-block-no-duplicate-custom-properties': true,
        'declaration-block-no-duplicate-properties': [true, {
            'ignore': [
                'consecutive-duplicates-with-different-values',
            ],
        }],
        'declaration-property-unit-allowed-list': [{
            'font-size': ['rem'], // only rem unit
            'line-height': [], // only unit less
        }, {
            'ignore': ['inside-function'],
        }],
        'no-duplicate-selectors': [true, {
            'disallowInList': false,
        }],
        'plugin/no-unsupported-browser-features': [true, {
            'browsers': ENV.BROWSERS,
            'ignore': [
                'css-featurequeries',
                'css-filters',
                'css-gradients',
                'css-resize',
                'css-touch-action',
                'css3-cursors-newer',
                'pointer-events',
                'will-change',
            ],
            'ignorePartialSupport': true,
            'severity': (ENV.PROD || ENV.DEBUG ? 'error' : 'warning'),
        }],
        'property-disallowed-list': [
            (ENV.PROD || ENV.DEBUG ? ['gap', 'row-gap', 'column-gap'] : []), // https://caniuse.com/?search=gap
        ],
        'property-no-unknown': [true, {
            'ignoreProperties': [
                'content-visibility',
            ],
        }],
    },
};
