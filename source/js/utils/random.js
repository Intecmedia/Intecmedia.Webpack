// Random float from <low, high> interval
export function randFloat(low, high) {
    return low + Math.random() * (high - low);
}

// Random integer from <low, high> interval
export function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}

// Random float from <-range/2, range/2> interval
export function randFloatSpread(range) {
    return range * (0.5 - Math.random());
}

export default randFloat;
