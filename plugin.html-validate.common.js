const { Rule } = require('html-validate');

class CheckNodeEnv extends Rule {
    constructor(options) {
        super({
            NODE_ENV: 'development',
            ...options,
        });
        this.domReady = this.domReady.bind(this);
    }

    setup() {
        this.on('dom:ready', this.domReady);
    }

    domReady({ document }) {
        const currentEnv = this.options.NODE_ENV;
        const documentElement = document.querySelector('html');
        const documentEnv = documentElement.getAttributeValue('data-node-env');
        if (documentEnv !== currentEnv) {
            const reportCommand =
                currentEnv === 'development' ? 'npm run html-validate-prod' : 'npm run html-validate-dev';
            const reportError = [
                `Linter NODE_ENV=${JSON.stringify(currentEnv)}.`,
                `Html document using NODE_ENV=${JSON.stringify(documentEnv)}.`,
                `Please run: ${JSON.stringify(reportCommand)}.`,
            ].join(' ');
            this.report(documentElement, reportError);
            throw new Error(reportError);
        }
    }
}

module.exports = { CheckNodeEnv };

module.exports.rules = {
    'pitcher/check-node-env': CheckNodeEnv,
};
