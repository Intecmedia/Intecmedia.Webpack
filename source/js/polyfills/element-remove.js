[Element.prototype, CharacterData.prototype, DocumentType.prototype].filter(Boolean).forEach((item) => {
    if (item.hasOwnProperty('remove')) {
        return;
    }
    Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
            this.parentNode && this.parentNode.removeChild(this);
        },
    });
});