/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

module.exports = {
    'env': {
        'browser': true,
        'node': false,
    },
    'extends': ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    'parser': '@typescript-eslint/parser',
    'plugins': ['@typescript-eslint'],
    'rules': {
        'prettier/prettier': ['error'],
    },
};
