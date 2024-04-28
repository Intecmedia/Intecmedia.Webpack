/**
 *
 * @param element
 * @param selector
 */
export default function isSelector(element, selector) {
    return [...document.querySelectorAll(selector)].some((i) => element === i);
}
