export default class AbstractComponent {
    constructor(options) {
        this.options = options;
    }

    init() {
        //
    }

    destroy() {
        //
    }

    get element() {
        return this.options.element;
    }

    on(type, listener, options = {}) {
        const name = `${type}.${this.options.name}`;
        return this.options.element.addEventListener(name, listener, options);
    }

    off(type, listener, options = {}) {
        const name = `${type}.${this.options.name}`;
        return this.options.element.removeEventListener(name, listener, options);
    }

    trigger(type, options = {}) {
        const name = `${type}.${this.options.name}`;
        const event = new CustomEvent(name, options);
        return this.options.element.dispatchEvent(event);
    }

    selector(selector) {
        return this.options.element.querySelector(selector);
    }

    selectorAll(selector) {
        return [...this.options.element.querySelectorAll(selector)];
    }
}
