/**
 * Linear mapping from range <a1, a2> to range <b1, b2>.
 * @param {number} x - input value
 * @param {number} a1 - range a1 value
 * @param {number} a2 - range a2 value
 * @param {number} b1 - range b1 value
 * @param {number} b2 - range b2 value
 * @returns {number} - mapping value
 */
export default function mapLinear(x, a1, a2, b1, b2) {
    return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}
