/**
 * Inserts HTML line breaks before all newlines in a string
 * @param {string} str - input string
 * @returns {boolean} - use XHTML compatible line breaks or not
 */
export default function nl2br(str, use_xhtml = false) {
    var breakTag = use_xhtml ? '<br ' + '/>' : '<br>';
    return `${str}`.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
}
