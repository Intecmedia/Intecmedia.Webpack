export default class AbstractApp {
    constructor(options) {
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
            if (id in this.components[name]) {
                return this.components[name][id];
            }
            return false;
        }
        return false;
    }

    all(name) {
        if (name in this.components) {
            return Object.values(this.components[name]);
        }
        return [];
    }

    init() {
        this.components.app = { app: this };
        this.initScope(document.body);
    }

    initScope(scope) {
        const newComponents = [];
        scope.querySelectorAll('[data-component]:not(.js-component)').forEach((element) => {
            const id = ++this.lastId;
            const name = element.getAttribute('data-component');
            const options = {
                element, name, id, app: this,
            };
            const ClassName = this.options.components[name];
            if (!ClassName) {
                console.error(`[app] Unknown component name: ${name}`, element);
            }
            element.classList.add('js-component');
            element.setAttribute('data-component-id', id);
            const component = new ClassName(options);
            if (!(name in this.components)) {
                this.components[name] = {};
            }
            this.components[name][id] = component;
            newComponents.push(component);
        });

        newComponents.forEach((component) => {
            component.init();
        });

        let closest = scope.closest('.js-component[data-component-id]');
        while (closest) {
            const id = closest.getAttribute('data-component-id');
            if (id) {
                const name = closest.getAttribute('data-component');
                const component = this.get(name, id);
                if (component) {
                    component.trigger('update', {
                        target: scope,
                    });
                } else {
                    console.warn('[app] Unknown component instance:', closest);
                }
            }
            const next = closest.closest('.js-component[data-component-id]');
            closest = (next && closest !== next ? next : null);
        }

        return newComponents;
    }

    destroyScope(scope) {
        scope.querySelectorAll('.js-component[data-component-id]').forEach((element) => {
            const id = element.getAttribute('data-component-id');
            if (!id) {
                element.classList.remove('js-component');
                element.removeAttribute('data-component-id');
                return;
            }
            const name = element.getAttribute('data-component');
            const component = this.get(name, id);
            if (component) {
                delete this.components[name][id];
                element.classList.remove('js-component');
                element.removeAttribute('data-component-id');
                component.destroy();
            } else {
                console.warn('[app] Unknown component instance:', element);
            }
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
