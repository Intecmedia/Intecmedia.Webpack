/**
 * Copy text to clipboard.
 * @param {string} text - input text string
 * @returns {Promise} copy result
 */
export default function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }

    const input = document.createElement('input');
    input.value = text;
    input.style.position = 'fixed';
    input.style.left = '-999999px';
    input.style.top = '-999999px';

    document.body.appendChild(input);
    input.focus();
    input.select();

    return new Promise((resolve, reject) => {
        if (document.execCommand('copy')) {
            resolve();
        } else {
            reject();
        }
        input.remove();
    });
}
