/* eslint-env node -- webpack is node env */
/* eslint 'compat/compat': 'off' -- webpack is node env */
/* eslint 'quote-props': ['error', 'always'] -- more readability keys */

module.exports = {
    'indent_char': ' ',
    'indent_size': 4,
    'html': {
        'max_preserve_newlines': 1,
        'wrap_line_length': 120,
        'wrap_attributes': 'preserve-aligned',
        'wrap_attributes_indent_size': 4,
        'inline': [
            'abbr', 'b', 'bdi', 'bdo', 'br', 'cite',
            'del', 'dfn', 'em', 'i',
            'ins', 'kbd', 'mark', 'meter',
            'q', 's', 'samp', 'small',
            'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'text',
            'acronym', 'big', 'strike', 'tt',
        ],
    },
};
