const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

/**
 * @typedef { import('html-validate').DOMReadyEvent } DOMReadyEvent
 */

/**
 *
 */
class TableResponsiveRequired extends Rule {
    /**
     * @param {object} options - plugin options
     */
    constructor(options) {
        super({ ignore: null, ...options });
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
