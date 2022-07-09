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
                return values[0] || false;
            }
            if (id instanceof Element) {
                const dataComponentId = id.getAttribute('data-component-id');
                if (dataComponentId && (dataComponentId in this.components[name])) {
                    return this.components[name][dataComponentId];
                }
                return false;
            }
            if (id in this.components[name]) {
                return this.components[name][id];
            }
            return false;
        }
        return false;
    }

    all(name) {
        return (name in this.components ? Object.values(this.components[name]) : []);
    }

    init() {
        this.initScope(document.body);
        const detail = { target: this };
        const event = new CustomEvent('init.App', { detail });
        window.dispatchEvent(event);
    }

    initScope(scope) {
        const newComponents = [];
        scope.querySelectorAll('[data-component]:not(.js-component)').forEach((element) => {
            newComponents.push(...this.createElement(element));
        });
        newComponents.forEach((component) => {
            component.init();
        });
        this.updateScope(scope);
        return newComponents;
    }

    createElement(element) {
        const newComponents = [];
        const id = ++this.lastId;
        const names = element.getAttribute('data-component').split(SEPARATOR_PATTERN);
        for (let index = 0; index < names.length; index++) {
            const name = names[index];
            const options = {
                element, name, id, app: this,
            };
            const ClassName = this.options.components[name];
            if (!ClassName) {
                console.error(`[app] Unknown component name: ${name}`, element);
            } else if (ClassName.singleton && (name in this.components)) {
                console.error(`[app] Cannot create already existing component: ${name}`, element);
            } else {
                element.classList.add('js-component');
                element.setAttribute('data-component-id', id);
                const component = new ClassName(options);
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

    updateScope(scope) {
        return this.triggerScope(scope, 'update');
    }

    destroyScope(scope) {
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
        this.destroyScope(document.body);
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
