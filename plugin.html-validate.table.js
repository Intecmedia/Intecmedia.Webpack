const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

class TableResponsiveRequired extends Rule {
    constructor(options) {
        super({ ignore: null, ...options });
        this.domReady = this.domReady.bind(this);
    }

    setup() {
        this.on('dom:ready', this.domReady);
    }

    domReady({ document }) {
        const tables = document.querySelectorAll('table');
        const ignores = this.options.ignore ? document.querySelectorAll(this.options.ignore) : [];
        tables.forEach((table) => {
            if (nodeIgnore(table, ignores)) {
                return;
            }

            if (!(table.parent && table.parent.classList.contains('table-responsive'))) {
                this.report(table, '<table> required `<div class="table-responsive">` parent.');
            }
        });
    }
}

module.exports = { TableResponsiveRequired };

module.exports.rules = {
    'pitcher/table-responsive-required': TableResponsiveRequired,
};
