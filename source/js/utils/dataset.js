/**
 * Get data-property as string
 * @param {HTMLElemen} element - html element
 * @param {string} name - name of data-attribute
 * @param {string} initial - default value
 * @returns {string}
 */
export function getString(element, name, initial) {
    return name in element.dataset ? element.dataset[name] : initial;
}

/**
 * Get data-property as float
 * @param {HTMLElemen} element - html element
 * @param {string} name - name of data-attribute
 * @param {float} initial - default value
 * @returns {float}
 */
export function getFloat(element, name, initial) {
    return name in element.dataset ? parseFloat(element.dataset[name], 10) || 0 : initial;
}

/**
 * Get data-property as integer
 * @param {HTMLElemen} element - html element
 * @param {string} name - name of data-attribute
 * @param {integer} initial - default value
 * @returns {integer}
 */
export function getInt(element, name, initial) {
    return name in element.dataset ? parseInt(element.dataset[name], 10) || 0 : initial;
}
