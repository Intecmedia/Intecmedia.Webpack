/* eslint "sort-keys": "error" -- more readability keys */

const fs = require('node:fs');

const globals = require('globals');
const compatPlugin = require('eslint-plugin-compat').configs['flat/recommended'];
const nodePlugin = require('eslint-plugin-n').configs['flat/recommended-script'];
const eslintParser = require('@babel/eslint-parser');

const APP = require('./app.config');
const ENV = require('./app.env');
const PACKAGE = require('./package.json');

const ignores = fs
    .readFileSync('./.eslintignore', 'utf-8')
    .split(/\r?\n/g)
    .map((i) => i.trim())
    .filter((i) => i.length > 0 && !i.startsWith('#'));

const commonConfigs = [
    require('@eslint/js/src/configs/eslint-recommended'),
    ...(APP.JSDOC && ENV.PROD ? [require('eslint-plugin-jsdoc').configs['flat/recommended']] : []),
    ...(ENV.PROD ? [require('@eslint-community/eslint-plugin-eslint-comments/configs').recommended] : []),
    require('eslint-plugin-promise').configs['flat/recommended'],
    require('eslint-plugin-prettier/recommended'), // prettier always last
];
const commonPlugins = Object.assign({}, ...commonConfigs.map((i) => i.plugins));
const commonRules = Object.assign({}, ...commonConfigs.map((i) => i.rules));

module.exports = [
    // ignores rules
    {
        'ignores': [...ignores],
    },
    // common rules
    {
        'plugins': {
            ...commonPlugins,
        },
        'rules': {
            ...commonRules,
            // code quality rules (fastest)
            'eqeqeq': [
                'error',
                'always',
                {
                    'null': 'ignore',
                },
            ],
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
            'prefer-template': ['error'],
            'promise/no-nesting': 'off',
            'promise/param-names': [
                'error',
                {
                    'rejectPattern': '[rR]eject$',
                    'resolvePattern': '[rR]esolve$',
                },
            ],
            'quote-props': [
                'error',
                'as-needed',
                {
                    'keywords': false,
                    'numbers': false,
                    'unnecessary': true,
                },
            ],
            'require-await': ['error'],
            ...(ENV.PROD
                ? // code style rules (slowest)
                  {
                      'id-length': [
                          'error',
                          {
                              'exceptions': ['$', 'i', 'j', 'k', 'v', 'n', 'm', 'x', 'y', 'z', 'a', 'b'],
                              'properties': 'never',
                          },
                      ],
                      ...(APP.JSDOC
                          ? {
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
                            }
                          : {}),
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
                      ...(APP.JSDOC
                          ? {
                                'jsdoc/require-description': 'off',
                                'jsdoc/require-param-description': 'off',
                                'jsdoc/require-param-type': 'off',
                                'jsdoc/require-returns': 'off',
                            }
                          : {}),
                      'no-debugger': 'off',
                      'no-misleading-character-class': 'off',
                      'no-redeclare': 'off',
                      'no-unreachable': 'off',
                      'no-unused-expressions': 'off',
                      'no-unused-vars': 'off',
                      'quote-props': 'off',
                  }),
        },
    },
    // browser code
    {
        'files': ['source/js/**/*.js'],
        'languageOptions': {
            'ecmaVersion': 2022,
            'globals': {
                ...globals.browser,
                'require': false,
            },
            'parser': eslintParser,
            'parserOptions': {
                'babelOptions': {
                    'configFile': './babel.config.js',
                },
            },
            'sourceType': 'module',
        },
        'linterOptions': {
            'reportUnusedDisableDirectives': 0,
        },
        'plugins': {
            ...compatPlugin.plugins,
        },
        'rules': {
            ...compatPlugin.rules,
            'global-require': 'error',
        },
        'settings': {
            'browsers': ENV.BROWSERS,
            'polyfills': ['ResizeObserver'],
        },
    },
    // node code
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
        'linterOptions': {
            'reportUnusedDisableDirectives': 0,
        },
        'plugins': {
            ...nodePlugin.plugins,
        },
        'rules': {
            ...nodePlugin.rules,
            'max-len': 'off',
            'max-lines': 'off',
            'n/no-extraneous-require': 'off',
            'n/no-process-exit': 'off',
            'n/prefer-node-protocol': [
                'warn',
                {
                    'version': PACKAGE.engines.node,
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
