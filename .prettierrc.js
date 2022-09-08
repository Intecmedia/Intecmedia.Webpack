/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

module.exports = {
    'overrides': [
        {
            'files': '*.scss',
            'options': {
                'singleQuote': false,
            },
            'parser': 'postcss-scss',
        },
        {
            'files': '*.js',
            'options': {
                'singleQuote': true,
            },
            'parser': '@babel/eslint-parser',
            'parserOptions': {
                'babelOptions': {
                    'configFile': './babel.config.js',
                },
            },
        },
    ],
    'printWidth': 120,
    'quoteProps': 'preserve',
    'tabWidth': 4,
    'useTabs': false,
};
