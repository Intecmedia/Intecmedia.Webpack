/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared');
const { propertyOrdering } = require('stylelint-semantic-groups');

const ENV = require('./app.env');

module.exports = deepMerge({}, sharedConfig, {
    'customSyntax': 'postcss-scss',
    'defaultSeverity': ENV.PROD || ENV.DEBUG ? 'error' : 'warning',
    'extends': [
        'stylelint-config-sass-guidelines',
        'stylelint-config-twbs-bootstrap',
        ...sharedConfig.extends,
        'stylelint-prettier/recommended', // prettier always last
        'stylelint-config-prettier-scss', // prettier always last
    ],
    'plugins': [
        'stylelint-high-performance-animation',
        'stylelint-max-lines',
        'stylelint-max-root-rules',
        'stylelint-scss',
        'stylelint-selector-bem-pattern',
        ...sharedConfig.plugins,
    ],
    'reportDescriptionlessDisables': true,
    'rules': {
        // code quality rules (fastest)
        'max-nesting-depth': [
            5,
            {
                'ignore': ['blockless-at-rules', 'pseudo-classes'],
            },
        ],
        'pitcher/max-lines': 1024,
        'pitcher/max-root-rules': 16,
        'plugin/no-low-performance-animation-properties': [
            true,
            {
                'ignore': 'paint-properties',
                'ignoreProperties': ['fill', 'stroke-dashoffset', 'text-decoration-color'],
                'severity': 'warning',
            },
        ],
        'plugin/selector-bem-pattern': {
            'ignoreCustomProperties': ['--icon-', '--intersection-'],
            'ignoreSelectors': [
                '\\.(js|is|no|has|not)\\-(.+)',
                '^\\.(js|no\\-js)(\\s+)',
                '^(html|body)',
                '^(svg|picture|img|iframe|video|option|optgroup|canvas)\\.?',
                '#\\{\\$[a-zA-Z][a-zA-Z-\\d]*\\}',
                '\\.(active|fade|show)',
            ],
            'implicitComponents': [
                'source/css/components/**/*.scss',
                'source/css/layout/**/*.scss',
                'source/css/pages/**/*.scss',
            ],
            'preset': 'bem',
        },
        'scss/dollar-variable-default': [
            true,
            {
                'ignore': 'local',
            },
        ],
        'scss/dollar-variable-pattern': ['^[a-zA-Z][a-zA-Z-\\d]*$'],
        'scss/selector-nest-combinators': 'always',
        'selector-class-pattern': ['^[a-zA-Z0-9\\-_]+$'],
        'selector-max-class': 5,
        'selector-max-compound-selectors': 5,
        'selector-max-type': [
            0,
            {
                'ignore': ['child'],
                'ignoreTypes': ['/^(html|body|svg|picture|img|iframe|video|option|optgroup|canvas)\\.?/'],
            },
        ],
        'selector-no-qualifying-type': [
            true,
            {
                'ignore': ['attribute', 'class'],
            },
        ],
        ...(ENV.PROD
            ? // code style rules (slowest)
              {
                  'order/order': [
                      'dollar-variables',
                      'custom-properties',
                      { 'hasBlock': false, 'name': 'extend', 'type': 'at-rule' },
                      { 'hasBlock': false, 'name': 'include', 'type': 'at-rule' },
                      'declarations',
                      { 'hasBlock': true, 'selector': '^&\\:', 'type': 'rule' },
                      { 'hasBlock': true, 'selector': '^(\\>|\\+|~)\\s+', 'type': 'rule' },
                      { 'hasBlock': true, 'selector': '^([a-zA-Z]+)?\\.', 'type': 'rule' },
                      { 'hasBlock': true, 'name': 'supports', 'type': 'at-rule' },
                      { 'hasBlock': true, 'name': 'include', 'type': 'at-rule' },
                      { 'hasBlock': true, 'name': 'media', 'type': 'at-rule' },
                      { 'hasBlock': true, 'selector': '^&--', 'type': 'rule' },
                      { 'hasBlock': true, 'selector': '^&__', 'type': 'rule' },
                  ],
                  'order/properties-alphabetical-order': null,
                  'order/properties-order': propertyOrdering,
                  'scss/at-import-no-partial-leading-underscore': true,
                  'scss/at-import-partial-extension': 'never',
                  'scss/at-import-partial-extension-blacklist': ['scss', 'css'],
                  'scss/at-rule-no-unknown': [
                      true,
                      {
                          'ignoreAtRules': ['property'],
                      },
                  ],
                  'scss/dollar-variable-empty-line-after': [
                      'always',
                      {
                          'except': ['last-nested', 'before-comment', 'before-dollar-variable'],
                      },
                  ],
                  'scss/double-slash-comment-empty-line-before': [
                      'always',
                      {
                          'except': ['first-nested'],
                          'ignore': ['between-comments', 'stylelint-commands'],
                      },
                  ],
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
