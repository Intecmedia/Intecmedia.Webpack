function matchesPolyfill(selector) {
    const matches = (this.document || this.ownerDocument).querySelectorAll(selector);
    let i = matches.length;
    while (--i >= 0 && matches.item(i) !== this) {
        // empty loop
    }
    return i > -1;
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector
        || Element.prototype.mozMatchesSelector
        || Element.prototype.msMatchesSelector
        || Element.prototype.oMatchesSelector
        || Element.prototype.webkitMatchesSelector
        || matchesPolyfill;
}
