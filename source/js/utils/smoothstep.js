/**
 * Smoothstep function (cubic Hermite interpolation), returning a value in the range 0.0 to 1.0.
 * @param {number} min - min value
 * @param {number} max - max value
 * @param {number} value - input value
 * @returns {number} - smoothstep value
 */
export function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
}

/**
 * Smootherstep function (cubic Hermite interpolation), returning a value in the range 0.0 to 1.0.
 * @param {number} min - min value
 * @param {number} max - max value
 * @param {number} value - input value
 * @returns {number} - smootherstep value
 */
export function smootherstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * x * (x * (x * 6 - 15) + 10);
}

export default smoothstep;
