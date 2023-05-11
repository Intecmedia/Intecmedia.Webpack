const TWO_PI = Math.PI * 2;

export default function oscillator(time, frequency = 1, amplitude = 1, phase = 0, offset = 0) {
    return Math.sin(time * frequency * TWO_PI + phase * TWO_PI) * amplitude + offset;
}
