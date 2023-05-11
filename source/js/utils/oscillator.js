export default function oscillator(time, frequency = 1, amplitude = 1, phase = 0, offset = 0) {
    return Math.sin(time * frequency * Math.PI * 2 + phase * Math.PI * 2) * amplitude + offset;
}
