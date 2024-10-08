const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

/**
 * @typedef { import('html-validate').DOMReadyEvent } DOMReadyEvent
 */

/**
 * Lint empty `a[href]` attribute.
 */
class LinkNoEmpty extends Rule {
    /**
     * @param {object} options - plugin options
     */
    constructor(options) {
        super({ ignore: '.wysiwyg a', ...options });
        this.domReady = this.domReady.bind(this);
    }

    /**
     * Setup plugin events.
     */
    setup() {
        this.on('dom:ready', this.domReady);
    }

    /**
     * Lint `a[href]` nodes.
     * @param {DOMReadyEvent.document} document - document object
     */
    domReady({ document }) {
        const links = document.querySelectorAll('a');
        const ignores = this.options.ignore ? document.querySelectorAll(this.options.ignore) : [];

        links.forEach((item) => {
            if (nodeIgnore(item, ignores)) {
                return;
            }
            const href = String(item.getAttributeValue('href') || '');
            if (href === '') {
                this.report(item, '<a> required `href` attribute.');
            } else if (href === '#') {
                this.report(item, '<a> required `href` attribute.');
            } else if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (!target) {
                    this.report(item, `<a> not found target node (\`href=${JSON.stringify(href)}\`).`);
                }
            }
        });
    }
}

module.exports = { LinkNoEmpty };

module.exports.rules = {
    'pitcher/link-no-empty': LinkNoEmpty,
};
