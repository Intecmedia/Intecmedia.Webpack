/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" -- webpack is node env */

const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

const MODIFIER_PATTERN = /(--([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*))$/;
const ELEMENT_PATTERN = /(__([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*))$/;

const CLASS_SEPARATOR = /[\s]+/;

class NoMissingElement extends Rule {
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
            const classList = node.getAttributeValue('class').trim().split(CLASS_SEPARATOR);
            classList.forEach((className) => {
                if (!ELEMENT_PATTERN.test(className)) return;
                const [, elementMatch] = className.match(ELEMENT_PATTERN);
                const blockName = className.substring(0, className.length - elementMatch.length);
                if (!node.closest(`.${blockName}`)) {
                    this.report(node, `Class-element references missing block ${JSON.stringify(blockName)} (element is ${JSON.stringify(className)}).`);
                }
            });
        });
    }
}

class NoMissingModifier extends Rule {
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
            const classList = node.getAttributeValue('class').trim().split(CLASS_SEPARATOR);
            classList.forEach((className) => {
                if (!MODIFIER_PATTERN.test(className)) return;
                const [, modifierMatch] = className.match(MODIFIER_PATTERN);
                const blockName = className.substring(0, className.length - modifierMatch.length);
                if (!classList.includes(blockName)) {
                    this.report(node, `Class-modifier references missing block ${JSON.stringify(blockName)} (modifier is ${JSON.stringify(className)}).`);
                }
            });
        });
    }
}

module.exports = { NoMissingElement, NoMissingModifier };

module.exports.rules = {
    'pitcher/bem-no-missing-element': NoMissingElement,
    'pitcher/bem-no-missing-modifier': NoMissingModifier,
};
