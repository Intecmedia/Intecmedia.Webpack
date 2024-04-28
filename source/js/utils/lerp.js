import clamp from '~/utils/clamp';

// linear interpolation function
/**
 *
 * @param start
 * @param end
 * @param factor
 */
export function lerp(start, end, factor) {
    return start * (1 - factor) + end * factor;
}

// inverse linear interpolation function
/**
 *
 * @param start
 * @param end
 * @param factor
 */
export function invlerp(start, end, factor) {
    return clamp((factor - start) / (end - start));
}

export default lerp;
