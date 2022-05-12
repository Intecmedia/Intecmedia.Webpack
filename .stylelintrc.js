/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared');

const ENV = require('./app.env');

module.exports = deepMerge({}, sharedConfig, {
    'customSyntax': 'postcss-scss',
    'defaultSeverity': (ENV.PROD || ENV.DEBUG ? 'error' : 'warning'),
    'extends': [
        'stylelint-config-sass-guidelines',
        'stylelint-config-twbs-bootstrap',
        ...sharedConfig.extends,
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
        'declaration-empty-line-before': null,
        'function-max-empty-lines': 0,
        'indentation': 4,
        'linebreaks': 'unix',
        'max-empty-lines': 2,
        'max-line-length': [120, {
            'ignore': [
                'comments',
            ],
            'ignorePattern': '/\\$(.+?):/',
        }],
        'max-nesting-depth': [5, {
            'ignore': [
                'blockless-at-rules',
                'pseudo-classes',
            ],
        }],
        'order/order': [
            'dollar-variables',
            'custom-properties',
            {
                'name': 'extend',
                'type': 'at-rule',
            },
            {
                'hasBlock': false,
                'name': 'include',
                'type': 'at-rule',
            },
            'declarations',
            {
                'hasBlock': true,
                'name': 'include',
                'type': 'at-rule',
            },
            'rules',
            {
                'name': 'media',
                'type': 'at-rule',
            },
        ],
        'order/properties-alphabetical-order': null,
        'pitcher/max-lines': 1024,
        'pitcher/max-root-rules': 16,
        'plugin/no-low-performance-animation-properties': [true, {
            'ignore': 'paint-properties',
            'ignoreProperties': [
                'fill',
                'stroke-dashoffset',
                'text-decoration-color',
            ],
            'severity': 'warning',
        }],
        'plugin/selector-bem-pattern': {
            'ignoreCustomProperties': [
                '--icon-',
                '--intersection-',
            ],
            'ignoreSelectors': [
                '\\.(js|is|no|has|not)\\-(.+)',
                '^\\.(js|no\\-js)(\\s+)',
                '^(html|body)',
                '^(svg|picture|img|iframe|video|option|optgroup)\\.?',
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
        'rule-empty-line-before': ['always', {
            'ignore': [
                'after-comment',
                'first-nested',
            ],
        }],
        'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
        'scss/at-else-closing-brace-space-after': 'always-intermediate',
        'scss/at-else-empty-line-before': 'never',
        'scss/at-extend-no-missing-placeholder': null,
        'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
        'scss/at-if-closing-brace-space-after': 'always-intermediate',
        'scss/at-import-no-partial-leading-underscore': true,
        'scss/at-mixin-argumentless-call-parentheses': 'always',
        'scss/at-rule-no-unknown': [true, {
            'ignoreAtRules': [
                'property',
            ],
        }],
        'scss/dollar-variable-default': [true, {
            'ignore': 'local',
        }],
        'scss/dollar-variable-pattern': [
            '^[a-zA-Z][a-zA-Z-\\d]*$',
        ],
        'scss/double-slash-comment-empty-line-before': ['always', {
            'except': [
                'first-nested',
            ],
            'ignore': [
                'between-comments',
                'stylelint-commands',
            ],
        }],
        'scss/selector-nest-combinators': 'always',
        'scss/selector-no-redundant-nesting-selector': true,
        'selector-class-pattern': [
            '^[a-zA-Z0-9\\-_]+$',
        ],
        'selector-list-comma-newline-after': 'always-multi-line',
        'selector-max-class': 5,
        'selector-max-compound-selectors': 5,
        'selector-max-empty-lines': 0,
        'selector-max-type': [0, {
            'ignore': [
                'child',
            ],
            'ignoreTypes': [
                '/^(html|body|svg|picture|img|iframe|video|option|optgroup)\\.?/',
            ],
        }],
        'selector-no-qualifying-type': [true, {
            'ignore': [
                'attribute',
                'class',
            ],
        }],
        'value-list-comma-newline-after': 'always-multi-line',
        'value-list-comma-newline-before': 'never-multi-line',
        'value-list-comma-space-after': 'always-single-line',
        'value-list-max-empty-lines': 1,
    },
});
