/**
 * Inserts HTML line breaks before all newlines in a string
 * @param {string} str - input string
 * @param {boolean} use_xhtml - whether to use XHTML compatible line breaks or not
 * @returns {boolean} - returns string with <br /> or <br> inserted before all newlines (\r\n, \n\r, \n and \r)
 */
export default function nl2br(str, use_xhtml = false) {
    var breakTag = use_xhtml ? '<br ' + '/>' : '<br>';
    return `${str}`.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
}
