/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const APP = require('./app.config');
const ENV = require('./app.env');

module.exports = {
    'env': {},
    'extends': ['plugin:eslint-comments/recommended', 'airbnb-base'],
    'overrides': [
        {
            'env': {
                'browser': true,
                'jquery': APP.JQUERY,
            },
            'extends': ['plugin:compat/recommended', 'plugin:prettier/recommended'],
            'files': ['./source/js/**/*.js'],
        },
        {
            'env': {
                'commonjs': true,
                'node': true,
            },
            'extends': ['plugin:node/recommended', 'plugin:prettier/recommended'],
            'files': ['./*.js', './source/helpers/*.js', './source/html.data.js'],
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
    'rules': {
        // code quality rules (fastest)
        'class-methods-use-this': 'off',
        'eslint-comments/require-description': [
            'error',
            {
                'ignore': ['global', 'globals'],
            },
        ],
        'func-names': ['error'],
        'import/dynamic-import-chunkname': [
            2,
            {
                'importFunctions': ['dynamicImport'],
                'webpackChunknameFormat': '[a-zA-Z0-9\\-_\\.]+',
            },
        ],
        'import/no-cycle': 'off',
        'import/order': 'off',
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
              {}
            : // dev-only rules (better dev experience)
              {
                  'compat/compat': 'off',
                  'import/no-extraneous-dependencies': 'off',
                  'import/no-import-module-exports': 'off',
                  'import/no-named-as-default': 'off',
                  'import/no-unresolved': 'off',
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
