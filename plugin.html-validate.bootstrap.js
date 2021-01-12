/* eslint-env node */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" */

const { Rule } = require('html-validate/dist/rule');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((i) => nodeEqual(i, node));

const COLS_COUNT = 12;
const COLS_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

const colClassList = (cols = COLS_COUNT, breakpoints = COLS_BREAKPOINTS) => {
    const numbers = Array.from({ length: cols }, (v, i) => (i + 1));
    return [
        ...(numbers.map((n) => `col-${n}`)),
        'col',
        'col-auto',
        ...(breakpoints.map((b) => [
            ...(numbers.map((n) => `col-${b}-${n}`)),
            `col-${b}`,
            `col-${b}-auto`,
        ]).flat()),
    ];
};

const colSelector = (cols = COLS_COUNT, breakpoints = COLS_BREAKPOINTS) => {
    const classList = colClassList(cols, breakpoints);
    return classList.map((i) => `.${i}`).join(', ');
};

class AbsRule extends Rule {
    constructor(options) {
        super({
            ignore: '', cols: COLS_COUNT, breakpoints: COLS_BREAKPOINTS, ...options,
        });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }
}

class ContainerNoNested extends AbsRule {
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

class ColNoRow extends AbsRule {
    domReady(event) {
        const selector = colSelector(this.options.cols, this.options.breakpoints);
        const cols = event.document.querySelectorAll(selector);
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        cols.forEach((col) => {
            if (nodeIgnore(col, ignores)) {
                return;
            }
            if (col.classList.contains('row')) {
                this.report(col, 'Found both `.row` and `.col-*-*` used on the same element.');
            }
            if (!col.parent || !col.parent.classList.contains('row')) {
                this.report(col, 'Not found `.row` for `.col`.');
            }
        });
    }
}

class RowNoChilds extends AbsRule {
    domReady(event) {
        const cols = colClassList(this.options.cols, this.options.breakpoints);
        const elements = event.document.querySelectorAll('.row > *');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        elements.forEach((el) => {
            if (nodeIgnore(el, ignores)) {
                return;
            }
            const { classList } = el;
            if (!cols.some((i) => classList.contains(i))) {
                this.report(el, 'Only columns (`.col-*-*`) may be children of `.row`s.');
            }
        });
    }
}

module.exports = { ColNoRow, RowNoChilds, ContainerNoNested };

module.exports.rules = {
    'bootstrap/col-no-row': ColNoRow,
    'bootstrap/row-no-childs': RowNoChilds,
    'bootstrap/container-no-nested': ContainerNoNested,
};
