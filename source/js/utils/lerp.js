import clamp from '~/utils/clamp';

/**
 * Linear interpolation function.
 * @param {number} start - start interpolation
 * @param {number} end - end interpolation
 * @param {number} factor - interpolation factor
 * @returns {number} - interpolated value
 */
export function lerp(start, end, factor) {
    return start * (1 - factor) + end * factor;
}

/**
 * Inverse linear interpolation function.
 * @param {number} start - start interpolation
 * @param {number} end - end interpolation
 * @param {number} factor - interpolation factor
 * @returns {number} - interpolated value
 */
export function invlerp(start, end, factor) {
    return clamp((factor - start) / (end - start));
}

export default lerp;
