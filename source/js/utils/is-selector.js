function isSelector(element, selector) {
    return [...document.querySelectorAll(selector)].some((i) => element === i);
}

export default isSelector;
