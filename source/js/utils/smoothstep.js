// Bare-bones smoothstep function (cubic Hermite interpolation), returning a value in the range 0.0 to 1.0.
export default function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - (2 * x));
}
