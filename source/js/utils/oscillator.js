const TWO_PI = Math.PI * 2;

/**
 * Generate oscillator sinus
 * @param {number} time - input time
 * @param {number} frequency - input frequency
 * @param {number} amplitude - input amplitude
 * @param {number} phase - input phase
 * @param {number} offset - input offset
 * @returns {number} - oscillator result
 */
export default function oscillator(time, frequency = 1, amplitude = 1, phase = 0, offset = 0) {
    return Math.sin(time * frequency * TWO_PI + phase * TWO_PI) * amplitude + offset;
}
