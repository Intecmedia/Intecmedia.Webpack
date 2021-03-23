/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */
/* eslint "quote-props": ["error", "always"] -- more readability keys */
/* eslint "sort-keys": "error" -- more readability keys */

module.exports = {
    'extends': ['plugin:@typescript-eslint/recommended'],
    'parser': '@typescript-eslint/parser',
    'plugins': ['@typescript-eslint'],
    'rules': {
        'indent': ['error', 4],
    },
};
