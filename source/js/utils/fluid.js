/**
 * Fluid value
 * @param {number} value - input value
 * @param {number} minValue - min value
 * @param {number} maxValue - max value
 * @param {number} minRange - min range
 * @param {number} maxRange - max range
 * @returns {number} - result number
 */
export function fluidValue(value, minValue, maxValue, minRange, maxRange) {
    let result = minValue;
    if (value <= minRange) {
        result = minValue + ((maxValue - minValue) * (value - minRange)) / (maxRange - minRange);
    }
    if (value >= maxRange) {
        result = maxValue;
    }
    return result;
}

/**
 * Fluid width via `window.innerWidth`
 * @param {number} minValue - min value
 * @param {number} maxValue - max value
 * @param {number} minRange - min range
 * @param {number} maxRange - max range
 * @returns {number} - result number
 */
export function fluidWidth(minValue, maxValue, minRange = 320, maxRange = 1200) {
    return fluidValue(window.innerWidth, minValue, maxValue, minRange, maxRange);
}

/**
 * Fluid height via `window.innerHeight`
 * @param {number} minValue - min value
 * @param {number} maxValue - max value
 * @param {number} minRange - min range
 * @param {number} maxRange - max range
 * @returns {number} - result number
 */
export function fluidHeight(minValue, maxValue, minRange = 320, maxRange = 480) {
    return fluidValue(window.innerHeight, minValue, maxValue, minRange, maxRange);
}

export default fluidValue;
