function closestPolyfill(selector) {
    let element = this;
    while (element) {
        if (element.matches(selector)) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = closestPolyfill;
}
