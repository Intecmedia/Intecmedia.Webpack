/**
 * --------------------------------------------------------------------------
 * Bootstrap forms validation customize
 * https://getbootstrap.com/docs/5.3/forms/validation/
 * --------------------------------------------------------------------------
 */

import AbstractComponent from '~/components/abstract';

const INPUT_SELECTOR = 'input:not(.no-validate), textarea:not(.no-validate), select:not(.no-validate)';

/**
 * Bootstrap forms validation.
 */
export default class BootstrapValidation extends AbstractComponent {
    /**
     * @param {object} options - options
     */
    constructor(options = {}) {
        super(options);
        this.onSubmit = this.onSubmit.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onInvalid = this.onInvalid.bind(this);
    }

    /**
     * Init events.
     */
    init() {
        console.assert(this.element.tagName === 'FORM', 'Required <form>', this.element);

        this.element.addEventListener('submit', this.onSubmit);
        this.element.addEventListener('reset', this.onReset);

        this.element.addEventListener('input', this.onInput);
        this.element.addEventListener('change', this.onChange);
        this.element.addEventListener('invalid', this.onInvalid);
    }

    /**
     * Submit-events handler.
     * @param {SubmitEvent} event - submit event
     */
    onSubmit(event) {
        if (!this.element.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.element.querySelectorAll(INPUT_SELECTOR).forEach((input) => {
            this.validateInput(input);
        });

        this.element.classList.add('was-validated');
    }

    /**
     * Reset-events handler.
     */
    onReset() {
        this.element.querySelectorAll(INPUT_SELECTOR).forEach((input) => {
            this.resetInput(input);
        });

        this.element.classList.remove('was-validated');
    }

    /**
     * Invalid-events handler.
     * @param {Event} event - invalid event
     */
    onInvalid(event) {
        const input = event.target.closest(INPUT_SELECTOR);
        if (!input) return;

        event.preventDefault();
        this.validateInput(input);
    }

    /**
     * Input-events handler.
     * @param {Event} event - input event
     */
    onInput(event) {
        const input = event.target.closest(INPUT_SELECTOR);
        if (!input) return;

        this.validateInput(input);
    }

    /**
     * Change-events handler.
     * @param {Event} event - input event
     */
    onChange(event) {
        const input = event.target.closest(INPUT_SELECTOR);
        if (!input) return;

        this.validateInput(input);
    }

    /**
     * Reset input.
     * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input - input element
     */
    resetInput(input) {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
    }

    /**
     * Validate input.
     * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} input - input element
     */
    validateInput(input) {
        if (input.validity.valid) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }

        const invalid = (() => {
            let sibling = input.nextElementSibling;
            while (sibling) {
                if (sibling.classList.contains('invalid-feedback') || sibling.classList.contains('invalid-tooltip')) {
                    return sibling;
                }
                sibling = sibling.nextElementSibling;
            }
            return null;
        })();

        if (invalid) {
            invalid.textContent = input.validationMessage;
        }
    }

    /**
     * Remove events.
     */
    destroy() {
        this.element.removeEventListener('submit', this.onSubmit);
        this.element.removeEventListener('reset', this.onReset);

        this.element.removeEventListener('input', this.onInput);
        this.element.removeEventListener('change', this.onChange);
        this.element.removeEventListener('invalid', this.onInvalid);
    }
}
