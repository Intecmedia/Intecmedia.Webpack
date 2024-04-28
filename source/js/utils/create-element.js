/**
 * Create element from string.
 * @param {string} html - input html string
 * @param {boolean} childs - returns child nodes
 * @returns {HTMLElement} - new html element
 */
export default function createElement(html, childs = false) {
    const template = document.createElement('template');
    template.innerHTML = childs ? html : html.trim(); // Never return a text node of whitespace as the result
    return childs ? template.content.childNodes : template.content.firstChild;
}
