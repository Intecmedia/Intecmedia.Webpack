/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared');
const { propertyOrdering } = require('stylelint-semantic-groups');

const ENV = require('./app.env');

module.exports = deepMerge({}, sharedConfig, {
    'customSyntax': 'postcss-scss',
    'defaultSeverity': ENV.PROD || ENV.DEBUG ? 'error' : 'warning',
    'extends': ['stylelint-config-recommended-scss', ...sharedConfig.extends],
    'overrides': [
        {
            'files': ['source/css/base/**/*.scss'],
            'rules': {
                'scss/at-extend-no-missing-placeholder': null,
            },
        },
        {
            'files': ['source/css/components/**/*.scss'],
            'rules': {
                'plugin/selector-bem-pattern': {
                    'ignoreCustomProperties': ['--aspect-', '--bs-', '--icon-', '--image-', '--video-', '--intersection-', '--fluid-', '--#\\{\\$prefix\\}'],
                    'ignoreSelectors': [
                        '^(html|body)\\.?',
                        '.+\\.(js|is|no|has|not)\\-(.+)',
                        '^(svg|picture|img|iframe|video|option|optgroup|canvas)\\.?',
                        '#\\{\\$[a-zA-Z][a-zA-Z-\\d]*\\}',
                        '\\.(active|fade|hide|hiding|show|showing|disabled|collapse|collapsed|collapsing)',
                    ],
                    'implicitComponents': ['source/css/components/**/*.scss', 'source/css/layout/**/*.scss', 'source/css/pages/**/*.scss'],
                    'preset': 'bem',
                },
                'selector-max-compound-selectors': 5,
                'selector-max-type': [
                    0,
                    {
                        'ignore': ['child'],
                        'ignoreTypes': ['/^(html|body|svg|picture|img|iframe|video|option|optgroup|canvas)\\.?/'],
                    },
                ],
                'selector-nested-pattern': ['^(&--|&__|&::|&:|&\\.|&\\[|>|&\\s*|~|\\+|\\w+|\\.)'],
            },
        },
        {
            'files': ['source/css/components/**/_.scss'],
            'rules': { 'plugin/selector-bem-pattern': null },
        },
    ],
    'plugins': [
        'stylelint-high-performance-animation',
        'stylelint-scss',
        'stylelint-selector-bem-pattern',
        'stylelint-order',
        'stylelint-prettier', // prettier always last
        ...sharedConfig.plugins,
    ],
    'reportDescriptionlessDisables': true,
    'reportInvalidScopeDisables': false,
    'reportNeedlessDisables': false,
    'rules': {
        // code quality rules (fastest)
        'no-descending-specificity': null,
        'no-invalid-double-slash-comments': null,
        'no-invalid-position-at-import-rule': null,
        'plugin/no-low-performance-animation-properties': [
            true,
            {
                'ignore': 'paint-properties',
                'ignoreProperties': [
                    'cx',
                    'cy',
                    'fill',
                    'flood-color',
                    'lighting-color',
                    'stop-color',
                    'stroke',
                    'stroke-dashoffset',
                    'text-decoration-color',
                    'text-fill-color',
                    'text-stroke-color',
                    'x',
                    'y',
                ],
                'severity': 'warning',
            },
        ],
        'prettier/prettier': true,
        'rule-empty-line-before': [
            'always',
            {
                'except': ['after-single-line-comment', 'first-nested'],
                'ignore': ['after-comment', 'first-nested'],
            },
        ],
        'scss/comment-no-empty': null,
        'scss/dollar-variable-pattern': ['^[a-zA-Z][a-zA-Z-\\d]*$'],
        'scss/operator-no-newline-after': null,
        'selector-class-pattern': ['^[a-zA-Z0-9\\-_]+$'],
        'selector-max-class': 5,
        'selector-no-qualifying-type': [
            true,
            {
                'ignore': ['attribute', 'class'],
            },
        ],
        ...(ENV.PROD
            ? // code style rules (slowest)
              {
                  'at-rule-empty-line-before': [
                      'always',
                      {
                          'except': ['after-same-name', 'first-nested'],
                          'ignore': ['after-comment'],
                          'ignoreAtRules': ['import'],
                      },
                  ],
                  'order/order': [
                      'dollar-variables',
                      'custom-properties',
                      { 'hasBlock': false, 'name': 'extend', 'type': 'at-rule' },
                      { 'hasBlock': false, 'name': 'include', 'type': 'at-rule' },
                      'declarations',
                      { 'hasBlock': true, 'name': 'supports', 'type': 'at-rule' },
                      { 'hasBlock': true, 'name': 'include', 'type': 'at-rule' },
                      { 'hasBlock': true, 'name': 'media', 'type': 'at-rule' },
                      { 'hasBlock': true, 'selector': '^&\\:', 'type': 'rule' },
                      { 'hasBlock': true, 'selector': '^(\\>|\\+|~)\\s+', 'type': 'rule' },
                      { 'hasBlock': true, 'selector': '^([a-zA-Z]+)?\\.', 'type': 'rule' },
                      { 'hasBlock': true, 'selector': '^&--', 'type': 'rule' },
                      { 'hasBlock': true, 'selector': '^&__', 'type': 'rule' },
                  ],
                  'order/properties-alphabetical-order': null,
                  'order/properties-order': propertyOrdering,
                  'scss/at-rule-no-unknown': [
                      true,
                      {
                          'ignoreAtRules': ['property'],
                      },
                  ],
                  'scss/double-slash-comment-empty-line-before': [
                      'always',
                      {
                          'except': ['first-nested'],
                          'ignore': ['between-comments', 'stylelint-commands'],
                      },
                  ],
                  'scss/load-no-partial-leading-underscore': true,
              }
            : // dev-only rules (better dev experience)
              {
                  'at-rule-disallowed-list': null,
                  'block-no-empty': null,
                  'comment-no-empty': null,
                  'no-empty-source': null,
                  'order/order': null,
                  'order/properties-alphabetical-order': null,
                  'order/properties-order': null,
              }),
    },
});
