/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const { Rule } = require('html-validate');

class CheckNodeEnv extends Rule {
    constructor(options) {
        super({
            NODE_ENV: '', ...options,
        });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const html = event.document.querySelector('html');
        const dataNodeEnv = html.getAttributeValue('data-node-env');
        if (dataNodeEnv !== this.options.NODE_ENV) {
            if (this.options.NODE_ENV === 'development') {
                this.report(html, `Document using NODE_ENV=${JSON.stringify(dataNodeEnv)}. Please run: \`npm run html-validate-prod\`.`);
            } else {
                this.report(html, `Document using NODE_ENV=${JSON.stringify(dataNodeEnv)}. Please run: \`npm run html-validate-dev\`.`);
            }
        }
    }
}

module.exports = { CheckNodeEnv };

module.exports.rules = {
    'pitcher/check-node-env': CheckNodeEnv,
};
