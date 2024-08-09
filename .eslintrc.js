/* eslint "sort-keys": "error" -- more readability keys */

const fs = require('node:fs');
const globals = require('globals');

const APP = require('./app.config');
const ENV = require('./app.env');
const PACKAGE = require('./package.json');

const ignores = fs.readFileSync('./.eslintignore').toString().trim().split(/\r?\n/);

const common = [
    require('@eslint/js/src/configs/eslint-recommended'),
    ...(ENV.PROD ? [require('eslint-plugin-jsdoc').configs['flat/recommended']] : []),
    ...(ENV.PROD ? [require('@eslint-community/eslint-plugin-eslint-comments/configs').recommended] : []),
    require('eslint-plugin-promise').configs['flat/recommended'],
    require('eslint-plugin-prettier/recommended'), // prettier always last
];

module.exports = [
    // common rules
    {
        'ignores': [...ignores],
        'plugins': {
            ...Object.assign({}, ...common.map((i) => i.plugins)),
        },
        'rules': {
            ...Object.assign({}, ...common.map((i) => i.rules)),
            // code quality rules (fastest)
            'func-names': ['error'],
            'max-lines': [
                'error',
                {
                    'max': 300,
                    'skipBlankLines': true,
                    'skipComments': true,
                },
            ],
            'no-invalid-this': [
                'error',
                {
                    'capIsConstructor': true,
                },
            ],
            'no-param-reassign': [
                'error',
                {
                    'props': false,
                },
            ],
            'require-await': ['error'],
            ...(ENV.PROD
                ? // code style rules (slowest)

                  {
                      '@eslint-community/eslint-comments/require-description': [
                          'error',
                          {
                              'ignore': ['global', 'globals'],
                          },
                      ],
                      'id-length': [
                          'error',
                          {
                              'exceptions': ['$', 'i', 'j', 'k', 'v', 'n', 'm', 'x', 'y', 'z', 'a', 'b'],
                              'properties': 'never',
                          },
                      ],
                      'jsdoc/require-description': [
                          'warn',
                          {
                              'checkConstructors': false,
                              'contexts': ['ClassDeclaration', 'FunctionDeclaration', 'MethodDefinition'],
                          },
                      ],
                      'jsdoc/require-jsdoc': [
                          'warn',
                          {
                              'require': {
                                  'ClassDeclaration': true,
                                  'FunctionDeclaration': true,
                                  'MethodDefinition': true,
                              },
                          },
                      ],
                      'no-unused-vars': [
                          'error',
                          {
                              'args': 'after-used',
                              'caughtErrors': 'all',
                              'ignoreRestSiblings': true,
                              'vars': 'all',
                          },
                      ],
                  }
                : // dev-only rules (better dev experience)
                  {
                      'compat/compat': 'off',
                      'no-debugger': 'off',
                      'no-misleading-character-class': 'off',
                      'no-redeclare': 'off',
                      'no-unreachable': 'off',
                      'no-unused-expressions': 'off',
                      'no-unused-vars': 'off',
                  }),
        },
    },
    // browser code
    {
        ...require('eslint-plugin-compat').configs['flat/recommended'],
        'files': ['source/js/**/*.js'],
        'settings': {
            'browsers': ENV.BROWSERS,
            'polyfills': ['ResizeObserver'],
        },
    },
    {
        'files': ['source/js/**/*.js'],
        'languageOptions': {
            'ecmaVersion': 2022,
            'globals': {
                ...globals.browser,
                ...(APP.JQUERY ? globals.jquery : {}),
                'require': false,
            },
            'parser': require('@babel/eslint-parser'),
            'parserOptions': {
                'babelOptions': {
                    'configFile': './babel.config.js',
                },
            },
            'sourceType': 'module',
        },
        'rules': {
            'global-require': 'error',
            'promise/no-nesting': 'off',
            'promise/param-names': [
                'error',
                {
                    'rejectPattern': '[rR]eject$',
                    'resolvePattern': '[rR]esolve$',
                },
            ],
        },
    },
    // node code
    {
        ...require('eslint-plugin-n').configs['flat/recommended-script'],
        'files': ['*.js', 'source/helpers/*.js', 'source/html.data.js'],
    },
    {
        'files': ['*.js', 'source/helpers/*.js', 'source/html.data.js'],
        'languageOptions': {
            'ecmaVersion': 2022,
            'globals': {
                ...globals.node,
            },
            'parserOptions': {
                'ecmaFeatures': {
                    'globalReturn': true,
                },
            },
            'sourceType': 'commonjs',
        },
        'rules': {
            'n/no-extraneous-require': 'off',
            'n/no-process-exit': 'off',
            'n/prefer-node-protocol': [
                'warn',
                {
                    'version': PACKAGE.engines.node,
                },
            ],
            'promise/no-nesting': 'off',
            'promise/param-names': [
                'error',
                {
                    'rejectPattern': '[rR]eject$',
                    'resolvePattern': '[rR]esolve$',
                },
            ],
        },
    },
    // config files
    {
        'files': ['.*rc.js', '.*rc.*.js'],
        'rules': {
            'quote-props': ['error', 'always'],
        },
    },
];
