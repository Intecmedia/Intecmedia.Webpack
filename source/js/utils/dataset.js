export function getString(element, name, initial) {
    return name in element.dataset ? element.dataset[name] : initial;
}

export function getFloat(element, name, initial) {
    return name in element.dataset ? parseFloat(element.dataset[name], 10) || 0 : initial;
}

export function getInt(element, name, initial) {
    return name in element.dataset ? parseInt(element.dataset[name], 10) || 0 : initial;
}
