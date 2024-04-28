const TWO_PI = Math.PI * 2;

/**
 *
 * @param time
 * @param frequency
 * @param amplitude
 * @param phase
 * @param offset
 */
export default function oscillator(time, frequency = 1, amplitude = 1, phase = 0, offset = 0) {
    return Math.sin(time * frequency * TWO_PI + phase * TWO_PI) * amplitude + offset;
}
