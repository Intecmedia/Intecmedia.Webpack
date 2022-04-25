/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" -- webpack is node env */

const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

const PATTERN_MODIFIER = /(--([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*))$/;
const CLASS_SEPARATOR = /[\s]/;

class MissingBlock extends Rule {
    constructor(options) {
        super({ ignore: '', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const nodes = event.document.querySelectorAll('body *[class]');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        nodes.forEach((node) => {
            if (nodeIgnore(node, ignores)) {
                return;
            }
            const classList = node.getAttributeValue('class')
                .trim().split(CLASS_SEPARATOR);
            classList.forEach((className) => {
                if (!PATTERN_MODIFIER.test(className)) return;
                const [, modifierMatch] = className.match(PATTERN_MODIFIER);
                const blockName = className.substring(0, className.length - modifierMatch.length);
                if (classList.includes(blockName)) {
                    this.report(node, `Class-modifer ${JSON.stringify(className)} required block-element ${JSON.stringify(blockName)} class.`);
                }
            });
        });
    }
}

module.exports = { MissingBlock };

module.exports.rules = {
    'pitcher/bem-missing-block': MissingBlock,
};
