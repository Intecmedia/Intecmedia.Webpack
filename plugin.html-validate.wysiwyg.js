const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

class WysiwygClassAllowed extends Rule {
    constructor(options) {
        super({ ignore: null, allowed: [], ...options });
        this.domReady = this.domReady.bind(this);
    }

    setup() {
        this.on('dom:ready', this.domReady);
    }

    domReady({ document }) {
        const items = document.querySelectorAll('.wysiwyg [class]');
        const ignores = this.options.ignore ? document.querySelectorAll(this.options.ignore) : [];
        const allowed = this.options.allowed ? this.options.allowed.map((i) => i.toLowerCase()) : [];

        items.forEach((node) => {
            if (nodeIgnore(node, ignores)) {
                return;
            }

            const className = node.classList.find((i) => !allowed.includes(i.toLowerCase()));
            if (className) {
                this.report(node, `Class \`${className}\` not allowed inside \`.wysiwyg\`.`);
            }
        });
    }
}

module.exports = { WysiwygClassAllowed };

module.exports.rules = {
    'pitcher/wysiwyg-class-allowed': WysiwygClassAllowed,
};
