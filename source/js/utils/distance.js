/**
 * Distance from <x1, y1> to <x2, y2>.
 * @param {number} x1 - x1 coordinate
 * @param {number} y1 - y1 coordinate
 * @param {number} x2 - x2 coordinate
 * @param {number} y2 - y2 coordinate
 * @returns {number} - {number}
 */
export default function distance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}
