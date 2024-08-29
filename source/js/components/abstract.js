/**
 * --------------------------------------------------------------------------
 * Abstract component
 * --------------------------------------------------------------------------
 */

/**
 * @typedef { import('./app.js').default } AbstractApp
 */

/**
 * Abstract component.
 */
export default class AbstractComponent {
    static singleton = false;

    /**
     * Creates an instance of AbstractComponent.
     * @param {object} options - component options
     * @memberof AbstractComponent
     */
    constructor(options) {
        if (new.target === AbstractComponent) {
            throw new TypeError('Cannot construct AbstractComponent instances directly');
        }
        this.options = options;
    }

    /**
     * Init component
     * @memberof AbstractComponent
     */
    init() {
        // nothing to do
    }

    /**
     * Destroy component
     * @memberof AbstractComponent
     */
    destroy() {
        // nothing to do
    }

    /**
     * Get current element
     * @readonly
     * @type {HTMLElement} - current element
     * @memberof AbstractComponent
     */
    get element() {
        return this.options.element;
    }

    /**
     * Get current application
     * @readonly
     * @type {AbstractApp} - current application
     * @memberof AbstractComponent
     */
    get app() {
        return this.options.app;
    }

    /**
     * Add element event listener
     * @param {string} type - event type
     * @param {Function} listener - listener callback
     * @param {object} [options] - listener options
     * @memberof AbstractComponent
     */
    on(type, listener, options = {}) {
        const name = `${type}.${this.options.name}`;
        this.options.element.addEventListener(name, listener, options);
    }

    /**
     * Remove element event listener
     * @param {string} type - event type
     * @param {Function} listener - listener callback
     * @param {object} [options] - listener options
     * @memberof AbstractComponent
     */
    off(type, listener, options = {}) {
        const name = `${type}.${this.options.name}`;
        this.options.element.removeEventListener(name, listener, options);
    }

    /**
     * Dispatch element event.
     * @param {string} type - event type
     * @param {object} [detail] - event detaal
     * @returns {boolean} - event result
     * @memberof AbstractComponent
     */
    trigger(type, detail = {}) {
        const name = `${type}.${this.options.name}`;
        const event = new CustomEvent(name, { detail });
        return this.options.element.dispatchEvent(event);
    }

    /**
     * Call element querySelector.
     * @param {string} selector - query selector
     * @returns {HTMLElement} - matched element
     * @memberof AbstractComponent
     */
    selector(selector) {
        return this.options.element.querySelector(selector);
    }

    /**
     * Call element querySelectorAll.
     * @param {string} selector - query selector
     * @returns {HTMLElement[]} - matched elements
     * @memberof AbstractComponent
     */
    selectorAll(selector) {
        return [...this.options.element.querySelectorAll(selector)];
    }
}
