/* eslint "sort-keys": "error" -- more readability keys */

module.exports = {
    'endOfLine': 'lf',
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
    'printWidth': 160,
    'quoteProps': 'preserve',
    'tabWidth': 4,
    'trailingComma': 'all',
    'useTabs': false,
};
