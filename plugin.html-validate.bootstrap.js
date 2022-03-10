/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" -- webpack is node env */

const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

const COLS_COUNT = 12;
const COLS_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

const makeColsClassList = (cols = COLS_COUNT, breakpoints = COLS_BREAKPOINTS) => {
    const colsNumbers = Array.from({ length: cols }, (value, index) => (index + 1));
    return [
        ...(colsNumbers.map((col) => `col-${col}`)),
        'col',
        'col-auto',
        ...(breakpoints.map((breakpoint) => [
            ...(colsNumbers.map((col) => `col-${breakpoint}-${col}`)),
            `col-${breakpoint}`,
            `col-${breakpoint}-auto`,
        ]).flat()),
    ];
};

const colSelector = (cols = COLS_COUNT, breakpoints = COLS_BREAKPOINTS) => {
    const classList = makeColsClassList(cols, breakpoints);
    return classList.map((className) => `.${className}`).join(', ');
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
        const cols = makeColsClassList(this.options.cols, this.options.breakpoints);
        const elements = event.document.querySelectorAll('.row > *');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        elements.forEach((el) => {
            if (nodeIgnore(el, ignores)) {
                return;
            }
            if (!cols.some((className) => el.classList.contains(className))) {
                this.report(el, 'Only columns (`.col-*-*`) may be children of `.row`s.');
            }
        });
    }
}

class FormSelectNoFormControl extends Rule {
    constructor(options) {
        super({ ignore: '', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const selects = event.document.querySelectorAll('select');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        selects.forEach((select) => {
            if (nodeIgnore(select, ignores)) {
                return;
            }
            if (select.classList.contains('form-control')) {
                this.report(select, 'For <select> not allowed `form-control` class, use `form-select` instead.');
            }
        });
    }
}

class FormControlInputOnly extends Rule {
    constructor(options) {
        super({ ignore: '', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const controls = event.document.querySelectorAll('.form-control');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        controls.forEach((control) => {
            if (nodeIgnore(control, ignores)) {
                return;
            }
            if (control.nodeName.toLowerCase() !== 'input') {
                this.report(control, 'Class `form-control` allowed only for input`s.');
            }
        });
    }
}

module.exports = {
    ColNoRow, RowNoChilds, ContainerNoNested, FormSelectNoFormControl, FormControlInputOnly,
};

module.exports.rules = {
    'bootstrap/col-no-row': ColNoRow,
    'bootstrap/row-no-childs': RowNoChilds,
    'bootstrap/container-no-nested': ContainerNoNested,
    'bootstrap/form-control-input-only': FormControlInputOnly,
    'bootstrap/form-select-no-form-control': FormSelectNoFormControl,
};
