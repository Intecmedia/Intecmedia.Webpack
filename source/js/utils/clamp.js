/**
 * Returns a number whose value is limited to the given range.
 * @param {number} value - input value
 * @param {number} min - lower boundary of the output range
 * @param {number} max - upper boundary of the output range
 * @returns {number} - clamped value
 */
export default function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
}
