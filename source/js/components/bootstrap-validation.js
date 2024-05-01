/**
 * --------------------------------------------------------------------------
 * Bootstrap forms validation customize
 * https://getbootstrap.com/docs/5.3/forms/validation/
 * --------------------------------------------------------------------------
 */

import AbstractComponent from '~/components/abstract';

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
    }

    /**
     * Init events.
     */
    init() {
        console.assert(this.element.tagName === 'FORM', 'Required <form>', this.element);

        this.element.addEventListener('submit', this.onSubmit);
    }

    /**
     * Submit-events handler
     * @param {SubmitEvent} event - submit event
     */
    onSubmit(event) {
        if (!this.element.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.element.classList.add('was-validated');
    }

    /**
     * Remove events.
     */
    destroy() {
        this.element.removeEventListener('submit', this.onSubmit);
    }
}
