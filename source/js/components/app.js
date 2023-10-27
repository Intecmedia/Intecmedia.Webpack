/* global VERBOSE */

import AbstractComponent from '~/components/abstract';

const SEPARATOR_PATTERN = /\s*,\s*/;

export default class AbstractApp {
    constructor(options) {
        if (new.target === AbstractApp) {
            throw new TypeError('Cannot construct AbstractApp instances directly');
        }
        this.options = options;
        this.components = {};
        this.lastId = 0;
    }

    get(name, id = null) {
        if (name in this.components) {
            if (arguments.length === 1) {
                const values = Object.values(this.components[name]);
                return values[0] || null;
            }
            if (id instanceof Element) {
                const dataComponentId = id.getAttribute('data-component-id');
                if (dataComponentId && dataComponentId in this.components[name]) {
                    return this.components[name][dataComponentId];
                }
                return null;
            }
            if (id in this.components[name]) {
                return this.components[name][id];
            }
            return null;
        }
        return null;
    }

    all(name) {
        return name in this.components ? Object.values(this.components[name]) : [];
    }

    init() {
        const newComponents = [];
        document.querySelectorAll('[data-component]:not(.js-component)').forEach((element) => {
            newComponents.push(...this.createElement(element));
        });
        newComponents.forEach((component) => {
            component.init();
        });

        const detail = { target: document.documentElement };
        const event = new CustomEvent('init.App', { detail });
        window.dispatchEvent(event);
        if (VERBOSE) {
            console.log('[app] init', event);
        }
        this.triggerScope(document.documentElement, 'init');
    }

    initScope(scope) {
        console.error(`[app] initScope method is deprecated, use updateScope instead`, scope);
        throw new Error('Method initScope method is deprecated, use updateScope instead.');
    }

    updateScope(scope) {
        const newComponents = [];
        scope.querySelectorAll('[data-component]:not(.js-component)').forEach((element) => {
            newComponents.push(...this.createElement(element));
        });
        newComponents.forEach((component) => {
            component.init();
        });

        const detail = { target: scope };
        const event = new CustomEvent('update.App', { detail });
        window.dispatchEvent(event);
        if (VERBOSE) {
            console.log('[app] update', event);
        }

        this.triggerScope(scope, 'update');
    }

    createElement(element) {
        const newComponents = [];
        const id = ++this.lastId;
        const names = element.getAttribute('data-component').split(SEPARATOR_PATTERN);
        for (let index = 0; index < names.length; index++) {
            const name = names[index];
            const options = {
                element,
                name,
                id,
                app: this,
            };
            const ClassName = this.options.components[name];
            if (!ClassName) {
                console.error(`[app] Unknown component name: ${name}`, element);
            } else if (
                ClassName.singleton &&
                name in this.components &&
                Object.keys(this.components[name]).length !== 0
            ) {
                console.error(`[app] Cannot create already existing component: ${name}`, element);
            } else {
                element.classList.add('js-component');
                element.setAttribute('data-component-id', id);
                const component = new ClassName(options);
                if (!(component instanceof AbstractComponent)) {
                    throw new TypeError(`Class ${name} should be instance of AbstractComponent.`);
                }
                if (!(name in this.components)) {
                    this.components[name] = {};
                }
                this.components[name][id] = component;
                newComponents.push(component);
            }
        }
        return newComponents;
    }

    triggerScope(scope, trigger) {
        let closest = scope.closest('.js-component[data-component-id]');
        while (closest) {
            const id = closest.getAttribute('data-component-id');
            if (id) {
                const names = closest.getAttribute('data-component').split(SEPARATOR_PATTERN);
                for (let index = 0; index < names.length; index++) {
                    const name = names[index];
                    const component = this.get(name, id);
                    if (component) {
                        component.trigger(trigger, {
                            target: scope,
                        });
                    } else {
                        console.warn('[app] Unknown component instance:', closest);
                    }
                }
            }
            closest = closest.parentNode.closest('.js-component[data-component-id]');
        }
    }

    destroyScope(scope) {
        const detail = { target: scope };
        const event = new CustomEvent(`destroy.App`, { detail });
        window.dispatchEvent(event);
        if (VERBOSE) {
            console.log('[app] destroy', event);
        }

        scope.querySelectorAll('.js-component[data-component-id]').forEach((element) => {
            this.destroyElement(element);
        });
        this.triggerScope(scope, 'destroy');
    }

    destroyElement(element) {
        const id = element.getAttribute('data-component-id');
        if (!id) {
            element.classList.remove('js-component');
            element.removeAttribute('data-component-id');
            return;
        }
        const names = element.getAttribute('data-component').split(SEPARATOR_PATTERN);
        for (let index = 0; index < names.length; index++) {
            const name = names[index];
            const component = this.get(name, id);
            if (component) {
                delete this.components[name][id];
                element.classList.remove('js-component');
                element.removeAttribute('data-component-id');
                component.destroy();
            } else {
                console.warn('[app] Unknown component instance:', element);
            }
        }
    }

    clearScope(scope) {
        scope.querySelectorAll('.js-component[data-component-id]').forEach((element) => {
            element.classList.remove('js-component');
            element.removeAttribute('data-component-id');
        });
    }

    destroy() {
        this.destroyScope(document);
    }

    on(name, type, listener, options = {}) {
        const components = this.all(name);
        components.forEach((component) => {
            component.on(type, listener, options);
        });
        return components;
    }

    off(name, type, listener, options = {}) {
        const components = this.all(name);
        components.forEach((component) => {
            component.off(type, listener, options);
        });
        return components;
    }

    trigger(name, type, options = {}) {
        const components = this.all(name);
        components.forEach((component) => {
            component.trigger(type, options);
        });
        return components;
    }
}
