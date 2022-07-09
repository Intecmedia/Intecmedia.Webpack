export default class AbstractComponent {
    static singleton = false;

    constructor(options) {
        if (new.target === AbstractComponent) {
            throw new TypeError('Cannot construct AbstractComponent instances directly');
        }
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

    get app() {
        return this.options.app;
    }

    on(type, listener, options = {}) {
        const name = `${type}.${this.options.name}`;
        return this.options.element.addEventListener(name, listener, options);
    }

    off(type, listener, options = {}) {
        const name = `${type}.${this.options.name}`;
        return this.options.element.removeEventListener(name, listener, options);
    }

    trigger(type, detail = {}) {
        const name = `${type}.${this.options.name}`;
        const event = new CustomEvent(name, { detail });
        return this.options.element.dispatchEvent(event);
    }

    selector(selector) {
        return this.options.element.querySelector(selector);
    }

    selectorAll(selector) {
        return [...this.options.element.querySelectorAll(selector)];
    }
}
