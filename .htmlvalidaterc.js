/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

const APP = require('./app.config');
const ENV = require('./app.env');

module.exports = {
    'extends': ['htmlvalidate:recommended', 'htmlvalidate:document'],
    'plugins': ['<rootDir>/plugin.html-validate.js'],
    'rules': {
        'bootstrap/col-no-row': [
            'error',
            {
                'ignore': '',
            },
        ],
        'bootstrap/container-no-nested': [
            'error',
            {
                'ignore': '',
            },
        ],
        'bootstrap/form-control-input-only': [
            'error',
            {
                'ignore': '',
            },
        ],
        'bootstrap/form-select-no-form-control': [
            'error',
            {
                'ignore': '',
            },
        ],
        'bootstrap/row-no-childs': [
            'error',
            {
                'ignore': '',
            },
        ],
        'heading-level': 'off',
        'id-pattern': [
            'error',
            {
                'pattern': 'kebabcase',
            },
        ],
        'long-title': 'off',
        'no-inline-style': 'off',
        'no-trailing-whitespace': 'off',
        'pitcher/bem-no-missing-element': [
            'error',
            {
                'ignore': '',
            },
        ],
        'pitcher/bem-no-missing-modifier': [
            'error',
            {
                'ignore': '',
            },
        ],
        'pitcher/check-node-env': [
            'error',
            {
                'NODE_ENV': ENV.NODE_ENV,
            },
        ],
        'pitcher/iframe-loading-required': [
            'error',
            {
                'ignore': '.wysiwyg iframe, .counters-body iframe, iframe.ignore-html-validate',
            },
        ],
        /*
        'pitcher/img-loading-required': ['error', {
            'ignore': '.wysiwyg img, .counters-body img, img.ignore-html-validate',
            'intrinsicsize': true,
        }],
        */
        'pitcher/img-picture-required': [
            'error',
            {
                'avif': (ENV.PROD || ENV.DEBUG) && APP.AVIF,
                'ignore': '.wysiwyg img, .counters-body img, img.ignore-html-validate',
                'webp': (ENV.PROD || ENV.DEBUG) && APP.WEBP,
            },
        ],
        'pitcher/video-playsinline-required': [
            'error',
            {
                'ignore': '.wysiwyg video, video.ignore-html-validate',
            },
        ],
        'require-sri': 'off',
        'script-type': 'off',
        'svg-focusable': 'off',
        'tel-non-breaking': 'off',
    },
};
