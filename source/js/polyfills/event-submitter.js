/* eslint 'compat/compat': 'off' -- useless for polyfill */

const buttonsSelector = 'button, input[type="button"], input[type="submit"], input[type="image"]';
let lastButton;

document.addEventListener(
    'click',
    (event) => {
        lastButton = event.target?.closest(buttonsSelector);
    },
    true
);

document.addEventListener(
    'submit',
    (event) => {
        if (lastButton && event.submitter) return;
        Object.defineProperty(Object.getPrototypeOf(event), 'submitter', {
            configurable: true,
            enumerable: true,
            get() {
                const form = this.target;
                const elements = [document.activeElement, lastButton];
                return elements.find((control) => {
                    return control && control.matches(buttonsSelector) && form === control.form;
                });
            },
        });
    },
    true
);

document.addEventListener('submit', () => {
    lastButton = undefined;
});
