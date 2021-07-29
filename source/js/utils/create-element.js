export default function createElement(html, childs = false) {
    const template = document.createElement('template');
    template.innerHTML = childs ? html : html.trim(); // Never return a text node of whitespace as the result
    return childs ? template.content.childNodes : template.content.firstChild;
}
