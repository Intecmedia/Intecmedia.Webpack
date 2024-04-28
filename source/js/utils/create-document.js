/**
 * Create document from string.
 * @param {string} html - input html string
 * @returns {Document} - new html document
 */
export default function createDocument(html) {
    const context = document.implementation.createHTMLDocument('');
    context.open();
    context.write(html);
    context.close();

    const base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    return context;
}
