/* eslint "sort-keys": "error" -- more readability keys */

const APP = require('./app.config');
const ENV = require('./app.env');
const PACKAGE = require('./package.json');

module.exports = {
    'env': {},
    // common extends
    'extends': [
        ...(ENV.PROD ? ['plugin:jsdoc/recommended'] : []),
        'plugin:@eslint-community/eslint-comments/recommended',
        'airbnb-base',
    ],
    'overrides': [
        // browser code
        {
            'env': {
                'browser': true,
                'es2022': true,
                'jquery': APP.JQUERY,
            },
            'extends': [
                'plugin:compat/recommended',
                'plugin:promise/recommended',
                'plugin:prettier/recommended', // prettier always last
            ],
            'files': ['./source/js/**/*.js'],
            'rules': {
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
            'env': {
                'commonjs': true,
                'node': true,
            },
            'extends': [
                'plugin:n/recommended',
                'plugin:promise/recommended',
                'plugin:prettier/recommended', // prettier always last
            ],
            'files': ['./*.js', './source/helpers/*.js', './source/html.data.js'],
            'rules': {
                'global-require': 'off',
                'import/dynamic-import-chunkname': 'off',
                'import/no-dynamic-require': 'off',
                'import/order': 'off',
                'max-classes-per-file': 'off',
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
            'files': ['./.*rc.js', './.*rc.*.js'],
            'rules': {
                'quote-props': ['error', 'always'],
            },
        },
    ],
    'parser': '@babel/eslint-parser',
    'parserOptions': {
        'babelOptions': {
            'configFile': './babel.config.js',
        },
    },
    'plugins': ['@babel', 'import'],
    'root': true,
    // common rules
    'rules': {
        // code quality rules (fastest)
        '@eslint-community/eslint-comments/require-description': [
            'error',
            {
                'ignore': ['global', 'globals'],
            },
        ],
        'class-methods-use-this': 'off',
        'func-names': ['error'],
        'import/dynamic-import-chunkname': [
            'error',
            {
                'importFunctions': ['dynamicImport'],
                'webpackChunknameFormat': '[a-zA-Z0-9\\-_\\.]+',
            },
        ],
        'import/no-cycle': 'off',
        'max-lines': [
            'error',
            {
                'max': 300,
                'skipBlankLines': true,
                'skipComments': true,
            },
        ],
        'no-console': 'off',
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
        'no-plusplus': 'off',
        'no-underscore-dangle': 'off',
        'prettier/prettier': ['error'],
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
                  'import/order': [
                      'error',
                      {
                          'alphabetize': { 'order': 'asc' },
                          'groups': ['builtin', 'external', 'parent', 'sibling', 'index'],
                          'warnOnUnassignedImports': false,
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
                  'import/no-extraneous-dependencies': 'off',
                  'import/no-import-module-exports': 'off',
                  'import/no-named-as-default': 'off',
                  'import/no-unresolved': 'off',
                  'import/order': 'off',
                  'no-alert': 'off',
                  'no-debugger': 'off',
                  'no-misleading-character-class': 'off',
                  'no-redeclare': 'off',
                  'no-unreachable': 'off',
                  'no-unused-expressions': 'off',
                  'no-unused-vars': 'off',
              }),
    },
    'settings': {
        'import/resolver': {
            'node': {},
            'webpack': {
                'config': './resolve.config.js',
            },
        },
        'polyfills': ['fetch', 'IntersectionObserver', 'Promise', 'ResizeObserver', 'Symbol'],
    },
};
