/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const APP = require('./app.config');
const ENV = require('./app.env');

module.exports = {
    'env': {
        'amd': true,
        'browser': true,
        'jquery': APP.JQUERY,
        'node': false,
    },
    'extends': [
        'plugin:compat/recommended',
        'plugin:eslint-comments/recommended',
        'airbnb-base',
    ],
    'parser': '@babel/eslint-parser',
    'parserOptions': {
        'babelOptions': {
            'configFile': './babel.config.js',
        },
    },
    'plugins': [
        '@babel',
        'import',
    ],
    'root': true,
    'rules': {
        'class-methods-use-this': 'off',
        'eslint-comments/require-description': ['error', {
            'ignore': ['global', 'globals'],
        }],
        'func-names': ['error'],
        'import/dynamic-import-chunkname': [2, {
            'importFunctions': ['dynamicImport'],
            'webpackChunknameFormat': '[a-zA-Z0-9\\-_\\.]+',
        }],
        'import/no-cycle': 'off',
        'import/order': 'off',
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'max-len': ['error', 120, {
            'ignoreComments': true,
            'ignoreRegExpLiterals': true,
            'ignoreStrings': true,
            'ignoreTemplateLiterals': true,
            'ignoreTrailingComments': true,
            'ignoreUrls': true,
        }],
        'max-lines': ['error', {
            'max': 300,
            'skipBlankLines': true,
            'skipComments': true,
        }],
        'no-alert': ENV.PROD ? ['error'] : 'off',
        'no-console': 'off',
        'no-debugger': ENV.PROD ? ['error'] : 'off',
        'no-invalid-this': ['error', {
            'capIsConstructor': true,
        }],
        'no-param-reassign': ['error', {
            'props': false,
        }],
        'no-plusplus': 'off',
        'no-underscore-dangle': 'off',
        'no-unreachable': ENV.PROD ? ['error'] : 'off',
        'no-unused-expressions': ENV.PROD ? ['error'] : 'off',
        'require-await': ['error'],
        'sort-requires/sort-requires': 'off',
        'unicode-bom': ['error', 'never'],
    },
    'settings': {
        'import/resolver': {
            'node': {},
            'webpack': {
                'config': './resolve.config.js',
            },
        },
        'polyfills': [
            'fetch',
            'IntersectionObserver',
            'Promise',
            'ResizeObserver',
            'Symbol',
        ],
    },
};
