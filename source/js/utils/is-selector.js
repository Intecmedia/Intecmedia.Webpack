/**
 * Cheml element is selector.
 * @param {HTMLElement} element - html element
 * @param  {string} selector - check selector
 * @returns {boolean} - check result
 */
export default function isSelector(element, selector) {
    return [...document.querySelectorAll(selector)].some((i) => element === i);
}
