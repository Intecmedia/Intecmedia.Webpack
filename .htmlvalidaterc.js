/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const APP = require('./app.config');
const ENV = require('./app.env');

module.exports = {
    'extends': [
        'htmlvalidate:recommended',
        'htmlvalidate:document',
    ],
    'plugins': [
        '<rootDir>/plugin.html-validate.js',
    ],
    'rules': {
        'bootstrap/col-no-row': ['error', {
            'ignore': '',
        }],
        'bootstrap/container-no-nested': ['error', {
            'ignore': '',
        }],
        'bootstrap/row-no-childs': ['error', {
            'ignore': '',
        }],
        'heading-level': 'off',
        'id-pattern': ['error', {
            'pattern': 'kebabcase',
        }],
        'long-title': 'off',
        'no-inline-style': 'off',
        'no-trailing-whitespace': 'off',
        'pitcher/iframe-loading-required': ['error', {
            'ignore': '.wysiwyg iframe, .counters-body iframe, iframe.ignore-html-validate',
        }],
        /*
        'pitcher/img-loading-required': ['error', {
            'ignore': '.wysiwyg img, .counters-body img, img.ignore-html-validate',
            'intrinsicsize': true,
        }],
        */
        'pitcher/img-picture-required': ['error', {
            'avif': (ENV.PROD || ENV.DEBUG) && APP.AVIF,
            'ignore': '.wysiwyg img, .counters-body img, img.ignore-html-validate',
            'webp': (ENV.PROD || ENV.DEBUG) && APP.WEBP,
        }],
        'require-sri': 'off',
        'svg-focusable': 'off',
    },
};
