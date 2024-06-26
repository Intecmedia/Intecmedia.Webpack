const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

/**
 * @typedef { import('html-validate').DOMReadyEvent } DOMReadyEvent
 */

/**
 * Lint `iframe[loading]` required attribute.
 */
class IframeLoadingRequired extends Rule {
    /**
     * @param {object} options - plugin options
     */
    constructor(options) {
        super({ ignore: '.wysiwyg iframe', ...options });
        this.domReady = this.domReady.bind(this);
    }

    /**
     * Setup plugin events.
     */
    setup() {
        this.on('dom:ready', this.domReady);
    }

    /**
     * Lint html document.
     * @param {DOMReadyEvent.document} document - document object
     */
    domReady({ document }) {
        const iframes = document.querySelectorAll('iframe');
        const ignores = this.options.ignore ? document.querySelectorAll(this.options.ignore) : [];
        iframes.forEach((iframe) => {
            if (nodeIgnore(iframe, ignores)) {
                return;
            }

            const loading = iframe.getAttributeValue('loading');
            if (!loading) {
                this.report(iframe, '<iframe> required `loading` attribute.');
            }
        });
    }
}

module.exports = { IframeLoadingRequired };

module.exports.rules = {
    'pitcher/iframe-loading-required': IframeLoadingRequired,
};
