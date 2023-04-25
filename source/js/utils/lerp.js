import clamp from '~/utils/clamp';

// linear interpolation function
export function lerp(start, end, factor) {
    return start * (1 - factor) + end * factor;
}

// inverse linear interpolation function
export function invlerp(start, end, factor) {
    return clamp((factor - start) / (end - start));
}

export default lerp;
