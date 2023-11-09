const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

class IframeLoadingRequired extends Rule {
    constructor(options) {
        super({ ignore: '.wysiwyg iframe', ...options });
        this.domReady = this.domReady.bind(this);
    }

    setup() {
        this.on('dom:ready', this.domReady);
    }

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
