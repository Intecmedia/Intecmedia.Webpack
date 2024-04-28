/**
 * Random float from <low, high> interval.
 * @param {number} low  - low interval
 * @param {number} high - high interval
 * @returns {number} - random value
 */
export function randFloat(low, high) {
    return low + Math.random() * (high - low);
}

/**
 * Random integer from <low, high> interval.
 * @param {number} low - low interval
 * @param {number} high - high interval
 * @returns {number} - random value
 */
export function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}

/**
 * Random float from <-range/2, range/2> interval.
 * @param {number} range - range interval
 * @returns {number} - random value
 */
export function randFloatSpread(range) {
    return range * (0.5 - Math.random());
}

export default randFloat;
