/**
 * Round number.
 * @param {number} value - input value
 * @param {number} factor - round factor
 * @returns {number} - rounded value
 */
export default function round(value, factor = 1000) {
    return Math.round(value * factor) / factor;
}
