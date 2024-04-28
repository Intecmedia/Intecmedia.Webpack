/**
 *
 * @param num
 * @param factor
 */
export default function round(num, factor = 1000) {
    return Math.round(num * factor) / factor;
}
