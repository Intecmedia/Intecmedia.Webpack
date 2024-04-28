/**
 *  Returns a number whose value is limited to the given range.
 * @param value input value
 * @param min lower boundary of the output range
 * @param max upper boundary of the output range
 */
export default function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
}
