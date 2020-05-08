/* eslint-env node */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" */

const { Rule } = require('html-validate/build/rule');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((i) => nodeEqual(i, node));

class ContainerNoNested extends Rule {
    constructor(options) {
        super({ ignore: '', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const containers = event.document.querySelectorAll('.container, .container-fluid');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        containers.forEach((container) => {
            const { parent } = container;
            if (nodeIgnore(container, ignores) || !parent) {
                return;
            }
            const { classList } = parent;
            if (classList.contains('container') || classList.contains('container-fluid')) {
                this.report(container, 'Containers (`.container` and `.container-fluid`) are not nestable.');
            }
        });
    }
}

module.exports = { ContainerNoNested };

module.exports.rules = {
    'bootstrap/container-no-nested': ContainerNoNested,
};
