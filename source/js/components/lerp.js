import clamp from './clamp';

// linear interpolation function
export default function lerp(start, end, factor) {
    return start * (1 - factor) + end * factor;
}

// inverse linear interpolation function
export function invlerp(a, b, v) {
    return clamp((v - a) / (b - a));
}
