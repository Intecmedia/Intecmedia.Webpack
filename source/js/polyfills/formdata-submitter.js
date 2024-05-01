/**
 * --------------------------------------------------------------------------
 * FormData.submitter polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData#submitter
 * --------------------------------------------------------------------------
 */

/* eslint 'compat/compat': 'off' -- useless for polyfill */

const orgFormData = window.FormData;

/**
 * FormData submitter polyfill.
 */
class FormDataSubmitter extends orgFormData {
    /**
     * @param {HTMLFormElement} form - html form element
     * @param {HTMLInputElement} submitter - html submitter element
     */
    constructor(form, submitter = null) {
        super(form);
        if (submitter) {
            this.append(submitter.name, submitter.value);
        }
    }
}

window.FormData = FormDataSubmitter;
