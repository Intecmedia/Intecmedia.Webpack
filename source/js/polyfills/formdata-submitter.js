/* eslint 'compat/compat': 'off' -- useless for polyfill */

const orgFormData = window.FormData;

class FormDataSubmitter extends orgFormData {
    constructor(form, submitter = null) {
        super(form);
        if (submitter) {
            this.append(submitter.name, submitter.value);
        }
    }
}

window.FormData = FormDataSubmitter;
