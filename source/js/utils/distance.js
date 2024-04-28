/**
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
export default function distance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}
