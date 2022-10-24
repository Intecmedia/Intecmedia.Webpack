import AbstractComponent from '~/components/abstract';

export default class BootstrapValidation extends AbstractComponent {
    constructor(options = {}) {
        super(options);
        this.onSubmit = this.onSubmit.bind(this);
    }

    init() {
        console.assert(this.element.tagName === 'FORM', 'Required <form>', this.element);

        this.element.addEventListener('submit', this.onSubmit);
    }

    onSubmit(event) {
        if (!this.element.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.element.classList.add('was-validated');
    }

    destroy() {
        this.element.removeEventListener('submit', this.onSubmit);
    }
}
