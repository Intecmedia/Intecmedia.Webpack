/**
 * Get data-property as string
 * @param {HTMLElement} element - html element
 * @param {string} name - name of data-attribute
 * @param {string} initial - default value
 * @returns {string} - result value
 */
export function getString(element, name, initial) {
    return name in element.dataset ? element.dataset[name] : initial;
}

/**
 * Get data-property as float
 * @param {HTMLElement} element - html element
 * @param {string} name - name of data-attribute
 * @param {number} initial - default value
 * @returns {number} - result value
 */
export function getFloat(element, name, initial) {
    return name in element.dataset ? parseFloat(element.dataset[name], 10) || 0 : initial;
}

/**
 * Get data-property as integer
 * @param {HTMLElement} element - html element
 * @param {string} name - name of data-attribute
 * @param {number} initial - default value
 * @returns {number} - result value
 */
export function getInt(element, name, initial) {
    return name in element.dataset ? parseInt(element.dataset[name], 10) || 0 : initial;
}

/**
 * Get data-property as json
 * @param {HTMLElement} element - html element
 * @param {string} name - name of data-attribute
 * @param {any} initial - default value
 * @returns {string} - result value
 */
export function getJSON(element, name, initial) {
    return name in element.dataset ? JSON.parse(element.dataset[name]) : initial;
}

/**
 * Get data-property as boolean
 * @param {HTMLElement} element - html element
 * @param {string} name - name of data-attribute
 * @param {boolean} initial - default value
 * @returns {boolean} - result value
 */
export function getBoolean(element, name, initial) {
    return name in element.dataset ? Boolean(JSON.parse(element.dataset[name])) : initial;
}
