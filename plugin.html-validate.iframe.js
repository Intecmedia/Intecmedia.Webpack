/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" -- webpack is node env */

const { Rule } = require('html-validate');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((i) => nodeEqual(i, node));

class IframeLoadingRequired extends Rule {
    constructor(options) {
        super({ ignore: '.wysiwyg iframe, iframe.ignore-html-validate', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const iframes = event.document.querySelectorAll('iframe');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
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
