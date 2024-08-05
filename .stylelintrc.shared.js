/* eslint "sort-keys": "error" -- more readability keys */

const ENV = require('./app.env');

module.exports = {
    'extends': [],
    'plugins': [],
    'rules': {
        // code quality rules (fastest)
        'declaration-block-no-duplicate-custom-properties': null,
        'declaration-block-no-duplicate-properties': [
            true,
            {
                'ignore': ['consecutive-duplicates-with-different-values'],
            },
        ],
        'declaration-property-unit-allowed-list': [
            {
                'font-size': ['rem', 'vw', 'vh', 'vmin', 'vmax'], // only rem, vw, vh unit
                'letter-spacing': ['em'], // only em unit
                'line-height': [], // only unit less
            },
            {
                'ignore': ['inside-function'],
            },
        ],
        'no-duplicate-selectors': [
            true,
            {
                'disallowInList': false,
            },
        ],
        'property-disallowed-list': [
            [
                // https://caniuse.com/?search=gap
                'gap',
                'row-gap',
                'column-gap',
                // https://caniuse.com/?search=aspect-ratio
                'aspect-ratio',
            ],
        ],
        'rule-selector-property-disallowed-list': {
            '/^(html|:root)$/': ['overflow', 'overflow-x', 'overflow-y'],
        },
        ...(ENV.PROD
            ? // code style rules (slowest)
              {
                  'property-no-unknown': [
                      true,
                      {
                          'ignoreProperties': ['content-visibility'],
                      },
                  ],
              }
            : // dev-only rules (better dev experience)
              {
                  'declaration-block-no-duplicate-custom-properties': null,
                  'declaration-block-no-duplicate-properties': null,
                  'no-duplicate-selectors': null,
                  'property-no-unknown': null,
                  'rule-selector-property-disallowed-list': null,
              }),
    },
};
