const Parser = require('fastparse');

function processMatch(match, orig, attr, value, index) {
    if (!this.filterAttr(this.currentTag, attr)) return;
    this.results.push({
        start: index + orig.length,
        length: value.length,
        value,
        tag: this.currentTag,
        attr,
    });
}

const parser = new Parser({
    outside: {
        '<!--.*?-->': true,
        '<![CDATA[.*?]]>': true,
        '<[!\\?].*?>': true,
        '<\\/[^>]+>': true,
        '<([a-zA-Z\\-:]+)\\s*': function insideTag(match, tagName) {
            this.currentTag = tagName;
            return 'inside';
        },
    },
    inside: {
        '\\s+': true, // eat up whitespace
        '>': 'outside', // end of attributes
        '(([0-9a-zA-Z\\-:]+)\\s*=\\s*")([^"]*)"': processMatch,
        "(([0-9a-zA-Z\\-:]+)\\s*=\\s*')([^']*)'": processMatch,
        '(([0-9a-zA-Z\\-:]+)\\s*=\\s*)([^\\s>]+)': processMatch,
    },
});

module.exports = function attrParser(html, filterAttr) {
    return parser.parse('outside', html, {
        currentTag: null,
        results: [],
        filterAttr,
    }).results;
};
